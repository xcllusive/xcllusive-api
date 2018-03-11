import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  try {
    const businessStage = await models.BusinessStage.findAll()
    return res.status(200).json(businessStage)
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const {
    name
  } = req.body

  try {
    await models.BusinessStage.create({ name })
    return res.status(200).json({ message: `Business stage ${name} created` })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const {
    name,
    businessStage
  } = req.body

  try {
    await models.businessStage.update({ name }, { where: { businessStage } })
    return res.status(200).json({ message: `Business register ${businessStage} updated` })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const { businessStage } = req.body

  try {
    await models.BusinessOwnersTime.destroy({ where: { businessStage } })
    return res.status(200).json({ message: `Business register ${businessStage} removed with success` })
  } catch (error) {
    return next(error)
  }
}
