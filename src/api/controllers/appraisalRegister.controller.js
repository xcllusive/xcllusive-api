import models from '../../config/sequelize'
import APIError from '../utils/APIError'

export const list = async (req, res, next) => {
  const { appraisalRegister } = req.query

  const limit = req.query.limit
  const offset = req.skip
  const where = appraisalRegister ? { type: appraisalRegister } : null

  try {
    const response = await models.AppraisalRegister.findAndCountAll({
      where,
      limit,
      offset
    })    
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
  const { appraisalRegisterId } = req.params

  try {
    const response = await models.AppraisalRegister.findOne({
      where: { id: appraisalRegisterId }
    })
    return res.status(201).json({
      data: response
    })
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const { label, type, points } = req.body

  try {
    const appraisal = await models.AppraisalRegister.create({ label, type, points })

    return res
      .status(200)
      .json({ data: appraisal, message: `Appraisal register ${label} created` })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { appraisalRegisterId } = req.params
  const { label, points } = req.body

  try {
    await models.AppraisalRegister.update(
      { label, points },
      { where: { id: appraisalRegisterId } }
    )
    return res.status(200).json({ message: `Appraisal register ${label} updated` })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const { appraisalRegisterId } = req.params

  try {
    const appraisalRegister = await models.AppraisalRegister.findOne({
      where: { id: appraisalRegisterId }
    })

    if (!appraisalRegister) {
      throw new APIError({
        message: 'Appraisal register not found',
        status: 400,
        isPublic: true
      })
    }

    await models.AppraisalRegister.destroy({ where: { id: appraisalRegisterId } })

    return res
      .status(200)
      .json({ message: `Appraisal register ${appraisalRegisterId} removed with success` })
  } catch (error) {
    return next(error)
  }
}
