import moment from 'moment'
import models from '../../config/sequelize'

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
    await models.Score.update(
      updateScore,
      { where: { id: scoreId } }
    )
    return res.status(200).json({ message: 'Score updated with success' })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const { scoreId } = req.params

  try {
    await models.Score.destroy({ where: { id: scoreId } })

    return res
      .status(200)
      .json({ message: `Score ${scoreId} removed with success` })
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
      order: [
        [
          'dateTimeCreated',
          'DESC'
        ]
      ]
    })

    return res
      .status(200)
      .json({
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
