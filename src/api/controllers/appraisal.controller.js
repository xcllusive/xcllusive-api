import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  const { businessId } = req.query

  const limit = req.query.limit
  const offset = req.skip
  const where = businessId ? { business_id: businessId } : null

  try {
    const response = await models.Appraisal.findAndCountAll({ where, limit, offset })
    return res.status(201).json({
      data: response,
      pageCount: response.count,
      itemCount: Math.ceil(response.count / req.query.limit)
    })
  } catch (error) {
    return next(error)
  }
}

export const get = async (req, res, next) => {
  const { appraisald } = req.params

  try {
    const response = await models.Appraisal.findOne({
      where: { id: appraisald }
    })
    return res.status(201).json({
      data: response
    })
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const newAppraisal = req.body

  try {
    const appraisal = await models.Appraisal.create(newAppraisal)

    return res.status(200).json({ data: appraisal, message: `Appraisal ${appraisal.id} created` })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { appraisalId } = req.params
  const updatedValues = req.body

  try {
    await models.Appraisal.update(
      { updatedValues },
      { where: { id: appraisalId } }
    )
    return res.status(200).json({ message: `Appraisal ${appraisalId} updated` })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const { appraisalId } = req.params

  try {
    await models.Appraisal.destroy({ where: { id: appraisalId } })

    return res
      .status(200)
      .json({ message: `Appraisal ${appraisalId} removed with success` })
  } catch (error) {
    return next(error)
  }
}
