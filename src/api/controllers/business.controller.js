import Handlebars from 'handlebars'
import moment from 'moment'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'
import mailer from '../modules/mailer'
import { uploadToS3 } from '../modules/aws'

export const getBusiness = async (req, res, next) => {
  const { idBusiness } = req.params

  const _mapValuesToArray = array => {
    if (array.length > 0) {
      if (array[0].firstName) {
        return array.map((item, index) => ({
          key: index,
          text: `${item.firstName} ${item.lastName}`,
          value: item.id
        }))
      }
      return array.map((item, index) => ({
        key: index,
        text: item.label,
        value: item.id
      }))
    }
    return []
  }

  try {
    const business = await models.Business.findOne({
      where: { id: idBusiness },
      include: [
        { model: models.User, as: 'CreatedBy' },
        { model: models.User, as: 'ModifiedBy' },
        { model: models.User, as: 'listingAgent' }
      ]
    })
    const stageList = await models.BusinessStage.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const sourceList = await models.BusinessSource.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const industryList = await models.BusinessIndustry.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const productList = await models.BusinessProduct.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const ratingList = await models.BusinessRating.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const typeList = await models.BusinessType.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const usersBroker = await models.User.findAll({
      raw: true,
      attributes: ['id', 'firstName', 'lastName'],
      where: { userType: 'Broker' }
    })
    const stageNotSignedList = await models.BusinessStageNotSigned.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const stageNotWantList = await models.BusinessStageNotWant.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const lastScore = await models.Score.findOne({
      where: {
        business_id: idBusiness
      },
      order: [['dateTimeCreated', 'DESC']]
    })
    const countAllEnquiry = await models.EnquiryBusinessBuyer.findAndCountAll({
      where: {
        business_id: idBusiness
      }
    })

    const response = {
      business,
      lastScore,
      countAllEnquiry: countAllEnquiry.count,
      stageList: _mapValuesToArray(stageList),
      sourceList: _mapValuesToArray(sourceList),
      industryList: _mapValuesToArray(industryList),
      productList: _mapValuesToArray(productList),
      ratingList: _mapValuesToArray(ratingList),
      typeList: _mapValuesToArray(typeList),
      usersBroker: _mapValuesToArray(usersBroker),
      stageNotSignedList: _mapValuesToArray(stageNotSignedList),
      stageNotWantList: _mapValuesToArray(stageNotWantList)
    }
    return res.status(200).json(response)
  } catch (err) {
    return next(err)
  }
}

export const list = async (req, res, next) => {
  let search = req.query.search
  let stageId = req.query.stageId
  let filterLog = req.query.filterLog
  let whereOptions = {
    where: {}
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
      'notifyOwner'
    ],
    include: [
      models.BusinessStage,
      models.BusinessProduct
      // {
      //   model: models.BusinessIndustry,
      //   where: { label: { $like: `%${search}%` } }
      // }
    ]
  }
  try {
    const response = {
      data: [],
      message: 'Get Businesses with sucessfuly'
    }

    const businesses = await models.Business.findAll(Object.assign(options, whereOptions))

    if (filterLog && JSON.parse(filterLog)) {
      const arrayBusinesses = await Promise.all(
        businesses.map(async business => {
          const log = await models.BuyerLog.findAll({
            where: {
              business_id: business.id,
              followUpStatus: 'Pending',
              followUp: {
                $lte: moment().toDate()
              }
            },
            raw: true
          })
          if (log.length) {
            return business
          }
        })
      )
      response.data = await arrayBusinesses.filter(item => {
        return item !== undefined
      })
    } else {
      response.data = await businesses
    }

    return res.status(200).json(response)
  } catch (err) {
    return next(err)
  }
}

