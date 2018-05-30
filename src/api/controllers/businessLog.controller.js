import APIError from '../utils/APIError'
import models from '../../config/sequelize'

export const get = async (req, res, next) => {
  const { idBusiness } = req.params

  try {
    const businessLog = await models.BusinessLog.findAll({ where: { id: idBusiness } })
    return res.status(200).json(businessLog)
  } catch (error) {
    return next(error)
  }
}

export const list = async (req, res, next) => {
  const { businessId } = req.query

  try {
    // Verify exists buyer
    const business = await models.Business.findOne({ where: { id: businessId } })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    const logs = await models.BusinessLog.findAll({
      where: { business_id: businessId },
      order: [['followUp', 'DESC']],
      include: [
        {
          model: models.Business,
          attributes: ['businessName']
        }
      ]
    })

    return res.status(201).json({
      data: logs,
      message:
        logs.length === 0
          ? 'Nothing business log found'
          : 'Get business log with succesfully'
    })
  } catch (error) {
    return next(error)
  }
}
