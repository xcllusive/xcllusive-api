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

    const context = Object.assign(appraisal.get({ plain: true }), variables)

    /* profits table */

    if (appraisal.year6 > 0) {
      context.lastYearProfit = 3000
      context.lastYearProfitAfterWages = 2800
    } else if (appraisal.year5 > 0) {
      context.lastYearProfit = 3000
      context.lastYearProfitAfterWages = 2800
    } else if (appraisal.year4 > 0) {
      context.lastYearProfit = 3000
      context.lastYearProfitAfterWages = 2800
    } else if (appraisal.year3 > 0) {
      context.lastYearProfit = 3000
      context.lastYearProfitAfterWages = 2800
    } else if (appraisal.year2 > 0) {
      context.lastYearProfit = 3000
      context.lastYearProfitAfterWages = 2800
    } else if (appraisal.year1 > 0) {
      context.lastYearProfit = 3000
      context.lastYearProfitAfterWages = 2800
    }
    const afterWages = context.lastYearProfit - context.lastYearProfitAfterWages
    context.avgProfits = avgProfit(appraisal)
    context.avgProfitsAfterWages = context.avgProfits - afterWages
    context.currentStockLevel = appraisal.currentStockLevel
    context.stockNecessary = appraisal.stockNecessary
    context.physicalAssetValue = appraisal.physicalAssetValue
    /* end profits table */

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
      }
      if (appraisal.pricingMethod === 2) {
        context.multiplierLabel = 'Multiplier EBITDA Avg'
        multiplier = numeral(item.soldPrice / ebitdaAvg(item)).format('0,0.[99]')
      }
      if (appraisal.pricingMethod === 3) {
        context.multiplierLabel = 'Multiplier PEBITDA Last Year'
        // multiplier = numeral(item.soldPrice / pebitdaLastYear(item)).format('0,0.[99]')
        multiplier = item.soldPrice / pebitdaLastYear(item)
      }
      if (appraisal.pricingMethod === 4) {
        context.multiplierLabel = 'Multiplier PEBITDA Avg'
        multiplier = numeral(
          item.soldPrice / (ebitdaAvg(item) + item.agreedWageForMainOwner)
        ).format('0,0.[99]')
      }
      if (appraisal.pricingMethod === 5) {
        context.multiplierLabel = 'Multiplier EBITDA Last Year With Stock'
        multiplier = numeral(
          (item.soldPrice + item.stockValue) / ebitdaLastYear(item)
        ).format('0,0.[99]')
      }
      if (appraisal.pricingMethod === 6) {
        context.multiplierLabel = 'Multiplier EBITDA Avg With Stock'
        multiplier = numeral((item.soldPrice + item.stockValue) / ebitdaAvg(item)).format(
          '0,0.[99]'
        )
      }
      if (appraisal.pricingMethod === 7) {
        context.multiplierLabel = 'Multiplier PEBITDA Last Year With Stock'
        multiplier = numeral(
          item.soldPrice / (pebitdaLastYear(item) + item.stockValue)
        ).format('0,0.[99]')
      }
      if (appraisal.pricingMethod === 8) {
        context.multiplierLabel = 'Multiplier PEBITDA Avg With Stock'
        multiplier = numeral(
          item.soldPrice /
            (ebitdaAvg(item) + item.agreedWageForMainOwner + item.stockValue)
        ).format('0,0.[99]')
      }
      if (appraisal.pricingMethod === 9) {
        context.multiplierLabel = 'T/O Multiplier'
        multiplier = numeral(item.soldPrice / item.latestFullYearTotalRevenue).format(
          '0,0.[99]'
        )
      }
      if (appraisal.pricingMethod === 10) {
        context.multiplierLabel = ''
        multiplier = ''
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
    await page.goto(`data:text/html,${template}`)
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