export const create = async (req, res, next) => {
  const newBusiness = {
    businessName: req.body.businessName,
    firstNameV: req.body.firstName,
    lastNameV: req.body.lastName,
    vendorPhone1: req.body.vendorPhone1,
    vendorPhone2: req.body.vendorPhone2,
    vendorPhone3: req.body.vendorPhone3,
    vendorEmail: req.body.vendorEmail,
    sourceId: req.body.businessSource === '' ? null : req.body.businessSource,
    sourceNotes: req.body.sourceNotes,
    description: req.body.description,
    stageId: 1, // Potencial Listing
    createdBy_id: req.user.id,
    modifiedBy_id: req.user.id,
    brokerAccountName: req.user.id
  }

  let template = null
  let listingAgent = null

  try {
    if (req.body.listingAgent) {
      // Verify exists template
      template = await models.EmailTemplate.findOne({
        where: { title: 'Agent assign to business' }
      })

      if (!template) {
        throw new APIError({
          message: 'The email template not found',
          status: 404,
          isPublic: true
        })
      }

      // Verify exists listingAgent
      listingAgent = await models.User.findOne({
        where: { id: req.body.listingAgent }
      })

      if (!listingAgent) {
        throw new APIError({
          message: 'Listing agent not found',
          status: 404,
          isPublic: true
        })
      }
    }

    newBusiness.listingAgent_id = req.body.listingAgent || req.user.id
    const business = await models.Business.create(newBusiness)
    await models.BusinessLog.create({
      text: 'New  Business',
      createdBy_id: req.user.id,
      followUpStatus: 'Pending',
      followUp: moment(),
      business_id: business.get('id')
    })

    if (req.body.listingAgent) {
      // Compile the template to use variables
      const templateCompiled = Handlebars.compile(template.body)
      const context = {
        agent_full_name: `${listingAgent.firstName} ${listingAgent.lastName}`,
        agent_first_name: listingAgent.firstName,
        business_name: business.businessName
      }

      // Set email options
      const mailOptions = {
        to: listingAgent.email,
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
      await mailer.sendMail(mailOptions)
    }

    return res.status(200).json({ message: 'Business created sucessfully' })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { idBusiness } = req.params

  const {
    stage,
    businessSource,
    businessRating,
    businessIndustry,
    businessProduct,
    businessType,
    brokerAccountName,
    depositeTakenDate,
    settlementDate
  } = req.body

  req.body.stageId = stage === '' ? undefined : stage
  req.body.sourceId = businessSource === '' ? undefined : businessSource
  req.body.ratingId = businessRating === '' ? undefined : businessRating
  req.body.industryId = businessIndustry === '' ? undefined : businessIndustry
  req.body.productId = businessProduct === '' ? undefined : businessProduct
  req.body.typeId = businessType === '' ? undefined : businessType
  req.body.depositeTakenDate =
    depositeTakenDate instanceof Date ? depositeTakenDate : undefined
  req.body.settlementDate = settlementDate instanceof Date ? settlementDate : undefined
  req.body.brokerAccountName = brokerAccountName === '' ? undefined : brokerAccountName
  req.body.modifiedBy_id = req.user.id

  try {
    const business = await models.Business.findOne({ where: { id: idBusiness } })

    if (!business.daysOnTheMarket && stage === 4) {
      req.body.daysOnTheMarket = moment()
    }

    await models.Business.update(req.body, { where: { id: idBusiness } })

    return res
      .status(200)
      .json({ message: `Business BS${idBusiness} updated with success` })
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

export const updateListingAgent = async (req, res, next) => {
  const { listingAgentId } = req.body

  const { idBusiness } = req.params

  const data = {
    listingAgent_id: listingAgentId
  }

  if (!idBusiness || idBusiness === 'undefined') {
    throw new APIError({
      message: 'Business id does not exist',
      status: 404,
      isPublic: true
    })
  }

  try {
    // Verify exists business
    const business = await models.Business.findOne({ where: { id: idBusiness } })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify exists template
    const template = await models.EmailTemplate.findOne({
      where: { title: 'Agent reassign to business' }
    })

    if (!template) {
      throw new APIError({
        message: 'The email template not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify exists listingAgent
    const listingAgent = await models.User.findOne({
      where: { id: listingAgentId }
    })

    if (!listingAgent) {
      throw new APIError({
        message: 'Listing agent not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify logged user
    const user = await models.User.findOne({
      where: { id: req.user.id }
    })

    // Compile the template to use variables
    const templateCompiled = Handlebars.compile(template.body)
    const context = {
      agent_full_name: `${listingAgent.firstName} ${listingAgent.lastName}`,
      agent_first_name: listingAgent.firstName,
      business_name: business.businessName,
      user_name: user.firstName
    }

    // Set email options
    const mailOptions = {
      to: listingAgent.email,
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
    await mailer.sendMail(mailOptions)
  } catch (error) {
    return next(error)
  }

  try {
    await models.Business.update(data, { where: { id: idBusiness } })
    return res
      .status(200)
      .json({ message: `Agent list on business BS${idBusiness} updated with success` })
  } catch (error) {
    return next(error)
  }
}

export const updateStageLost = async (req, res, next) => {
  const { idBusiness } = req.params
  const updateBusiness = req.body

  updateBusiness.modifiedBy_id = req.user.id
  updateBusiness.stageId = 8

  try {
    // Verify exists business
    const business = await models.Business.findOne({ where: { id: idBusiness } })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    await models.Business.update(updateBusiness, { where: { id: idBusiness } })

    if (updateBusiness.pendingDone) {
      await models.BusinessLog.update(
        { followUpStatus: 'Done' },
        { where: { business_id: idBusiness } }
      )
    }

    if (updateBusiness.followUpLog) {
      await models.BusinessLog.create({
        text: `${updateBusiness.text}

Lost Notes: ${updateBusiness.afterSalesNotes}

Mark all Pending communications with this Vendor as Done: ${
  updateBusiness.pendingDone === true ? 'Yes' : 'No'
}

Did you meet with this vendor? ${
  updateBusiness.saleNotesLostMeeting === true ? 'Yes' : 'No'
} : ${updateBusiness.recoveryStageNotWant}

Did we want this business? ${
  updateBusiness.saleNotesLostWant === true ? 'Yes' : 'No'
} : ${updateBusiness.recoveryStageNotSigned}

`,
        createdBy_id: req.user.id,
        followUpStatus: 'Done',
        followUp: moment(updateBusiness.date),
        business_id: idBusiness
      })
    }

    return res
      .status(200)
      .json({ message: `Business BS${idBusiness} updated with success` })
  } catch (error) {
    return next(error)
  }
}

export const enquiryBusiness = async (req, res, next) => {
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
    let enquiryBusinessBuyer = await models.EnquiryBusinessBuyer.findOne({
      where: { $and: { business_id: businessId, buyer_id: buyerId } }
    })

    if (!enquiryBusinessBuyer) {
      // Set on Enquiry table
      enquiryBusinessBuyer = await models.EnquiryBusinessBuyer.create({
        buyer_id: buyer.id,
        business_id: business.id
      })
    }

    // Insert in log
    await models.BuyerLog.create({
      text: 'Business Enquired',
      followUpStatus: 'Done',
      followUp: moment(),
      business_id: businessId,
      buyer_id: buyerId
    })

    return res.status(201).json({
      data: enquiryBusinessBuyer,
      message: `Business ${businessId} attach to buyer ${buyerId}`
    })
  } catch (error) {
    return next(error)
  }
}

export const emailToBuyer = async (req, res, next) => {
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

    // Verify exists template
    const template = await models.EmailTemplate.findOne({
      where: { title: 'Send Email to Buyer' }
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
      buyer_name: `${buyer.firstName} ${buyer.surname}`
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

    // Insert in log
    await models.BuyerLog.create({
      text: `Email to Buyer ${buyer.id} Sent (Under Offer)`,
      followUpStatus: 'Done',
      followUp: moment(),
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

export const sendEnquiryOwner = async (req, res, next) => {
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

    // Verify exists template
    const template = await models.EmailTemplate.findOne({
      where: { title: 'Send Enquiry to Owner' }
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
      owner_name: `${business.firstName} ${business.lastName}`,
      business_name: business.businessName,
      buyer_id: buyerId,
      buyer_phone: buyer.telephone1,
      buyer_email: buyer.email
    }

    // Set email options
    const mailOptions = {
      to: business.vendorEmail,
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

    // Insert in log
    await models.BuyerLog.create({
      text: 'Enquiry to Owner Sent',
      followUpStatus: 'Done',
      followUp: moment(),
      business_id: businessId,
      buyer_id: buyerId
    })

    return res.status(201).json({
      data: responseMailer,
      message: 'Enquiry to Owner Sent'
    })
  } catch (error) {
    return next(error)
  }
}

export const getBuyersFromBusiness = async (req, res, next) => {
  const { idBusiness } = req.params
  const { showAll } = req.query

  try {
    // Verify exists business
    const business = await models.Business.findOne({
      where: { id: idBusiness }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Get buyers from business enquiry
    const buyersFromBusiness = await models.EnquiryBusinessBuyer.findAll({
      where: { business_id: idBusiness },
      include: [
        {
          model: models.Buyer
        }
      ]
    })

    const array = []
    const verifyContentBuyerLog = await buyersFromBusiness.map(async enquiry => {
      const where = {
        buyer_id: enquiry.buyer_id,
        business_id: idBusiness,
        followUp: {
          $lte: moment().toDate()
        },
        followUpStatus: 'Pending'
      }
      if (showAll && JSON.parse(showAll)) {
        delete where.followUpStatus
        delete where.followUp
      }
      const logs = await models.BuyerLog.findAll({
        where,
        raw: true
      })
      if (logs.length > 0) {
        // Get last log
        const where = {
          buyer_id: enquiry.buyer_id,
          business_id: enquiry.business_id,
          followUpStatus: 'Pending'
        }
        if (showAll && JSON.parse(showAll)) {
          delete where.followUpStatus
        }
        const lastLog = await models.BuyerLog.findOne({
          where,
          order: [['dateTimeCreated', 'DESC']],
          raw: true
        })
        array.push({ lastLog, enquiry })
      }
      return array
    })

    const response = await Promise.all(verifyContentBuyerLog)

    return res.status(201).json({
      data: {
        array: response[0],
        countAll: buyersFromBusiness.length
      },
      message: 'Success'
    })
  } catch (error) {
    return next(error)
  }
}

export const getGroupEmail = async (req, res, next) => {
  const { idBusiness } = req.params

  // const response = []

  try {
    // Verify exists business
    const business = await models.Business.findOne({
      where: { id: idBusiness }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Get buyers from business enquiry
    const buyersFromBusiness = await models.EnquiryBusinessBuyer.findAll({
      where: { business_id: idBusiness },
      include: [
        {
          model: models.Buyer
        }
      ]
    })

    const arrayGroupEmail = await Promise.all(
      buyersFromBusiness.map(async item => {
        const logs = await models.BuyerLog.findAll({
          where: {
            buyer_id: item.buyer_id,
            business_id: item.business_id
          }
        })

        const isPending = await Promise.all(
          logs.map(log => {
            return log.followUpStatus
          })
        )

        if (item.Buyer.caReceived) {
          return {
            id: item.Buyer.id,
            email: item.Buyer.email,
            firstName: item.Buyer.firstName,
            lastName: item.Buyer.surname,
            isPending: isPending.some(item => {
              return item === 'Pending'
            })
          }
        }
      })
    )

    const filterArrayGroupEmail = arrayGroupEmail.filter(item => {
      return item !== undefined
    })

    return res.status(201).json({
      data: filterArrayGroupEmail,
      message: 'Success'
    })
  } catch (error) {
    return next(error)
  }
}

export const sendGroupEmail = async (req, res, next) => {
  const { to, subject, body } = req.body
  const fileAttachment = req.files.attachment
  const sentTo = []

  try {
    const emailToOffice = await models.SystemSettings.findOne({ where: 1 })
    for (let buyer of JSON.parse(to)) {
      const mailOptions = {
        to: buyer.email,
        from: '"Xcllusive Business Sales" <businessinfo@xcllusive.com.au>',
        subject,
        replyTo: buyer.replyTo
          ? req.user.email
          : `${req.user.email}, ${emailToOffice.emailOffice}`,
        html: `
        <p>Dear ${buyer.firstName} ${buyer.lastName}</p>
        
        </br>
        <p>${body}</p>
        </br>

        <p>Xcllusive Business Sales</p>
        <p>www.xcllusive.com.au | (02) 9817 3331</p>
        `,
        attachments: fileAttachment
          ? [
            {
              filename: fileAttachment.name,
              content: fileAttachment.data
            }
          ]
          : []
      }
      const resMailer = await mailer.sendMail(mailOptions)
      if (resMailer) sentTo.push(resMailer.envelope.to[0])
    }

    return res.status(201).json({
      data: sentTo,
      message: 'Send email successfuly'
    })
  } catch (error) {
    return next(error)
  }
}

export const getStageSold = async (req, res, next) => {
  const { idBusiness } = req.params

  try {
    const sold = await models.BusinessSold.findOne({
      where: { business_id: idBusiness }
    })

    return res.status(201).json({
      data: sold,
      message: 'Get sold successfuly'
    })
  } catch (error) {
    return next(error)
  }
}

export const createStageSold = async (req, res, next) => {
  const { idBusiness } = req.params
  const newSold = req.body

  newSold.business_id = idBusiness
  newSold.createddBy_id = req.user.id
  newSold.modifiedBy_id = req.user.id

  try {
    const sold = await models.BusinessSold.create(newSold)

    return res.status(201).json({
      data: sold,
      message: 'Create with successfuly'
    })
  } catch (error) {
    return next(error)
  }
}

export const updateStageSold = async (req, res, next) => {
  const { idBusiness } = req.params
  const updatedSold = req.body

  updatedSold.business_id = idBusiness
  updatedSold.modifiedBy_id = req.user.id

  try {
    await models.BusinessSold.update(updatedSold, { where: { id: updatedSold.id } })

    return res.status(201).json({
      data: null,
      message: 'Update with successfuly'
    })
  } catch (error) {
    return next(error)
  }
}

export const finaliseStageSold = async (req, res, next) => {
  const { idBusiness, idSold } = req.params

  try {
    await models.BusinessSold.update(
      { sold: true, modifiedBy_id: req.user.id },
      { where: { id: idSold } }
    )
    await models.Business.update(
      { stageId: 6, modifiedBy_id: req.user.id },
      { where: { id: idBusiness } }
    )
    await models.BusinessLog.update(
      { followUpStatus: 'Done' },
      { where: { business_id: idBusiness } }
    )
    return res.status(201).json({
      data: null,
      message: 'Stage change to Sold'
    })
  } catch (error) {
    return next(error)
  }
}

export const getQtdeBusinessStageUser = async (req, res, next) => {
  try {
    const businessPotentialListing = await models.Business.count({
      where: { $and: { listingAgent_id: req.user.id, stageId: 1 } }
    })
    const businessListingNegotiation = await models.Business.count({
      where: { $and: { listingAgent_id: req.user.id, stageId: 2 } }
    })
    const businessSalesMemo = await models.Business.count({
      where: { $and: { listingAgent_id: req.user.id, stageId: 3 } }
    })
    const businessForSale = await models.Business.count({
      where: { $and: { listingAgent_id: req.user.id, stageId: 4 } }
    })
    const businessSold = await models.Business.count({
      where: { $and: { listingAgent_id: req.user.id, stageId: 6 } }
    })
    const businessWithdrawn = await models.Business.count({
      where: { $and: { listingAgent_id: req.user.id, stageId: 7 } }
    })
    return res.status(201).json({
      data: {
        businessPotentialListing,
        businessListingNegotiation,
        businessSalesMemo,
        businessForSale,
        businessSold,
        businessWithdrawn
      }
    })
  } catch (error) {
    return next(error)
  }
}

export const getAllPerUser = async (req, res, next) => {
  let search = req.query.search
  let stageId = req.query.stageId
  let filterLog = req.query.filterLog
  let whereOptions = {
    where: {}
  }

  whereOptions.where.listingAgent_id = {
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
      'notifyOwner'
    ],
    include: [
      models.BusinessStage,
      models.BusinessProduct
      // {
      //   model: models.BusinessIndustry,
      //   where: { label: { $like: `%${search}%` } }
      // }
    ]
  }
  try {
    const response = {
      data: [],
      message: 'Get Businesses with sucessfuly'
    }

    const businesses = await models.Business.findAll(Object.assign(options, whereOptions))

    if (filterLog && JSON.parse(filterLog)) {
      const arrayBusinesses = await Promise.all(
        businesses.map(async business => {
          const log = await models.BuyerLog.findAll({
            where: {
              business_id: business.id,
              followUpStatus: 'Pending',
              followUp: {
                $lte: moment().toDate()
              }
            },
            raw: true
          })
          if (log.length) {
            return business
          }
        })
      )
      response.data = await arrayBusinesses.filter(item => {
        return item !== undefined
      })
    } else {
      response.data = await businesses
    }

    return res.status(200).json(response)
  } catch (err) {
    return next(err)
  }
}

export const updateStageMemo = async (req, res, next) => {
  const { idBusiness } = req.params
  const updateMemo = req.body

  updateMemo.modifiedBy_id = req.user.id
  updateMemo.stageId = 3

  try {
    // Verify exists business
    const business = await models.Business.findOne({ where: { id: idBusiness } })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    await models.Business.update(updateMemo, { where: { id: idBusiness } })

    if (updateMemo.pendingDone) {
      await models.BusinessLog.update(
        { followUpStatus: 'Done' },
        { where: { business_id: idBusiness } }
      )
    }

    return res
      .status(200)
      .json({ data: business, message: `Business BS${idBusiness} changed to sales memo` })
  } catch (error) {
    return next(error)
  }
}

export const uploadIM = async (req, res, next) => {
  const { businessId } = req.body
  const file = req.files.imFile

  try {
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
        message: 'Expect one file upload named imFile',
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

    // VERIFY WITH BRUNO
    // Upload file to aws s3
    const upload = await uploadToS3(
      'xcllusive-certificate-authority',
      file,
      `${business.businessName}_IM_${business.id}.pdf`
    )

    // updated IM uploaded on business
    await models.Business.update(
      { imUploaded: true, imUrl: upload.Location },
      { where: { id: businessId } }
    )
    return res
      .status(200)
      .json({ message: `IM on business BS${business.id} uploaded successfully` })
  } catch (error) {
    return next(error)
  }
}
