import Handlebars from 'handlebars'
import moment from 'moment'
import _ from 'lodash'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'
import mailer from '../modules/mailer'
import { uploadToS3 } from '../modules/aws'
import { transformQueryAndCleanNull } from '../utils/sharedFunctionsObject'

export const get = async (req, res, next) => {
  const { idBuyer: id } = req.params

  try {
    const buyer = await models.Buyer.findOne({
      where: { id },
      include: [models.BusinessSource]
    })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    const response = transformQueryAndCleanNull(buyer.toJSON())

    return res.status(201).json({
      data: response,
      message: 'Success'
    })
  } catch (error) {
    return next(error)
  }
}

export const list = async (req, res, next) => {
  const { search, perPage } = req.query
  const paramsSearch = [
    'surname',
    'firstName',
    'email',
    'telephone1',
    'telephone2',
    'telephone3',
    'emailOptional'
  ]
  const whereOptions = {}

  if (search) {
    whereOptions.where = {}
    whereOptions.where.$or = []
    paramsSearch.map(item => {
      whereOptions.where.$or.push({
        [item]: {
          $like: `%${search}%`
        }
      })
    })
  }

  const options = {
    attributes: [
      'id',
      'firstName',
      'surname',
      'email',
      'streetName',
      'telephone1',
      'telephone2',
      'caSent',
      'caReceived',
      'suburb',
      'state',
      'source_id',
      'postCode',
      'priceFrom',
      'priceTo',
      'emailOptional',
      'attachmentUrl'
    ],
    limit: perPage
  }

  try {
    const buyers = await models.Buyer.findAll(Object.assign(options, whereOptions))
    return res.status(200).json({
      data: buyers,
      message: 'Success'
    })
  } catch (error) {
    return res.json({
      error: true,
      message: error
    })
  }
}

export const listBusiness = async (req, res, next) => {
  let search = req.query.search
  let stageId = req.query.stageId
  let whereOptions = {
    where: {}
  }

  whereOptions.where.brokerAccountName = {
    $eq: req.user.id
  }

  if (stageId && stageId.length > 0) {
    if (parseInt(stageId)) {
      whereOptions.where.stageId = {
        $eq: `${stageId}`
      }
    } else {
      const arrayStageId = JSON.parse(stageId)
      whereOptions.where.stageId = {
        $or: arrayStageId
      }
    }
  }

  if (search && search.length > 0) {
    if (search.includes('BS') || search.includes('bs')) {
      if (search.includes('BS')) search = search.replace(/BS/g, '')
      if (search.includes('bs')) search = search.replace(/bs/g, '')
      whereOptions.where.id = {
        $eq: search
      }
    } else {
      if (parseInt(search)) {
        whereOptions.where.listedPrice = {
          $lte: search * 1.1,
          $gte: search * 0.9
        }
      } else {
        whereOptions.where.$or = []
        whereOptions.where.$or.push(
          {
            businessName: {
              $like: `%${search}%`
            }
          },
          {
            firstNameV: {
              $like: `%${search}%`
            }
          },
          {
            lastNameV: {
              $like: `%${search}%`
            }
          },
          {
            suburb: {
              $like: `%${search}%`
            }
          },
          {
            searchNote: {
              $like: `%${search}%`
            }
          }
        )
      }
    }
  }

  const options = {
    attributes: [
      'id',
      'businessName',
      'firstNameV',
      'lastNameV',
      'address1',
      'industry',
      'listedPrice',
      'description',
      'stageId',
      'productId',
      'industryId',
      'suburb',
      'state',
      'postCode',
      'typeId',
      'notifyOwner',
      'dateTimeCreated',
      'daysOnTheMarket',
      'vendorPhone1'
    ],
    include: [models.BusinessStage, models.BusinessProduct]
  }

  try {
    const businesses = await models.Business.findAll(Object.assign(options, whereOptions))

    const buyersFromBusiness = await Promise.all(
      businesses.map(async business => {
        const enquiries = await models.EnquiryBusinessBuyer.findAll({
          where: { business_id: business.id },
          include: [
            {
              model: models.Buyer
            }
          ]
        })
        return {
          enquiries,
          business
        }
      })
    )

    const response = await Promise.all(
      buyersFromBusiness.map(async obj => {
        const arrayLogsLength = await Promise.all(
          obj.enquiries.map(async enquiry => {
            const log = await models.BuyerLog.findAll({
              where: {
                buyer_id: enquiry.buyer_id,
                business_id: enquiry.business_id,
                followUpStatus: 'Pending',
                followUp: {
                  $lte: moment().toDate()
                }
              },
              raw: true
            })
            return log.length
          })
        )
        const lastScore = await models.Score.findOne({
          where: {
            business_id: obj.business.id
          },
          order: [['dateTimeCreated', 'DESC']]
        })
        return {
          business: obj.business,
          countFollowUpTask: _.sum(arrayLogsLength),
          lastScore
        }
      })
    )

    return res.status(200).json(response)
  } catch (err) {
    return next(err)
  }
}

