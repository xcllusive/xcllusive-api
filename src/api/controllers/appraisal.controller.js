import util from 'util'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import puppeteer from 'puppeteer'
import moment from 'moment'
import models from '../../config/sequelize'
import APIError from '../utils/APIError'
import numeral from 'numeral'
import { ebitdaAvg } from '../utils/sharedFunctionsObject'
// import mailer from '../modules/mailer'

export const list = async (req, res, next) => {
  const { businessId } = req.query

  const limit = req.query.limit
  const offset = req.skip
  const where = businessId ? { business_id: businessId } : null

  try {
    const response = await models.Appraisal.findAndCountAll({ where, limit, offset })
    return res.status(201).json({
      data: response,
      pageCount: response.count,
      itemCount: Math.ceil(response.count / req.query.limit)
    })
  } catch (error) {
    return next(error)
  }
}

export const get = async (req, res, next) => {
  const { appraisalId } = req.params

  try {
    const response = await models.Appraisal.findOne({
      where: { id: appraisalId },
      include: [
        { model: models.Business },
        { model: models.User, as: 'CreatedBy' },
        { model: models.User, as: 'ModifiedBy' }
      ]
    })
    return res.status(201).json({
      data: response
    })
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const newAppraisal = req.body

  newAppraisal.createdBy_id = req.user.id

  try {
    // Verify exists appraisal to change the stage to appraisal if you do not have any
    const haveAppraisal = await models.Appraisal.findOne({
      where: { business_id: newAppraisal.business_id }
    })
    if (!haveAppraisal) {
      const updateBusiness = req.body
      updateBusiness.modifiedBy_id = req.user.id
      updateBusiness.stageId = 9
      await models.Business.update(updateBusiness, {
        where: { id: newAppraisal.business_id }
      })
    }

    const appraisal = await models.Appraisal.create(newAppraisal)

    return res
      .status(200)
      .json({ data: appraisal, message: `Appraisal ${appraisal.id} created` })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { appraisalId } = req.params
  const updatedValues = req.body

  updatedValues.updatedBy_id = req.user.id

  try {
    await models.Appraisal.update(updatedValues, { where: { id: appraisalId } })
    return res.status(200).json({ message: `Appraisal ${appraisalId} updated` })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const { appraisalId } = req.params

  try {
    await models.Appraisal.destroy({ where: { id: appraisalId } })

    return res
      .status(200)
      .json({ message: `Appraisal ${appraisalId} removed with success` })
  } catch (error) {
    return next(error)
  }
}

// _ebitdaAvg = businessSold => {
//   let count = 0
//   let totalYear = 0

//   if (businessSold.year4 > 0) {
//     count = count + 1
//     totalYear = totalYear + businessSold.year4
//   }
//   if (businessSold.year3 > 0) {
//     count = count + 1
//     totalYear = totalYear + businessSold.year3
//   }
//   if (businessSold.year2 > 0) {
//     count = count + 1
//     totalYear = totalYear + businessSold.year2
//   }
//   if (businessSold.year1 > 0) {
//     totalYear = totalYear + businessSold.year1
//     count = count + 1
//   }

//   return totalYear / count - businessSold.agreedWageForWorkingOwners
// }

export const generatePdf = async (req, res, next) => {
  const { appraisalId } = req.params

  const templatePath = path.resolve(
    'src',
    'api',
    'resources',
    'pdf',
    'templates',
    'appraisal',
    'appraisal.html'
  )

  const destPdfGenerated = path.resolve(
    'src',
    'api',
    'resources',
    'pdf',
    'generated',
    'appraisal',
    `${Date.now()}.pdf`
  )

  const readFile = util.promisify(fs.readFile)

  try {
    // Verify exists appraisal
    const appraisal = await models.Appraisal.findOne({
      where: { id: appraisalId },
      include: [{ model: models.Business, as: 'Business' }]
    })

    if (!appraisal) {
      throw new APIError({
        message: 'Appraisal not found',
        status: 404,
        isPublic: true
      })
    }

    const businessType = await models.BusinessType.findOne({
      where: { id: appraisal.Business.typeId }
    })

    const businessSoldselectedListOnlyId = JSON.parse(
      appraisal.comparableDataSelectedList
    )

    const comparableDataSelectedList = await models.BusinessSold.findAll({
      where: { id: Array.from(businessSoldselectedListOnlyId) }
    })

    // console.log(comparableDataSelectedList)

    const context = {
      dateTimeCreated: moment().format('DD/MM/YYYY'),
      currentYear: moment().get('year'),
      businessName: appraisal.Business.businessName,
      dateTimeModified: appraisal.dateTimeModified,
      businessABN: appraisal.Business.businessABN,
      businessAddress1: appraisal.Business.address1,
      businessSuburb: appraisal.Business.suburb,
      businessState: appraisal.Business.state,
      businessPostCode: appraisal.Business.postCode,
      businessFirstNameV: appraisal.Business.firstNameV,
      businessLastNameV: appraisal.Business.lastNameV,
      businessIndustry: appraisal.Business.industry,
      businessType: businessType.label,
      currentOwner: appraisal.currentOwner,
      nOfBusinessLocations: appraisal.nOfBusinessLocations,
      businessCommenced: appraisal.businessCommenced,
      tradingHours: appraisal.tradingHours,
      productsServices: appraisal.productsServices,
      descriptionCustomers: appraisal.descriptionCustomers,
      clientDatabaseAvailable: appraisal.clientDatabaseAvailable ? 'Yes' : 'No',
      client10TO: appraisal.client10TO ? 'Yes' : 'No',
      client5TO: appraisal.client5TO,
      descriptionSuppliers: appraisal.descriptionSuppliers,
      premisesOwnedRented: appraisal.premisesOwnedRented,
      rentCost: appraisal.rentCost,
      timeRemLease: appraisal.timeRemLease,
      premisesNotes: appraisal.premisesNotes,
      fullTime: appraisal.fullTime,
      partTime: appraisal.partTime,
      subContractors: appraisal.subContractors,
      casuals: appraisal.casuals,
      numberOwners: appraisal.numberOwners,
      owners1sHours: appraisal.owners1sHours,
      owners1sRole: appraisal.owners1sRole,
      otherOwnersHours: appraisal.otherOwnersHours,
      otherOwnersRole: appraisal.otherOwnersRole,
      otherRelevantNotes: appraisal.otherRelevantNotes,
      year1: appraisal.year1,
      year2: appraisal.year2,
      year3: appraisal.year3,
      year4: appraisal.year4,
      year5: appraisal.year5,
      year6: appraisal.year6,
      year7: appraisal.year7,
      sales1: appraisal.sales1,
      sales2: appraisal.sales2,
      sales3: appraisal.sales3,
      sales4: appraisal.sales4,
      sales5: appraisal.sales5,
      sales6: appraisal.sales6,
      sales7: appraisal.sales7,
      cogs1: appraisal.cogs1,
      cogs2: appraisal.cogs2,
      cogs3: appraisal.cogs3,
      cogs4: appraisal.cogs4,
      cogs5: appraisal.cogs5,
      cogs6: appraisal.cogs6,
      cogs7: appraisal.cogs7,
      grossMargin1: appraisal.grossMargin1,
      grossMargin2: appraisal.grossMargin2,
      grossMargin3: appraisal.grossMargin3,
      grossMargin4: appraisal.grossMargin4,
      grossMargin5: appraisal.grossMargin5,
      grossMargin6: appraisal.grossMargin6,
      grossMargin7: appraisal.grossMargin7,
      grossMarginPerc1: appraisal.grossMarginPerc1,
      grossMarginPerc2: appraisal.grossMarginPerc2,
      grossMarginPerc3: appraisal.grossMarginPerc3,
      grossMarginPerc4: appraisal.grossMarginPerc4,
      grossMarginPerc5: appraisal.grossMarginPerc5,
      grossMarginPerc6: appraisal.grossMarginPerc6,
      grossMarginPerc7: appraisal.grossMarginPerc7,
      otherIncome1: appraisal.otherIncome1,
      otherIncome2: appraisal.otherIncome2,
      otherIncome3: appraisal.otherIncome3,
      otherIncome4: appraisal.otherIncome4,
      otherIncome5: appraisal.otherIncome5,
      otherIncome6: appraisal.otherIncome6,
      otherIncome7: appraisal.otherIncome7,
      grossProfit1: appraisal.grossProfit1,
      grossProfit2: appraisal.grossProfit2,
      grossProfit3: appraisal.grossProfit3,
      grossProfit4: appraisal.grossProfit4,
      grossProfit5: appraisal.grossProfit5,
      grossProfit6: appraisal.grossProfit6,
      grossProfit7: appraisal.grossProfit7,
      expenses1: appraisal.expenses1,
      expenses2: appraisal.expenses2,
      expenses3: appraisal.expenses3,
      expenses4: appraisal.expenses4,
      expenses5: appraisal.expenses5,
      expenses6: appraisal.expenses6,
      expenses7: appraisal.expenses7,
      operatingProfit1: appraisal.operatingProfit1,
      operatingProfit2: appraisal.operatingProfit2,
      operatingProfit3: appraisal.operatingProfit3,
      operatingProfit4: appraisal.operatingProfit4,
      operatingProfit5: appraisal.operatingProfit5,
      operatingProfit6: appraisal.operatingProfit6,
      operatingProfit7: appraisal.operatingProfit7,
      operatingProfitPerc1: appraisal.operatingProfitPerc1,
      operatingProfitPerc2: appraisal.operatingProfitPerc2,
      operatingProfitPerc3: appraisal.operatingProfitPerc3,
      operatingProfitPerc4: appraisal.operatingProfitPerc4,
      operatingProfitPerc5: appraisal.operatingProfitPerc5,
      operatingProfitPerc6: appraisal.operatingProfitPerc6,
      operatingProfitPerc7: appraisal.operatingProfitPerc7,
      riskList: appraisal.riskList,
      valueDriversList: appraisal.valueDriversList,
      criticalIssuesList: appraisal.criticalIssuesList,
      /* table 10 last businesses */
      businessType1: comparableDataSelectedList[0]
        ? comparableDataSelectedList[0].businessType
        : '',
      businessType2: comparableDataSelectedList[1]
        ? comparableDataSelectedList[1].businessType
        : '',
      businessType3: comparableDataSelectedList[2]
        ? comparableDataSelectedList[2].businessType
        : '',
      businessType4: comparableDataSelectedList[3]
        ? comparableDataSelectedList[3].businessType
        : '',
      businessType5: comparableDataSelectedList[4]
        ? comparableDataSelectedList[4].businessType
        : '',
      businessType6: comparableDataSelectedList[5]
        ? comparableDataSelectedList[5].businessType
        : '',
      businessType7: comparableDataSelectedList[6]
        ? comparableDataSelectedList[6].businessType
        : '',
      businessType8: comparableDataSelectedList[7]
        ? comparableDataSelectedList[7].businessType
        : '',
      businessType9: comparableDataSelectedList[8]
        ? comparableDataSelectedList[8].businessType
        : '',
      businessType10: comparableDataSelectedList[9]
        ? comparableDataSelectedList[9].businessType
        : '',
      turnOver1: comparableDataSelectedList[0]
        ? numeral(comparableDataSelectedList[0].latestFullYearTotalRevenue).format('$0,0')
        : '',
      turnOver2: comparableDataSelectedList[1]
        ? numeral(comparableDataSelectedList[1].latestFullYearTotalRevenue).format('$0,0')
        : '',
      turnOver3: comparableDataSelectedList[2]
        ? numeral(comparableDataSelectedList[2].latestFullYearTotalRevenue).format('$0,0')
        : '',
      turnOver4: comparableDataSelectedList[3]
        ? numeral(comparableDataSelectedList[3].latestFullYearTotalRevenue).format('$0,0')
        : '',
      turnOver5: comparableDataSelectedList[4]
        ? numeral(comparableDataSelectedList[4].latestFullYearTotalRevenue).format('$0,0')
        : '',
      turnOver6: comparableDataSelectedList[5]
        ? numeral(comparableDataSelectedList[5].latestFullYearTotalRevenue).format('$0,0')
        : '',
      turnOver7: comparableDataSelectedList[6]
        ? numeral(comparableDataSelectedList[6].latestFullYearTotalRevenue).format('$0,0')
        : '',
      turnOver8: comparableDataSelectedList[7]
        ? numeral(comparableDataSelectedList[7].latestFullYearTotalRevenue).format('$0,0')
        : '',
      turnOver9: comparableDataSelectedList[8]
        ? numeral(comparableDataSelectedList[8].latestFullYearTotalRevenue).format('$0,0')
        : '',
      turnOver10: comparableDataSelectedList[9]
        ? numeral(comparableDataSelectedList[9].latestFullYearTotalRevenue).format('$0,0')
        : '',
      avg1:
        appraisal.pricingMethod === 1 ||
        appraisal.pricingMethod === 2 ||
        appraisal.pricingMethod === 5 ||
        appraisal.pricingMethod === 6
          ? numeral(ebitdaAvg(comparableDataSelectedList[0])).format('$0,0')
          : ''
      /* end table 10 last businesses */
    }

    const PDF_OPTIONS = {
      path: destPdfGenerated,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        left: '15mm',
        right: '15mm',
        bottom: '15mm'
      },
      displayHeaderFooter: true,
      headerTemplate: ' ',
      footerTemplate: `
      <div style="margin-left:15mm;margin-right:15mm;width:100%;font-size:12px;text-align:center;color:rgb(187, 187, 187);">
      <span style="float: left;">Sales Inspection Report and Business Appraisal for NAME OF BUSINEES HERE</span>
      <span style="float: right;">Page: <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>`
      // scale: 0.8
    }

    const content = await readFile(templatePath, 'utf8')
    const handlebarsCompiled = handlebars.compile(content)
    const template = handlebarsCompiled(context)
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    // const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.emulateMedia('screen')
    await page.goto(`data:text/html,${template}`)
    await page.pdf(PDF_OPTIONS)
    await browser.close()

    return res.download(destPdfGenerated, err => {
      // fs.unlink(destPdfGenerated)
      if (err) {
        throw new APIError({
          message: 'Error on download pdf',
          status: 500,
          isPublic: true
        })
      }
    })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
