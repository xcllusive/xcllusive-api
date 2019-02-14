import util from 'util'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import puppeteer from 'puppeteer'
import moment from 'moment'
import models from '../../config/sequelize'
import APIError from '../utils/APIError'
import numeral from 'numeral'
import {
  ebitdaAvg,
  ebitdaLastYear,
  pebitdaLastYear,
  avgProfit
} from '../utils/sharedFunctionsObject'
// import mailer from '../modules/mailer'

export const list = async (req, res, next) => {
  const {
    businessId
  } = req.query

  const limit = req.query.limit
  const offset = req.skip
  const where = businessId ? {
    business_id: businessId
  } : null

  try {
    const response = await models.Appraisal.findAndCountAll({
      where,
      limit,
      offset
    })
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
  const {
    appraisalId
  } = req.params

  try {
    const response = await models.Appraisal.findOne({
      where: {
        id: appraisalId
      },
      include: [{
          model: models.Business
        },
        {
          model: models.User,
          as: 'CreatedBy'
        },
        {
          model: models.User,
          as: 'ModifiedBy'
        }
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
  newAppraisal.dateTimeCreated = moment().toDate()

  try {
    // Verify exists appraisal to change the stage to appraisal if you do not have any
    const haveAppraisal = await models.Appraisal.findOne({
      where: {
        business_id: newAppraisal.business_id
      }
    })
    if (!haveAppraisal) {
      const updateBusiness = req.body
      updateBusiness.modifiedBy_id = req.user.id
      updateBusiness.stageId = 9
      await models.Business.update(updateBusiness, {
        where: {
          id: newAppraisal.business_id
        }
      })
    }

    const appraisal = await models.Appraisal.create(newAppraisal)

    return res
      .status(200)
      .json({
        data: appraisal,
        message: `Appraisal ${appraisal.id} created`
      })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const {
    appraisalId
  } = req.params
  const updatedValues = req.body

  updatedValues.updatedBy_id = req.user.id

  const appraisal = await models.Appraisal.findOne({
    where: {
      id: appraisalId
    }
  })

  let totalCompleted = 0
  if (appraisal.confirmAbout) totalCompleted = 10
  if (appraisal.confirmBusinessAnalysis) totalCompleted = totalCompleted + 10
  if (appraisal.confirmBusinessDetail) totalCompleted = totalCompleted + 10
  if (appraisal.confirmComparableData) totalCompleted = totalCompleted + 10
  if (appraisal.confirmCustomersSuppliers) totalCompleted = totalCompleted + 10
  if (appraisal.confirmFinancialAnalysis) totalCompleted = totalCompleted + 10
  if (appraisal.confirmNotesAndAssumptions) totalCompleted = totalCompleted + 10
  if (appraisal.confirmOwnershipFinalNotes) totalCompleted = totalCompleted + 10
  if (appraisal.confirmPremisesEnployees) totalCompleted = totalCompleted + 10
  if (appraisal.confirmPricing) totalCompleted = totalCompleted + 10

  updatedValues.completed = totalCompleted

  try {
    await models.Appraisal.update(updatedValues, {
      where: {
        id: appraisalId
      }
    })
    return res.status(200).json({
      message: `Appraisal ${appraisalId} updated`
    })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const {
    appraisalId
  } = req.params

  try {
    await models.Appraisal.destroy({
      where: {
        id: appraisalId
      }
    })

    return res
      .status(200)
      .json({
        message: `Appraisal ${appraisalId} removed with success`
      })
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
  const {
    appraisalId
  } = req.params

  const {
    draft
  } = req.body

  const templatePath = path.resolve(
    'src',
    'api',
    'resources',
    'pdf',
    'templates',
    'appraisal',
    draft ? 'appraisalDraft.html' : 'appraisal.html'
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
      where: {
        id: appraisalId
      },
      include: [{
        model: models.Business,
        as: 'Business'
      }]
    })

    if (!appraisal) {
      throw new APIError({
        message: 'Appraisal not found',
        status: 404,
        isPublic: true
      })
    }

    const businessType = await models.BusinessType.findOne({
      where: {
        id: appraisal.Business.typeId
      }
    })

    const businessSoldselectedListOnlyId = JSON.parse(
      appraisal.comparableDataSelectedList
    )

    const comparableDataSelectedList = await models.BusinessSold.findAll({
      where: {
        id: Array.from(businessSoldselectedListOnlyId)
      }
    })

    const variables = {
      dateTimeCreated: moment().format('DD/MM/YYYY'),
      currentYear: moment().get('year'),
      businessName: appraisal.Business.businessName,
      businessABN: appraisal.Business.businessABN,
      businessAddress1: appraisal.Business.address1,
      businessSuburb: appraisal.Business.suburb,
      businessState: appraisal.Business.state,
      businessPostCode: appraisal.Business.postCode,
      businessFirstNameV: appraisal.Business.firstNameV,
      businessLastNameV: appraisal.Business.lastNameV,
      businessIndustry: appraisal.Business.industry,
      businessType: businessType.label,
      clientDatabaseAvailable: appraisal.clientDatabaseAvailable ? 'Yes' : 'No',
      client10TO: appraisal.client10TO ? 'Yes' : 'No',
      financialInformationArray: []
    }

    const context = Object.assign(appraisal.get({
      plain: true
    }), variables)

    // start prepared by
    const loggedUser = await models.User.findOne({
      where: {
        id: req.user.id
      }
    })
    var regionOfficeUser = ''
    if (loggedUser.dataRegion === 'Sydney Office') regionOfficeUser = 'G14, 1-15 Barr Street, Balmain NSW 2041'
    if (loggedUser.dataRegion === 'Melbourne Office') regionOfficeUser = 'Suite 2, 276 High Street, Kew, VIC 3101'
    if (loggedUser.dataRegion === 'Queensland Office') regionOfficeUser = 'Spring Hill, Qld 4004'
    if (loggedUser.dataRegion === 'Gosford Office') regionOfficeUser = 'Pegasus Business Centre, Suite 2a/3 Racecourse Rd, Gosford NSW 2250'
    if (loggedUser.dataRegion === 'Cowra Office') regionOfficeUser = 'PO Box 182, Cowra, NSW 2794'
    if (loggedUser.dataRegion === 'Camberra Office') regionOfficeUser = 'Cooma, NSW 2630'
    if (loggedUser.dataRegion === 'Adelaide Office') regionOfficeUser = 'Westpac House Level 30, 91 King William Street, Adelaide SA 5000'

    context.preparedBy = `Xcllusive Business Sales </br>${regionOfficeUser} </br>(02) 9817 3331 </br>www.xcllusive.com.au </br>Lic: 172 3536 </br>ABN: 99 144 870 762`
    // ends prepared by

    /* profits table */
    if (appraisal.year6 > 0) {
      context.lastYearProfit = numeral(appraisal.calcOperatingProfit6).format('$0,0')
      context.lastYearProfitAfterWages = numeral(appraisal.calcOperatingProfit6 - appraisal.totalAnnualWages).format('$0,0')
    } else if (appraisal.year5 > 0) {
      context.lastYearProfit = numeral(appraisal.calcOperatingProfit5).format('$0,0')
      context.lastYearProfitAfterWages = numeral(appraisal.calcOperatingProfit5 - appraisal.totalAnnualWages).format('$0,0')
    } else if (appraisal.year4 > 0) {
      context.lastYearProfit = numeral(appraisal.calcOperatingProfit4).format('$0,0')
      context.lastYearProfitAfterWages = numeral(appraisal.calcOperatingProfit4 - appraisal.totalAnnualWages).format('$0,0')
    } else if (appraisal.year3 > 0) {
      context.lastYearProfit = numeral(appraisal.calcOperatingProfit3).format('$0,0')
      context.lastYearProfitAfterWages = numeral(appraisal.calcOperatingProfit3 - appraisal.totalAnnualWages).format('$0,0')
    } else if (appraisal.year2 > 0) {
      context.lastYearProfit = numeral(appraisal.calcOperatingProfit2).format('$0,0')
      context.lastYearProfitAfterWages = numeral(appraisal.calcOperatingProfit2 - appraisal.totalAnnualWages).format('$0,0')
    } else if (appraisal.year1 > 0) {
      context.lastYearProfit = numeral(appraisal.calcOperatingProfit1).format('$0,0')
      context.lastYearProfitAfterWages = numeral(appraisal.calcOperatingProfit1 - appraisal.totalAnnualWages).format('$0,0')
    }
    context.avgProfits = numeral(avgProfit(appraisal)).format('$0,0')
    context.avgProfitsAfterWages = numeral(avgProfit(appraisal) - appraisal.totalAnnualWages).format('$0,0')
    context.currentStockLevel = numeral(appraisal.currentStockLevel).format('$0,0')
    context.stockNecessary = numeral(appraisal.stockNecessary).format('$0,0')
    context.physicalAssetValue = numeral(appraisal.physicalAssetValue).format('$0,0')
    /* end profits table */

    // start owners position table
    context.owner1Position = appraisal.owner1Position
    context.owner2Position = appraisal.owner2Position
    context.owner3Position = appraisal.owner3Position
    context.owner4Position = appraisal.owner4Position
    context.owner5Position = appraisal.owner5Position
    context.owner6Position = appraisal.owner6Position
    context.owner7Position = appraisal.owner7Position

    context.owner1HoursPWeek = appraisal.owner1HoursPWeek
    context.owner2HoursPWeek = appraisal.owner2HoursPWeek
    context.owner3HoursPWeek = appraisal.owner3HoursPWeek
    context.owner4HoursPWeek = appraisal.owner4HoursPWeek
    context.owner5HoursPWeek = appraisal.owner5HoursPWeek
    context.owner6HoursPWeek = appraisal.owner6HoursPWeek
    context.owner7HoursPWeek = appraisal.owner7HoursPWeek

    context.owner1AnnualWage = numeral(appraisal.owner1AnnualWage).format('$0,0')
    context.owner2AnnualWage = numeral(appraisal.owner2AnnualWage).format('$0,0')
    context.owner3AnnualWage = numeral(appraisal.owner3AnnualWage).format('$0,0')
    context.owner4AnnualWage = numeral(appraisal.owner4AnnualWage).format('$0,0')
    context.owner5AnnualWage = numeral(appraisal.owner5AnnualWage).format('$0,0')
    context.owner6AnnualWage = numeral(appraisal.owner6AnnualWage).format('$0,0')
    context.owner7AnnualWage = numeral(appraisal.owner7AnnualWage).format('$0,0')

    context.totalAnnualWages = numeral(appraisal.totalAnnualWages).format('$0,0')
    // end owners position table

    // start Financial Information Table
    context.sales1 = numeral(appraisal.sales1).format('$0,0')
    context.sales2 = numeral(appraisal.sales2).format('$0,0')
    context.sales3 = numeral(appraisal.sales3).format('$0,0')
    context.sales4 = numeral(appraisal.sales4).format('$0,0')
    context.sales5 = numeral(appraisal.sales5).format('$0,0')
    context.sales7 = numeral(appraisal.sales7).format('$0,0')

    context.cogs1 = numeral(appraisal.cogs1).format('$0,0')
    context.cogs2 = numeral(appraisal.cogs2).format('$0,0')
    context.cogs3 = numeral(appraisal.cogs3).format('$0,0')
    context.cogs4 = numeral(appraisal.cogs4).format('$0,0')
    context.cogs5 = numeral(appraisal.cogs5).format('$0,0')
    context.cogs7 = numeral(appraisal.cogs7).format('$0,0')

    context.calcGrossMargin1 = numeral(appraisal.calcGrossMargin1).format('$0,0')
    context.calcGrossMargin2 = numeral(appraisal.calcGrossMargin2).format('$0,0')
    context.calcGrossMargin3 = numeral(appraisal.calcGrossMargin3).format('$0,0')
    context.calcGrossMargin4 = numeral(appraisal.calcGrossMargin4).format('$0,0')
    context.calcGrossMargin5 = numeral(appraisal.calcGrossMargin5).format('$0,0')
    context.calcGrossMargin6 = numeral(appraisal.calcGrossMargin6).format('$0,0')

    context.calcGrossMarginPerc1 = `${appraisal.calcGrossMarginPerc1}%`
    context.calcGrossMarginPerc2 = `${appraisal.calcGrossMarginPerc2}%`
    context.calcGrossMarginPerc3 = `${appraisal.calcGrossMarginPerc3}%`
    context.calcGrossMarginPerc4 = `${appraisal.calcGrossMarginPerc4}%`
    context.calcGrossMarginPerc5 = `${appraisal.calcGrossMarginPerc5}%`
    context.calcGrossMarginPerc6 = `${appraisal.calcGrossMarginPerc6}%`

    context.otherIncome1 = numeral(appraisal.otherIncome1).format('$0,0')
    context.otherIncome2 = numeral(appraisal.otherIncome2).format('$0,0')
    context.otherIncome3 = numeral(appraisal.otherIncome3).format('$0,0')
    context.otherIncome4 = numeral(appraisal.otherIncome4).format('$0,0')
    context.otherIncome5 = numeral(appraisal.otherIncome5).format('$0,0')
    context.otherIncome7 = numeral(appraisal.otherIncome7).format('$0,0')

    context.calcGrossProfit1 = numeral(appraisal.calcGrossProfit1).format('$0,0')
    context.calcGrossProfit2 = numeral(appraisal.calcGrossProfit2).format('$0,0')
    context.calcGrossProfit3 = numeral(appraisal.calcGrossProfit3).format('$0,0')
    context.calcGrossProfit4 = numeral(appraisal.calcGrossProfit4).format('$0,0')
    context.calcGrossProfit5 = numeral(appraisal.calcGrossProfit5).format('$0,0')
    context.calcGrossProfit7 = numeral(appraisal.calcGrossProfit7).format('$0,0')

    context.expenses1 = numeral(appraisal.expenses1).format('$0,0')
    context.expenses2 = numeral(appraisal.expenses2).format('$0,0')
    context.expenses3 = numeral(appraisal.expenses3).format('$0,0')
    context.expenses4 = numeral(appraisal.expenses4).format('$0,0')
    context.expenses5 = numeral(appraisal.expenses5).format('$0,0')
    context.expenses7 = numeral(appraisal.expenses7).format('$0,0')

    context.calcOperatingProfit1 = numeral(appraisal.calcOperatingProfit1).format('$0,0')
    context.calcOperatingProfit2 = numeral(appraisal.calcOperatingProfit2).format('$0,0')
    context.calcOperatingProfit3 = numeral(appraisal.calcOperatingProfit3).format('$0,0')
    context.calcOperatingProfit4 = numeral(appraisal.calcOperatingProfit4).format('$0,0')
    context.calcOperatingProfit5 = numeral(appraisal.calcOperatingProfit5).format('$0,0')
    context.calcOperatingProfit6 = numeral(appraisal.calcOperatingProfit6).format('$0,0')

    context.calcOperatingProfitPerc1 = `${appraisal.calcOperatingProfitPerc1}%`
    context.calcOperatingProfitPerc2 = `${appraisal.calcOperatingProfitPerc2}%`
    context.calcOperatingProfitPerc3 = `${appraisal.calcOperatingProfitPerc3}%`
    context.calcOperatingProfitPerc4 = `${appraisal.calcOperatingProfitPerc4}%`
    context.calcOperatingProfitPerc5 = `${appraisal.calcOperatingProfitPerc5}%`
    context.calcOperatingProfitPerc6 = `${appraisal.calcOperatingProfitPerc6}%`
    // end Financial Information Table

    // start salesGpPebitda chart
    context.year1ShowHide = appraisal.year1
    context.year2ShowHide = appraisal.year2
    context.year3ShowHide = appraisal.year3
    context.year4ShowHide = appraisal.year4
    context.year5ShowHide = appraisal.year5
    context.year6ShowHide = appraisal.year6

    context.sales1GpPebitda = appraisal.sales1
    context.sales2GpPebitda = appraisal.sales2
    context.sales3GpPebitda = appraisal.sales3
    context.sales4GpPebitda = appraisal.sales4
    context.sales5GpPebitda = appraisal.sales5
    context.sales7GpPebitda = appraisal.sales7

    context.calcGrossProfit1SalesPebitda = appraisal.calcGrossProfit1
    context.calcGrossProfit2SalesPebitda = appraisal.calcGrossProfit2
    context.calcGrossProfit3SalesPebitda = appraisal.calcGrossProfit3
    context.calcGrossProfit4SalesPebitda = appraisal.calcGrossProfit4
    context.calcGrossProfit5SalesPebitda = appraisal.calcGrossProfit5
    context.calcGrossProfit7SalesPebitda = appraisal.calcGrossProfit7

    context.calcOperatingProfit1SalesPebitda = appraisal.calcOperatingProfit1
    context.calcOperatingProfit2SalesPebitda = appraisal.calcOperatingProfit2
    context.calcOperatingProfit3SalesPebitda = appraisal.calcOperatingProfit3
    context.calcOperatingProfit4SalesPebitda = appraisal.calcOperatingProfit4
    context.calcOperatingProfit5SalesPebitda = appraisal.calcOperatingProfit5
    context.calcOperatingProfit6SalesPebitda = appraisal.calcOperatingProfit6

    context.calcGrossMarginPerc1GmProfit = appraisal.calcGrossMarginPerc1
    context.calcGrossMarginPerc2GmProfit = appraisal.calcGrossMarginPerc2
    context.calcGrossMarginPerc3GmProfit = appraisal.calcGrossMarginPerc3
    context.calcGrossMarginPerc4GmProfit = appraisal.calcGrossMarginPerc4
    context.calcGrossMarginPerc5GmProfit = appraisal.calcGrossMarginPerc5
    context.calcGrossMarginPerc6GmProfit = appraisal.calcGrossMarginPerc6

    context.calcOperatingProfitPerc1GmProfit = appraisal.calcOperatingProfitPerc1
    context.calcOperatingProfitPerc2GmProfit = appraisal.calcOperatingProfitPerc2
    context.calcOperatingProfitPerc3GmProfit = appraisal.calcOperatingProfitPerc3
    context.calcOperatingProfitPerc4GmProfit = appraisal.calcOperatingProfitPerc4
    context.calcOperatingProfitPerc5GmProfit = appraisal.calcOperatingProfitPerc5
    context.calcOperatingProfitPerc6GmProfit = appraisal.calcOperatingProfitPerc6

    /* verifying if there's any Year unmarked to show in the pdf  */
    if (!appraisal.renderPdfYear1) {
      context.year1ShowHide = ''
      context.sales1GpPebitda = '-'
      context.calcGrossProfit1SalesPebitda = '-'
      context.calcOperatingProfit1SalesPebitda = '-'
      context.calcGrossMarginPerc1GmProfit = '-'
      context.calcOperatingProfitPerc1GmProfit = '-'
    }
    if (!appraisal.renderPdfYear2) {
      context.year2ShowHide = ''
      context.sales2GpPebitda = '-'
      context.calcGrossProfit2SalesPebitda = '-'
      context.calcOperatingProfit2SalesPebitda = '-'
      context.calcGrossMarginPerc2GmProfit = '-'
      context.calcOperatingProfitPerc2GmProfit = '-'
    }
    if (!appraisal.renderPdfYear3) {
      context.year3ShowHide = ''
      context.sales3GpPebitda = '-'
      context.calcGrossProfit3SalesPebitda = '-'
      context.calcOperatingProfit3SalesPebitda = '-'
      context.calcGrossMarginPerc3GmProfit = '-'
      context.calcOperatingProfitPerc3GmProfit = '-'
    }
    if (!appraisal.renderPdfYear4) {
      context.year4ShowHide = ''
      context.sales4GpPebitda = '-'
      context.calcGrossProfit4SalesPebitda = '-'
      context.calcOperatingProfit4SalesPebitda = '-'
      context.calcGrossMarginPerc4GmProfit = '-'
      context.calcOperatingProfitPerc4GmProfit = '-'
    }
    if (!appraisal.renderPdfYear5) {
      context.year5ShowHide = ''
      context.sales5GpPebitda = '-'
      context.calcGrossProfit5SalesPebitda = '-'
      context.calcOperatingProfit5SalesPebitda = '-'
      context.calcGrossMarginPerc5GmProfit = '-'
      context.calcOperatingProfitPerc5GmProfit = '-'
    }
    if (!appraisal.renderPdfYear6) {
      context.year6ShowHide = ''
      context.sales7GpPebitda = '-'
      context.calcGrossProfit7SalesPebitda = '-'
      context.calcOperatingProfit6SalesPebitda = '-'
      context.calcGrossMarginPerc6GmProfit = '-'
      context.calcOperatingProfitPerc6GmProfit = '-'
    }
    /* end verifying if there's any Year unmarked to show in the pdf  */

    // end salesGpPebitda and gmProfit chart

    // start pricing chart
    let calcPricingMethod = numeral(appraisal.formulaValuePricingMethod)
    context.avgMultiplierLabel = numeral(calcPricingMethod.value() * appraisal.avgMultiplier).format('$0,0')
    context.riskPremiumLabel = numeral(calcPricingMethod.value() * appraisal.riskPremium).format('$0,0')
    context.marketPremiumLabel = numeral(calcPricingMethod.value() * appraisal.marketPremium).format('$0,0')
    context.askingPriceLabel = numeral(calcPricingMethod.value() * appraisal.askingPrice).format('$0,0')
    // end pricing chat

    // start Labels for formula pricing
    context.formulaValuePricingMethod = appraisal.formulaValuePricingMethod
    context.labelComparableMultiplier = 'Comparable Multiplier'
    context.fCalc1 = '*'
    context.fCalc2 = '='
    context.labelAskingPriceMultipler = 'Asking Price Multiplier'
    // end Labels for formula pricing

    /* table 10 last businesses */
    let totalMultiplier = 0

    context.last10BusinessArray = comparableDataSelectedList.map((item) => {
      let multiplier = 0
      let formulaComparableMultiplier = 0
      let formulaValuePricingMethod = ''
      let labelComparableMultiplier = ''
      let fCalc1 = ''
      let fCalc2 = ''
      let labelAskingPriceMultipler = ''
      let askingPrice = ''
      let avg = 0
      let lastYear = 0

      if (appraisal.pricingMethod === 1) {
        context.multiplierLabel = 'Multiplier EBITDA Last Year'
        multiplier = numeral(item.soldPrice / ebitdaLastYear(item)).format('0,0.[99]')
        context.formulaComparableMultiplier = appraisal.sumMEbitdaLastYear
      }
      if (appraisal.pricingMethod === 2) {
        context.multiplierLabel = 'Multiplier EBITDA Avg'
        multiplier = numeral(item.soldPrice / ebitdaAvg(item)).format('0,0.[99]')
        context.formulaComparableMultiplier = appraisal.sumMEbitdaAvg
      }
      if (appraisal.pricingMethod === 3) {
        context.multiplierLabel = 'Multiplier PEBITDA Last Year'
        multiplier = item.soldPrice / pebitdaLastYear(item)
        context.formulaComparableMultiplier = appraisal.sumMPebitdaLastYear
      }
      if (appraisal.pricingMethod === 4) {
        context.multiplierLabel = 'Multiplier PEBITDA Avg'
        multiplier = numeral(
          item.soldPrice / (ebitdaAvg(item) + item.agreedWageForMainOwner)
        ).format('0,0.[99]')
        context.formulaComparableMultiplier = appraisal.sumMPebitdaAvg
      }
      if (appraisal.pricingMethod === 5) {
        context.multiplierLabel = 'Multiplier EBITDA Last Year With Stock'
        multiplier = numeral(
          (item.soldPrice + item.stockValue) / ebitdaLastYear(item)
        ).format('0,0.[99]')
        context.formulaComparableMultiplier = appraisal.sumMEbitdaLastYearWithStock
      }
      if (appraisal.pricingMethod === 6) {
        context.multiplierLabel = 'Multiplier EBITDA Avg With Stock'
        multiplier = numeral((item.soldPrice + item.stockValue) / ebitdaAvg(item)).format(
          '0,0.[99]'
        )
        context.formulaComparableMultiplier = appraisal.sumMEbitdaAvgWithStock
      }
      if (appraisal.pricingMethod === 7) {
        context.multiplierLabel = 'Multiplier PEBITDA Last Year With Stock'
        multiplier = numeral(
          item.soldPrice / (pebitdaLastYear(item) + item.stockValue)
        ).format('0,0.[99]')
        context.formulaComparableMultiplier = appraisal.sumMPebitdaLastYearWithStock
      }
      if (appraisal.pricingMethod === 8) {
        context.multiplierLabel = 'Multiplier PEBITDA Avg With Stock'
        multiplier = numeral(
          item.soldPrice /
          (ebitdaAvg(item) + item.agreedWageForMainOwner + item.stockValue)
        ).format('0,0.[99]')
        context.formulaComparableMultiplier = appraisal.sumMPebitdaAvgWithStock
      }
      if (appraisal.pricingMethod === 9) {
        context.multiplierLabel = 'T/O Multiplier'
        multiplier = numeral(item.soldPrice / item.latestFullYearTotalRevenue).format(
          '0,0.[99]'
        )
        context.formulaComparableMultiplier = appraisal.sumMTO
      }
      if (appraisal.pricingMethod === 10) {
        context.multiplierLabel = ''
        multiplier = ''
        formulaValuePricingMethod = ''
        labelComparableMultiplier = ''
        fCalc1 = ''
        fCalc2 = ''
        labelAskingPriceMultipler = ''
        askingPrice = ''
      }

      /* EBITDA */
      if (
        appraisal.pricingMethod === 1 ||
        appraisal.pricingMethod === 2 ||
        appraisal.pricingMethod === 5 ||
        appraisal.pricingMethod === 6
      ) {
        context.avgLabel = 'EBITDA Avg'
        context.lastYearLabel = 'EBITDA Last Year'
        avg = numeral(ebitdaAvg(item)).format('$0,0')
        lastYear = numeral(ebitdaLastYear(item)).format('$0,0')
      }
      /* PEBITDA */
      if (
        appraisal.pricingMethod === 3 ||
        appraisal.pricingMethod === 4 ||
        appraisal.pricingMethod === 7 ||
        appraisal.pricingMethod === 8 ||
        appraisal.pricingMethod === 9 ||
        appraisal.pricingMethod === 10
      ) {
        context.avgLabel = 'PEBITDA Avg'
        context.lastYearLabel = 'PEBITDA Last Year'
        avg = numeral(
          ebitdaAvg(item) + item.agreedWageForMainOwner
        ).format('$0,0')
        lastYear = numeral(pebitdaLastYear(item)).format('$0,0')
      }

      totalMultiplier = totalMultiplier + multiplier

      return {
        businessType: item.businessType,
        turnOver: numeral(item.latestFullYearTotalRevenue).format('$0,0'),
        trend: item.trend,
        stockValue: numeral(item.stockValue).format('$0,0'),
        assetsValue: numeral(item.assetValue).format('$0,0'),
        priceIncStock: numeral(
          item.soldPrice + item.stockValue
        ).format('$0,0'),
        multiplier: numeral(multiplier).format('0,0.[99]'),
        specialNotes: item.specialNotes,
        termsOfDeal: item.termsOfDeal,
        formulaComparableMultiplier,
        formulaValuePricingMethod,
        labelComparableMultiplier,
        fCalc1,
        fCalc2,
        labelAskingPriceMultipler,
        askingPrice,
        avg,
        lastYear
      }
    })

    /* end table 10 last businesses */
    context.avgMultiplier = numeral(totalMultiplier / comparableDataSelectedList.length).format('0,0.[99]')

    // start gauges
    context.valueSliderBR = appraisal.valueSliderBR
    context.valueSliderMarket = appraisal.valueSliderMarket

    const descriptionBusinessRisk = await models.AppraisalRegister.findOne({
      where: {
        points: appraisal.valueSliderBR,
        type: 'descriptionBusinessRisk'
      }
    })
    const descriptionMarket = await models.AppraisalRegister.findOne({
      where: {
        points: appraisal.valueSliderMarket,
        type: 'descriptionMarket'
      }
    })
    context.descriptionGaugeBusinessRisk = descriptionBusinessRisk.label
    context.descriptionGaugeMarket = descriptionMarket.label
    // end gauges

    // start table financial information
    for (let i = 1; i < 31; i++) {
      if (appraisal[`aaRow${i}`] || appraisal[`aaRow${i}`] !== '') {
        context.financialInformationArray.push({
          aaRow: appraisal[`aaRow${i}`],
          aaRowYear1: appraisal[`aaRow${i}Year1`],
          aaRowYear2: appraisal[`aaRow${i}Year2`],
          aaRowYear3: appraisal[`aaRow${i}Year3`],
          aaRowYear4: appraisal[`aaRow${i}Year4`],
          aaRowYear5: appraisal[`aaRow${i}Year5`],
          aaRowYear7: appraisal[`aaRow${i}Year7`]
        })
      }
    }
    // end table financial information

    // starts pricing chart
    context.smallestMultiplier = appraisal.smallestMultiplier
    context.avgMultiplier = appraisal.avgMultiplier
    context.riskPremium = appraisal.riskPremium
    context.marketPremium = appraisal.marketPremium
    context.askingPrice = appraisal.askingPrice
    context.lessThan5PercChanceOfSelling = appraisal.lessThan5PercChanceOfSelling
    // end pricig chart

    if (appraisal.inclStock) {
      context.plusIncl = 'Incl. Stock of'
    } else {
      context.plusIncl = 'Plus Stock of'
    }

    // start notes and assumptions
    const arrayNotesAssumptions = []
    if (appraisal.notesAndAssumptions1YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions1)
    }
    if (appraisal.notesAndAssumptions2YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions2)
    }
    if (appraisal.notesAndAssumptions3YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions3)
    }
    if (appraisal.notesAndAssumptions4YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions4)
    }
    if (appraisal.notesAndAssumptions5YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions5)
    }
    if (appraisal.notesAndAssumptions6YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions6)
    }
    if (appraisal.notesAndAssumptions7YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions7)
    }
    if (appraisal.notesAndAssumptions8YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions8)
    }
    if (appraisal.notesAndAssumptions9YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions9)
    }
    if (appraisal.notesAndAssumptions10YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions10)
    }
    if (appraisal.notesAndAssumptions11YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions11)
    }
    if (appraisal.notesAndAssumptions12YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions12)
    }
    if (appraisal.notesAndAssumptions13YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions13)
    }
    if (appraisal.notesAndAssumptions14YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions14)
    }
    if (appraisal.notesAndAssumptions15YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions16)
    }
    if (appraisal.notesAndAssumptions17YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions17)
    }
    if (appraisal.notesAndAssumptions18YesNo) {
      arrayNotesAssumptions.push(appraisal.notesAndAssumptions18)
    }

    context.arrayNotesAssumptions = arrayNotesAssumptions.join(',').replace(/,/g, '</br></br></br>').split()
    // finish notes and assumptions

    handlebars.registerHelper('each', (context, options) => {
      var ret = ''
      for (var i = 0, j = context.length; i < j; i++) {
        ret = ret + options.fn(context[i])
      }
      return ret
    })

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
              <span style="float: left;">Sales Inspection Report and Business Appraisal for ${
  appraisal.Business.businessName
}</span>
              <span style="float: right;">Page: <span class="pageNumber"></span> of <span class="totalPages"></span></span>
              </div>`
    }

    const content = await readFile(templatePath, 'utf8')
    const handlebarsCompiled = handlebars.compile(content)
    const template = handlebarsCompiled(context)

    /* test pdf on chromium  */
    // const browser = await puppeteer.launch({
    //   headless: false
    // })

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.emulateMedia('screen')
    await page.setContent(template)
    await page.goto(`data:text/html,${template}`, {
      waitUntil: 'networkidle0'
    })
    await page.pdf(PDF_OPTIONS)
    await browser.close()

    return res.download(destPdfGenerated, err => {
      fs.unlink(destPdfGenerated, err => {
        if (err) {
          throw new APIError({
            message: 'Error on download pdf',
            status: 500,
            isPublic: true
          })
        }
      })
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
