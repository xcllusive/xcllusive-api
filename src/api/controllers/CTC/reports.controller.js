import models from '../../../config/sequelize'
// import APIError from '../../utils/APIError'
import _ from 'lodash'
// import moment from 'moment'

export const getMarketingReport = async (req, res, next) => {
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo

  try {
    /* starts Leads per Analyst */
    const dateTimeCreated = await models.Business.findAndCountAll({
      raw: true,
      attributes: ['listingAgentCtc_id'],
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [
        {
          model: models.User,
          attributes: ['firstName', 'lastName', 'dataRegion'],
          as: 'listingAgentCtc',
          where: {
            id: {
              $col: 'Business.listingAgentCtc_id'
            }
          }
        }
      ],
      group: [
        [
          {
            model: models.User,
            as: 'listingAgentCtc'
          }, 'id'
        ]
      ]
    })
    const totalLeads = _.merge(dateTimeCreated.rows, dateTimeCreated.count)

    const dateChangedToSalesMemorandum = await models.Business.findAndCountAll({
      raw: true,
      attributes: ['listingAgentCtc_id'],
      where: {
        dateChangedToSalesMemorandum: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [
        {
          model: models.User,
          attributes: ['firstName', 'lastName', 'dataRegion'],
          as: 'listingAgentCtc',
          where: {
            id: {
              $col: 'Business.listingAgentCtc_id'
            },
            listingAgentCtc: 1
          }
        }
      ],
      group: [
        [
          {
            model: models.User,
            as: 'listingAgentCtc'
          }, 'id'
        ]
      ]
    })
    const signedUp = _.merge(dateChangedToSalesMemorandum.rows, dateChangedToSalesMemorandum.count)
    const mergedArray = _.merge(totalLeads, signedUp)
    let leadsPerAnalyst = totalLeads
    if (mergedArray.length > 0) {
      const changedArrayName = signedUp.map(item => {
        return {
          listingAgentCtc_id: item.listingAgentCtc_id,
          countImStage: item.count
        }
      })
      changedArrayName.forEach(items => {
        mergedArray.forEach(items2 => {
          if (items.listingAgentCtc_id === items2.listingAgentCtc_id) {
            const mergeToArray = _.merge(items2, items)
            leadsPerAnalyst = _.merge(mergedArray, mergeToArray)
          }
        })
      })
    }

    let sumLeads = 0
    let sumIm = 0
    let index = 0
    let sumConvertionRate = 0
    leadsPerAnalyst.forEach(items => {
      if (!items.countImStage) {
        items.countImStage = 0
      }
      sumLeads = sumLeads + items.count
      sumIm = sumIm + items.countImStage
      if (items.count > 0 && items.countImStage) sumConvertionRate = sumConvertionRate + (items.count / items.countImStage) * 100
      index++
    })
    let totalsArray = []
    totalsArray.push({
      sumLeads,
      sumIm,
      index,
      sumConvertionRate
    })
    /* ends Leads per Analyst */

    /* starts Leads per Source */
    const leadsPerSourceTotalLeads = await models.Business.findAndCountAll({
      raw: true,
      attributes: ['sourceId'],
      as: 'Business',
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [
        {
          model: models.BusinessSource,
          attributes: ['label'],
          as: 'source',
          where: {
            id: {
              $col: 'Business.sourceId'
            }
          }
        }, {
          model: models.User,
          attributes: ['dataRegion'],
          as: 'listingAgentCtc',
          where: {
            id: {
              $col: 'Business.listingAgentCtc_id'
            }
          }
        }
      ],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceTotalLeadsMerged = _.merge(leadsPerSourceTotalLeads.rows, leadsPerSourceTotalLeads.count)

    const leadsPerSourceSignedUp = await models.Business.findAndCountAll({
      raw: true,
      attributes: ['sourceId'],
      as: 'Business',
      where: {
        dateChangedToSalesMemorandum: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [
        {
          model: models.BusinessSource,
          attributes: ['label'],
          as: 'source',
          where: {
            id: {
              $col: 'Business.sourceId'
            }
          }
        }, {
          model: models.User,
          attributes: ['dataRegion'],
          as: 'listingAgentCtc',
          where: {
            id: {
              $col: 'Business.listingAgentCtc_id'
            }
          }
        }
      ],
      group: ['Business.sourceId']
    })

    const arrayLeadsPerSourceSignedUpMerged = _.merge(leadsPerSourceSignedUp.rows, leadsPerSourceSignedUp.count)
    const arrayMerged = _.merge(arrayLeadsPerSourceTotalLeadsMerged, arrayLeadsPerSourceSignedUpMerged)
    let arrayLeadsPerSource = arrayMerged
    if (arrayLeadsPerSourceSignedUpMerged.length > 0) {
      const changedArrayName = arrayLeadsPerSourceSignedUpMerged.map(item => {
        return {
          sourceId: item.sourceId,
          'source.label': item['source.label'],
          countSourceSignedUp: item.count
        }
      })
      arrayMerged.forEach(items => {
        changedArrayName.forEach(items2 => {
          if (items.sourceId === items2.sourceId) {
            const mergeToArray = _.merge(items2, items)
            arrayLeadsPerSource = _.merge(changedArrayName, mergeToArray)
          } else {
            arrayLeadsPerSource = _.merge(changedArrayName, arrayMerged)
          }
        })
      })
    }
    /* end Leads per Source */

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
      include: [
        {
          model: models.BusinessSource,
          attributes: ['label'],
          as: 'source',
          where: {
            id: {
              $col: 'Business.sourceId'
            }
          }
        }, {
          model: models.User,
          attributes: ['dataRegion'],
          as: 'listingAgentCtc',
          where: {
            id: {
              $col: 'Business.listingAgentCtc_id'
            }
          }
        }
      ],
      group: [
        [
          {
            model: models.BusinessSource,
            as: 'source'
          }, 'id'
        ]
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
      include: [
        {
          model: models.BusinessSource,
          as: 'source',
          where: {
            id: {
              $col: 'Business.sourceId'
            }
          }
        }, {
          model: models.User,
          attributes: ['dataRegion'],
          as: 'listingAgentCtc',
          where: {
            id: {
              $col: 'Business.listingAgentCtc_id'
            }
          }
        }
      ]
    })
    /* ends Total per Source */

    return res.status(201).json({
      data: {
        leadsPerAnalyst,
        totalsArray,
        arrayLeadsPerSource,
        arrayTotalPerSource,
        totalGeralPerSource
      }
    })
  } catch (error) {
    return next(error)
  }
}
