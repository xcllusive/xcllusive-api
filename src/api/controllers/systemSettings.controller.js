import models from '../../config/sequelize'
import APIError from '../utils/APIError'
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
  const xcllusiveBuyer = !!req.body.company
  const ctcBuyer = req.body.company === false

  try {
    const buyer = await models.Buyer.findAll({
      raw: true,
      attributes: ['firstName', 'surname', 'email', 'state'],
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        },
        xcllusiveBuyer: xcllusiveBuyer,
        ctcBuyer: ctcBuyer
      },
      order: [
        ['dateTimeCreated', 'ASC']
      ]
    })

    if (!buyer || buyer.length === 0) {
      throw new APIError({
        message: 'No buyer in the period informed',
        status: 404,
        isPublic: true
      })
    }

    const xlsx = require('xlsx')
    var newWb = xlsx.utils.book_new()
    var newWs = xlsx.utils.json_to_sheet(buyer)
    xlsx.utils.book_append_sheet(newWb, newWs, 'New Data')
    const destXlsxGenerated = path.resolve('src', 'api', 'resources', 'xls', 'exports', `buyers${moment().format('DD_MM_YYYY_hh_mm_ss')}.xlsx`)
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
  const replaceOnlyToNumber = (onlyNumbers) => {
    onlyNumbers = onlyNumbers.replace(/\D/g, '')
    let replaced = onlyNumbers.replace(/-/gi, '')
    replaced = replaced.replace(/ /gi, '')
    replaced = replaced.replace(/;/gi, '')
    replaced = replaced.replace(/<[^>]+>/gi, '')
    replaced = replaced.replace(/<[^>]>/gi, '')
    replaced = replaced.replace(/[.*+?^${}()|[\]\\]/g, '')

    return parseInt(replaced)
  }
  try {
    const business = await models.Business.findAll({
      raw: true
      // where: {
      //   // id: {
      //   //   $between: [141108, 141416]
      //   // }
      //   // id: 141410
      // }
    })
    let count = 0
    const response = await Promise.all(
      business.map(async business => {
        let vendorPhone1Number = 0
        let vendorPhone2Number = 0
        const phone1 = business.vendorPhone1 !== '' ? business.vendorPhone1 : business.vendorPhone2
        if (phone1) {
          vendorPhone1Number = replaceOnlyToNumber(phone1).toString()
        }

        if (vendorPhone1Number.length > 9) {
          const sizedPhone = vendorPhone1Number
          vendorPhone1Number = sizedPhone.substring(0, 9)
          vendorPhone2Number = sizedPhone.substring(10, 30)
        } else {
          const phone2 = business.vendorPhone2 !== '' ? business.vendorPhone2 : business.vendorPhone3
          if (phone2) {
            vendorPhone2Number = replaceOnlyToNumber(phone2).toString()
          }
        }

        if (vendorPhone1Number || vendorPhone2Number) {
          const updateBusiness = {
            vendorPhone1Number: vendorPhone1Number,
            vendorPhone2Number: vendorPhone2Number
          }
          await models.Business.update(updateBusiness, {
            where: {
              id: business.id
            }
          })
        }
        count = count + 1
        console.log('which id am I?', business.id)
        console.log('counting...:', count)
      })
    )

    return res.status(201).json({
      data: response,
      message: 'JavaScript executed successfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const exportIssue = async (req, res, next) => {
  const issueId = req.body.issueId

  try {
    const business = await models.Business.findAll({
      raw: true,
      attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'vendorEmail', 'address1', 'suburb', 'state', 'postCode'],
      where: {
        listIssues_id: {
          $like: `%${issueId}%`
        }
      },
      order: [
        ['dateTimeCreated', 'ASC']
      ]
    })

    if (!business) {
      throw new APIError({
        message: 'There is none business in the issue',
        status: 404,
        isPublic: true
      })
    }

    const xlsx = require('xlsx')
    var newWb = xlsx.utils.book_new()
    var newWs = xlsx.utils.json_to_sheet(business)
    xlsx.utils.book_append_sheet(newWb, newWs, 'New Data')
    const destXlsxGenerated = path.resolve('src', 'api', 'resources', 'xls', 'exports', `issue${moment().format('DD_MM_YYYY_hh_mm_ss')}.xlsx`)
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
        // exportLog.exportedPeriodFrom = req.body.dateFrom
        // exportLog.exportedPeriodTo = req.body.dateTo
        exportLog.type = `Issue ${issueId}`
        exportLog.createdBy_id = req.user.id
        await models.ExportLog.create(exportLog)
      }
    })
  } catch (error) {
    return next(error)
  }
}
