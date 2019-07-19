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
import {
  upGreenArrow,
  downRedArrow,
  steadyYellowArrow
} from '../constants/icons'
// import mailer from '../modules/mailer'

export const list = async (req, res, next) => {
  const {
    businessId
  } = req.query

  const limit = req.query.limit
  const offset = req.skip
  const where = businessId ? {
    business_id: businessId
  }
    : null

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
      }, {
        model: models.User,
        as: 'CreatedBy'
      }, {
        model: models.User,
        as: 'ModifiedBy'
      }]
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
  newAppraisal.comparableDataSelectedList = '[]'

  try {
    // Verify exists appraisal to change the stage to appraisal if you do not have any
    const haveAppraisal = await models.Appraisal.findOne({
      raw: true,
      where: {
        business_id: newAppraisal.business_id
      }
    })
    if (!haveAppraisal) {
      const updateBusiness = {}
      updateBusiness.comparableDataSelectedList = '[]'
      updateBusiness.business_id = req.body.business_id
      updateBusiness.modifiedBy_id = req.user.id
      updateBusiness.stageId = 9
      await models.Business.update(updateBusiness, {
        where: {
          id: newAppraisal.business_id
        }
      })
    }

    const appraisal = await models.Appraisal.create(newAppraisal)

    return res.status(200).json({
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
  if (updatedValues.confirmAbout || (appraisal.confirmAbout && updatedValues.confirmAbout === undefined)) totalCompleted = 10
  if (updatedValues.confirmBusinessAnalysis || (appraisal.confirmBusinessAnalysis && updatedValues.confirmBusinessAnalysis === undefined)) totalCompleted = totalCompleted + 10
  if (updatedValues.confirmBusinessDetail || (appraisal.confirmBusinessDetail && updatedValues.confirmBusinessDetail === undefined)) totalCompleted = totalCompleted + 10
  if (updatedValues.confirmComparableData || (appraisal.confirmComparableData && updatedValues.confirmComparableData === undefined)) totalCompleted = totalCompleted + 10
  if (updatedValues.confirmCustomersSuppliers || (appraisal.confirmCustomersSuppliers && updatedValues.confirmCustomersSuppliers === undefined)) totalCompleted = totalCompleted + 10
  if (updatedValues.confirmFinancialAnalysis || (appraisal.confirmFinancialAnalysis && updatedValues.confirmFinancialAnalysis === undefined)) totalCompleted = totalCompleted + 10
  if (updatedValues.confirmNotesAndAssumptions || (appraisal.confirmNotesAndAssumptions && updatedValues.confirmNotesAndAssumptions === undefined)) totalCompleted = totalCompleted + 10
  if (updatedValues.confirmOwnershipFinalNotes || (appraisal.confirmOwnershipFinalNotes && updatedValues.confirmOwnershipFinalNotes === undefined)) totalCompleted = totalCompleted + 10
  if (updatedValues.confirmPremisesEnployees || (appraisal.confirmPremisesEnployees && updatedValues.confirmPremisesEnployees === undefined)) totalCompleted = totalCompleted + 10
  if (updatedValues.confirmPricing || (appraisal.confirmPricing && updatedValues.confirmPricing === undefined)) totalCompleted = totalCompleted + 10

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

    return res.status(200).json({
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
  const _replaceDollarAndComma = replace => {
    replace = replace.replace('$', ',')
    replace = replace.replace(/,/g, '')
    return replace
  }

  const _calculatedPriceBetween = context => {
    return parseInt(_replaceDollarAndComma(context.marketPremiumLabel))
  }

  const {
    appraisalId
  } = req.params

  const {
    draft
  } = req.body

  const templatePath = path.resolve('src', 'api', 'resources', 'pdf', 'templates', 'appraisal', draft ? 'appraisalDraft.html' : 'appraisal.html')

  const destPdfGenerated = path.resolve('src', 'api', 'resources', 'pdf', 'generated', 'appraisal', `${Date.now()}.pdf`)

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

    const businessSoldselectedListOnlyId = JSON.parse(appraisal.comparableDataSelectedList)

    const comparableDataSelectedList = await models.BusinessSold.findAll({
      where: {
        id: Array.from(businessSoldselectedListOnlyId)
      },
      include: [{
        attributes: ['label'],
        model: models.BusinessType,
        as: 'BusinessType',
        where: {
          id: {
            $col: 'BusinessSold.businessType'
          }
        }
      }]
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

    const context = Object.assign(
      appraisal.get({
        plain: true
      }),
      variables
    )

    // start prepared by
    const loggedUser = await models.User.findOne({
      raw: true,
      where: {
        id: req.user.id
      },
      include: [{
        model: models.OfficeRegister,
        as: 'office',
        where: {
          id: {
            $col: 'User.officeId'
          }
        }
      }]
    })

    context.preparedBy = `Xcllusive Business Sales </br>${loggedUser['office.address']} </br>${loggedUser['office.phoneNumber']} </br>www.xcllusive.com.au </br>Lic: ${loggedUser['office.license']} </br>ABN: ${loggedUser['office.abn']}`
    // ends prepared by

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
    context.calcAnnualised1 = numeral(appraisal.calcAnnualised1).format('$0,0')

    context.cogs1 = numeral(appraisal.cogs1).format('$0,0')
    context.cogs2 = numeral(appraisal.cogs2).format('$0,0')
    context.cogs3 = numeral(appraisal.cogs3).format('$0,0')
    context.cogs4 = numeral(appraisal.cogs4).format('$0,0')
    context.cogs5 = numeral(appraisal.cogs5).format('$0,0')
    context.calcAnnualised2 = numeral(appraisal.calcAnnualised2).format('$0,0')

    context.calcGrossMargin1 = numeral(appraisal.calcGrossMargin1).format('$0,0')
    context.calcGrossMargin2 = numeral(appraisal.calcGrossMargin2).format('$0,0')
    context.calcGrossMargin3 = numeral(appraisal.calcGrossMargin3).format('$0,0')
    context.calcGrossMargin4 = numeral(appraisal.calcGrossMargin4).format('$0,0')
    context.calcGrossMargin5 = numeral(appraisal.calcGrossMargin5).format('$0,0')
    context.calcGrossMargin6 = numeral(appraisal.calcGrossMargin6).format('$0,0')
    context.calcGrossMargin7 = numeral(appraisal.calcGrossMargin7).format('$0,0')

    context.calcGrossMarginPerc1 = `${Math.round(appraisal.calcGrossMarginPerc1)}%`
    context.calcGrossMarginPerc2 = `${Math.round(appraisal.calcGrossMarginPerc2)}%`
    context.calcGrossMarginPerc3 = `${Math.round(appraisal.calcGrossMarginPerc3)}%`
    context.calcGrossMarginPerc4 = `${Math.round(appraisal.calcGrossMarginPerc4)}%`
    context.calcGrossMarginPerc5 = `${Math.round(appraisal.calcGrossMarginPerc5)}%`
    context.calcGrossMarginPerc6 = `${Math.round(appraisal.calcGrossMarginPerc6)}%`
    context.calcGrossMarginPerc7 = `${Math.round(appraisal.calcGrossMarginPerc7)}%`

    context.otherIncome1 = numeral(appraisal.otherIncome1).format('$0,0')
    context.otherIncome2 = numeral(appraisal.otherIncome2).format('$0,0')
    context.otherIncome3 = numeral(appraisal.otherIncome3).format('$0,0')
    context.otherIncome4 = numeral(appraisal.otherIncome4).format('$0,0')
    context.otherIncome5 = numeral(appraisal.otherIncome5).format('$0,0')
    context.calcAnnualised5 = numeral(appraisal.calcAnnualised5).format('$0,0')

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
    context.calcAnnualised7 = numeral(appraisal.calcAnnualised7).format('$0,0')

    context.calcOperatingProfit1 = numeral(appraisal.calcOperatingProfit1).format('$0,0')
    context.calcOperatingProfit2 = numeral(appraisal.calcOperatingProfit2).format('$0,0')
    context.calcOperatingProfit3 = numeral(appraisal.calcOperatingProfit3).format('$0,0')
    context.calcOperatingProfit4 = numeral(appraisal.calcOperatingProfit4).format('$0,0')
    context.calcOperatingProfit5 = numeral(appraisal.calcOperatingProfit5).format('$0,0')
    context.calcOperatingProfit6 = numeral(appraisal.calcOperatingProfit6).format('$0,0')
    context.calcOperatingProfit7 = numeral(appraisal.calcOperatingProfit7).format('$0,0')

    context.calcOperatingProfitPerc1 = `${Math.round(appraisal.calcOperatingProfitPerc1)}%`
    context.calcOperatingProfitPerc2 = `${Math.round(appraisal.calcOperatingProfitPerc2)}%`
    context.calcOperatingProfitPerc3 = `${Math.round(appraisal.calcOperatingProfitPerc3)}%`
    context.calcOperatingProfitPerc4 = `${Math.round(appraisal.calcOperatingProfitPerc4)}%`
    context.calcOperatingProfitPerc5 = `${Math.round(appraisal.calcOperatingProfitPerc5)}%`
    context.calcOperatingProfitPerc6 = `${Math.round(appraisal.calcOperatingProfitPerc6)}%`
    context.calcOperatingProfitPerc7 = `${Math.round(appraisal.calcOperatingProfitPerc7)}%`
    // end Financial Information Table

    const financialInfoSourceDesc = await models.AppraisalRegister.findOne({
      where: {
        id: appraisal.financialInfoSource,
        type: 'financialInfoSource'
      }
    })
    context.financialInfoSource = financialInfoSourceDesc.label

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

    context.calcGrossMarginPerc1GmProfit = numeral(appraisal.calcGrossMarginPerc1).format('0,0.[0]')
    context.calcGrossMarginPerc2GmProfit = numeral(appraisal.calcGrossMarginPerc2).format('0,0.[0]')
    context.calcGrossMarginPerc3GmProfit = numeral(appraisal.calcGrossMarginPerc3).format('0,0.[0]')
    context.calcGrossMarginPerc4GmProfit = numeral(appraisal.calcGrossMarginPerc4).format('0,0.[0]')
    context.calcGrossMarginPerc5GmProfit = numeral(appraisal.calcGrossMarginPerc5).format('0,0.[0]')
    context.calcGrossMarginPerc6GmProfit = numeral(appraisal.calcGrossMarginPerc6).format('0,0.[0]')

    context.calcOperatingProfitPerc1GmProfit = numeral(appraisal.calcOperatingProfitPerc1).format('0,0.[0]')
    context.calcOperatingProfitPerc2GmProfit = numeral(appraisal.calcOperatingProfitPerc2).format('0,0.[0]')
    context.calcOperatingProfitPerc3GmProfit = numeral(appraisal.calcOperatingProfitPerc3).format('0,0.[0]')
    context.calcOperatingProfitPerc4GmProfit = numeral(appraisal.calcOperatingProfitPerc4).format('0,0.[0]')
    context.calcOperatingProfitPerc5GmProfit = numeral(appraisal.calcOperatingProfitPerc5).format('0,0.[0]')
    context.calcOperatingProfitPerc6GmProfit = numeral(appraisal.calcOperatingProfitPerc6).format('0,0.[0]')

    context.renderPdfYear1 = appraisal.renderPdfYear1
    context.renderPdfYear2 = appraisal.renderPdfYear2
    context.renderPdfYear3 = appraisal.renderPdfYear3
    context.renderPdfYear4 = appraisal.renderPdfYear4
    context.renderPdfYear5 = appraisal.renderPdfYear5
    context.renderPdfYear7 = appraisal.renderPdfYear7

    /* verifying if there's any Year unmark to show in the pdf  */
    // if (!appraisal.renderPdfYear1) {
    //   context.year1ShowHide = ''
    //   context.sales1GpPebitda = '-'
    //   context.calcGrossProfit1SalesPebitda = '-'
    //   context.calcOperatingProfit1SalesPebitda = '-'
    //   context.calcGrossMarginPerc1GmProfit = '-'
    //   context.calcOperatingProfitPerc1GmProfit = '-'
    // }
    // if (!appraisal.renderPdfYear2) {
    //   context.year2ShowHide = ''
    //   context.sales2GpPebitda = '-'
    //   context.calcGrossProfit2SalesPebitda = '-'
    //   context.calcOperatingProfit2SalesPebitda = '-'
    //   context.calcGrossMarginPerc2GmProfit = '-'
    //   context.calcOperatingProfitPerc2GmProfit = '-'
    // }
    // if (!appraisal.renderPdfYear3) {
    //   context.year3ShowHide = ''
    //   context.sales3GpPebitda = '-'
    //   context.calcGrossProfit3SalesPebitda = '-'
    //   context.calcOperatingProfit3SalesPebitda = '-'
    //   context.calcGrossMarginPerc3GmProfit = '-'
    //   context.calcOperatingProfitPerc3GmProfit = '-'
    // }
    // if (!appraisal.renderPdfYear4) {
    //   context.year4ShowHide = ''
    //   context.sales4GpPebitda = '-'
    //   context.calcGrossProfit4SalesPebitda = '-'
    //   context.calcOperatingProfit4SalesPebitda = '-'
    //   context.calcGrossMarginPerc4GmProfit = '-'
    //   context.calcOperatingProfitPerc4GmProfit = '-'
    // }
    // if (!appraisal.renderPdfYear5) {
    //   context.year5ShowHide = ''
    //   context.sales5GpPebitda = '-'
    //   context.calcGrossProfit5SalesPebitda = '-'
    //   context.calcOperatingProfit5SalesPebitda = '-'
    //   context.calcGrossMarginPerc5GmProfit = '-'
    //   context.calcOperatingProfitPerc5GmProfit = '-'
    // }
    // if (!appraisal.renderPdfYear7) {
    //   context.year6ShowHide = ''
    //   context.sales7GpPebitda = '-'
    //   context.calcGrossProfit7SalesPebitda = '-'
    //   context.calcOperatingProfit6SalesPebitda = '-'
    //   context.calcGrossMarginPerc6GmProfit = '-'
    //   context.calcOperatingProfitPerc6GmProfit = '-'
    // }

    /* end verifying if there's any Year unmarked to show in the pdf  */

    // end salesGpPebitda and gmProfit chart

    // start pricing chart
    let calcPricingMethod = numeral(appraisal.formulaValuePricingMethod)
    context.avgMultiplierLabel = numeral(calcPricingMethod.value() * appraisal.avgMultiplier).format('$0,0')
    context.riskPremiumLabel = numeral(parseInt(_replaceDollarAndComma(context.avgMultiplierLabel)) + parseInt(_replaceDollarAndComma(appraisal.formulaRiskPremium))).format('$0,0')
    context.marketPremiumLabel = numeral(parseInt(_replaceDollarAndComma(context.riskPremiumLabel)) + parseInt(_replaceDollarAndComma(appraisal.formulaMarketPremium))).format('$0,0')
    context.askingPriceLabel = context.formulaAskingPrice
    // end pricing chat

    // start Labels for formula pricing
    context.formulaValuePricingMethod = appraisal.formulaValuePricingMethod
    context.labelComparableMultiplier = 'Comparable Multiplier'
    context.fCalc1 = '*'
    context.fCalc2 = '='
    context.labelAskingPriceMultipler = 'Asking Price Multiplier'
    context.labelPriceBasedOnComparable = 'Price Based on Comparable'
    context.topLabel = '771px'
    // end Labels for formula pricing

    /* Line Calc Style */
    context.leftCalcLine = '97px'
    context.widthCalcLine = '607px'

    /* table 10 last businesses */
    let totalMultiplier = 0

    context.last10BusinessArray = comparableDataSelectedList.map(item => {
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
        context.multiplierLabel = 'EBITDA Last Year'
        multiplier = numeral(item.soldPrice / ebitdaLastYear(item)).format('0,0.[99]')
        context.formulaComparableMultiplier = appraisal.sumMEbitdaLastYear
        context.footerComparableData = 'Sales Price / EBITDA Last Year'
      }
      if (appraisal.pricingMethod === 2) {
        context.multiplierLabel = 'EBITDA Avg'
        multiplier = numeral(item.soldPrice / ebitdaAvg(item)).format('0,0.[99]')
        context.formulaComparableMultiplier = appraisal.sumMEbitdaAvg
        context.footerComparableData = 'Sales Price / EBITDA Avg'
      }
      if (appraisal.pricingMethod === 3) {
        context.multiplierLabel = 'PEBITDA Last Year'
        multiplier = item.soldPrice / pebitdaLastYear(item)
        context.formulaComparableMultiplier = appraisal.sumMPebitdaLastYear
        context.footerComparableData = 'Sales Price / PEBITDA Last Year'
      }
      if (appraisal.pricingMethod === 4) {
        context.multiplierLabel = 'PEBITDA Avg'
        multiplier = numeral(
          item.soldPrice / (ebitdaAvg(item) + item.agreedWageForMainOwner)
        ).format('0,0.[99]')
        context.formulaComparableMultiplier = appraisal.sumMPebitdaAvg
        context.footerComparableData = 'Sales Price / PEBITDA Avg'
      }
      if (appraisal.pricingMethod === 5) {
        context.multiplierLabel = 'EBITDA Last Year With Stock'
        multiplier = numeral(
          (item.soldPrice + item.stockValue) / ebitdaLastYear(item)
        ).format('0,0.[99]')
        context.formulaComparableMultiplier = appraisal.sumMEbitdaLastYearWithStock
        context.footerComparableData = 'Sales Price Including Stock / PEBITDA Last Year'
      }
      if (appraisal.pricingMethod === 6) {
        context.multiplierLabel = 'EBITDA Avg With Stock'
        multiplier = numeral((item.soldPrice + item.stockValue) / ebitdaAvg(item)).format(
          '0,0.[99]'
        )
        context.formulaComparableMultiplier = appraisal.sumMEbitdaAvgWithStock
        context.footerComparableData = 'Sales Price Including Stock / EBITDA Avg'
      }
      if (appraisal.pricingMethod === 7) {
        context.multiplierLabel = 'PEBITDA Last Year With Stock'
        multiplier = numeral(
          item.soldPrice / (pebitdaLastYear(item) + item.stockValue)
        ).format('0,0.[99]')
        context.formulaComparableMultiplier = appraisal.sumMPebitdaLastYearWithStock
        context.footerComparableData = 'Sales Price Including Stock / PEBITDA Last Year'
      }
      if (appraisal.pricingMethod === 8) {
        context.multiplierLabel = 'PEBITDA Avg With Stock'
        multiplier = numeral(
          item.soldPrice /
          (ebitdaAvg(item) + item.agreedWageForMainOwner + item.stockValue)
        ).format('0,0.[99]')
        context.formulaComparableMultiplier = appraisal.sumMPebitdaAvgWithStock
        context.footerComparableData = 'Sales Price Including Stock / PEBITDA Avg'
      }
      if (appraisal.pricingMethod === 9) {
        context.multiplierLabel = 'T/O Multiplier'
        multiplier = numeral(item.soldPrice / item.latestFullYearTotalRevenue).format('0,0.[99]')
        context.formulaComparableMultiplier = appraisal.sumMTO
        context.footerComparableData = 'Sales Price / T/O'
      }
      if (appraisal.pricingMethod === 10) {
        context.multiplierLabel = ''
        multiplier = ''
        context.formulaValuePricingMethod = ''
        context.labelComparableMultiplier = ''
        context.fCalc1 = ''
        context.fCalc2 = ''
        labelAskingPriceMultipler = ''
        askingPrice = ''
        context.labelPriceBasedOnComparable = 'Assets Value'
        context.topLabel = '795px'
        context.leftCalcLine = '240px'
        context.widthCalcLine = '500px'
      }

      /* EBITDA */
      if (appraisal.pricingMethod === 1 || appraisal.pricingMethod === 2 || appraisal.pricingMethod === 5 || appraisal.pricingMethod === 6) {
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
        avg = numeral(ebitdaAvg(item) + item.agreedWageForMainOwner).format('$0,0')
        lastYear = numeral(pebitdaLastYear(item)).format('$0,0')
      }

      totalMultiplier = totalMultiplier + multiplier
      return {
        businessType: item.BusinessType.label,
        industry: item.industry,
        turnOver: numeral(item.latestFullYearTotalRevenue).format('$0,0'),
        trend: item.trend,
        stockValue: numeral(item.stockValue).format('$0,0'),
        assetsValue: numeral(item.assetValue).format('$0,0'),
        priceIncStock: numeral(item.soldPrice + item.stockValue).format('$0,0'),
        multiplier: multiplier ? numeral(multiplier).format('0,0.[99]') : null,
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
        lastYear,
        notesConcat: item.specialNotes || item.termsOfDeal ? `Notes: ${item.specialNotes} + ${item.termsOfDeal}` : false,
        trendIcon: item.trend === 'up' ? upGreenArrow : item.trend === 'down' ? downRedArrow : steadyYellowArrow
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
          aaRowYear1: appraisal[`aaRow${i}Year1`] > 0 ? `$ ${numeral(appraisal[`aaRow${i}Year1`]).format('0,0')}` : null,
          aaRowYear2: appraisal[`aaRow${i}Year2`] > 0 ? `$ ${numeral(appraisal[`aaRow${i}Year2`]).format('0,0')}` : null,
          aaRowYear3: appraisal[`aaRow${i}Year3`] > 0 ? `$ ${numeral(appraisal[`aaRow${i}Year3`]).format('0,0')}` : null,
          aaRowYear4: appraisal[`aaRow${i}Year4`] > 0 ? `$ ${numeral(appraisal[`aaRow${i}Year4`]).format('0,0')}` : null,
          aaRowYear5: appraisal[`aaRow${i}Year5`] > 0 ? `$ ${numeral(appraisal[`aaRow${i}Year5`]).format('0,0')}` : null,
          aaRowYear7: appraisal[`aaRow${i}Year7`] > 0 ? `$ ${numeral(appraisal[`aaRow${i}Year7`]).format('0,0')}` : null,
          sales1Validation: parseInt(appraisal.sales1) !== 0,
          sales2Validation: parseInt(appraisal.sales2) !== 0,
          sales3Validation: parseInt(appraisal.sales3) !== 0,
          sales4Validation: parseInt(appraisal.sales4) !== 0,
          sales5Validation: parseInt(appraisal.sales5) !== 0,
          sales7Validation: parseInt(appraisal.calcAnnualised1) !== 0
        })
      }
    }
    context.financialInformationArray = context.financialInformationArray.filter(item => {
      return item.aaRowYear1 !== null || item.aaRowYear2 !== null || item.aaRowYear3 !== null || item.aaRowYear4 !== null || item.aaRowYear5 !== null || item.aaRowYear7 !== null
    })
    // end table financial information

    // starts pricing chart
    context.smallestMultiplier = appraisal.smallestMultiplier
    context.avgMultiplier = appraisal.avgMultiplier
    context.riskPremium = appraisal.riskPremium
    context.marketPremium = appraisal.marketPremium
    context.askingPrice = appraisal.askingPrice
    context.lessThan5PercChanceOfSelling = appraisal.lessThan5PercChanceOfSelling
    // end pricig chart

    /* Stock */
    context.leftProposedPrice = '340px'
    if (appraisal.stockNecessary > 0) {
      context.plusIncl = appraisal.inclStock ? 'Incl. Stock of' : 'Plus Stock of'
      context.showCurrentStockLevel = numeral(appraisal.currentStockLevel).format('$0,0')
      context.leftProposedPrice = '239px'
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

    context.arrayNotesAssumptions = arrayNotesAssumptions
      .join(',')
      .replace(/,/g, '</br></br></br>')
      .split()
    // finish notes and assumptions

    context.totalAdjusments1 = numeral(context.totalAdjusments1).format('0,0')
    context.totalAdjusments2 = numeral(context.totalAdjusments2).format('0,0')
    context.totalAdjusments3 = numeral(context.totalAdjusments3).format('0,0')
    context.totalAdjusments4 = numeral(context.totalAdjusments4).format('0,0')
    context.totalAdjusments5 = numeral(context.totalAdjusments5).format('0,0')
    context.totalAdjusments7 = numeral(context.totalAdjusments7).format('0,0')
    context.adjustedProfitPerc1 = numeral(context.adjustedProfitPerc1).format('0,0')
    context.adjustedProfitPerc2 = numeral(context.adjustedProfitPerc2).format('0,0')
    context.adjustedProfitPerc3 = numeral(context.adjustedProfitPerc3).format('0,0')
    context.adjustedProfitPerc4 = numeral(context.adjustedProfitPerc4).format('0,0')
    context.adjustedProfitPerc5 = numeral(context.adjustedProfitPerc5).format('0,0')
    context.adjustedProfitPerc7 = numeral(context.adjustedProfitPerc7).format('0,0')
    context.totalAdjustedProfit1 = numeral(context.totalAdjustedProfit1).format('0,0')
    context.totalAdjustedProfit2 = numeral(context.totalAdjustedProfit2).format('0,0')
    context.totalAdjustedProfit3 = numeral(context.totalAdjustedProfit3).format('0,0')
    context.totalAdjustedProfit4 = numeral(context.totalAdjustedProfit4).format('0,0')
    context.totalAdjustedProfit5 = numeral(context.totalAdjustedProfit5).format('0,0')
    context.totalAdjustedProfit7 = numeral(context.totalAdjustedProfit7).format('0,0')

    let totalYearsUsed = 0
    if (appraisal.renderPdfYear6) totalYearsUsed = totalYearsUsed + 1
    if (appraisal.renderPdfYear5) totalYearsUsed = totalYearsUsed + 1
    if (appraisal.renderPdfYear4) totalYearsUsed = totalYearsUsed + 1
    if (appraisal.renderPdfYear3) totalYearsUsed = totalYearsUsed + 1
    if (appraisal.renderPdfYear2) totalYearsUsed = totalYearsUsed + 1
    if (appraisal.renderPdfYear1) totalYearsUsed = totalYearsUsed + 1
    context.totalYearsUsed = totalYearsUsed

    const totalBusinessesComparableSelectedList = JSON.parse(appraisal.comparableDataSelectedList).length
    context.totalBusinessesComparableSelectedList = totalBusinessesComparableSelectedList
    context.notesConcat = appraisal.specialNotes + appraisal.termsOfDeal

    if (appraisal.reducePriceForStockValue) {
      context.opinionPrice = numeral(_calculatedPriceBetween(context) - appraisal.currentStockLevel + (_calculatedPriceBetween(context) - appraisal.currentStockLevel) * (appraisal.sliderLowRange / 100)).format('$0,0')
      context.opinionPrice2 = numeral(parseInt(_replaceDollarAndComma(context.formulaAskingPrice)) - parseInt(_replaceDollarAndComma(appraisal.formulaNegotiationPremium)) - appraisal.currentStockLevel).format('$0,0')
      context.formulaAskingPrice = numeral(parseInt(_replaceDollarAndComma(context.formulaAskingPrice)) - appraisal.currentStockLevel).format('$0,0')
    } else {
      context.opinionPrice = numeral(_calculatedPriceBetween(context) + (_calculatedPriceBetween(context)) * (appraisal.sliderLowRange / 100)).format('$0,0')
      context.opinionPrice2 = numeral(parseInt(_replaceDollarAndComma(context.formulaAskingPrice)) - parseInt(_replaceDollarAndComma(appraisal.formulaNegotiationPremium))).format('$0,0')
    }

    /* financial information table */
    context.sales1Validation = parseInt(appraisal.sales1) !== 0
    context.sales2Validation = parseInt(appraisal.sales2) !== 0
    context.sales3Validation = parseInt(appraisal.sales3) !== 0
    context.sales4Validation = parseInt(appraisal.sales4) !== 0
    context.sales5Validation = parseInt(appraisal.sales5) !== 0
    context.sales7Validation = parseInt(appraisal.calcAnnualised1) !== 0
    /* end */

    /* profits table */
    if (appraisal.renderPdfYear7 && parseInt(appraisal.calcAnnualised1) !== 0) {
      context.lastYearProfitEbitda = numeral(appraisal.totalAdjustedProfit7 - appraisal.totalAnnualWages).format('$0,0')
      context.lastYearProfitPebitda = numeral(appraisal.totalAdjustedProfit7 - (appraisal.totalAnnualWages - appraisal.owner1AnnualWage)).format('$0,0')
    } else if (appraisal.renderPdfYear5 && parseInt(appraisal.sales5) !== 0) {
      context.lastYearProfitEbitda = numeral(appraisal.totalAdjustedProfit5 - appraisal.totalAnnualWages).format('$0,0')
      context.lastYearProfitPebitda = numeral(appraisal.totalAdjustedProfit5 - (appraisal.totalAnnualWages - appraisal.owner1AnnualWage)).format('$0,0')
    } else if (appraisal.renderPdfYear4 && parseInt(appraisal.sales4) !== 0) {
      context.lastYearProfitEbitda = numeral(appraisal.totalAdjustedProfit4 - appraisal.totalAnnualWages).format('$0,0')
      context.lastYearProfitPebitda = numeral(appraisal.totalAdjustedProfit4 - (appraisal.totalAnnualWages - appraisal.owner1AnnualWage)).format('$0,0')
    } else if (appraisal.renderPdfYear3 && parseInt(appraisal.sales3) !== 0) {
      context.lastYearProfitEbitda = numeral(appraisal.totalAdjustedProfit3 - appraisal.totalAnnualWages).format('$0,0')
      context.lastYearProfitPebitda = numeral(appraisal.totalAdjustedProfit3 - (appraisal.totalAnnualWages - appraisal.owner1AnnualWage)).format('$0,0')
    } else if (appraisal.renderPdfYear2 && parseInt(appraisal.sales2) !== 0) {
      context.lastYearProfitEbitda = numeral(appraisal.totalAdjustedProfit2 - appraisal.totalAnnualWages).format('$0,0')
      context.lastYearProfitPebitda = numeral(appraisal.totalAdjustedProfit2 - (appraisal.totalAnnualWages - appraisal.owner1AnnualWage)).format('$0,0')
    } else if (appraisal.renderPdfYear1 && parseInt(appraisal.sales1) !== 0) {
      context.lastYearProfitEbitda = numeral(appraisal.totalAdjustedProfit1 - appraisal.totalAnnualWages).format('$0,0')
      context.lastYearProfitPebitda = numeral(appraisal.totalAdjustedProfit1 - (appraisal.totalAnnualWages - appraisal.owner1AnnualWage)).format('$0,0')
    }
    context.avgProfitsEbitda = numeral(avgProfit(appraisal) - appraisal.totalAnnualWages).format('$0,0')
    context.avgProfitsPebitda = numeral((avgProfit(appraisal) - appraisal.totalAnnualWages) + appraisal.owner1AnnualWage).format('$0,0')
    context.currentStockLevel = numeral(appraisal.currentStockLevel).format('$0,0')
    context.stockNecessary = numeral(appraisal.stockNecessary).format('$0,0')
    context.physicalAssetValue = numeral(appraisal.physicalAssetValue).format('$0,0')
    /* end profits table */

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
              <div style="margin-left:15mm;margin-right:15mm;width:100%;font-size:10px;text-align:center;color:#61bbff;font-family: Trebuchet MS">
              <span style="float: left;">Opinion of the market value for ${
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
    /* end test pdf on chromium  */
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.emulateMedia('screen')
    await page.setContent(template)
    /* only works local. Does not work in AWS */
    await page.setContent(template)
    await page.goto(`data:text/html,${template}`, {
      waitUntil: 'networkidle0'
    })
    /* end */

    await page.pdf(PDF_OPTIONS)
    await browser.close()

    return res.download(destPdfGenerated, async err => {
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
      const downloaded = {}
      downloaded.downloaded = true
      await models.Appraisal.update(downloaded, {
        where: {
          id: appraisal.id
        }
      })
    })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

export const moveFinancialYear = async (req, res, next) => {
  const updateAppraisal = req.body

  for (let i = 1; i < 6; i++) {
    updateAppraisal[`year${i}`] = updateAppraisal[`year${i + 1}`]
    updateAppraisal[`sales${i}`] = updateAppraisal[`sales${i + 1}`]
    updateAppraisal[`cogs${i}`] = updateAppraisal[`cogs${i + 1}`]
    updateAppraisal[`calcGrossMargin${i}`] = updateAppraisal[`calcGrossMargin${i + 1}`]
    updateAppraisal[`calcGrossMarginPerc${i}`] = updateAppraisal[`calcGrossMarginPerc${i + 1}`]
    updateAppraisal[`otherIncome${i}`] = updateAppraisal[`otherIncome${i + 1}`]
    updateAppraisal[`calcGrossProfit${i}`] = updateAppraisal[`calcGrossProfit${i + 1}`]
    updateAppraisal[`expenses${i}`] = updateAppraisal[`expenses${i + 1}`]
    updateAppraisal[`calcOperatingProfit${i}`] = updateAppraisal[`calcOperatingProfit${i + 1}`]
    updateAppraisal[`calcOperatingProfitPerc${i}`] = updateAppraisal[`calcOperatingProfitPerc${i + 1}`]
  }
  updateAppraisal.year6 = updateAppraisal.year5 + 1
  updateAppraisal.sales6 = 0
  updateAppraisal.cogs6 = 0
  updateAppraisal.calcGrossMargin6 = 0
  updateAppraisal.calcGrossMarginPerc6 = 0
  updateAppraisal.otherIncome6 = 0
  updateAppraisal.calcGrossProfit6 = 0
  updateAppraisal.expenses6 = 0
  updateAppraisal.calcOperatingProfit6 = 0
  updateAppraisal.calcOperatingProfitPerc6 = 0

  /* Moving Addbacks and Adjustments */
  for (let l = 1; l < 6; l++) {
    for (let i = 1; i < 31; i++) {
      updateAppraisal[`aaRow${i}Year${l}`] = updateAppraisal[`aaRow${i}Year${l + 1}`]
      if (l === 5) updateAppraisal[`aaRow${i}Year${6}`] = 0
    }
  }

  try {
    await models.Appraisal.update(updateAppraisal, {
      where: {
        id: updateAppraisal.id
      }
    })
    return res.status(200).json({
      message: 'Financial Year Moved successfully'
    })
  } catch (error) {
    return next(error)
  }
}
