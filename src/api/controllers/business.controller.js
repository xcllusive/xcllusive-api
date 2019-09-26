import Handlebars from 'handlebars'
import moment from 'moment'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'
import mailer from '../modules/mailer'
import _ from 'lodash'
import {
  uploadToS3,
  SNS
} from '../modules/aws'

export const getBusiness = async (req, res, next) => {
  const {
    idBusiness
  } = req.params

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
      where: {
        id: idBusiness
      },
      include: [{
        model: models.User,
        as: 'CreatedBy'
      }, {
        model: models.User,
        as: 'ModifiedBy'
      }, {
        model: models.User,
        as: 'listingAgent'
      }, {
        model: models.User,
        as: 'listingAgentCtc'
      }]
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
      where: {
        id: {
          $ne: 99 /* ignore Any (only for comparable data in appraisal) */
        }
      },
      attributes: ['id', 'label'],
      order: [
        ['label', 'ASC']
      ]
    })
    const usersBroker = await models.User.findAll({
      raw: true,
      attributes: ['id', 'firstName', 'lastName'],
      where: {
        userType: 'Broker',
        active: 1
      }
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
      order: [
        ['dateTimeCreated', 'DESC']
      ]
    })
    const countAllEnquiry = await models.EnquiryBusinessBuyer.findAndCountAll({
      where: {
        business_id: idBusiness
      }
    })
    const ctcSourceList = await models.CtcBusinessSource.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const ctcStageList = await models.CtcBusinessStage.findAll({
      raw: true,
      where: {
        id: {
          $ne: 1
        }
      },
      attributes: ['id', 'label']
    })
    let issueList = []
    if (business.company_id === 2 && business.listIssues_id) {
      issueList = await models.Issue.findAll({
        raw: true,
        attributes: ['id', 'label', 'closed'],
        where: {
          id: {
            $in: JSON.parse(business.listIssues_id)
          }
        }
      })
    }

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
      stageNotWantList: _mapValuesToArray(stageNotWantList),
      ctcSourceList: _mapValuesToArray(ctcSourceList),
      ctcStageList: _mapValuesToArray(ctcStageList),
      issueList
    }
    return res.status(200).json(response)
  } catch (err) {
    return next(err)
  }
}

