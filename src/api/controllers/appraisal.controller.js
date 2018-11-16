import util from 'util'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import puppeteer from 'puppeteer'
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

    const context = {}

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
      displayHeaderFooter: false,
      headerTemplate: ' ',
      footerTemplate: `
      <div style="margin-left:15mm;margin-right:15mm;width:100%;font-size:12px;text-align:center;color:rgb(187, 187, 187);">
      <span style="float: left;"></span>
      <span style="float: right;">Page: <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>`,
      scale: 0.8
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
