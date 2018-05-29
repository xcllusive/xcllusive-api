import Handlebars from 'handlebars'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'
import mailer from '../modules/mailer'
import { uploadToS3 } from '../modules/aws'

export const get = async (req, res, next) => {
  const { idEmailTemplate: id } = req.params

  try {
    const template = await models.EmailTemplate.findOne({ where: { id } })

    if (JSON.parse(template.handlebars)) {
      template.handlebars = JSON.parse(template.handlebars)
    }

    return res.status(201).json({
      data: template,
      message: 'Template get with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const list = async (req, res, next) => {
  const { perPage, brokersEmail } = req.query
  const options = {
    attributes: ['id', 'title'],
    limit: perPage
  }

  if (brokersEmail) {
    options.where = {
      brokersEmail: true
    }
  }

  try {
    const templates = await models.EmailTemplate.findAll(options)
    return res.status(201).json({
      data: templates,
      message: 'Templates list with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const newTemplateEmail = req.body
  const file = req.files.attachment
  const nameFileTemplate = newTemplateEmail.title.replace(/\s/g, '-').toLowerCase()

  newTemplateEmail.createdBy_id = req.user.id
  newTemplateEmail.modifiedBy_id = req.user.id

  try {
    // // Verify file is pdf, doc, docx
    // if (
    //   !/\/pdf$/.test(file.mimetype) ||
    //   !/\/doc$/.test(file.mimetype) ||
    //   !/\/docx$/.test(file.mimetype)
    // ) {
    //   throw new APIError({
    //     message: 'Expect pdf or doc file',
    //     status: 400,
    //     isPublic: true
    //   })
    // }

    // Upload file to aws s3
    const upload = await uploadToS3('xcllusive-email-templates', file, nameFileTemplate)

    newTemplateEmail.attachmentPath = upload.Location

    // Create email template
    const templateEmail = await models.EmailTemplate.create(newTemplateEmail)

    return res.status(201).json({
      data: templateEmail,
      message: 'Template email created with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { idEmailTemplate: id } = req.params
  const editTemplateEmail = req.body
  const file = req.files.attachment

  editTemplateEmail.modifiedBy_id = req.user.id

  try {
    const template = await models.EmailTemplate.findOne({ where: { id } })

    if (!template) {
      throw new APIError({
        message: 'Template not found',
        status: 400,
        isPublic: true
      })
    }

    editTemplateEmail.title = template.title

    // Verify file received
    if (file) {
      const nameFileTemplate = !editTemplateEmail.title
        ? template.title.replace(/\s/g, '-').toLowerCase()
        : editTemplateEmail.title.replace(/\s/g, '-').toLowerCase()

      // Upload file to aws s3
      const upload = await uploadToS3('xcllusive-email-templates', file, nameFileTemplate)
      editTemplateEmail.attachmentPath = upload.Location
    }

    const updatedTemplate = await models.EmailTemplate.update(editTemplateEmail, {
      where: { id }
    })

    return res.status(201).json({
      data: updatedTemplate,
      message: 'Template updated with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const sendEmail = async (req, res, next) => {
  const newEmail = req.body

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({ where: { id: newEmail.idBuyer } })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    // const templateCompiled = Handlebars.compile(template.body)

    // const context = {
    //   firstName: 'Cayo'
    // }

    const mailOptions = {
      to: buyer.email,
      from: '"Xcllusive" <businessinfo@xcllusive.com.au>',
      subject: newEmail.subject,
      html: newEmail.body
    }

    const resMailer = await mailer.sendMail(mailOptions)

    return res.status(201).json({
      data: resMailer,
      message: 'Send email successfuly'
    })
  } catch (error) {
    return next(error)
  }
}

export const sendEmailTest = async (req, res, next) => {
  const newEmail = req.body

  try {
    const template = await models.EmailTemplate.findOne({
      where: { title: newEmail.template }
    })

    if (!template) {
      const err = {
        message: 'The email template not found',
        status: 404,
        isPublic: true
      }
      throw err
    }

    const templateCompiled = Handlebars.compile(template.body)

    const context = {
      firstName: 'Cayo'
    }

    const mailOptions = {
      to: newEmail.to,
      from: '"Xcllusive Test 👻" <businessinfo@xcllusive.com.au>',
      subject: 'Teste',
      html: templateCompiled(context)
    }

    const resMailer = await mailer.sendMail(mailOptions)

    return res.status(201).json({
      data: resMailer,
      message: 'Send email successfuly'
    })
  } catch (error) {
    return next(error)
  }
}
