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
          value: `${item.firstName} ${item.lastName}`
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
    const business = await models.Business.findOne({ where: { id: idBusiness } })
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
    const ownersTimeList = await models.BusinessOwnersTime.findAll({
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
    const usersStaff = await models.User.findAll({
      raw: true,
      attributes: ['id', 'firstName', 'lastName'],
      where: { userType: 'Staff' }
    })
    const stageNotSignedList = await models.BusinessStageNotSigned.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const stageNotWantList = await models.BusinessStageNotWant.findAll({
      raw: true,
      attributes: ['id', 'label']
    })

    const response = {
      business,
      stageList: _mapValuesToArray(stageList),
      sourceList: _mapValuesToArray(sourceList),
      industryList: _mapValuesToArray(industryList),
      ownersTimeList: _mapValuesToArray(ownersTimeList),
      productList: _mapValuesToArray(productList),
      ratingList: _mapValuesToArray(ratingList),
      typeList: _mapValuesToArray(typeList),
      usersStaff: _mapValuesToArray(usersStaff),
      stageNotSignedList: _mapValuesToArray(stageNotSignedList),
      stageNotWantList: _mapValuesToArray(stageNotWantList)
    }
    return res.status(200).json(response)
  } catch (err) {
    console.log(err)
    return next(err)
  }
}

export const list = async (req, res, next) => {
  let search = req.query.search
  let stageId = req.query.stageId
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
          }
        )
      }
    }
  }

  console.log(JSON.stringify(whereOptions))

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
      'suburb',
      'state',
      'postCode',
      'typeId',
      'notifyOwner'
    ],
    include: [models.BusinessStage, models.BusinessProduct]
  }
  try {
    const businesses = await models.Business.findAll(Object.assign(options, whereOptions))
    return res.status(200).json(businesses)
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
    stageId: 1 // Potencial Listing
  }

  try {
    const user = await models.User.findOne({
      where: { id: req.user.id },
      attributes: ['firstName', 'lastName']
    })
    newBusiness.listingAgent = `${user.firstName} ${user.lastName}`
    const business = await models.Business.create(newBusiness)
    await models.BusinessLog.create({
      text: 'New  ',
      createdBy: 1,
      status: 'Pending',
      business_id: business.get('id')
    })

    return res.status(200).json({ message: 'Business created with success' })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { idBusiness } = req.params

  if (!idBusiness || idBusiness === 'undefined') {
    throw new APIError({
      message: 'Business id does not exist',
      status: 404,
      isPublic: true
    })
  }

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
    businessStage,
    businessSource,
    businessRating,
    businessIndustry,
    businessOwnersTime,
    businessProduct,
    businessType,
    listingAgent,
    staffAccountName,
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

  const business = {
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
    stageId: businessStage === '' ? null : businessStage,
    sourceId: businessSource === '' ? null : businessSource,
    ratingId: businessRating === '' ? null : businessRating,
    industryId: businessIndustry === '' ? null : businessIndustry,
    ownersTimeId: businessOwnersTime === '' ? null : businessOwnersTime,
    productId: businessProduct === '' ? null : businessProduct,
    typeId: businessType === '' ? null : businessType,
    staffAccountName,
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
  }

  try {
    await models.Business.update(business, { where: { id: idBusiness } })
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
      text: `Email to Buyer ${buyer.id} Sent (Under Offer)’r`,
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
