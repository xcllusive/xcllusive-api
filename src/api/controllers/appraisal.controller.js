import util from 'util'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import puppeteer from 'puppeteer'
import moment from 'moment'
import models from '../../config/sequelize'
import APIError from '../utils/APIError'
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

    const context = {
      currentYear: moment().get('year'),
      businessName: appraisal.Business.businessName,
      dateTimeModified: appraisal.dateTimeModified,
      businessABN: appraisal.Business.businessABN,
      businessAddress: appraisal.Business.address1,
      businessSuburb: appraisal.Business.suburb,
      businessState: appraisal.Business.state,
      businessPostCode: appraisal.Business.postCode,
      businessFirstNameV: appraisal.Business.firstNameV,
      businessLastNameV: appraisal.Business.lastNameV,
      businessIndustry: appraisal.Business.businessIndustry,
      businessType: appraisal.Business.businessType,
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
      cogs1: appraisal.cogs1,
      grossMargin1: appraisal.grossMargin1,
      grossMarginPerc1: appraisal.grossMarginPerc1,
      otherIncome1: appraisal.otherIncome1,
      grossProfit1: appraisal.grossProfit1,
      expenses1: appraisal.expenses1,
      operatingProfit1: appraisal.operatingProfit1,
      operatingProfitPerc1: appraisal.operatingProfitPerc1,
      cogs2: appraisal.cogs2,
      grossMargin2: appraisal.grossMargin2,
      grossMarginPerc2: appraisal.grossMarginPerc2,
      otherIncome2: appraisal.otherIncome2,
      grossProfit2: appraisal.grossProfit2,
      expenses2: appraisal.expenses2,
      operatingProfit2: appraisal.operatingProfit2,
      operatingProfitPerc2: appraisal.operatingProfitPerc2,
      cogs3: appraisal.cogs3,
      grossMargin3: appraisal.grossMargin3,
      grossMarginPerc3: appraisal.grossMarginPerc3,
      otherIncome3: appraisal.otherIncome3,
      grossProfit3: appraisal.grossProfit3,
      expenses3: appraisal.expenses3,
      operatingProfit3: appraisal.operatingProfit3,
      operatingProfitPerc3: appraisal.operatingProfitPerc3,
      cogs4: appraisal.cogs4,
      grossMargin4: appraisal.grossMargin4,
      grossMarginPerc4: appraisal.grossMarginPerc4,
      otherIncome4: appraisal.otherIncome4,
      grossProfit4: appraisal.grossProfit4,
      expenses4: appraisal.expenses4,
      operatingProfit4: appraisal.operatingProfit4,
      operatingProfitPerc4: appraisal.operatingProfitPerc4,
      cogs5: appraisal.cogs5,
      grossMargin5: appraisal.grossMargin5,
      grossMarginPerc5: appraisal.grossMarginPerc5,
      otherIncome5: appraisal.otherIncome5,
      grossProfit5: appraisal.grossProfit5,
      expenses5: appraisal.expenses5,
      operatingProfit5: appraisal.operatingProfit5,
      operatingProfitPerc5: appraisal.operatingProfitPerc5,
      cogs6: appraisal.cogs6,
      grossMargin6: appraisal.grossMargin6,
      grossMarginPerc6: appraisal.grossMarginPerc6,
      otherIncome6: appraisal.otherIncome6,
      grossProfit6: appraisal.grossProfit6,
      expenses6: appraisal.expenses6,
      operatingProfit6: appraisal.operatingProfit6,
      operatingProfitPerc6: appraisal.operatingProfitPerc6,
      cogs7: appraisal.cogs7,
      grossMargin7: appraisal.grossMargin7,
      grossMarginPerc7: appraisal.grossMarginPerc7,
      otherIncome7: appraisal.otherIncome7,
      grossProfit7: appraisal.grossProfit7,
      expenses7: appraisal.expenses7,
      operatingProfit7: appraisal.operatingProfit7,
      operatingProfitPerc7: appraisal.operatingProfitPerc7
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
      fs.unlink(destPdfGenerated)
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
