import models from '../../config/sequelize'
import APIError from '../utils/APIError'
import _ from 'lodash'
import path from 'path'
import fs from 'fs'
import moment from 'moment'

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

export const exportBuyers = async (req, res, next) => {
  const dateFrom = req.body.dateFrom
  const dateTo = req.body.dateTo

  try {
    const buyer = await models.Buyer.findAll({
      raw: true,
      attributes: ['firstName', 'surname', 'email', 'state'],
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        }
      },
      order: [
        ['dateTimeCreated', 'ASC']
      ]
    })

    if (!buyer) {
      throw new APIError({
        message: 'There is none buyer in the period informed',
        status: 404,
        isPublic: true
      })
    }

    const xlsx = require('xlsx')
    var newWb = xlsx.utils.book_new()
    var newWs = xlsx.utils.json_to_sheet(buyer)
    xlsx.utils.book_append_sheet(newWb, newWs, 'New Data')
    const destXlsxGenerated = path.resolve(
      'src',
      'api',
      'resources',
      'xls',
      'exports',
      `buyers${moment().format('DD_MM_YYYY_hh_mm_ss')}.xlsx`
    )
    xlsx.writeFile(newWb, destXlsxGenerated)

    return res.download(destXlsxGenerated, async err => {
      fs.unlink(destXlsxGenerated, error => {
        if (error) {
          throw new APIError({
            message: 'Error on send xlsx',
            status: 500,
            isPublic: true
          })
        }
      })
      if (err) {
        throw new APIError({
          message: 'Error on send xlsx',
          status: 500,
          isPublic: true
        })
      } else {
        const exportLog = {}
        exportLog.exportedPeriodFrom = req.body.dateFrom
        exportLog.exportedPeriodTo = req.body.dateTo
        exportLog.type = 'Buyer Export'
        exportLog.createdBy_id = req.user.id
        await models.ExportLog.create(exportLog)
      }
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
    return res.status(201).json({
      data: allDuplicatedPending,
      message: 'JavaScript executed successfully'
    })
  } catch (error) {
    return next(error)
  }
}
