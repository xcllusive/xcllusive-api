import moment from 'moment'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  const { limit, type, priceRangeStart, priceRangeEnd, trend } = req.query
  const offset = req.skip

  let whereOptions = {
    sold: 1
  }

  if (type) whereOptions.businessType = { $like: `%${type}%` }
  if (priceRangeStart) whereOptions.soldPrice = { $gte: priceRangeStart }
  if (priceRangeEnd) whereOptions.soldPrice = { $lte: priceRangeEnd }
  if (trend) {
    if (!JSON.parse(trend)) {
      throw new APIError({
        message: 'Trend is not array',
        status: 404,
        isPublic: true
      })
    }
    whereOptions.trend = { $or: JSON.parse(trend) }
  }

  try {
    const businessesSold = await models.BusinessSold.findAndCountAll({
      where: whereOptions,
      order: [['soldDate', 'DESC']],
      limit,
      offset
    })

    const response = {
      data: businessesSold,
      pageCount: businessesSold.count,
      itemCount: Math.ceil(businessesSold.count / req.query.limit),
      message: 'Get businesses sold with sucessfuly'
    }
    return res.status(200).json(response)
  } catch (err) {
    return next(err)
  }
}
