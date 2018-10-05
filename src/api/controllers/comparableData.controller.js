import _ from 'lodash'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'
import { stringify } from 'querystring'

export const list = async (req, res, next) => {
  const { limit, type, priceRangeStart, priceRangeEnd, trend } = req.query
  const offset = req.skip

  let whereOptions = {
    sold: 1
  }

  if (type) whereOptions.businessType = { $like: `%${type}%` }
  if (priceRangeStart) whereOptions.soldPrice = { $gte: priceRangeStart }
  if (priceRangeEnd) whereOptions.soldPrice = { $lte: priceRangeEnd }
  if (priceRangeStart && priceRangeEnd) {
    whereOptions.soldPrice = {
      $and: {
        $gte: priceRangeStart,
        $lte: priceRangeEnd
      }
    }
  }
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
  } catch (error) {
    return next(error)
  }
}

export const get = async (req, res, next) => {
  const { idAppraisal } = req.params

  try {
    const appraisal = await models.Appraisal.findOne({ where: { id: idAppraisal } })

    if (!appraisal) {
      throw new APIError({
        message: 'Appraisal not found',
        status: 400,
        isPublic: true
      })
    }

    if (
      !appraisal.comparableDataSelectedList ||
      appraisal.comparableDataSelectedList === ''
    ) {
      throw new APIError({
        message: 'Appraisal selected list is empty',
        status: 400,
        isPublic: true
      })
    }

    const businessSoldselectedListOnlyId = JSON.parse(
      appraisal.comparableDataSelectedList
    )

    const comparableDataSelectedList = await models.BusinessSold.findAll({
      where: { id: Array.from(businessSoldselectedListOnlyId) }
    })

    return res
      .status(200)
      .json({ data: comparableDataSelectedList, message: 'Get Selected list' })
  } catch (error) {
    return next(error)
  }
}

export const save = async (req, res, next) => {
  const { appraisalId, selectedList } = req.body

  // if (selectedList.isArray()) {
  //   throw new APIError({
  //     message: 'Selected list is not array',
  //     status: 400,
  //     isPublic: true
  //   })
  // }

  const selectedListOnlyId = _.map(selectedList, 'id')

  try {
    await models.Appraisal.update(
      {
        comparableDataSelectedList: JSON.stringify(selectedListOnlyId)
      },
      { where: { id: appraisalId } }
    )

    return res.status(200).json({ data: null, message: 'Get Selected list' })
  } catch (error) {
    return next(error)
  }
}
