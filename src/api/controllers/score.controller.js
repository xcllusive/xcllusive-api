import moment from 'moment'
import puppeteer from 'puppeteer'
import handlebars from 'handlebars'
import Util from 'util'
import fs from 'fs'
import Path from 'path'
import numeral from 'numeral'
import models from '../../config/sequelize'
import APIError from '../utils/APIError'
import {
  happy,
  neutral,
  sad
} from '../constants/icons'
import mailer from '../modules/mailer'

const ReadFile = Util.promisify(fs.readFile)

export const list = async (req, res, next) => {
  const {
    business
  } = req.query

  const limit = req.query.limit
  const offset = req.skip
  const where = business ? {
    business_id: business
  } : null
  const include = [{
    model: models.ScoreRegister,
    as: 'currentInterest'
  }, {
    model: models.ScoreRegister,
    as: 'infoTransMomen'
  }, {
    model: models.ScoreRegister,
    as: 'perceivedPrice'
  }, {
    model: models.ScoreRegister,
    as: 'perceivedRisk'
  }]

  try {
    const response = await models.Score.findAndCountAll({
      where,
      limit,
      offset,
      include,
      order: [
        ['dateTimeCreated', 'DESC']
      ]
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
    scoreId
  } = req.params

  try {
    const response = await models.Score.findOne({
      where: {
        id: scoreId
      },
      include: [{
        model: models.ScoreRegister,
        as: 'currentInterest'
      }, {
        model: models.ScoreRegister,
        as: 'infoTransMomen'
      }, {
        model: models.ScoreRegister,
        as: 'perceivedPrice'
      }, {
        model: models.ScoreRegister,
        as: 'perceivedRisk'
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
  const newScore = req.body
  newScore.createdBy_id = req.user.id
  newScore.modifiedBy_id = req.user.id

  try {
    const lastVersion = await models.Score.findOne({
      where: {
        business_id: newScore.business_id
      },
      order: [
        ['dateTimeCreated', 'DESC']
      ]
    })
    newScore.version =
      lastVersion && lastVersion.version > 0 ? lastVersion.version + 1 : 1
    const score = await models.Score.create(newScore)

    return res.status(200).json({
      data: score,
      message: 'Score created'
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const {
    scoreId
  } = req.params
  const updateScore = req.body
  updateScore.modifiedBy_id = req.user.id

  try {
    await models.Score.update(updateScore, {
      where: {
        id: scoreId
      }
    })
    return res.status(200).json({
      message: 'Score updated with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const {
    scoreId
  } = req.params

  try {
    await models.Score.destroy({
      where: {
        id: scoreId
      }
    })

    return res.status(200).json({
      message: 'Score removed with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const initial = async (req, res, next) => {
  const {
    business
  } = req.query

  try {
    const yours = await models.EnquiryBusinessBuyer.findAndCountAll({
      where: {
        business_id: business,
        dateTimeCreated: {
          $gt: moment().subtract(30, 'days')
        }
      }
    })
    const avg = await models.EnquiryBusinessBuyer.findAndCountAll({
      where: {
        dateTimeCreated: {
          $gt: moment().subtract(30, 'days')
        }
      }
    })

    const totalBusinessForSale = await models.Business.count({
      where: {
        stageId: 4
      }
    })

    const lastScore = await models.Score.findOne({
      where: {
        business_id: business
      },
      order: [
        ['dateTimeCreated', 'DESC']
      ]
    })

    return res.status(200).json({
      data: {
        avg: numeral(avg.count / totalBusinessForSale).format('0.0[0]'),
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
  const {
    scoreId
  } = req.params

  const templatePath = Path.resolve(
    'src',
    'api',
    'resources',
    'pdf',
    'templates',
    'score',
    'score.html'
  )
  const destPdfGenerated = Path.resolve(
    'src',
    'api',
    'resources',
    'pdf',
    'generated',
    'score',
    `${Date.now()}.pdf`
  )

  try {
    // Verify exists score
    const score = await models.Score.findOne({
      where: {
        id: scoreId
      },
      include: [{
        model: models.Business,
        as: 'Business'
      }, {
        model: models.ScoreRegister,
        as: 'currentInterest'
      }, {
        model: models.ScoreRegister,
        as: 'infoTransMomen'
      }, {
        model: models.ScoreRegister,
        as: 'perceivedPrice'
      }, {
        model: models.ScoreRegister,
        as: 'perceivedRisk'
      }]
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

    const enquiriesTotalLastFourWeeks = await models.EnquiryBusinessBuyer.findAndCountAll({
      where: {
        dateTimeCreated: {
          $gt: moment().subtract(4, 'weeks')
        }
      }
    })

    const enquiriesBusinessLastFourWeeks = await models.EnquiryBusinessBuyer.findAndCountAll({
      where: {
        business_id: score.Business.id,
        dateTimeCreated: {
          $gt: moment().subtract(4, 'weeks')
        }
      }
    })

    const businessesForSale = await models.Business.findAndCountAll({
      where: {
        stageId: 4
      }
    })

    const enquiries = await models.ScoreRegister.findOne({
      where: {
        label: score.diff > 4 ? 4 : score.diff < -4 ? -4 : score.diff
      }
    })

    const lastScore = await models.Score.findOne({
      where: {
        business_id: score.Business.id
      },
      order: [
        ['dateTimeCreated', 'DESC']
      ],
      limit: [1, 1]
    })

    const last20BusinessSold = await models.Business.findAll({
      where: {
        stageId: 6
      },
      attributes: ['businessName', 'listedPrice', 'dateTimeModified', 'daysOnTheMarket'],
      order: [
        ['dateTimeModified', 'DESC']
      ],
      include: [{
        model: models.Score,
        where: {
          dateSent: {
            $ne: null
          }
        }
      }],
      limit: 20
    })

    const buyerFeedbackScore = await models.Score.findAll({
      where: {
        business_id: score.Business.id
      },
      order: [
        ['dateTimeCreated', 'DESC']
      ],
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

    const percBusinessSold = {
      column_10_20: 0,
      column_21_30: 0,
      column_31_40: 0,
      column_41_50: 0,
      column_51_60: 0,
      column_61_70: 0,
      column_71_80: 0,
      column_81_90: 0
    }

    const chartScoreProgress = {
      label_column_1: '-',
      label_column_2: '-',
      label_column_3: '-',
      label_column_4: '-',
      label_column_5: '-',
      label_column_6: '-',
      label_column_7: '-',
      label_column_8: '-',
      label_column_9: '-',
      label_column_10: '-',
      column_1: 0,
      column_2: 0,
      column_3: 0,
      column_4: 0,
      column_5: 0,
      column_6: 0,
      column_7: 0,
      column_8: 0,
      column_9: 0,
      column_10: 0
    }

    const averageValue = {
      column_10_20: 0,
      column_21_30: 0,
      column_31_40: 0,
      column_41_50: 0,
      column_51_60: 0,
      column_61_70: 0,
      column_71_80: 0,
      column_81_90: 0
    }

    const valueRangeArray = {
      column_10_20: [],
      column_21_30: [],
      column_31_40: [],
      column_41_50: [],
      column_51_60: [],
      column_61_70: [],
      column_71_80: [],
      column_81_90: []
    }

    var count = 0

    buyerFeedbackScore.forEach(progress => {
      count = count + 1

      if (count === 1) {
        chartScoreProgress.label_column_1 = moment(progress.dateTimeCreated).format(
          'DD/MM/YYYY'
        )
        chartScoreProgress.column_1 = progress.total
      }
      if (count === 2) {
        chartScoreProgress.label_column_2 = moment(progress.dateTimeCreated).format(
          'DD/MM/YYYY'
        )
        chartScoreProgress.column_2 = progress.total
      }
      if (count === 3) {
        chartScoreProgress.label_column_3 = moment(progress.dateTimeCreated).format(
          'DD/MM/YYYY'
        )
        chartScoreProgress.column_3 = progress.total
      }
      if (count === 4) {
        chartScoreProgress.label_column_4 = moment(progress.dateTimeCreated).format(
          'DD/MM/YYYY'
        )
        chartScoreProgress.column_4 = progress.total
      }
      if (count === 5) {
        chartScoreProgress.label_column_5 = moment(progress.dateTimeCreated).format(
          'DD/MM/YYYY'
        )
        chartScoreProgress.column_5 = progress.total
      }
      if (count === 6) {
        chartScoreProgress.label_column_6 = moment(progress.dateTimeCreated).format(
          'DD/MM/YYYY'
        )
        chartScoreProgress.column_6 = progress.total
      }
      if (count === 7) {
        chartScoreProgress.label_column_7 = moment(progress.dateTimeCreated).format(
          'DD/MM/YYYY'
        )
        chartScoreProgress.column_7 = progress.total
      }
      if (count === 8) {
        chartScoreProgress.label_column_8 = moment(progress.dateTimeCreated).format(
          'DD/MM/YYYY'
        )
        chartScoreProgress.column_8 = progress.total
      }
      if (count === 9) {
        chartScoreProgress.label_column_9 = moment(progress.dateTimeCreated).format(
          'DD/MM/YYYY'
        )
        chartScoreProgress.column_9 = progress.total
      }
      if (count === 10) {
        chartScoreProgress.label_column_10 = moment(progress.dateTimeCreated).format(
          'DD/MM/YYYY'
        )
        chartScoreProgress.column_10 = progress.total
      }
    })

    const columnListedPrice = {
      previous_10_20: 0,
      previous_21_30: 0,
      previous_31_40: 0,
      previous_41_50: 0,
      previous_51_60: 0,
      previous_61_70: 0,
      previous_71_80: 0,
      previous_81_90: 0,
      total_10_20: 0,
      total_21_30: 0,
      total_31_40: 0,
      total_41_50: 0,
      total_51_60: 0,
      total_61_70: 0,
      total_71_80: 0,
      total_81_90: 0
    }

    last20BusinessSold.forEach(business => {
      const daysOnTheMarket = moment().diff(business.daysOnTheMarket, 'days')

      business.Scores.forEach(score => {
        if (score.dateSent) {
          if (score.total <= 20) {
            chartNumberOfBusinessSold.column_10_20 =
              chartNumberOfBusinessSold.column_10_20 + 1

            chartDaysOnTheMarket.column_10_20 = Math.trunc(
              (daysOnTheMarket + chartDaysOnTheMarket.column_10_20) /
              chartNumberOfBusinessSold.column_10_20
            )

            percBusinessSold.column_10_20 =
              (percBusinessSold.column_10_20 * 100) / last20BusinessSold.length

            if (chartNumberOfBusinessSold.column_10_20 === 1) {
              columnListedPrice.previous_10_20 = business.listedPrice
              columnListedPrice.total_10_20 = columnListedPrice.previous_10_20
            }
            if (chartNumberOfBusinessSold.column_10_20 > 1) {
              columnListedPrice.total_10_20 =
                columnListedPrice.previous_10_20 + business.listedPrice
              columnListedPrice.previous_10_20 = columnListedPrice.total_10_20
            }
            averageValue.column_10_20 =
              columnListedPrice.total_10_20 / chartNumberOfBusinessSold.column_10_20
            averageValue.column_10_20 = numeral(averageValue.column_10_20).format('0.0a')

            valueRangeArray.column_10_20.push(business.listedPrice)
          }
          if (score.total > 20 && score.total < 31) {
            chartNumberOfBusinessSold.column_21_30 =
              chartNumberOfBusinessSold.column_21_30 + 1

            chartDaysOnTheMarket.column_21_30 = Math.trunc(
              (daysOnTheMarket + chartDaysOnTheMarket.column_21_30) /
              chartNumberOfBusinessSold.column_21_30
            )

            percBusinessSold.column_21_30 =
              (percBusinessSold.column_21_30 * 100) / last20BusinessSold.length

            averageValue.column_21_30 =
              business.listedPrice / chartNumberOfBusinessSold.column_21_30

            if (chartNumberOfBusinessSold.column_21_30 === 1) {
              columnListedPrice.previous_21_30 = business.listedPrice
              columnListedPrice.total_21_30 = columnListedPrice.previous_21_30
            }
            if (chartNumberOfBusinessSold.column_21_30 > 1) {
              columnListedPrice.total_21_30 =
                columnListedPrice.previous_21_30 + business.listedPrice
              columnListedPrice.previous_21_30 = columnListedPrice.total_21_30
            }
            averageValue.column_21_30 =
              columnListedPrice.total_21_30 / chartNumberOfBusinessSold.column_21_30
            averageValue.column_21_30 = numeral(averageValue.column_21_30).format('0.0a')

            valueRangeArray.column_21_30.push(business.listedPrice)
          }
          if (score.total > 30 && score.total < 41) {
            chartNumberOfBusinessSold.column_31_40 =
              chartNumberOfBusinessSold.column_31_40 + 1

            chartDaysOnTheMarket.column_31_40 = Math.trunc(
              (daysOnTheMarket + chartDaysOnTheMarket.column_31_40) /
              chartNumberOfBusinessSold.column_31_40
            )

            percBusinessSold.column_31_40 =
              (percBusinessSold.column_31_40 * 100) / last20BusinessSold.length

            if (chartNumberOfBusinessSold.column_31_40 === 1) {
              columnListedPrice.previous_31_40 = business.listedPrice
              columnListedPrice.total_31_40 = columnListedPrice.previous_31_40
            }
            if (chartNumberOfBusinessSold.column_31_40 > 1) {
              columnListedPrice.total_31_40 =
                columnListedPrice.previous_31_40 + business.listedPrice
              columnListedPrice.previous_31_40 = columnListedPrice.total_31_40
            }
            averageValue.column_31_40 =
              columnListedPrice.total_31_40 / chartNumberOfBusinessSold.column_31_40
            averageValue.column_31_40 = numeral(averageValue.column_31_40).format('0.0a')

            valueRangeArray.column_31_40.push(business.listedPrice)
          }
          if (score.total > 40 && score.total < 51) {
            chartNumberOfBusinessSold.column_41_50 =
              chartNumberOfBusinessSold.column_41_50 + 1

            chartDaysOnTheMarket.column_41_50 = Math.trunc(
              (daysOnTheMarket + chartDaysOnTheMarket.column_41_50) /
              chartNumberOfBusinessSold.column_41_50
            )

            percBusinessSold.column_41_50 =
              (chartNumberOfBusinessSold.column_41_50 * 100) / last20BusinessSold.length

            if (chartNumberOfBusinessSold.column_41_50 === 1) {
              columnListedPrice.previous_41_50 = business.listedPrice
              columnListedPrice.total_41_50 = columnListedPrice.previous_41_50
            }
            if (chartNumberOfBusinessSold.column_41_50 > 1) {
              columnListedPrice.total_41_50 =
                columnListedPrice.previous_41_50 + business.listedPrice
              columnListedPrice.previous_41_50 = columnListedPrice.total_41_50
            }
            averageValue.column_41_50 = Math.trunc(
              columnListedPrice.total_41_50 / chartNumberOfBusinessSold.column_41_50
            )
            averageValue.column_41_50 = numeral(averageValue.column_41_50).format('0.0a')

            valueRangeArray.column_41_50.push(business.listedPrice)
          }
          if (score.total > 50 && score.total < 61) {
            chartNumberOfBusinessSold.column_51_60 =
              chartNumberOfBusinessSold.column_51_60 + 1

            chartDaysOnTheMarket.column_51_60 = Math.trunc(
              (daysOnTheMarket + chartDaysOnTheMarket.column_51_60) /
              chartNumberOfBusinessSold.column_51_60
            )

            percBusinessSold.column_51_60 =
              (percBusinessSold.column_51_60 * 100) / last20BusinessSold.length

            if (chartNumberOfBusinessSold.column_51_60 === 1) {
              columnListedPrice.previous_51_60 = business.listedPrice
              columnListedPrice.total_51_60 = columnListedPrice.previous_51_60
            }
            if (chartNumberOfBusinessSold.column_51_60 > 1) {
              columnListedPrice.total_51_60 =
                columnListedPrice.previous_51_60 + business.listedPrice
              columnListedPrice.previous_51_60 = columnListedPrice.total_51_60
            }
            averageValue.column_51_60 =
              columnListedPrice.total_51_60 / chartNumberOfBusinessSold.column_51_60
            averageValue.column_51_60 = numeral(averageValue.column_51_60).format('0.0a')

            valueRangeArray.column_51_60.push(business.listedPrice)
          }
          if (score.total > 60 && score.total < 71) {
            chartNumberOfBusinessSold.column_61_70 =
              chartNumberOfBusinessSold.column_61_70 + 1

            chartDaysOnTheMarket.column_61_70 = Math.trunc(
              (daysOnTheMarket + chartDaysOnTheMarket.column_61_70) /
              chartNumberOfBusinessSold.column_61_70
            )

            percBusinessSold.column_61_70 =
              (percBusinessSold.column_61_70 * 100) / last20BusinessSold.length

            if (chartNumberOfBusinessSold.column_61_70 === 1) {
              columnListedPrice.previous_61_70 = business.listedPrice
              columnListedPrice.total_61_70 = columnListedPrice.previous_61_70
            }
            if (chartNumberOfBusinessSold.column_61_70 > 1) {
              columnListedPrice.total_61_70 =
                columnListedPrice.previous_61_70 + business.listedPrice
              columnListedPrice.previous_61_70 = columnListedPrice.total_61_70
            }
            averageValue.column_61_70 =
              columnListedPrice.total_61_70 / chartNumberOfBusinessSold.column_61_70
            averageValue.total_61_70 = numeral(averageValue.total_61_70).format('0.0a')

            valueRangeArray.column_61_70.push(business.listedPrice)
          }
          if (score.total > 70 && score.total < 81) {
            chartNumberOfBusinessSold.column_71_80 =
              chartNumberOfBusinessSold.column_71_80 + 1

            chartDaysOnTheMarket.column_71_80 = Math.trunc(
              (daysOnTheMarket + chartDaysOnTheMarket.column_71_80) /
              chartNumberOfBusinessSold.column_71_80
            )

            percBusinessSold.column_71_80 =
              (percBusinessSold.column_71_80 * 100) / last20BusinessSold.length

            if (chartNumberOfBusinessSold.column_71_80 === 1) {
              columnListedPrice.previous_71_80 = business.listedPrice
              columnListedPrice.total_71_80 = columnListedPrice.previous_71_80
            }
            if (chartNumberOfBusinessSold.column_71_80 > 1) {
              columnListedPrice.total_71_80 =
                columnListedPrice.previous_71_80 + business.listedPrice
              columnListedPrice.previous_71_80 = columnListedPrice.total_71_80
            }
            averageValue.column_71_80 =
              columnListedPrice.total_71_80 / chartNumberOfBusinessSold.column_71_80
            averageValue.column_71_80 = numeral(averageValue.column_71_80).format('0.0a')

            valueRangeArray.column_71_80.push(business.listedPrice)
          }
          if (score.total > 80) {
            chartNumberOfBusinessSold.column_81_90 =
              chartNumberOfBusinessSold.column_81_90 + 1

            chartDaysOnTheMarket.column_81_90 = Math.trunc(
              (daysOnTheMarket + chartDaysOnTheMarket.column_81_90) /
              chartNumberOfBusinessSold.column_81_90
            )

            percBusinessSold.column_81_90 =
              (percBusinessSold.column_81_90 * 100) / last20BusinessSold.lenght

            if (chartNumberOfBusinessSold.column_81_90 === 1) {
              columnListedPrice.previous_81_90 = business.listedPrice
              columnListedPrice.total_81_90 = columnListedPrice.previous_81_90
            }
            if (chartNumberOfBusinessSold.column_81_90 > 1) {
              columnListedPrice.total_81_90 =
                columnListedPrice.previous_81_90 + business.listedPrice
              columnListedPrice.previous_81_90 = columnListedPrice.total_81_90
            }
            averageValue.column_81_90 =
              columnListedPrice.total_81_90 / chartNumberOfBusinessSold.column_81_90
            averageValue.column_81_90 = numeral(averageValue.column_81_90).format('0.0a')

            valueRangeArray.column_81_90.push(business.listedPrice)
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

    const renderValueRange = array => {
      let min = Math.min(...array)
      let max = Math.max(...array)

      if (min === Infinity) min = 0
      if (max === -Infinity) max = 0

      return `$${numeral(min).format('0.0a')} - $${numeral(max).format('0.0a')}`
    }

    const context = {
      business_name: score.Business.businessName,
      score_generated: moment(score.dateTimeCreated).format('DD/MM/YYYY'),
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
      perceivedRisk_icon: renderSmile(score.perceivedRisk.weight),
      percBusinessSold,
      chartScoreProgress,
      averageValue,
      valueRange: {
        column_10_20: renderValueRange(valueRangeArray.column_10_20),
        column_21_30: renderValueRange(valueRangeArray.column_21_30),
        column_31_40: renderValueRange(valueRangeArray.column_31_40),
        column_41_50: renderValueRange(valueRangeArray.column_41_50),
        column_51_60: renderValueRange(valueRangeArray.column_51_60),
        column_61_70: renderValueRange(valueRangeArray.column_61_70),
        column_71_80: renderValueRange(valueRangeArray.column_71_80),
        column_81_90: renderValueRange(valueRangeArray.column_81_90)
      }
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
      <span style="float: left;">${context.business_name} - Buyer Feedback ${
  context.score_version
}</span>
      <span style="float: right;">Page: <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>`
    }

    const content = await ReadFile(templatePath, 'utf8')
    const handlebarsCompiled = handlebars.compile(content)
    const template = handlebarsCompiled(context)
    // const browser = await puppeteer.launch({headless: false}) // to debug
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    await page.emulateMedia('screen')
    await page.goto(`data:text/html,${template}`, {
      waitUntil: 'networkidle2'
    })

    await page.pdf(PDF_OPTIONS)
    await browser.close()

    // Send Email

    const settings = await models.SystemSettings.findOne({
      where: 1
    })

    const broker = await models.User.findOne({
      where: {
        id: score.Business.brokerAccountName
      }
    })

    // Verify exists template
    const templateEmail = await models.EmailTemplate.findOne({
      where: {
        title: 'Score Email'
      }
    })

    if (!templateEmail) {
      throw new APIError({
        message: 'The email template not found',
        status: 404,
        isPublic: true
      })
    }

    // Compile the template to use variables
    const templateEmailCompiled = handlebars.compile(templateEmail.body)
    const contextTemplateEmail = {
      owners_name: `${score.Business.firstNameV} - ${score.Business.lastNameV}`
    }

    // Set email options
    const mailOptions = {
      to: [score.Business.vendorEmail, settings.emailOffice],
      from: '"Xcllusive" <businessinfo@xcllusive.com.au>',
      subject: `Score - ${score.Business.businessName} - ${templateEmail.subject}`,
      html: templateEmailCompiled(contextTemplateEmail),
      replyTo: broker.email,
      attachments: [{
        filename: `${templateEmail.title.trim()}.pdf`,
        path: destPdfGenerated
      }]
    }

    // Send Email
    const responseMailer = await mailer.sendMail(mailOptions)

    // Updated caSent on Buyer
    await models.Score.update({
      dateSent: moment()
    }, {
      where: {
        id: scoreId
      }
    })

    // remove pdf temp
    await fs.unlink(destPdfGenerated)

    // return res.sendFile(destPdfGenerated)
    return res.status(200).json({
      responseMailer,
      message: 'Score sent with success'
    })
  } catch (error) {
    return next(error)
  }
}
