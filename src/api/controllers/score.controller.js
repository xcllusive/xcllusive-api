import moment from 'moment'
import puppeteer from 'puppeteer'
import handlebars from 'handlebars'
import Util from 'util'
import Fs from 'fs'
import Path from 'path'
import models from '../../config/sequelize'
import APIError from '../utils/APIError'
import { happy, neutral, sad } from '../constants/icons'

const ReadFile = Util.promisify(Fs.readFile)

export const list = async (req, res, next) => {
  const { business } = req.query

  const limit = req.query.limit
  const offset = req.skip
  const where = business ? { business_id: business } : null
  const include = [
    { model: models.ScoreRegister, as: 'currentInterest' },
    { model: models.ScoreRegister, as: 'infoTransMomen' },
    { model: models.ScoreRegister, as: 'perceivedPrice' },
    { model: models.ScoreRegister, as: 'perceivedRisk' }
  ]

  try {
    const response = await models.Score.findAndCountAll({ where, limit, offset, include })
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
  const { scoreId } = req.params

  try {
    const response = await models.Score.findOne({
      where: { id: scoreId },
      include: [
        { model: models.ScoreRegister, as: 'currentInterest' },
        { model: models.ScoreRegister, as: 'infoTransMomen' },
        { model: models.ScoreRegister, as: 'perceivedPrice' },
        { model: models.ScoreRegister, as: 'perceivedRisk' }
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
  const newScore = req.body
  newScore.createdBy_id = req.user.id
  newScore.modifiedBy_id = req.user.id

  try {
    await models.Score.create(newScore)

    return res.status(200).json({ message: 'Score created' })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { scoreId } = req.params
  const updateScore = req.body
  updateScore.modifiedBy_id = req.user.id

  try {
    await models.Score.update(updateScore, { where: { id: scoreId } })
    return res.status(200).json({ message: 'Score updated with success' })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const { scoreId } = req.params

  try {
    await models.Score.destroy({ where: { id: scoreId } })

    return res.status(200).json({ message: `Score ${scoreId} removed with success` })
  } catch (error) {
    return next(error)
  }
}

export const initial = async (req, res, next) => {
  const { business } = req.query

  try {
    const yours = await models.EnquiryBusinessBuyer.findAndCountAll({
      where: {
        business_id: business,
        dateTimeCreated: {
          $gt: moment().subtract(4, 'weeks')
        }
      }
    })
    const avg = await models.EnquiryBusinessBuyer.findAndCountAll({
      where: {
        dateTimeCreated: {
          $gt: moment().subtract(4, 'weeks')
        }
      }
    })
    const lastScore = await models.Score.findOne({
      where: {
        business_id: business
      },
      order: [['dateTimeCreated', 'DESC']]
    })

    return res.status(200).json({
      data: {
        avg: avg.count,
        yours: yours.count,
        lastScore: lastScore
      },
      message: 'Get data with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const makePdf = async (req, res, next) => {
  const { scoreId } = req.params

  const templatePath = Path.resolve('src', 'api', 'resources', 'pdf', 'templates', 'score', 'score.html')
  const destPdfGenerated = Path.resolve('src', 'api', 'resources', 'pdf', 'generated', 'score', `${Date.now()}.pdf`)

  try {
    // Verify exists score
    const score = await models.Score.findOne({
      where: { id: scoreId },
      include: [
        { model: models.Business, as: 'Business' },
        { model: models.ScoreRegister, as: 'currentInterest' },
        { model: models.ScoreRegister, as: 'infoTransMomen' },
        { model: models.ScoreRegister, as: 'perceivedPrice' },
        { model: models.ScoreRegister, as: 'perceivedRisk' }
      ]
    })

    if (!score) {
      throw new APIError({
        message: 'Score not found',
        status: 404,
        isPublic: true
      })
    }

    const enquiriesBusiness = await models.EnquiryBusinessBuyer.findAndCountAll({
      where: {
        business_id: score.Business.id
      }
    })

    const enquiriesTotalLastFourWeeks = await models.EnquiryBusinessBuyer.findAndCountAll(
      {
        where: {
          dateTimeCreated: {
            $gt: moment().subtract(4, 'weeks')
          }
        }
      }
    )

    const enquiriesBusinessLastFourWeeks = await models.EnquiryBusinessBuyer.findAndCountAll(
      {
        where: {
          business_id: score.Business.id,
          dateTimeCreated: {
            $gt: moment().subtract(4, 'weeks')
          }
        }
      }
    )

    const businessesForSale = await models.Business.findAndCountAll({
      where: { stageId: 4 }
    })

    const enquiries = await models.ScoreRegister.findOne({
      where: { label: score.diff }
    })

    const lastScore = await models.Score.findOne({
      where: {
        business_id: score.Business.id
      },
      order: [['dateTimeCreated', 'DESC']],
      limit: [1, 1]
    })

    const last20BusinessSold = await models.Business.findAll({
      where: {
        stageId: 6
      },
      attributes: ['businessName', 'listedPrice', 'dateTimeModified', 'daysOnTheMarket'],
      order: [['dateTimeModified', 'DESC']],
      include: [
        {
          model: models.Score,
          where: {
            dateSent: {
              $ne: null
            }
          }
        }
      ],
      limit: 20
    })

    const buyerFeedbackScore = await models.Score.findAll({
      where: {
        business_id: score.Business.id
      },
      order: [['dateTimeCreated', 'DESC']],
      limit: 10
    })

    const chartNumberOfBusinessSold = {
      column_10_20: 0,
      column_21_30: 0,
      column_31_40: 0,
      column_41_50: 0,
      column_51_60: 0,
      column_61_70: 0,
      column_71_80: 0,
      column_81_90: 0
    }

    const chartDaysOnTheMarket = {
      column_10_20: 0,
      column_21_30: 0,
      column_31_40: 0,
      column_41_50: 0,
      column_51_60: 0,
      column_61_70: 0,
      column_71_80: 0,
      column_81_90: 0
    }

    last20BusinessSold.forEach(business => {
      const daysOnTheMarket = moment().diff(business.daysOnTheMarket, 'days')
      business.Scores.forEach(score => {
        if (score.dateSent) {
          if (score.total <= 20) {
            chartNumberOfBusinessSold.column_10_20 =
              chartNumberOfBusinessSold.column_10_20 + 1
            chartDaysOnTheMarket.column_10_20 =
              (daysOnTheMarket + chartDaysOnTheMarket.column_10_20) /
              chartNumberOfBusinessSold.column_10_20
          }
          if (score.total > 20 && score.total < 31) {
            chartNumberOfBusinessSold.column_21_30 =
              chartNumberOfBusinessSold.column_21_30 + 1
            chartDaysOnTheMarket.column_21_30 =
              (daysOnTheMarket + chartDaysOnTheMarket.column_21_30) /
              chartNumberOfBusinessSold.column_21_30
          }
          if (score.total > 30 && score.total < 41) {
            chartNumberOfBusinessSold.column_31_40 =
              chartNumberOfBusinessSold.column_31_40 + 1
            chartDaysOnTheMarket.column_31_40 =
              (daysOnTheMarket + chartDaysOnTheMarket.column_31_40) /
              chartNumberOfBusinessSold.column_31_40
          }
          if (score.total > 40 && score.total < 51) {
            chartNumberOfBusinessSold.column_41_50 =
              chartNumberOfBusinessSold.column_41_50 + 1
            chartDaysOnTheMarket.column_41_50 =
              (daysOnTheMarket + chartDaysOnTheMarket.column_41_50) /
              chartNumberOfBusinessSold.column_41_50
          }
          if (score.total > 50 && score.total < 61) {
            chartNumberOfBusinessSold.column_51_60 =
              chartNumberOfBusinessSold.column_51_60 + 1
            chartDaysOnTheMarket.column_51_60 =
              (daysOnTheMarket + chartDaysOnTheMarket.column_51_60) /
              chartNumberOfBusinessSold.column_51_60
          }
          if (score.total > 60 && score.total < 71) {
            chartNumberOfBusinessSold.column_61_70 =
              chartNumberOfBusinessSold.column_61_70 + 1
            chartDaysOnTheMarket.column_61_70 =
              (daysOnTheMarket + chartDaysOnTheMarket.column_61_70) /
              chartNumberOfBusinessSold.column_61_70
          }
          if (score.total > 70 && score.total < 81) {
            chartNumberOfBusinessSold.column_71_80 =
              chartNumberOfBusinessSold.column_71_80 + 1
            chartDaysOnTheMarket.column_71_80 =
              (daysOnTheMarket + chartDaysOnTheMarket.column_71_80) /
              chartNumberOfBusinessSold.column_71_80
          }
          if (score.total > 80) {
            chartNumberOfBusinessSold.column_81_90 =
              chartNumberOfBusinessSold.column_81_90 + 1
            chartDaysOnTheMarket.column_81_90 =
              (daysOnTheMarket + chartDaysOnTheMarket.column_81_90) /
              chartNumberOfBusinessSold.column_81_90
          }
        }
      })
    })

    const renderSubtitle = weight => {
      if (weight < 30) {
        return 'Needs urgent attention'
      }
      if (weight >= 30 && weight <= 59) {
        return 'Possible improvement'
      }
      if (weight >= 60) {
        return 'Satisfactory'
      }
      return 'Not found score'
    }

    const renderSmile = weight => {
      if (weight < 30) {
        return sad
      }
      if (weight >= 30 && weight <= 59) {
        return neutral
      }
      if (weight >= 60) {
        return happy
      }
      return 'Not found score'
    }

    const context = {
      business_name: score.Business.businessName,
      score_generated: moment(score.dateTimeCreated).format('L'),
      score_version: score.version,
      total_enquiries: enquiriesBusiness.count,
      total_enquiries_last_four_weeks: enquiriesBusinessLastFourWeeks.count,
      average_enquiries_last_four_weeks: (
        enquiriesTotalLastFourWeeks.count / businessesForSale.count
      ).toFixed(2),
      currentInterest: score.currentInterest,
      currentInterestNotes: score.notesInterest,
      infoTransMomen: score.infoTransMomen,
      notesMomentum: score.notesMomentum,
      perceivedPrice: score.perceivedPrice,
      notesPrice: score.notesPrice,
      perceivedRisk: score.perceivedRisk,
      notesRisk: score.notesRisk,
      enquiries,
      notesEnquiries: score.notesEnquiries,
      lastScore,
      last20BusinessSold,
      chartNumberOfBusinessSold,
      chartDaysOnTheMarket,
      buyerFeedbackScore,
      totalScore: score.total,
      enquiries_subtitle: renderSubtitle(enquiries.weight),
      currentInterest_subtitle: renderSubtitle(score.currentInterest.weight),
      infoTransMomen_subtitle: renderSubtitle(score.infoTransMomen.weight),
      perceivedPrice_subtitle: renderSubtitle(score.perceivedPrice.weight),
      perceivedRisk_subtitle: renderSubtitle(score.perceivedRisk.weight),
      enquiries_icon: renderSmile(enquiries.weight),
      currentInterest_icon: renderSmile(score.currentInterest.weight),
      infoTransMomen_icon: renderSmile(score.infoTransMomen.weight),
      perceivedPrice_icon: renderSmile(score.perceivedPrice.weight),
      perceivedRisk_icon: renderSmile(score.perceivedRisk.weight)
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
      <span style="float: left;">${context.business_name} buyer feedback ${context.score_version}</span>
      <span style="float: right;">Page: <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>`
    }

    const content = await ReadFile(templatePath, 'utf8')
    const handlebarsCompiled = handlebars.compile(content)
    const template = handlebarsCompiled(context)
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.emulateMedia('screen')
    await page.goto(`data:text/html,${template}`, { waitUntil: 'networkidle2' })

    await page.pdf(PDF_OPTIONS)
    await browser.close()

    return res.sendFile(destPdfGenerated)
    // return res.status(200).json({
    //   context,
    //   message: 'Generated pdf with success'
    // })
  } catch (error) {
    return next(error)
  }
}
