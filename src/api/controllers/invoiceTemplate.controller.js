import APIError from '../utils/APIError'
import models from '../../config/sequelize'

export const get = async (req, res, next) => {
  const { idInvoiceemplate: id } = req.params

  try {
    const template = await models.InvoiceTemplate.findOne({ where: { id } })

    return res.status(201).json({
      data: template,
      message: 'Template get with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const list = async (req, res, next) => {
  const { limit, state } = req.query
  const offset = req.skip

  const options = {
    attributes: ['id', 'title', 'state'],
    limit: limit || 50,
    offset
  }

  if (state) {
    options.where = {
      state
    }
  }

  try {
    const templates = await models.InvoiceTemplate.findAll(options)
    return res.status(201).json({
      data: templates,
      message: 'Templates list with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const newInvoiceTemplate = req.body

  newInvoiceTemplate.createdBy_id = req.user.id
  newInvoiceTemplate.modifiedBy_id = req.user.id

  try {
    // Create email template
    const template = await models.InvoiceTemplate.create(newInvoiceTemplate)

    return res.status(201).json({
      data: template,
      message: 'Template invoice created with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { idInvoiceTemplate: id } = req.params
  const editInvoiceTemplate = req.body

  editInvoiceTemplate.modifiedBy_id = req.user.id

  try {
    const template = await models.InvoiceTemplate.findOne({ where: { id } })

    if (!template) {
      throw new APIError({
        message: 'Template not found',
        status: 400,
        isPublic: true
      })
    }

    const updatedTemplate = await models.InvoiceTemplate.update(editInvoiceTemplate, {
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

export const remove = async (req, res, next) => {
  const { idInvoiceTemplate: id } = req.params

  try {
    await models.InvoiceTemplate.destroy({ where: { id } })

    return res
      .status(200)
      .json({ message: `Invoice template${id} removed with success` })
  } catch (error) {
    return next(error)
  }
}
