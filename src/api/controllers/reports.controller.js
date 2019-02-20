import models from '../../config/sequelize'
import _ from 'lodash'

export const getMarketingReport = async (req, res, next) => {
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo

  try {
    const dateTimeCreated = await models.Business.findAll({
      raw: true,
      attributes: ['listingAgent_id'],
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [
        {
          model: models.User,
          attributes: ['firstName', 'lastName', 'dataRegion'],
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            }
          }
        }
      ],
      group: [
        [
          {
            model: models.User,
            as: 'listingAgent'
          }, 'id'
        ]
      ]
    })

    const dateTimeCreatedCount = await models.Business.count({
      raw: true,
      attributes: ['listingAgent_id'],
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [
        {
          model: models.User,
          attributes: ['firstName', 'lastName', 'dataRegion'],
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            }
          }
        }
      ],
      group: [
        [
          {
            model: models.User,
            as: 'listingAgent'
          }, 'id'
        ]
      ]
    })

    const dateChangedToSalesMemorandum = await models.Business.count({
      raw: true,
      attributes: ['listingAgent_id'],
      where: {
        dateChangedToSalesMemorandum: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [
        {
          model: models.User,
          attributes: ['firstName', 'lastName', 'dataRegion'],
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            }
          }
        }
      ],
      group: [
        [
          {
            model: models.User,
            as: 'listingAgent'
          }, 'id'
        ]
      ]
    })

    // const test = _.union(dateTimeCreated, dateTimeCreatedCount, dateChangedToSalesMemorandum)

    const mergeArray = _.merge(dateTimeCreated, dateTimeCreatedCount)
    const changedArrayName = dateChangedToSalesMemorandum.map(item => {
      return {
        listingAgent_id: item.listingAgent_id,
        countImStage: item.count
      }
    })
    const arrayFinal = _.merge(mergeArray, changedArrayName)

    return res.status(201).json({
      data: arrayFinal
    })
  } catch (error) {
    return next(error)
  }
}
