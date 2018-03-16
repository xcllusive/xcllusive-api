import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  const {
    business
  } = req.query

  try {
    const businessLogs = await models.BusinessLog.findAll({ where: { business_id: business } })
    return res.status(200).json(businessLogs)
  } catch (error) {
    return next(error)
  }
}

export const get = async (req, res, next) => {
  const {
    id
  } = req.params

  try {
    const businessLog = await models.BusinessLog.findAll({ where: { id } })
    return res.status(200).json(businessLog)
  } catch (error) {
    return next(error)
  }
}
