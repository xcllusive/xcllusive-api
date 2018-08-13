import _ from 'lodash'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'

export const get = async (req, res, next) => {
  const { idInvoice: id } = req.params

  try {
    const invoice = await models.Invoice.findOne({ where: { id } })

    return res.status(201).json({
      data: invoice,
      message: 'Invoice get with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const getLast = async (req, res, next) => {
  const { businessId } = req.query

  try {
    const invoice = await models.Invoice.findOne({
      where: {
        business_id: businessId
      },
      order: [['dateTimeCreated', 'DESC']]
    })
    return res.status(201).json({
      data: invoice,
      message: 'Get last invoice with succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const list = async (req, res, next) => {
  const { limit, businessId } = req.query
  const offset = req.skip

  try {
    const invoices = await models.Invoice.findAndCountAll({
      where: {
        business_id: businessId
      },
      order: [['dateTimeCreated', 'DESC']],
      limit,
      offset
    })

    return res.status(201).json({
      data: invoices,
      pageCount: invoices.count,
      itemCount: Math.ceil(invoices.count / req.query.limit),
      message: 'List invoices with succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const { invoice, businessId } = req.body

  invoice.createdBy_id = req.user.id
  invoice.modifiedBy_id = req.user.id

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

    // Get number of invoices
    const invoices = models.Invoice.findAndCountAll({
      where: {
        business_id: businessId
      }
    })

    invoice.business_id = business.id
    invoice.ref = `${invoices.count + 1}${business.businessName.substring(0, 10).trim()}`

    const invoiceCreated = await models.Invoice.create(invoice)

    return res.status(201).json({
      data: invoiceCreated,
      message: 'Invoice created with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { idInvoice: id } = req.params
  const editInvoice = req.body

  editInvoice.modifiedBy_id = req.user.id

  try {
    const editedInvoice = await models.Invoice.update(editInvoice, {
      where: { id }
    })

    return res.status(201).json({
      data: editedInvoice,
      message: 'Invoice updated with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const { idInvoice: id } = req.params

  try {
    await models.Invoice.destroy({ where: { id } })

    return res.status(200).json({ message: `Invoice ${id} removed with success` })
  } catch (error) {
    return next(error)
  }
}
