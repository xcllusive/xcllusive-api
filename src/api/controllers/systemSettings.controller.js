import models from '../../config/sequelize'
import APIError from '../utils/APIError'
import _ from 'lodash'

export const getAllSettings = async (req, res, next) => {
  try {
    const settings = await models.SystemSettings.findOne({
      where: {
        id: 1
      }
    })

    return res.status(201).json({
      data: settings,
      message: 'Success'
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const updateSettings = req.body

  updateSettings.modifiedBy_id = req.user.id

  try {
    // Verify exists settings default
    const settings = await models.SystemSettings.findOne({
      where: {
        id: 1
      }
    })

    if (!settings) {
      throw new APIError({
        message: 'Systems settings default not found',
        status: 404,
        isPublic: true
      })
    }

    await models.SystemSettings.update(updateSettings, {
      where: {
        id: 1
      }
    })
    return res.status(201).json({
      data: updateSettings,
      message: 'System Settings updated with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const executeJavaScript = async (req, res, next) => {
  try {
    const allDuplicatedPending = await models.BuyerLog.findAndCountAll({
      raw: true,
      attributes: ['id', 'buyer_id', 'followUpStatus', 'dateTimeCreated'],
      where: {
        followUpStatus: 'Pending'
      },
      group: ['buyer_id']
    })

    const mergedArray = _.merge(allDuplicatedPending.count, allDuplicatedPending.rows)

    mergedArray.forEach(async item => {
      console.log(item.count)
      if (item.count > 1) {
        const listDuplicatedPerBuyer = await models.BuyerLog.findAll({
          raw: true,
          attributes: ['id'],
          where: {
            buyer_id: item.buyer_id,
            followUpStatus: 'Pending'
          }
        })
        const arrayDuplicates = await Promise.all(
          listDuplicatedPerBuyer.map(dupl => {
            return dupl.id
          })
        )
        var maxArray = Math.max.apply(null, arrayDuplicates)
        const listToRemove = _.remove(arrayDuplicates, item => {
          return item !== maxArray
        })

        await models.BuyerLog.update({
          followUpStatus: 'Done'
        }, {
          where: {
            id: {
              $in: listToRemove
            }
          }
        })
      }
    })

    // console.log(newArray)
    return res.status(201).json({
      data: allDuplicatedPending,
      message: 'System Settings updated with success'
    })
  } catch (error) {
    return next(error)
  }
}
