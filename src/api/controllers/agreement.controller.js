import APIError from '../utils/APIError'
import models from '../../config/sequelize'
import mailer from '../modules/mailer'

export const get = async (req, res, next) => {
  const { idAgreement: id } = req.params

  try {
    const template = await models.AgreementTemplate.findOne({ where: { id } })

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

export const create = async (req, res, next) => {
  const newAgreementTemplate = req.body

  newAgreementTemplate.createdBy_id = req.user.id
  newAgreementTemplate.modifiedBy_id = req.user.id

  try {
    // Create email template
    const template = await models.AgreementTemplate.create(newAgreementTemplate)

    return res.status(201).json({
      data: template,
      message: 'Template agreement created with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { idAgreementTemplate: id } = req.params
  const editAgreementTemplate = req.body

  editAgreementTemplate.modifiedBy_id = req.user.id

  try {
    const template = await models.AgreementTemplate.findOne({ where: { id } })

    if (!template) {
      throw new APIError({
        message: 'Template not found',
        status: 400,
        isPublic: true
      })
    }

    const updatedTemplate = await models.AgreementTemplate.update(editAgreementTemplate, {
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
    const buyer = await models.Buyer.findOne({ where: { id: newEmail.buyerId } })

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
