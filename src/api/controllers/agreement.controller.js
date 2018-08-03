import APIError from '../utils/APIError'
import models from '../../config/sequelize'
import mailer from '../modules/mailer'

export const get = async (req, res, next) => {
  const { idAgreement: id } = req.params

  try {
    const agreement = await models.Agreement.findOne({ where: { id } })

    return res.status(201).json({
      data: agreement,
      message: 'Template get with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  req.body.newAgreement.createdBy_id = req.user.id

  try {
    const business = await models.Business.findOne({
      where: { id: req.body.business.id}
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 400,
        isPublic: true
      })
    }

    const agreement = await models.Agreement.create(req.body.newAgreement)

    await models.Business.update({ agreement: agreement.id }, {
      where: {
        id: business.id
      }
    })

    return res.status(201).json({
      data: agreement,
      message: 'Agreement created with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { idAgreement: id } = req.params
  const editAgreement = req.body

  editAgreement.modifiedBy_id = req.user.id

  try {
    const agreement = await models.Agreement.findOne({ where: { id } })

    if (!agreement) {
      throw new APIError({
        message: 'Agreement not found',
        status: 400,
        isPublic: true
      })
    }

    const updatedAgreement = await models.Agreement.update(editAgreement, {
      where: { id }
    })

    return res.status(201).json({
      data: updatedAgreement,
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
