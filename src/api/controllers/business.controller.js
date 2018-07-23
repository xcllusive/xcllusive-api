import Handlebars from 'handlebars'
import moment from 'moment'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'
import mailer from '../modules/mailer'

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
        { model: models.User, as: 'ModifiedBy' }
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
    business.lastScore = await models.Score.findOne({
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
    business.countAllEnquiry = countAllEnquiry.count

    const response = {
      business,
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
      console.log(arrayBusinesses)
      response.data = arrayBusinesses.filter(item => {
        return item !== undefined
      })
    } else {
      response.data = businesses
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
    createdBy_id: req.user.id
  }

  try {
    const user = await models.User.findOne({
      where: { id: req.user.id },
      attributes: ['firstName', 'lastName']
    })
    newBusiness.listingAgent = `${user.firstName} ${user.lastName}`
    const business = await models.Business.create(newBusiness)
    await models.BusinessLog.create({
      text: 'New  Business',
      createdBy_id: req.user.id,
      status: 'Pending',
      followUp: moment(),
      business_id: business.get('id')
    })

    return res.status(200).json({ message: 'Business created with success' })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { idBusiness } = req.params

  const {
    businessName,
    firstNameV,
    lastNameV,
    vendorPhone1,
    vendorPhone2,
    vendorPhone3,
    vendorEmail,
    sourceNotes,
    description,
    businessNameSecondary,
    businessABN,
    businessURL,
    address1,
    suburb,
    state,
    postCode,
    data120DayGuarantee,
    notifyOwner,
    stage,
    businessSource,
    businessRating,
    businessIndustry,
    businessProduct,
    businessType,
    listingAgent,
    brokerAccountName,
    listedPrice,
    currentPrice,
    engagementFee,
    commissionPerc,
    minimumCharge,
    appraisalHigh,
    appraisalLow,
    depositeTaken,
    depositeTakenDate,
    commissionSold,
    settlementDate,
    soldPrice,
    attachedPurchaser,
    searchNote,
    afterSalesNotes
  } = req.body

  const businessUpdated = {
    businessName,
    firstNameV,
    lastNameV,
    vendorPhone1,
    vendorPhone2,
    vendorPhone3,
    vendorEmail,
    sourceNotes,
    description,
    businessNameSecondary,
    businessABN,
    businessURL,
    address1,
    suburb,
    state,
    postCode,
    data120DayGuarantee,
    notifyOwner,
    listingAgent,
    stageId: stage === '' ? null : stage,
    sourceId: businessSource === '' ? null : businessSource,
    ratingId: businessRating === '' ? null : businessRating,
    industryId: businessIndustry === '' ? null : businessIndustry,
    productId: businessProduct === '' ? null : businessProduct,
    typeId: businessType === '' ? null : businessType,
    brokerAccountName,
    listedPrice,
    currentPrice,
    engagementFee,
    commissionPerc,
    minimumCharge,
    appraisalHigh,
    appraisalLow,
    depositeTaken,
    depositeTakenDate,
    commissionSold,
    settlementDate,
    soldPrice,
    attachedPurchaser,
    searchNote,
    afterSalesNotes,
    modifiedBy_id: req.user.id
  }

  try {
    const business = await models.Business.findOne({ where: { id: idBusiness } })

    if (!business.daysOnTheMarket && stage === 4) {
      businessUpdated.daysOnTheMarket = moment()
    }

    await models.Business.update(businessUpdated, { where: { id: idBusiness } })
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
  const { listingAgentName } = req.body

  const { idBusiness } = req.params

  const data = {
    listingAgent: listingAgentName
  }

  if (!idBusiness || idBusiness === 'undefined') {
    throw new APIError({
      message: 'Business id does not exist',
      status: 404,
      isPublic: true
    })
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

  console.log(updateBusiness)

  updateBusiness.modifiedBy_id = req.user.id
  updateBusiness.stageId = 8

  // Verify exists business
  const business = await models.Business.findOne({ where: { id: idBusiness } })

  if (!business) {
    throw new APIError({
      message: 'Business not found',
      status: 404,
      isPublic: true
    })
  }

  try {
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
