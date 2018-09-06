import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  const { appraisalRegister } = req.query

  const limit = req.query.limit
  const offset = req.skip

  try {
    switch (parseInt(appraisalRegister, 10)) {
      case 1:
        const registers1 = await models.AppraisalRegister.findAndCountAll({ limit, offset })
        return res.status(201).json({
          data: registers1,
          pageCount: registers1.count,
          itemCount: Math.ceil(registers1.count / req.query.limit)
        })
      default:
        throw new Error(`Appraisal register ${appraisalRegister} does not exist`)
    }
  } catch (error) {
    return next(error)
  }
}

export const get = async (req, res, next) => {
  const { appraisalRegister } = req.query
  const { appraisalRegisterId } = req.params

  try {
    switch (parseInt(appraisalRegister, 10)) {
      case 1:
        const register1 = await models.AppraisalRegister.findOne({
          where: { id: appraisalRegisterId }
        })
        return res.status(201).json({
          data: register1
        })
      default:
        throw new Error(`Appraisal register ${appraisalRegister} does not exist`)
    }
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const { label, type: appraisalRegister } = req.body

  try {
    if (appraisalRegister === 1) {
      await models.AppraisalRegister.create({ label })
    }
    if (!appraisalRegister) {
      throw new Error(`Appraisal register ${appraisalRegister} does not exist`)
    }

    return res.status(200).json({ message: `Appraisal register ${label} created` })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { label, appraisalRegister } = req.body

  const { appraisalRegisterId } = req.params

  try {
    if (appraisalRegister === 1) {
      await models.AppraisalRegister.update({ label }, { where: { id: appraisalRegisterId } })
    }

    if (!appraisalRegister) {
      throw new Error(`Appraisal register ${appraisalRegister} does not exist`)
    }

    return res.status(200).json({ message: `Appraisal register ${label} updated` })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const { appraisalRegister } = req.body

  const { appraisalRegisterId } = req.params

  try {
    if (appraisalRegister === 1) {
      await models.AppraisalRegister.destroy({ where: { id: appraisalRegisterId } })
    }

    if (!appraisalRegister) {
      throw new Error(`Appraisal register ${appraisalRegister} does not exist`)
    }

    return res
      .status(200)
      .json({ message: `Appraisal register ${appraisalRegister} removed with success` })
  } catch (error) {
    return next(error)
  }
}