export const list = async (req, res, next) => {
  let search = req.query.search
  let stageId = req.query.stageId
  let company = req.query.company
  let filterLog = req.query.filterLog
  let whereOptions = {
    where: {}
  }

  if (stageId && stageId.length > 0) {
    if (parseInt(stageId) || company) {
      if (company === 'xcllusive') {
        whereOptions.where.stageId = {
          $eq: `${JSON.parse(stageId)}`
        }
        whereOptions.where.$and = []
        whereOptions.where.$and.push({
          company_id: {
            $eq: 1
          }
        })
      }
      if (company === 'ctc') {
        whereOptions.where.ctcStageId = {
          $eq: `${stageId}`
        }
        whereOptions.where.$and = []
        whereOptions.where.$and.push({
          company_id: {
            $eq: 2
          }
        })
      }
    } else {
      const arrayStageId = JSON.parse(stageId)
      whereOptions.where.$and = []
      whereOptions.where.$and.push({
        stageId: {
          $or: arrayStageId
        }
      })
    }
  } else {
    whereOptions.where.$and = []
    if (company === 'xcllusive') {
      whereOptions.where.$and.push({
        company_id: {
          $eq: 1
        }
      })
    }
    if (company === 'ctc') {
      whereOptions.where.$and.push({
        company_id: {
          $eq: 2
        }
      })
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
        whereOptions.where.$or.push({
          businessName: {
            $like: `%${search}%`
          }
        }, {
          firstNameV: {
            $like: `%${search}%`
          }
        }, {
          lastNameV: {
            $like: `%${search}%`
          }
        }, {
          suburb: {
            $like: `%${search}%`
          }
        }, {
          searchNote: {
            $like: `%${search}%`
          }
        })
      }
    }
  }

  const options = {
    attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'address1', 'industry', 'listedPrice', 'description', 'stageId', 'productId', 'industryId', 'suburb', 'state', 'postCode', 'typeId', 'notifyOwner', 'vendorEmail', 'company_id', 'vendorPhone1', 'vendorPhone2', 'vendorPhone3', 'ctcStageId'],
    include: [
      models.BusinessStage, models.BusinessProduct, models.CtcBusinessStage
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
                $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
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
    brokerAccountName: req.user.id,
    ctcSourceId: req.body.ctcSourceId,
    company_id: req.body.company,
    willReassign: req.body.willReassign,
    ctcStageId: req.body.ctcStageId,
    dateTimeAssignToAgent: moment().format('YYYY-MM-DD hh:mm:ss'),
    dateTimeFirstOpenByAgent: req.body.dateTimeFirstOpenByAgent
  }

  let template = null
  let listingAgent = null

  const listingAgentXcllusive = req.body.listingAgent
  if (req.body.listingAgent === null || newBusiness.willReassign) req.body.listingAgent = req.body.listingAgentCtc || req.user.id
  try {
    if (req.body.listingAgent) {
      // Verify exists template
      template = await models.EmailTemplate.findOne({
        where: {
          title: 'Agent assign to business'
        }
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
        where: {
          id: req.body.listingAgent
        }
      })

      if (!listingAgent) {
        throw new APIError({
          message: 'Listing agent not found',
          status: 404,
          isPublic: true
        })
      }
    } else {
      newBusiness.dateTimeFirstOpenByAgent = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    }
    if (req.body.company === 1) {
      newBusiness.listingAgent_id = req.body.listingAgent !== '' ? req.body.listingAgent : req.user.id
      newBusiness.ctcSourceId = 1
      newBusiness.ctcStageId = 1
    } else {
      if (newBusiness.willReassign) newBusiness.listingAgent_id = listingAgentXcllusive
      newBusiness.listingAgentCtc_id = req.body.listingAgentCtc || req.user.id
      newBusiness.ctcStageId = 2
    }

    const business = await models.Business.create(newBusiness)
    await models.BusinessLog.create({
      text: 'New Business',
      createdBy_id: req.user.id,
      followUpStatus: 'Pending',
      followUp: moment().format('YYYY-MM-DD hh:mm:ss'),
      business_id: business.get('id')
    })

    if (req.body.listingAgent) {
      // Compile the template to use variables
      const templateCompiled = Handlebars.compile(template.body)
      const context = {
        agent_full_name: `${listingAgent.firstName} ${listingAgent.lastName}`,
        agent_first_name: listingAgent.firstName,
        business_name: business.businessName,
        business_id: business.id
      }

      // Set email options
      const mailOptions = {
        to: listingAgent.email,
        from: '"Xcllusive" <businessinfo@xcllusive.com.au>',
        subject: template.subject,
        html: templateCompiled(context),
        attachments: template.enableAttachment ? [{
          filename: `${template.title.trim()}.pdf`,
          path: template.attachmentPath
        }] : []
      }

      // Send Email
      await mailer.sendMail(mailOptions)
    }

    return res.status(200).json({
      data: business,
      message: 'Business created successfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const {
    idBusiness
  } = req.params

  const {
    stage,
    businessSource,
    businessRating,
    businessIndustry,
    businessProduct,
    businessType,
    // typeId,
    brokerAccountName,
    depositeTakenDate,
    settlementDate,
    ctcSourceId
  } = req.body

  req.body.stageId = stage === '' ? undefined : stage
  req.body.sourceId = businessSource === '' ? undefined : businessSource
  req.body.ratingId = businessRating === '' ? undefined : businessRating
  req.body.industryId = businessIndustry === '' ? undefined : businessIndustry
  req.body.productId = businessProduct === '' ? undefined : businessProduct
  req.body.typeId = businessType === '' ? undefined : businessType
  // req.body.typeId = typeId === '' ? undefined : typeId
  req.body.depositeTakenDate = depositeTakenDate instanceof Date ? depositeTakenDate : undefined
  req.body.settlementDate = settlementDate instanceof Date ? settlementDate : undefined
  req.body.brokerAccountName = brokerAccountName === '' ? undefined : brokerAccountName
  req.body.modifiedBy_id = req.user.id
  req.body.ctcSourceId = ctcSourceId === '' ? 1 : ctcSourceId

  try {
    const business = await models.Business.findOne({
      where: {
        id: idBusiness
      }
    })

    if (!business.daysOnTheMarket && stage === 4) {
      req.body.daysOnTheMarket = moment()
    }

    if (business.stageId !== 4 && req.body.stageId === 4) {
      req.body.dateChangedToForSale = moment()
    }

    await models.Business.update(req.body, {
      where: {
        id: idBusiness
      }
    })

    return res.status(200).json({
      message: `Business BS${idBusiness} updated with success`
    })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const {
    id
  } = req.body
  try {
    await models.User.destroy({
      where: {
        id
      }
    })
    return res.status(200).json({
      message: 'User removed with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const updateListingAgent = async (req, res, next) => {
  const {
    listingAgentId,
    listingAgentCtcId,
    company
  } = req.body

  const {
    idBusiness
  } = req.params

  const data = {
    listingAgent_id: listingAgentId > 0 ? listingAgentId : null,
    listingAgentCtc_id: listingAgentCtcId > 0 ? listingAgentCtcId : null
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
    const business = await models.Business.findOne({
      where: {
        id: idBusiness
      }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify exists template
    const template = await models.EmailTemplate.findOne({
      where: {
        title: 'Agent reassign to business'
      }
    })

    if (!template) {
      throw new APIError({
        message: 'The email template not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify logged user
    const user = await models.User.findOne({
      where: {
        id: req.user.id
      }
    })

    let mailOptions = {}
    let mailOptionsCtc = {}

    // Verify exists listingAgent
    if (listingAgentId > 0 && company === 'Xcllusive') {
      const listingAgent = await models.User.findOne({
        where: {
          id: listingAgentId
        }
      })

      if (!listingAgent) {
        throw new APIError({
          message: 'Listing agent not found',
          status: 404,
          isPublic: true
        })
      }

      // set company to Xcllusive
      data.company_id = 1

      // Compile the template to use variables
      const templateCompiled = Handlebars.compile(template.body)
      const context = {
        agent_full_name: `${listingAgent.firstName} ${listingAgent.lastName}`,
        agent_first_name: listingAgent.firstName,
        business_name: business.businessName,
        user_name: user.firstName,
        business_id: business.id
      }

      // Set email options
      mailOptions = {
        to: listingAgent.email,
        from: '"Xcllusive" <businessinfo@xcllusive.com.au>',
        subject: template.subject,
        html: templateCompiled(context),
        attachments: template.enableAttachment ? [{
          filename: `${template.title.trim()}.pdf`,
          path: template.attachmentPath
        }] : []
      }
      // Send Email
      await mailer.sendMail(mailOptions)

      await models.BusinessLog.create({
        text: `Business Reassigned to ${listingAgent.firstName} ${listingAgent.lastName} by ${user.firstName} ${user.lastName}`,
        createdBy_id: req.user.id,
        followUpStatus: 'Done',
        followUp: moment().format('YYYY-MM-DD hh:mm:ss'),
        business_id: idBusiness
      })
    }

    // Verify exists listingAgent
    if (listingAgentCtcId > 0 && company === 'CTC') {
      const listingAgentCtc = await models.User.findOne({
        where: {
          id: listingAgentCtcId
        }
      })

      if (!listingAgentCtc) {
        throw new APIError({
          message: 'Listing agent not found',
          status: 404,
          isPublic: true
        })
      }
      // set company to CTC
      data.company_id = 2
      // set stage to new
      data.ctcStageId = 2

      /* save dateTime assign to agent to control first open by agent */
      data.dateTimeAssignToAgent = moment().format('YYYY-MM-DD hh:mm:ss')
      data.dateTimeFirstOpenByAgent = null

      // Compile the template to use variables
      const templateCompiled = Handlebars.compile(template.body)
      const context = {
        agent_full_name: `${listingAgentCtc.firstName} ${listingAgentCtc.lastName}`,
        agent_first_name: listingAgentCtc.firstName,
        business_name: business.businessName,
        user_name: user.firstName,
        business_id: business.id
      }

      // Set email options
      mailOptionsCtc = {
        to: listingAgentCtc.email,
        from: '"Xcllusive" <businessinfo@xcllusive.com.au>',
        subject: template.subject,
        html: templateCompiled(context),
        attachments: template.enableAttachment ? [{
          filename: `${template.title.trim()}.pdf`,
          path: template.attachmentPath
        }] : []
      }
      // Send Email
      await mailer.sendMail(mailOptionsCtc)

      await models.BusinessLog.create({
        text: `Business Reassigned to ${listingAgentCtc.firstName} ${listingAgentCtc.lastName} by ${user.firstName} ${user.lastName}`,
        createdBy_id: req.user.id,
        followUpStatus: 'Done',
        followUp: moment().format('YYYY-MM-DD hh:mm:ss'),
        business_id: idBusiness
      })
    }
  } catch (error) {
    return next(error)
  }

  try {
    await models.Business.update(data, {
      where: {
        id: idBusiness
      }
    })
    return res.status(200).json({
      message: 'Business reassigned successfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const updateStageLost = async (req, res, next) => {
  const {
    idBusiness
  } = req.params
  const updateBusiness = req.body

  updateBusiness.modifiedBy_id = req.user.id
  updateBusiness.stageId = 8
  updateBusiness.ratingId = updateBusiness.businessRating
  updateBusiness.lostDate = moment().toDate()
  updateBusiness.addLeadNurtureList = updateBusiness.addLeadNurtureList === 'Yes'
  updateBusiness.stageNotSignedId = !updateBusiness.recoveryStageNotSigned ? 1 : updateBusiness.recoveryStageNotSigned
  updateBusiness.stageNotWantId = !updateBusiness.recoveryStageNotWant ? 1 : updateBusiness.recoveryStageNotWant
  if (updateBusiness.email !== '') updateBusiness.vendorEmail = updateBusiness.email

  try {
    // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: idBusiness
      }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }
    await models.Business.update(updateBusiness, {
      where: {
        id: idBusiness
      }
    })

    if (updateBusiness.pendingDone) {
      await models.BusinessLog.update({
        followUpStatus: 'Done'
      }, {
        where: {
          business_id: idBusiness
        }
      })
    }

    if (updateBusiness.followUpLog) {
      await models.BusinessLog.create({
        text: `${updateBusiness.text}

Lost Notes: ${updateBusiness.afterSalesNotes}

Did you meet with this vendor? ${updateBusiness.saleNotesLostMeeting === true ? 'Yes' : 'No'}

Did we want this business? ${updateBusiness.saleNotesLostWant === true ? 'Yes' : 'No'}

`,
        createdBy_id: req.user.id,
        followUpStatus: 'Pending',
        followUp: moment(updateBusiness.date).format('YYYY-MM-DD hh:mm:ss'),
        business_id: idBusiness
      })
    }

    if (updateBusiness.addLeadNurtureList) {
      const systemSettings = await models.SystemSettings.findOne({
        where: {
          id: 1
        }
      })
      const analyst = await models.User.findOne({
        where: {
          id: business.listingAgent_id
        }
      })
      const emailMarketing = systemSettings.emailMarketing
      const mailOptions = {
        to: emailMarketing,
        from: '"Xcllusive" <businessinfo@xcllusive.com.au>',
        subject: 'Lead Nurture',
        html: `Please add to Lead Nurture List:
        </br></br>
        <b>Business Number:</b> ${business.id}
        </br>
        <b>Business Name:</b> ${business.businessName}
        </br>
        <b>Owner:</b> ${business.firstNameV} ${business.lastNameV}
        </br>
        <b>Email:</b> ${business.vendorEmail || updateBusiness.vendorEmail}
        </br>
        <b>Analyst:</b> ${analyst.firstName} ${analyst.lastName}
        `
      }

      // Send Email
      await mailer.sendMail(mailOptions)
    }

    return res.status(200).json({
      message: `Business BS${idBusiness} updated with success`
    })
  } catch (error) {
    return next(error)
  }
}

export const enquiryBusiness = async (req, res, next) => {
  const {
    buyerId,
    businessId
  } = req.body

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({
      where: {
        id: buyerId
      }
    })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: businessId
      }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify business attach to buyer
    let enquiryBusinessBuyer = await models.EnquiryBusinessBuyer.findOne({
      where: {
        $and: {
          business_id: businessId,
          buyer_id: buyerId
        }
      }
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
      followUp: moment().format('YYYY-DD-MM hh:mm:ss'),
      business_id: businessId,
      buyer_id: buyerId,
      createdBy_id: req.user.id,
      modifiedBy_id: req.user.id
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
  const {
    buyerId,
    businessId
  } = req.body

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({
      where: {
        id: buyerId
      }
    })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: businessId
      }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify exists template
    const template = await models.EmailTemplate.findOne({
      where: {
        title: 'Send Email to Buyer'
      }
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
      subject: `${template.subject}`,
      html: templateCompiled(context),
      attachments: template.enableAttachment ? [{
        filename: `${template.title.trim()}.pdf`,
        path: template.attachmentPath
      }] : []
    }

    // Send Email
    const responseMailer = await mailer.sendMail(mailOptions)

    // Insert in log
    await models.BuyerLog.create({
      text: `Email to Buyer ${buyer.id} Sent (Under Offer)`,
      followUpStatus: 'Done',
      followUp: moment().format('YYYY-MM-DD hh:mm:ss'),
      business_id: businessId,
      buyer_id: buyerId,
      createdBy_id: req.user.id,
      modifiedBy_id: req.user.id
    })

    return res.status(201).json({
      data: {
        mail: responseMailer
      },
      message: `Send email successfully to ${buyer.firstName} <${buyer.email}>`
    })
  } catch (error) {
    return next(error)
  }
}

export const sendEnquiryOwner = async (req, res, next) => {
  const {
    buyerId,
    businessId
  } = req.body

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({
      where: {
        id: buyerId
      }
    })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: businessId
      }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify exists template
    const template = await models.EmailTemplate.findOne({
      where: {
        title: 'Send Enquiry to Owner'
      }
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
      attachments: template.enableAttachment ? [{
        filename: `${template.title.trim()}.pdf`,
        path: template.attachmentPath
      }] : []
    }

    // Send Email
    const responseMailer = await mailer.sendMail(mailOptions)

    // Insert in log
    await models.BuyerLog.create({
      text: 'Enquiry to Owner Sent',
      followUpStatus: 'Done',
      followUp: moment().format('YYYY-MM-DD hh:mm:ss'),
      business_id: businessId,
      buyer_id: buyerId,
      createdBy_id: req.user.id,
      modifiedBy_id: req.user.id
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
  const {
    idBusiness
  } = req.params
  const {
    showAll
  } = req.query

  try {
    // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: idBusiness
      }
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
      where: {
        business_id: idBusiness
      },
      include: [{
        model: models.Buyer,
        as: 'Buyer'
      }]
    })

    const array = []
    const verifyContentBuyerLog = await buyersFromBusiness.map(async enquiry => {
      const where = {
        buyer_id: enquiry.buyer_id,
        business_id: idBusiness,
        followUp: {
          $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
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
          order: [
            ['dateTimeCreated', 'DESC']
          ],
          raw: true
        })
        array.push({
          lastLog,
          enquiry
        })
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
  const {
    idBusiness
  } = req.params

  // const response = []

  try {
    // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: idBusiness
      }
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
      where: {
        business_id: idBusiness
      },
      include: [{
        model: models.Buyer,
        as: 'Buyer'
      }]
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
  const {
    to,
    subject,
    body
  } = req.body
  const fileAttachment = req.files.attachment
  const sentTo = []

  try {
    const emailToOffice = await models.SystemSettings.findOne({
      where: 1
    })
    for (let buyer of JSON.parse(to)) {
      const mailOptions = {
        to: buyer.email,
        from: '"Xcllusive Business Sales" <businessinfo@xcllusive.com.au>',
        subject,
        replyTo: buyer.replyTo ? req.user.email : `${req.user.email}, ${emailToOffice.emailOffice}`,
        html: `
        <p>Dear ${buyer.firstName} ${buyer.lastName}</p>
        
        </br>
        <p>${body}</p>
        </br>

        <p>Xcllusive Business Sales</p>
        <p>www.xcllusive.com.au | (02) 9817 3331</p>
        `,
        attachments: fileAttachment ? [{
          filename: fileAttachment.name,
          content: fileAttachment.data
        }] : []
      }
      const resMailer = await mailer.sendMail(mailOptions)
      if (resMailer) sentTo.push(resMailer.envelope.to[0])
    }

    return res.status(201).json({
      data: sentTo,
      message: 'Group emails sent successfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const getStageSold = async (req, res, next) => {
  const {
    idBusiness
  } = req.params

  try {
    const sold = await models.BusinessSold.findOne({
      where: {
        business_id: idBusiness
      }
    })

    return res.status(201).json({
      data: sold,
      message: 'Get sold successfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const createStageSold = async (req, res, next) => {
  const {
    idBusiness
  } = req.params
  const newSold = req.body

  newSold.business_id = idBusiness
  newSold.createddBy_id = req.user.id
  newSold.modifiedBy_id = req.user.id

  try {
    await models.Business.update({
      typeId: newSold.businessType,
      businessType: newSold.businessType,
      industry: newSold.industry
    }, {
      where: {
        id: idBusiness
      }
    })

    const sold = await models.BusinessSold.create(newSold)

    return res.status(201).json({
      data: sold,
      message: 'Create with successfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const updateStageSold = async (req, res, next) => {
  const {
    idBusiness
  } = req.params
  const updatedSold = req.body

  updatedSold.business_id = idBusiness
  updatedSold.modifiedBy_id = req.user.id

  try {
    await models.Business.update({
      typeId: updatedSold.businessType,
      businessType: updatedSold.businessType,
      industry: updatedSold.industry
    }, {
      where: {
        id: idBusiness
      }
    })

    await models.BusinessSold.update(updatedSold, {
      where: {
        id: updatedSold.id
      }
    })

    return res.status(201).json({
      data: null,
      message: 'Update with successfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const finaliseStageSold = async (req, res, next) => {
  const {
    idBusiness,
    idSold
  } = req.params

  try {
    await models.BusinessSold.update({
      sold: true,
      modifiedBy_id: req.user.id
    }, {
      where: {
        id: idSold
      }
    })
    await models.Business.update({
      stageId: 6,
      modifiedBy_id: req.user.id
    }, {
      where: {
        id: idBusiness
      }
    })
    await models.BusinessLog.update({
      followUpStatus: 'Done'
    }, {
      where: {
        business_id: idBusiness
      }
    })
    return res.status(201).json({
      data: null,
      message: 'Stage change to Sold'
    })
  } catch (error) {
    return next(error)
  }
}

export const getQtdeBusinessStageUser = async (req, res, next) => {
  let whereOptionsPotentialListing = {}
  let whereOptionsAppraisal = {}
  let whereOptionsForSale = {}
  let whereOptionsLost = {}

  if (req.user.listingAgentCtc) {
    whereOptionsPotentialListing = {
      listingAgentCtc_id: {
        $eq: req.user.id
      },
      stageId: 1
    }
    whereOptionsAppraisal = {
      listingAgentCtc_id: {
        $eq: req.user.id
      },
      stageId: 9
    }
    whereOptionsForSale = {
      listingAgentCtc_id: {
        $eq: req.user.id
      },
      stageId: 4
    }
    whereOptionsLost = {
      listingAgentCtc_id: {
        $eq: req.user.id
      },
      stageId: 8
    }
  } else {
    whereOptionsPotentialListing = {
      listingAgent_id: {
        $eq: req.user.id
      },
      $or: [{
        listingAgentCtc_id: req.user.id
      }, {
        listingAgentCtc_id: null
      }],
      stageId: 1
    }
    whereOptionsAppraisal = {
      listingAgent_id: {
        $eq: req.user.id
      },
      $or: [{
        listingAgentCtc_id: req.user.id
      }, {
        listingAgentCtc_id: null
      }],
      stageId: 9
    }
    whereOptionsForSale = {
      listingAgent_id: {
        $eq: req.user.id
      },
      $or: [{
        listingAgentCtc_id: req.user.id
      }, {
        listingAgentCtc_id: null
      }],
      stageId: 4
    }
    whereOptionsLost = {
      listingAgent_id: {
        $eq: req.user.id
      },
      $or: [{
        listingAgentCtc_id: req.user.id
      }, {
        listingAgentCtc_id: null
      }],
      stageId: 8
    }
  }

  try {
    const businessPotentialListingFilter = await models.Business.count({
      where: whereOptionsPotentialListing,
      include: {
        model: models.BusinessLog,
        as: 'BusinessLog',
        where: {
          business_id: {
            $col: 'Business.id'
          },
          followUpStatus: 'Pending',
          followUp: {
            $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
          }
        }
      }
    })
    const businessAppraisalFilter = await models.Business.count({
      where: whereOptionsAppraisal,
      include: {
        model: models.BusinessLog,
        as: 'BusinessLog',
        where: {
          business_id: {
            $col: 'Business.id'
          },
          followUpStatus: 'Pending',
          followUp: {
            $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
          }
        }
      }
    })

    const businessPotentialListing = await models.Business.count({
      where: whereOptionsPotentialListing,
      distinct: 'id',
      include: {
        model: models.BusinessLog,
        as: 'BusinessLog',
        where: {
          business_id: {
            $col: 'Business.id'
          }
        }
      }
    })
    const businessAppraisal = await models.Business.count({
      where: whereOptionsAppraisal,
      distinct: 'id',
      include: {
        model: models.BusinessLog,
        as: 'BusinessLog',
        where: {
          business_id: {
            $col: 'Business.id'
          }
        }
      }
    })

    const businessForSale = await models.Business.count({
      where: whereOptionsForSale
    })

    const businessLost = await models.Business.count({
      where: whereOptionsLost
    })

    return res.status(201).json({
      data: {
        businessPotentialListingFilter,
        businessPotentialListing,
        businessAppraisalFilter,
        businessAppraisal,
        businessForSale,
        businessLost
      }
    })
  } catch (error) {
    return next(error)
  }
}

export const getCtcQtdeBusinessStageUser = async (req, res, next) => {
  const whereOptionsNew = {
    listingAgentCtc_id: {
      $eq: req.user.id
    },
    ctcStageId: 2
  }
  const whereOptionsCold = {
    listingAgentCtc_id: {
      $eq: req.user.id
    },
    ctcStageId: 3
  }
  const whereOptionsPotential = {
    listingAgentCtc_id: {
      $eq: req.user.id
    },
    ctcStageId: 4
  }
  const whereOptionsHot = {
    listingAgentCtc_id: {
      $eq: req.user.id
    },
    ctcStageId: 5
  }
  const whereOptionsEngaged = {
    listingAgentCtc_id: {
      $eq: req.user.id
    },
    ctcStageId: 6
  }
  const whereOptionsLost = {
    listingAgentCtc_id: {
      $eq: req.user.id
    },
    ctcStageId: 7
  }

  const whereOptionsReferredToXcllusive = {
    listingAgentCtc_id: {
      $eq: req.user.id
    },
    ctcStageId: 8
  }

  try {
    const businessNewFilter = await models.Business.count({
      where: whereOptionsNew,
      include: {
        model: models.BusinessLog,
        as: 'BusinessLog',
        where: {
          business_id: {
            $col: 'Business.id'
          },
          followUpStatus: 'Pending',
          followUp: {
            $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
          }
        }
      }
    })
    const businessColdFilter = await models.Business.count({
      where: whereOptionsCold,
      include: {
        model: models.BusinessLog,
        as: 'BusinessLog',
        where: {
          business_id: {
            $col: 'Business.id'
          },
          followUpStatus: 'Pending',
          followUp: {
            $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
          }
        }
      }
    })

    const businessNew = await models.Business.count({
      where: whereOptionsNew,
      distinct: 'id',
      include: {
        model: models.BusinessLog,
        as: 'BusinessLog',
        where: {
          business_id: {
            $col: 'Business.id'
          }
        }
      }
    })
    const businessCold = await models.Business.count({
      where: whereOptionsCold,
      distinct: 'id',
      include: {
        model: models.BusinessLog,
        as: 'BusinessLog',
        where: {
          business_id: {
            $col: 'Business.id'
          }
        }
      }
    })

    const businessPotential = await models.Business.count({
      where: whereOptionsPotential
    })

    const businessHot = await models.Business.count({
      where: whereOptionsHot
    })

    const businessEngaged = await models.Business.count({
      where: whereOptionsEngaged
    })

    const businessLost = await models.Business.count({
      where: whereOptionsLost
    })

    const businessReferredToXcllusive = await models.Business.count({
      where: whereOptionsReferredToXcllusive
    })

    return res.status(201).json({
      data: {
        businessNewFilter,
        businessNew,
        businessColdFilter,
        businessCold,
        businessPotential,
        businessHot,
        businessEngaged,
        businessLost,
        businessReferredToXcllusive
      }
    })
  } catch (error) {
    return next(error)
  }
}

export const getAllPerUser = async (req, res, next) => {
  let search = req.query.search
  const stageId = req.query.stageId
  let filterLog = req.query.filterLog
  const orderByDateTimeCreated = req.query.orderByDateTimeCreated
  // let whereOptions = {
  //   where: {
  //     listingAgent_id: {
  //       $eq: req.user.id
  //     }
  //   }
  // }

  let whereOptions = {}
  let whereStageLost = {}
  if (req.user.listingAgentCtc) {
    whereStageLost = {
      stageId: 8,
      listingAgentCtc_id: req.user.id
    }
    whereOptions = {
      where: {
        listingAgentCtc_id: {
          $eq: req.user.id
        }
      }
    }
  } else {
    whereStageLost = {
      stageId: 8,
      listingAgent_id: req.user.id,
      company_id: 1
    }
    whereOptions = {
      where: {
        listingAgent_id: {
          $eq: req.user.id
        },
        company_id: 1
        // $or: [{
        //   listingAgentCtc_id: req.user.id
        // }, {
        //   listingAgentCtc_id: null
        // }]
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
      // if (parseInt(search)) {
      //   whereOptions.where.listedPrice = {
      //     $lte: search * 1.1,
      //     $gte: search * 0.9
      //   }
      // } else {
      if (req.user.listingAgentCtc) {
        whereOptions.where.$or = []
      }
      whereOptions.where.$and = []
      whereOptions.where.$and.push({
        $or: {
          businessName: {
            $like: `%${search}%`
          },
          firstNameV: {
            $like: `%${search}%`
          },
          lastNameV: {
            $like: `%${search}%`
          },
          suburb: {
            $like: `%${search}%`
          },
          searchNote: {
            $like: `%${search}%`
          },
          vendorPhone1: {
            $like: `%${search}%`
          },
          vendorPhone2: {
            $like: `%${search}%`
          },
          vendorPhone3: {
            $like: `%${search}%`
          }
        }
      })
      // }
    }
  }

  if (stageId && stageId.length > 0) {
    if (parseInt(stageId)) {
      whereOptions.where.stageId = {
        $eq: `${parseInt(stageId)}`
      }
    }
  }

  try {
    let totalLostRecontact = 0
    if (filterLog && JSON.parse(filterLog)) {
      const response = await models.Business.findAll(
        Object.assign(whereOptions, {
          attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'stageId', 'dateTimeCreated'],
          include: {
            model: models.BusinessLog,
            as: 'BusinessLog',
            where: {
              business_id: {
                $col: 'Business.id'
              },
              followUpStatus: 'Pending',
              followUp: {
                $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
              }
            }
          },
          order: [
            [{
              model: models.BusinessLog,
              as: 'BusinessLog'
            }, 'followUp', 'DESC']
          ]
        })
      )
      const businessesLost = await models.Business.findAll(
        Object.assign(whereOptions, {
          attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'stageId', 'dateTimeCreated'],
          where: whereStageLost,
          include: {
            model: models.BusinessLog,
            as: 'BusinessLog',
            where: {
              business_id: {
                $col: 'Business.id'
              },
              followUpStatus: 'Pending',
              followUp: {
                $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
              }
            }
          },
          order: [
            [{
              model: models.BusinessLog,
              as: 'BusinessLog'
            }, 'followUp', 'DESC']
          ]
        })
      )
      totalLostRecontact = businessesLost.length
      if (search === undefined) {
        if (parseInt(stageId) === 1) {
          businessesLost.forEach(item => {
            response.push(item)
          })
          if (orderByDateTimeCreated) {
            response.sort(function (a, b) {
              return new Date(b.dateTimeCreated) - new Date(a.dateTimeCreated)
            })
          } else {
            response.sort(function (a, b) {
              return new Date(b.BusinessLog[0].followUp) - new Date(a.BusinessLog[0].followUp)
            })
          }
        } else {
          if (orderByDateTimeCreated) {
            response.sort(function (a, b) {
              return new Date(b.dateTimeCreated) - new Date(a.dateTimeCreated)
            })
          }
        }
      }

      return res.status(200).json({
        data: {
          rows: response,
          totalLostRecontact
        },
        message: 'Get businesses succesfully.'
      })
    }

    const response = await models.Business.findAll(
      Object.assign(whereOptions, {
        attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'stageId', 'dateTimeCreated'],
        include: {
          model: models.BusinessLog,
          as: 'BusinessLog',
          where: {
            business_id: {
              $col: 'Business.id'
            }
          }
        },
        order: [
          [{
            model: models.BusinessLog,
            as: 'BusinessLog'
          }, 'followUp', 'DESC']
        ]
      })
    )
    const businessesLost = await models.Business.findAll(
      Object.assign(whereOptions, {
        attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'stageId', 'dateTimeCreated'],
        where: whereStageLost,
        include: {
          model: models.BusinessLog,
          as: 'BusinessLog',
          where: {
            business_id: {
              $col: 'Business.id'
            },
            followUpStatus: 'Pending',
            followUp: {
              $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
            }
          }
        },
        order: [
          [{
            model: models.BusinessLog,
            as: 'BusinessLog'
          }, 'followUp', 'DESC']
        ]
      })
    )
    totalLostRecontact = businessesLost.length
    if (parseInt(stageId) === 1) {
      businessesLost.forEach(item => {
        response.push(item)
      })
      if (orderByDateTimeCreated) {
        response.sort(function (a, b) {
          return new Date(b.dateTimeCreated) - new Date(a.dateTimeCreated)
        })
      } else {
        response.sort(function (a, b) {
          return new Date(b.BusinessLog[0].followUp) - new Date(a.BusinessLog[0].followUp)
        })
      }
    } else {
      if (orderByDateTimeCreated) {
        response.sort(function (a, b) {
          return new Date(b.dateTimeCreated) - new Date(a.dateTimeCreated)
        })
      }
    }

    return res.status(200).json({
      data: {
        rows: response,
        totalLostRecontact
      },
      message: 'Get businesses succesfuly.'
    })
  } catch (err) {
    return next(err)
  }
}

export const getCtcAllPerUser = async (req, res, next) => {
  let search = req.query.search
  const stageId = req.query.stageId
  let filterLog = req.query.filterLog
  const orderByDateTimeCreated = req.query.orderByDateTimeCreated
  // let whereOptions = {
  //   where: {
  //     listingAgent_id: {
  //       $eq: req.user.id
  //     }
  //   }
  // }
  const whereStageLost = {
    stageId: 7,
    listingAgentCtc_id: req.user.id
  }
  const whereOptions = {
    where: {
      listingAgentCtc_id: {
        $eq: req.user.id
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
      // if (parseInt(search)) {
      //   whereOptions.where.listedPrice = {
      //     $lte: search * 1.1,
      //     $gte: search * 0.9
      //   }
      // } else {
      whereOptions.where.$and = []
      whereOptions.where.$and.push({
        $or: {
          businessName: {
            $like: `%${search}%`
          },
          firstNameV: {
            $like: `%${search}%`
          },
          lastNameV: {
            $like: `%${search}%`
          },
          suburb: {
            $like: `%${search}%`
          },
          searchNote: {
            $like: `%${search}%`
          },
          vendorPhone1: {
            $like: `%${search}%`
          },
          vendorPhone2: {
            $like: `%${search}%`
          },
          vendorPhone3: {
            $like: `%${search}%`
          }
        }
      })
      // }
    }
  }

  if (stageId && stageId.length > 0) {
    if (parseInt(stageId)) {
      whereOptions.where.ctcStageId = {
        $eq: `${parseInt(stageId)}`
      }
    }
  }

  try {
    if (filterLog && JSON.parse(filterLog)) {
      const response = await models.Business.findAll(
        Object.assign(whereOptions, {
          attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'stageId', 'dateTimeCreated'],
          include: {
            model: models.BusinessLog,
            as: 'BusinessLog',
            where: {
              business_id: {
                $col: 'Business.id'
              },
              followUpStatus: 'Pending',
              followUp: {
                $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
              }
            }
          },
          order: [
            [{
              model: models.BusinessLog,
              as: 'BusinessLog'
            }, 'time', 'desc'], [{
              model: models.BusinessLog,
              as: 'BusinessLog'
            }, 'followUp', 'DESC']
          ]
        })
      )
      const businessesLost = await models.Business.findAll(
        Object.assign(whereOptions, {
          attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'stageId', 'dateTimeCreated'],
          where: whereStageLost,
          include: {
            model: models.BusinessLog,
            as: 'BusinessLog',
            where: {
              business_id: {
                $col: 'Business.id'
              },
              followUpStatus: 'Pending',
              followUp: {
                $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
              }
            }
          },
          order: [
            [{
              model: models.BusinessLog,
              as: 'BusinessLog'
            }, 'followUp', 'DESC']
          ]
        })
      )

      if (parseInt(stageId) === 1) {
        businessesLost.forEach(item => {
          response.push(item)
        })
        if (orderByDateTimeCreated) {
          response.sort(function (a, b) {
            return new Date(b.dateTimeCreated) - new Date(a.dateTimeCreated)
          })
        } else {
          response.sort(function (a, b) {
            return new Date(b.BusinessLog[0].followUp) - new Date(a.BusinessLog[0].followUp)
          })
        }
      } else {
        if (orderByDateTimeCreated) {
          response.sort(function (a, b) {
            return new Date(b.dateTimeCreated) - new Date(a.dateTimeCreated)
          })
        }
      }

      return res.status(200).json({
        data: {
          rows: response
        },
        message: 'Get businesses succesfully.'
      })
    }

    const response = await models.Business.findAll(
      Object.assign(whereOptions, {
        attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'stageId', 'dateTimeCreated'],
        include: {
          model: models.BusinessLog,
          as: 'BusinessLog',
          where: {
            business_id: {
              $col: 'Business.id'
            }
          }
        },
        order: [
          [{
            model: models.BusinessLog,
            as: 'BusinessLog'
          }, 'followUp', 'DESC']
        ]
      })
    )
    const businessesLost = await models.Business.findAll(
      Object.assign(whereOptions, {
        attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'stageId', 'dateTimeCreated'],
        where: whereStageLost,
        include: {
          model: models.BusinessLog,
          as: 'BusinessLog',
          where: {
            business_id: {
              $col: 'Business.id'
            },
            followUpStatus: 'Pending',
            followUp: {
              $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
            }
          }
        },
        order: [
          [{
            model: models.BusinessLog,
            as: 'BusinessLog'
          }, 'followUp', 'DESC']
        ]
      })
    )

    if (parseInt(stageId) === 1) {
      businessesLost.forEach(item => {
        response.push(item)
      })
      if (orderByDateTimeCreated) {
        response.sort(function (a, b) {
          return new Date(b.dateTimeCreated) - new Date(a.dateTimeCreated)
        })
      } else {
        response.sort(function (a, b) {
          return new Date(b.BusinessLog[0].followUp) - new Date(a.BusinessLog[0].followUp)
        })
      }
    } else {
      if (orderByDateTimeCreated) {
        response.sort(function (a, b) {
          return new Date(b.dateTimeCreated) - new Date(a.dateTimeCreated)
        })
      }
    }

    return res.status(200).json({
      data: {
        rows: response
      },
      message: 'Get businesses succesfuly.'
    })
  } catch (err) {
    return next(err)
  }
}

export const updateStageMemo = async (req, res, next) => {
  const {
    idBusiness
  } = req.params
  const updateMemo = req.body

  updateMemo.modifiedBy_id = req.user.id
  updateMemo.stageId = 3

  try {
    // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: idBusiness
      }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    updateMemo.dateChangedToSalesMemorandum = moment().toDate()
    updateMemo.currentPrice = updateMemo.listedPrice
    updateMemo.industry = updateMemo.industry
    updateMemo.commissionPerc = parseFloat(updateMemo.commissionPerc)
    updateMemo.productId = updateMemo.businessProduct

    await models.Business.update(updateMemo, {
      where: {
        id: idBusiness
      }
    })

    if (updateMemo.pendingDone) {
      await models.BusinessLog.update({
        followUpStatus: 'Done'
      }, {
        where: {
          business_id: idBusiness
        }
      })
    }

    return res.status(200).json({
      data: business,
      message: `Business BS${idBusiness} changed to sales memo`
    })
  } catch (error) {
    return next(error)
  }
}

export const uploadIM = async (req, res, next) => {
  const {
    businessId
  } = req.body
  const file = req.files.imFile

  try {
    // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: businessId
      }
    })

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

    // Upload file to aws s3
    const upload = await uploadToS3('xcllusive-im', file, `${business.businessName}_IM_${business.id}.pdf`)

    // updated IM uploaded on business
    await models.Business.update({
      imUploaded: true,
      imUrl: upload.Location
    }, {
      where: {
        id: businessId
      }
    })
    return res.status(200).json({
      message: `IM on business BS${business.id} uploaded successfully`
    })
  } catch (error) {
    return next(error)
  }
}

export const verifyDuplicatedBusiness = async (req, res, next) => {
  const {
    vendorPhone1,
    vendorEmail
  } = req.query

  const telephoneRaw = vendorPhone1
    .split(' ')
    .join('')
    .split('-')
    .join('')

  try {
    const businesses = await models.Business.findAll({
      raw: true,
      attributes: ['id', 'firstNameV', 'lastNameV', 'businessName', 'vendorPhone1', 'vendorEmail']
      // where: {
      //   $or: [{
      //     vendorPhone1: {
      //       $like: `%${telephoneRaw}%`
      //     }
      //   }, {
      //     vendorEmail: {
      //       $like: `%${vendorEmail}%`
      //     }
      //   }]
      // }
    })
    let duplicatedBusiness = null
    businesses.forEach(item => {
      if (
        (item.vendorPhone1 &&
          item.vendorPhone1
            .split(' ')
            .join('')
            .split('-')
            .join('') === telephoneRaw) ||
        (item.vendorEmail && item.vendorEmail === vendorEmail)
      ) {
        duplicatedBusiness = item
      }
    })
    return res.status(201).json({
      data: duplicatedBusiness,
      message: ''
    })
  } catch (error) {
    return next(error)
  }
}

export const sendEmailToCtcBusiness = async (req, res, next) => {
  const {
    values,
    buyer,
    business
  } = req.body

  try {
    const businessObj = await models.Business.findOne({
      where: {
        id: business.id
      }
    })

    // Compile the template to use variables
    const templateCompiled = Handlebars.compile(values.body)
    const context = {
      owner_full_name: `${businessObj.firstNameV} ${businessObj.lastNameV}`,
      buyer_name: `${buyer.firstName} ${buyer.surname}`,
      buyer_phone: buyer.telephone1,
      buyer_email: buyer.email
    }

    // Set email options
    const mailOptions = {
      to: values.to,
      from: '"Xcllusive" <businessinfo@xcllusive.com.au>',
      replyTo: 'enquiries@ctoc.com.au',
      subject: values.subject,
      html: templateCompiled(context)
    }

    // Send Email
    const responseMailer = await mailer.sendMail(mailOptions)

    // update buyer to CTC Buyer
    const modifyBuyer = {
      ctcBuyer: true
    }
    await models.Buyer.update(modifyBuyer, {
      where: {
        id: buyer.id
      }
    })

    // Verify business attach to buyer
    const enquiryBusinessBuyer = await models.EnquiryBusinessBuyer.findOne({
      where: {
        $and: {
          business_id: businessObj.id,
          buyer_id: buyer.id
        }
      }
    })

    if (!enquiryBusinessBuyer) {
      // Set on Enquiry table
      await models.EnquiryBusinessBuyer.create({
        buyer_id: buyer.id,
        business_id: businessObj.id
      })
    }

    // Insert in log
    await models.BuyerLog.create({
      text: 'Enquiry Email to CTC Business Sent',
      followUpStatus: 'Done',
      followUp: moment().format('YYYY-MM-DD hh:mm:ss'),
      business_id: businessObj.id,
      buyer_id: buyer.id,
      createdBy_id: req.user.id,
      modifiedBy_id: req.user.id
    })

    return res.status(201).json({
      data: responseMailer,
      message: 'Email to CTC Business Sent'
    })
  } catch (error) {
    return next(error)
  }
}

export const sendSms = async (req, res, next) => {
  const {
    buyer,
    business,
    phone
    // message
  } = req.body

  try {
    const businessObj = await models.Business.findOne({
      where: {
        id: business.id
      }
    })

    // send SMS via aws SNS
    // cayo
    const template = await models.EmailTemplate.findOne({
      where: {
        title: 'Enquiry SMS CTC'
      }
    })

    const templateCompiled = Handlebars.compile(template.body)
    const context = {
      buyer_name: `${buyer.firstName} ${buyer.surname}`,
      buyer_phone: buyer.telephone1,
      buyer_email: buyer.email
    }
    let message = templateCompiled(context)
    message = message.replace(/<p><br>/gi, '\n')
    message = message.replace(/<p>/gi, '\n')
    message = message.replace(/<\/p>/gi, '')

    const sentSms = await SNS(phone, message)

    if (sentSms) {
      // Verify business attach to buyer
      const enquiryBusinessBuyer = await models.EnquiryBusinessBuyer.findOne({
        where: {
          $and: {
            business_id: businessObj.id,
            buyer_id: buyer.id
          }
        }
      })

      if (!enquiryBusinessBuyer) {
        // Set on Enquiry table
        await models.EnquiryBusinessBuyer.create({
          buyer_id: buyer.id,
          business_id: businessObj.id
        })
      }
      // Insert in log
      await models.BuyerLog.create({
        text: 'Enquiry SMS to CTC Business Sent',
        followUpStatus: 'Done',
        followUp: moment().format('YYYY-MM-DD hh:mm:ss'),
        business_id: businessObj.id,
        buyer_id: buyer.id,
        createdBy_id: req.user.id,
        modifiedBy_id: req.user.id
      })
    } else {
      throw new APIError({
        message: 'Error sending sms',
        status: 400,
        isPublic: true
      })
    }

    return res.status(201).json({
      data: sentSms,
      message: 'Sms Sent to Onwer'
    })
  } catch (error) {
    return next(error)
  }
}

export const verifyBusinessFirstOpenByAgent = async (req, res, next) => {
  const {
    idBusiness
  } = req.params

  try {
    const business = await models.Business.findOne({
      where: {
        id: idBusiness
      }
    })
    let message = ''
    if ((business.listingAgent_id === req.user.id && !business.dateTimeFirstOpenByAgent) || (business.listingAgentCtc_id === req.user.id && !business.dateTimeFirstOpenByAgent)) {
      const updateBusiness = {
        dateTimeFirstOpenByAgent: moment().format('YYYY-MM-DD hh:mm:ss')
      }
      await models.Business.update(updateBusiness, {
        where: {
          id: idBusiness
        }
      })
      message = `Listing Agent has open Business ${idBusiness} for the first time`
    } else {
      message = 'User Logged is not the Listing Agent'
    }

    return res.status(200).json({
      message: message
    })
  } catch (error) {
    return next(error)
  }
}

export const getAllEnquiries = async (req, res, next) => {
  const businessId = req.query.businessId

  try {
    const enquiries = await models.EnquiryBusinessBuyer.findAndCountAll({
      attributes: ['id', 'dateTimeCreated'],
      where: {
        business_id: businessId
      },
      include: [{
        attributes: ['id', 'firstName', 'surname', 'email', 'telephone1', 'caReceived', 'smSent'],
        model: models.Buyer,
        as: 'Buyer'
      }],
      order: [
        ['dateTimeCreated', 'desc']
      ]
    })
    if (!enquiries) {
      throw new APIError({
        message: 'Business does not have enquiry',
        status: 404,
        isPublic: true
      })
    }

    return res.status(200).json({
      data: enquiries.rows,
      totalEnquiries: enquiries.count,
      message: 'Get enquiries succesfully.'
    })
  } catch (err) {
    return next(err)
  }
}

export const addIssueToBusiness = async (req, res, next) => {
  const {
    issueId,
    business
  } = req.body

  try {
    const arrayIssues = []
    if (business.listIssues_id) {
      const array = JSON.parse(business.listIssues_id)
      array.map(item => {
        arrayIssues.push(item)
      })
    }
    arrayIssues.push(issueId.toString())
    await models.Business.update({
      listIssues_id: JSON.stringify(arrayIssues)
    }, {
      where: {
        id: business.id
      }
    })
    return res.status(200).json({
      message: 'Issue has been added to the business'
    })
  } catch (err) {
    return next(err)
  }
}

export const removeIssueFromBusiness = async (req, res, next) => {
  const {
    issueId,
    businessId
  } = req.body

  try {
    const business = await models.Business.findOne({
      raw: true,
      where: {
        id: businessId
      }
    })

    const newList = _.filter(JSON.parse(business.listIssues_id), item => {
      return parseInt(item) !== parseInt(issueId)
    })

    await models.Business.update({
      listIssues_id: JSON.stringify(newList)
    }, {
      where: {
        id: businessId
      }
    })

    return res.status(200).json({
      message: 'Issue has been removed from the business'
    })
  } catch (err) {
    return next(err)
  }
}
