import APIError from '../utils/APIError'
import models from '../../config/sequelize'

export const get = async (req, res, next) => {
  const { idAgreementTemplate: id } = req.params

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

export const list = async (req, res, next) => {
  const { perPage, state } = req.query

  const options = {
    attributes: ['id', 'title', 'state'],
    limit: perPage || 50
  }

  if (state) {
    options.where = {
      state
    }
  }

  try {
    const templates = await models.AgreementTemplate.findAll(options)
    return res.status(201).json({
      data: templates,
      message: 'Templates list with success'
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
