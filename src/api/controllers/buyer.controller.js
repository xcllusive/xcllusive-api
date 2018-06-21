import Handlebars from 'handlebars'
import moment from 'moment'
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

export const create = async (req, res, next) => {
  const newBuyer = req.body

  newBuyer.source_id = req.body.source_id === '' ? null : req.body.source_id
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
      text: 'Confidentiality Agreement Sent',
      followUp: moment().add(7, 'days'),
      business_id: businessId,
      buyer_id: buyerId
    })

    return res.status(201).json({
      data: {
        mail: responseMailer
      },
      message: `Send email successfuly to ${buyer.firstName} <${buyer.email}>`
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
    const business = await models.Business.findOne({ where: { id: businessId } })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify notifyOwner on business
    if (!business.notifyOwner) {
      throw new APIError({
        message: 'Notify Owner is to false',
        status: 400,
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
      listing_agent: business.listingAgent,
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
    await models.Buyer.update({ smSent: true }, { where: { id: buyerId } })

    // Insert in log
    await models.BuyerLog.create({
      text: `Send Information Sales Memorandum to Buyer ${buyer.id}`,
      followUpStatus: 'Done',
      followUp: moment().add(1, 'days'),
      business_id: businessId,
      buyer_id: buyerId
    })

    return res.status(201).json({
      data: {
        mail: responseMailer
      },
      message: `Send email successfuly to ${buyer.firstName} <${buyer.email}>`
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

    return res.status(201).json({
      data: upload,
      message: `Send email successfuly to ${buyer.firstName} <${buyer.email}>`
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
      order: [['followUp', 'DESC']],
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
      message:
        logs.length === 0 ? 'Nothing buyer log found' : 'Get buyer log with succesfuly'
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

    return res.status(201).json({
      data: logs,
      pageCount: logs.count,
      itemCount: Math.ceil(logs.count / req.query.limit),
      message:
        logs.length === 0
          ? 'No business found for buyer'
          : 'Get business from buyer with succesfuly'
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
      message: 'Get businesses from buyer with succesfuly'
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
      message: 'Buyer log created with succesfuly'
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
      message: 'Buyer log updated with succesfuly'
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

    await models.BuyerLog.update({
      followUpStatus: 'Done',
      modifiedBy_id: req.user.id
    }, {
      where: {
        buyer_id: idBuyer,
        business_id: idBusiness
      }
    })

    return res.status(201).json({
      data: {},
      message: 'All logs have been finalised'
    })
  } catch (error) {
    return next(error)
  }
}
