import models from '../../config/sequelize'
import APIError from '../utils/APIError'
import _ from 'lodash'
import path from 'path'

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
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo

  var objArray = [{
    'id': 0,
    'name': 'xxxx',
    'is_active': 'false'
  }, {
    'id': 1,
    'name': 'yyyy',
    'is_active': 'true'
  }]

  try {
    const buyer = await models.Buyer.findAll({
      raw: true,
      attributes: ['firstName', 'surname', 'email'],
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
    const destExcelGenerated = path.resolve('buyersExported.xlsx')
    xlsx.writeFile(newWb, 'buyersExported.xlsx')

    const blob = new Blob([buyer], {
      type: 'text/xlsx'
    })
    console.log(blob)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', 'buyersExported.xlsx')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    // const destExcelGenerated = path.resolve('buyersExported.xlsx')
    // res.download(destExcelGenerated, err => {
    //   console.log('cayo', err)
    // })

    return res.status(201).json({
      data: '',
      message: 'Success'
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
