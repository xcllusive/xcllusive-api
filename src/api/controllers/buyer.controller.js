import Handlebars from 'handlebars'
import Busboy from 'busboy'
import moment from 'moment'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'
import mailer from '../modules/mailer'
import { uploadToS3 } from '../modules/aws'

export const get = async (req, res, next) => {
  const { idBuyer: id } = req.params

  try {
    const buyer = await models.Buyer.findOne({ where: { id } })

    return res.status(201).json({
      data: buyer,
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
      'caSent',
      'caReceived',
      'suburb',
      'state',
      'source_id',
      'postCode',
      'priceFrom',
      'priceTo',
      'emailOptional'
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
      where: { title: 'CA Sent' }
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

    // Get upload file
    const busboy = new Busboy({ headers: req.headers })

    busboy.on('finish', async () => {
      const file = req.files.caFile

      // Verify file received
      // if (!file) {
      //   throw new APIError({
      //     message: 'Expect one file upload named caFile',
      //     status: 400,
      //     isPublic: true
      //   })
      // }

      // // Verify file is pdf
      // if (/^application\/(pdf)$/.test(file.mimetype)) {
      //   throw new APIError({
      //     message: 'Expect pdf file',
      //     status: 400,
      //     isPublic: true
      //   })
      // }

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
    })

    req.pipe(busboy)

    return res.status(201).json({
      data: {},
      message: `Send email successfuly to ${buyer.firstName} <${buyer.email}>`
    })
  } catch (error) {
    return next(error)
  }
}
