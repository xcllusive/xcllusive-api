// import APIError from '../utils/APIError'
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

export const list = async (req, res, next) => {
  const { limit, businessId } = req.query
  const offset = req.skip

  try {
    const invoices = await models.Invoice.findAndCountAll({
      where: {
        business_id: businessId
      },
      order: [['followUp', 'DESC']],
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
  const newInvoice = req.body

  try {
    const invoiceCreated = await models.Invoice.create(newInvoice)
    invoiceCreated.createdBy_id = req.user.id
    invoiceCreated.modifiedBy_id = req.user.id

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