export const create = async (req, res, next) => {
  const newBuyer = req.body

  newBuyer.source_id = req.body.sourceId === '' ? null : req.body.sourceId
  newBuyer.createdBy_id = req.user.id
  newBuyer.modifiedBy_id = req.user.id

  try {
    const buyer = await models.Buyer.create(newBuyer)
    return res.status(201).json({
      data: buyer,
      message: 'Buyer created with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { idBuyer } = req.params
  const modifyBuyer = req.body

  modifyBuyer.modifiedBy_id = req.user.id

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({
      where: { id: idBuyer }
    })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    await models.Buyer.update(modifyBuyer, { where: { id: idBuyer } })
    return res.status(201).json({
      data: modifyBuyer,
      message: 'Buyer updated with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const { id } = req.body
  try {
    await models.User.destroy({ where: { id } })
    return res.status(200).json({ message: 'User removed with success' })
  } catch (error) {
    return next(error)
  }
}

export const sendCA = async (req, res, next) => {
  const { buyerId, businessId } = req.body

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({ where: { id: buyerId } })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify exists business
    const business = await models.Business.findOne({ where: { id: businessId } })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify business attach to buyer
    const enquiryBusinessBuyer = await models.EnquiryBusinessBuyer.findOne({
      where: { $and: { business_id: businessId, buyer_id: buyerId } }
    })

    if (!enquiryBusinessBuyer) {
      // Set on Enquiry table
      await models.EnquiryBusinessBuyer.create({
        buyer_id: buyer.id,
        business_id: business.id
      })
    }

    // Verify exists template CA Sent
    const template = await models.EmailTemplate.findOne({
      where: { id: 8 }
    })
    if (!template) {
      throw new APIError({
        message: 'The email template not found',
        status: 404,
        isPublic: true
      })
    }

    // Compile the template to use variables
    const templateCompiled = Handlebars.compile(template.body)
    const context = {
      buyer_name: `${buyer.firstName} ${buyer.surname}`,
      business_name: business.businessName
    }

    // Set email options
    const mailOptions = {
      to: buyer.email,
      from: '"Xcllusive" <businessinfo@xcllusive.com.au>',
      subject: template.subject,
      html: templateCompiled(context),
      attachments: template.enableAttachment
        ? [
          {
            filename: `${template.title.trim()}.pdf`,
            path: template.attachmentPath
          }
        ]
        : []
    }

    // Send Email
    const responseMailer = await mailer.sendMail(mailOptions)

    // Updated caSent on Buyer
    await models.Buyer.update({ caSent: true }, { where: { id: buyerId } })

    // Insert in log
    await models.BuyerLog.create({
      followUpStatus: 'Pending',
      text: 'CA Sent',
      followUp: moment().add(7, 'days'),
      business_id: businessId,
      buyer_id: buyerId
    })

    return res.status(201).json({
      data: {
        mail: responseMailer
      },
      message: `Email sent successfully to ${buyer.firstName} ${buyer.surname} <${
        buyer.email
      }>`
    })
  } catch (error) {
    return next(error)
  }
}

export const sendIM = async (req, res, next) => {
  const { buyerId, businessId } = req.body

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({ where: { id: buyerId } })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify exists business
    const business = await models.Business.findOne({
      where: { id: businessId },
      include: [{ model: models.User, as: 'listingAgent' }]
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify notifyOwner on business
    // if (!business.notifyOwner) {
    //   throw new APIError({
    //     message: 'Notify Owner is to false',
    //     status: 400,
    //     isPublic: true
    //   })
    // }

    // Verify business attach to buyer
    const enquiryBusinessBuyer = await models.EnquiryBusinessBuyer.findOne({
      where: { $and: { business_id: businessId, buyer_id: buyerId } }
    })

    if (!enquiryBusinessBuyer) {
      // Set on Enquiry table
      await models.EnquiryBusinessBuyer.create({
        buyer_id: buyer.id,
        business_id: business.id
      })
    }

    // Verify exists template
    const template = await models.EmailTemplate.findOne({
      where: { title: 'Send Business IM' }
    })
    if (!template) {
      throw new APIError({
        message: 'The email template not found',
        status: 404,
        isPublic: true
      })
    }

    // Compile the template to use variables
    const templateCompiled = Handlebars.compile(template.body)
    const context = {
      buyer_name: `${buyer.firstName} ${buyer.surname}`,
      business_name: business.businessName,
      listing_agent: `${business.listingAgent.firstName} ${
        business.listingAgent.lastName
      }`,
      listing_agent_email: business.vendorEmail,
      listing_agent_phone: business.vendorPhone1
    }

    // Set email options
    const mailOptions = {
      to: buyer.email,
      from: '"Xcllusive" <businessinfo@xcllusive.com.au>',
      subject: `${business.businessName} - ${template.subject}`,
      html: templateCompiled(context),
      attachments: template.enableAttachment
        ? [
          // {
          //   filename: `${template.title.trim()}.pdf`,
          //   path: template.attachmentPath
          // },
          {
            filename: `${business.businessName.trim()}_IM_${business.id}.pdf`,
            path: business.imUrl
          }
        ]
        : []
    }

    // Send Email
    const responseMailer = await mailer.sendMail(mailOptions)

    // Updated caSent on Buyer
    await models.Buyer.update({ smSent: true }, { where: { id: buyerId } })

    // const test = await models.User.findOne({
    //   where: { id: req.user.id }
    // })

    // console.log(test)

    // Insert in log
    await models.BuyerLog.create({
      text: business.notifyOwner
        ? `IM Sent to Buyer ${buyer.id} by ${req.user.id}`
        : `IM Sent to Buyer ${buyer.id}`,
      followUpStatus: 'Done',
      followUp: moment().add(1, 'days'),
      business_id: businessId,
      buyer_id: buyerId
    })

    return res.status(201).json({
      data: {
        mail: responseMailer
      },
      message: `Email sent successfully to ${buyer.firstName} ${buyer.surname} <${
        buyer.email
      }>`
    })
  } catch (error) {
    return next(error)
  }
}

export const receivedCA = async (req, res, next) => {
  const { buyerId, businessId } = req.body
  const file = req.files.caFile

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({ where: { id: buyerId } })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify exists business
    const business = await models.Business.findOne({ where: { id: businessId } })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify file received
    if (!file) {
      throw new APIError({
        message: 'Expect one file upload named caFile',
        status: 400,
        isPublic: true
      })
    }

    // Verify file is pdf
    if (!/\/pdf$/.test(file.mimetype)) {
      throw new APIError({
        message: 'Expect pdf file',
        status: 400,
        isPublic: true
      })
    }

    // Upload file to aws s3
    const upload = await uploadToS3(
      'xcllusive-certificate-authority',
      file,
      `ca-buyer-${buyer.id}.pdf`
    )

    // updated CA received on buyer
    await models.Buyer.update(
      { caReceived: true, attachmentUrl: upload.Location },
      { where: { id: buyerId } }
    )

    // Insert in log
    await models.BuyerLog.create({
      text: 'CA Received',
      followUpStatus: 'Done',
      followUp: moment().toDate(),
      business_id: businessId,
      buyer_id: buyerId
    })

    return res.status(201).json({
      data: upload,
      message: `Email sent successfully to ${buyer.firstName} ${buyer.surname} <${
        buyer.email
      }>`
    })
  } catch (error) {
    return next(error)
  }
}

export const listLog = async (req, res, next) => {
  const { idBuyer: id } = req.params

  const limit = req.query.limit
  const offset = req.skip

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({ where: { id } })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    const logs = await models.BuyerLog.findAndCountAll({
      where: { buyer_id: id },
      order: [['dateTimeCreated', 'DESC']],
      include: [
        {
          model: models.Business,
          attributes: ['businessName']
        }
      ],
      limit,
      offset
    })

    return res.status(201).json({
      data: logs,
      pageCount: logs.count,
      itemCount: Math.ceil(logs.count / req.query.limit),
      message: logs.length === 0 ? 'Nothing buyer log found' : 'Get buyer log succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const listBusinessesFromBuyerLog = async (req, res, next) => {
  const { idBuyer } = req.params
  const { businessId } = req.query

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({ where: { id: idBuyer } })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    const logs = await models.BuyerLog.findAndCountAll({
      where: { buyer_id: idBuyer, business_id: businessId },
      order: [['dateTimeCreated', 'DESC']],
      include: [
        {
          model: models.Business,
          attributes: ['businessName']
        }
      ],
      limit: req.query.limit,
      offset: req.skip
    })

    const lastLog = await models.BuyerLog.findOne({
      where: { buyer_id: idBuyer, business_id: businessId, followUpStatus: 'Pending' },
      order: [['dateTimeCreated', 'DESC']],
      raw: true
    })

    console.log(lastLog)

    return res.status(201).json({
      data: logs,
      lastLog,
      pageCount: logs.count,
      itemCount: Math.ceil(logs.count / req.query.limit),
      message:
        logs.length === 0
          ? 'No business found for buyer'
          : 'Get business from buyer succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const listBusinessesFromBuyer = async (req, res, next) => {
  const { idBuyer } = req.params

  try {
    // Verify exists buyer
    const buyers = await models.EnquiryBusinessBuyer.findAll({
      where: { buyer_id: idBuyer },
      include: [
        {
          model: models.Business,
          attributes: ['businessName']
        }
      ]
    })

    if (!buyers) {
      throw new APIError({
        message: 'Businesses not found',
        status: 404,
        isPublic: true
      })
    }

    return res.status(201).json({
      data: buyers,
      message: 'Get businesses from buyer succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const createLog = async (req, res, next) => {
  const newLog = {
    text: req.body.buyerLog_text ? req.body.buyerLog_text : '',
    followUp: req.body.buyerLog_followUp ? req.body.buyerLog_followUp : '',
    followUpStatus: 'Pending',
    business_id: req.body.business_id,
    buyer_id: req.body.buyer_id,
    modifiedBy_id: req.user.id,
    createdBy_id: req.user.id
  }

  try {
    const lastLog = await models.BuyerLog.findOne({
      where: { buyer_id: req.body.buyer_id, business_id: req.body.business_id },
      order: [['dateTimeCreated', 'DESC']]
    })

    if (lastLog) {
      await models.BuyerLog.update(
        { followUpStatus: 'Done' },
        { where: { id: lastLog.id } }
      )
    }

    const log = await models.BuyerLog.create(newLog)

    return res.status(201).json({
      data: log,
      message: 'Buyer log created succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const updateLog = async (req, res, next) => {
  const { idLog } = req.params
  const updateLog = {
    text: req.body.buyerLog_text ? req.body.buyerLog_text : '',
    followUp: req.body.buyerLog_followUp ? req.body.buyerLog_followUp : '',
    followUpStatus: 'Pending',
    modifiedBy_id: req.user.id
  }

  try {
    // Verify exists log
    const log = await models.BuyerLog.findOne({
      where: { id: idLog }
    })

    if (!log) {
      throw new APIError({
        message: 'Buyer Log not found',
        status: 404,
        isPublic: true
      })
    }

    await models.BuyerLog.update(updateLog, { where: { id: idLog } })

    return res.status(201).json({
      data: log,
      message: 'Buyer log updated succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const finaliseLog = async (req, res, next) => {
  const { idBuyer } = req.params
  const { idBusiness } = req.body

  try {
    // Verify exists buyer and business
    const enquiry = await models.EnquiryBusinessBuyer.findAll({
      where: {
        buyer_id: idBuyer,
        business_id: idBusiness
      }
    })

    if (!enquiry) {
      throw new APIError({
        message: 'Cannot find enquiries.',
        status: 404,
        isPublic: true
      })
    }

    await models.BuyerLog.update(
      {
        followUpStatus: 'Done',
        modifiedBy_id: req.user.id
      },
      {
        where: {
          buyer_id: idBuyer,
          business_id: idBusiness
        }
      }
    )

    return res.status(201).json({
      data: {},
      message: 'All logs have been finalised'
    })
  } catch (error) {
    return next(error)
  }
}
