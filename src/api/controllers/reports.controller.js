import models from '../../config/sequelize'
import _ from 'lodash'

export const getMarketingReport = async (req, res, next) => {
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo

  try {
    /* starts Leads per Analyst */
    const dateTimeCreated = await models.Business.findAll({
      raw: true,
      attributes: ['listingAgent_id'],
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [{
        model: models.User,
        attributes: ['firstName', 'lastName', 'dataRegion'],
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          }
        }
      }],
      group: [
        [{
          model: models.User,
          as: 'listingAgent'
        }, 'id']
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
      include: [{
        model: models.User,
        attributes: ['firstName', 'lastName', 'dataRegion'],
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          }
        }
      }],
      group: [
        [{
          model: models.User,
          as: 'listingAgent'
        }, 'id']
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
      include: [{
        model: models.User,
        attributes: ['firstName', 'lastName', 'dataRegion'],
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          }
        }
      }],
      group: [
        [{
          model: models.User,
          as: 'listingAgent'
        }, 'id']
      ]
    })

    const mergeArray = _.merge(dateTimeCreated, dateTimeCreatedCount)
    const changedArrayName = dateChangedToSalesMemorandum.map(item => {
      return {
        listingAgent_id: item.listingAgent_id,
        countImStage: item.count
      }
    })
    const arrayFinal = _.merge(mergeArray, changedArrayName)
    /* ends Leads per Analyst */

    /* starts Leads per Source */
    const leadsPerSource = await models.Business.findAndCountAll({
      raw: true,
      attributes: ['listingAgent_id', 'sourceId', 'dataRegion', 'id'],
      as: 'Business',
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [{
        model: models.User,
        attributes: ['firstName', 'lastName', 'dataRegion'],
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          }
        }
      }, {
        model: models.BusinessSource,
        attributes: ['label'],
        as: 'source',
        where: {
          id: {
            $col: 'Business.sourceId'
          }
        }
      }],
      group: [
        'Business.sourceId', 'Business.dataRegion', 'Business.listingAgent_id'
      ]
    })
    const arrayLeadsPerSource = _.merge(leadsPerSource.rows, leadsPerSource.count)
    /* ends Leads per Source */

    /* starts Total per Source */
    const totalPerSource = await models.Business.findAndCountAll({
      raw: true,
      attributes: ['sourceId'],
      as: 'Business',
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [{
        model: models.BusinessSource,
        attributes: ['label'],
        as: 'source',
        where: {
          id: {
            $col: 'Business.sourceId'
          }
        }
      }],
      group: [
        [{
          model: models.BusinessSource,
          as: 'source'
        }, 'id']
      ]
    })
    const arrayTotalPerSource = _.merge(totalPerSource.rows, totalPerSource.count)

    const totalGeralPerSource = await models.Business.count({
      raw: true,
      as: 'Business',
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [{
        model: models.BusinessSource,
        as: 'source',
        where: {
          id: {
            $col: 'Business.sourceId'
          }
        }
      }]
    })
    /* ends Leads per Source */

    return res.status(201).json({
      data: {
        arrayFinal,
        arrayTotalPerSource,
        totalGeralPerSource,
        arrayLeadsPerSource
      }
    })
  } catch (error) {
    return next(error)
  }
}
