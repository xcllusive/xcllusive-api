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
  if (priceRangeStart) whereOptions.priceRangeStart = priceRangeStart
  if (priceRangeEnd) whereOptions.priceRangeEnd = priceRangeEnd
  if (trend) whereOptions.trend = trend

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
