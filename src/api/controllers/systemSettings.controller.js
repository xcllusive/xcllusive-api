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
    const buyers = await models.testImportBuyer.findAll({
      raw: true,
      where: {
        id: {
          $between: [6001, 6600]
        }
      }
    })
    let count = 0
    const response = await Promise.all(
      buyers.map(async (buyer) => {
        const existBuyer = await models.Buyer.findOne({
          where: {
            email: buyer.email
          }
        })
        if (!existBuyer) {
          const onlyNumbers = buyer.telephone1 !== '' ? buyer.telephone1 : buyer.telephone2
          let replaced = onlyNumbers.replace(/-/gi, '')
          replaced = replaced.replace(/ /gi, '')
          replaced = replaced.replace(/;/gi, '')
          replaced = replaced.replace(/<[^>]+>/gi, '')
          replaced = replaced.replace(/<[^>]>/gi, '')
          replaced = replaced.replace(/[.*+?^${}()|[\]\\]/g, '')
          const toString = parseInt(replaced)

          buyer.id = null
          buyer.xcllusiveBuyer = 0
          buyer.ctcBuyer = 1
          buyer.telephone1Number = toString.toString()
          buyer.createdBy_id = 1
          buyer.modifiedBy_id = 1
          buyer.caReceived = 0
          buyer.caSent = 0
          buyer.smSent = 0
          models.Buyer.create(buyer)
        } else {
          count = count + 1
          console.log('this buyer, already exists', count)
        }
      })
    )
    // const businesses = await models.testImportBusiness.findAll({
    //   raw: true
    // })

    // const response = await Promise.all(
    //   businesses.map(async (business) => {
    //     const existBusiness = await models.Business.findOne({
    //       where: {
    //         vendorEmail: business.vendorEmail
    //       }
    //     })
    //     if (!existBusiness) {
    //       business.id = null
    //       business.data120DayGuarantee = 0
    //       business.dateChangedToForSale = moment().format('YYYY-MM-DD hh:mm:ss')

    //       const separeName = business.name.indexOf(' ')
    //       const firstNameV = business.name.substr(0, separeName)
    //       const lastNameV = business.name.slice(separeName + 1, business.name.length).trim()
    //       business.firstNameV = firstNameV
    //       business.lastNameV = lastNameV

    //       const separeAddress = business.businessAddress.indexOf(',')
    //       const streetName = business.businessAddress.substr(0, separeAddress)
    //       const separeSuburb = business.businessAddress.indexOf(',', separeAddress + 1)
    //       const suburb = business.businessAddress.slice(separeAddress + 1, separeSuburb).trim()
    //       const separeState = business.businessAddress.indexOf(',', separeSuburb + 1)
    //       const state = business.businessAddress.slice(separeSuburb + 1, separeState).trim()
    //       // const separePostCode = business.businessAddress.indexOf(',', separeState + 1)
    //       const postCode = business.businessAddress.slice(separeState + 1, business.businessAddress.length).trim()
    //       business.address1 = streetName
    //       business.suburb = suburb
    //       business.state = state
    //       business.postCode = postCode
    //       business.dateTimeCreated = moment().format('YYYY-MM-DD hh:mm:ss')
    //       business.dateTimeModified = moment().format('YYYY-MM-DD hh:mm:ss')
    //       models.Business.create(business)
    //     }
    //   })
    // )

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
    const destXlsxGenerated = path.resolve(
      'src',
      'api',
      'resources',
      'xls',
      'exports',
      `issue${moment().format('DD_MM_YYYY_hh_mm_ss')}.xlsx`
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
