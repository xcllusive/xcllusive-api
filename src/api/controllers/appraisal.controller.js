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
    // end Financial Information Table

    // start Labels for formula pricing
    context.formulaValuePricingMethod = appraisal.formulaValuePricingMethod
    context.labelComparableMultiplier = 'Comparable Multiplier'
    context.fCalc1 = '+'
    context.fCalc2 = '='
    context.labelAskingPriceMultipler = 'Asking Price Multiplier'
    // end Labels for formula pricing

    /* table 10 last businesses */
    let totalMultiplier = 0
    let totalIndex = 0
    comparableDataSelectedList.forEach((item, index) => {
      context[`businessType${index + 1}`] = item.businessType
      context[`turnOver${index + 1}`] = numeral(item.latestFullYearTotalRevenue).format(
        '$0,0'
      )
      context[`trend${index + 1}`] = item.trend
      context[`stockValue${index + 1}`] = numeral(item.stockValue).format('$0,0')
      context[`assetsValue${index + 1}`] = numeral(item.assetValue).format('$0,0')
      context[`priceIncStock${index + 1}`] = numeral(
        item.soldPrice + item.stockValue
      ).format('$0,0')

      let multiplier = null
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
        // multiplier = numeral(item.soldPrice / pebitdaLastYear(item)).format('0,0.[99]')
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
        context.formulaValuePricingMethod = ''
        context.labelComparableMultiplier = ''
        context.fCalc1 = ''
        context.fCalc2 = ''
        context.labelAskingPriceMultipler = ''
        context.askingPrice = ''
      }
      context[`multiplier${index + 1}`] = numeral(multiplier).format('0,0.[99]')

      totalMultiplier = totalMultiplier + multiplier
      totalIndex = totalIndex + index

      /* EBITDA */
      if (
        appraisal.pricingMethod === 1 ||
        appraisal.pricingMethod === 2 ||
        appraisal.pricingMethod === 5 ||
        appraisal.pricingMethod === 6
      ) {
        context.avgLabel = 'EBITDA Avg'
        context.lastYearLabel = 'EBITDA Last Year'
        context[`avg${index + 1}`] = numeral(ebitdaAvg(item)).format('$0,0')
        context[`lastYear${index + 1}`] = numeral(ebitdaLastYear(item)).format('$0,0')
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
        context[`avg${index + 1}`] = numeral(
          ebitdaAvg(item) + item.agreedWageForMainOwner
        ).format('$0,0')
        context[`lastYear${index + 1}`] = numeral(pebitdaLastYear(item)).format('$0,0')
      }
      context[`specialNotes${index + 1}`] = item.specialNotes
      context[`termsOfDeal${index + 1}`] = item.termsOfDeal
    })
    /* end table 10 last businesses */
    context.avgMultiplier = numeral(totalMultiplier / totalIndex).format('0,0.[99]')

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

    const checkYearRender = (render, value) => {
      if (render) {
        return value
      }
      return '-'
    }

    // start table financial information
    for (let i = 1; i < 31; i++) {
      if (appraisal[`aaRow${i}`] || appraisal[`aaRow${i}`] !== '') {
        context.financialInformationArray.push({
          aaRow: appraisal[`aaRow${i}`],
          aaRowYear1: checkYearRender(appraisal['renderPdfYear1'], appraisal[`aaRow${i}Year1`]),
          aaRowYear2: checkYearRender(appraisal['renderPdfYear2'], appraisal[`aaRow${i}Year2`]),
          aaRowYear3: checkYearRender(appraisal['renderPdfYear3'], appraisal[`aaRow${i}Year3`]),
          aaRowYear4: checkYearRender(appraisal['renderPdfYear4'], appraisal[`aaRow${i}Year4`]),
          aaRowYear5: checkYearRender(appraisal['renderPdfYear5'], appraisal[`aaRow${i}Year5`]),
          aaRowYear7: checkYearRender(appraisal['renderPdfYear7'], appraisal[`aaRow${i}Year7`])
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

    // start formula pricing
    // end formula pricing

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
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    // const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.emulateMedia('screen')
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
