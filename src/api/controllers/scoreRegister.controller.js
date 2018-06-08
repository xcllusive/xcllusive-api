import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  const { scoreRegister } = req.query

  const limit = req.query.limit
  const offset = req.skip
  const where = scoreRegister
    ? {type: scoreRegister}
    : null

  try {
    const response = await models.ScoreRegister.findAndCountAll({where, limit, offset })
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
  const { scoreRegisterId } = req.params

  try {
    const response = await models.ScoreRegister.findOne({
      where: { id: scoreRegisterId }
    })
    return res.status(201).json({
      data: response
    })
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const { label, type } = req.body

  try {
    await models.ScoreRegister.create({ label, type })

    return res.status(200).json({ message: `Buyer register ${label} created` })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { scoreRegisterId } = req.params
  const { label } = req.body

  try {
    await models.ScoreRegister.update({ label }, { where: { id: scoreRegisterId } })
    return res.status(200).json({ message: `Buyer register ${label} updated` })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const { scoreRegisterId } = req.params

  try {
    await models.ScoreRegister.destroy({ where: { id: scoreRegisterId } })

    return res
      .status(200)
      .json({ message: `Buyer register ${scoreRegisterId} removed with success` })
  } catch (error) {
    return next(error)
  }
}
