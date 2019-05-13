import models from '../../../config/sequelize'
import APIError from '../../utils/APIError'
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
      include: [{
        model: models.User,
        attributes: ['firstName', 'lastName', 'dataRegion'],
        as: 'listingAgentCtc',
        where: {
          id: {
            $col: 'Business.listingAgentCtc_id'
          }
        }
      }],
      group: [
        [{
          model: models.User,
          as: 'listingAgentCtc'
        }, 'id']
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
      include: [{
        model: models.User,
        attributes: ['firstName', 'lastName', 'dataRegion'],
        as: 'listingAgentCtc',
        where: {
          id: {
            $col: 'Business.listingAgentCtc_id'
          },
          listingAgentCtc: 1
        }
      }],
      group: [
        [{
          model: models.User,
          as: 'listingAgentCtc'
        }, 'id']
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
      include: [{
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
      }],
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
      include: [{
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
      }],
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
      include: [{
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
      }, {
        model: models.User,
        attributes: ['dataRegion'],
        as: 'listingAgentCtc',
        where: {
          id: {
            $col: 'Business.listingAgentCtc_id'
          }
        }
      }]
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

export const getBusinessesPerAnalyst = async (req, res, next) => {
  const analystId = req.query.analystId
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo

  try {
    const listBusinessesDateCreated = await models.Business.findAll({
      raw: true,
      attributes: ['id', 'businessName', 'firstNameV', 'lastNameV'],
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        },
        listingAgentCtc_id: analystId
      }
    })

    const listBusinessesSalesMemorandum = await models.Business.findAll({
      raw: true,
      attributes: ['id', 'businessName', 'firstNameV', 'lastNameV'],
      where: {
        dateChangedToSalesMemorandum: {
          $between: [dateFrom, dateTo]
        },
        listingAgentCtc_id: analystId
      }
    })

    return res.status(201).json({
      data: {
        listBusinessesDateCreated,
        listBusinessesSalesMemorandum
      }
    })
  } catch (error) {
    return next(error)
  }
}

export const getAllAnalysts = async (req, res, next) => {
  const _mapValuesToArray = array => {
    if (array.length > 0) {
      if (array[0].firstName) {
        return array.map((item, index) => ({
          key: index,
          text: `${item.firstName} ${item.lastName}`,
          value: item.id
        }))
      }
      return array.map((item, index) => ({
        key: index,
        text: item.label,
        value: item.id
      }))
    }
    return []
  }

  try {
    const allAnalysts = await models.User.findAll({
      raw: true,
      where: {
        listingAgentCtc: true
      },
      order: [
        ['firstName', 'ASC']
      ]
    })
    if (!allAnalysts) {
      throw new APIError({
        message: 'Analysts not found',
        status: 404,
        isPublic: true
      })
    }

    return res.status(201).json({
      data: _mapValuesToArray(allAnalysts),
      message: 'Analysts got successfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const getQtdeBusinessesStagePerUser = async (req, res, next) => {
  const analystId = req.query.analystId
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo

  try {
    const businessPotentialListing = await models.Business.count({
      where: {
        $and: {
          listingAgentCtc_id: analystId,
          stageId: 1
        }
      },
      distinct: 'id',
      include: {
        model: models.BusinessLog,
        as: 'BusinessLog',
        where: {
          business_id: {
            $col: 'Business.id'
          }
        }
      }
    })
    const businessAppraisal = await models.Business.count({
      where: {
        $and: {
          listingAgentCtc_id: analystId,
          stageId: 9
        }
      },
      distinct: 'id',
      include: {
        model: models.BusinessLog,
        as: 'BusinessLog',
        where: {
          business_id: {
            $col: 'Business.id'
          }
        }
      }
    })

    const businessForSale = await models.Business.count({
      where: {
        $and: {
          listingAgentCtc_id: analystId,
          stageId: 4
        }
      },
      distinct: 'id',
      include: {
        model: models.BusinessLog,
        as: 'BusinessLog',
        where: {
          business_id: {
            $col: 'Business.id'
          }
        }
      }
    })

    const businessLost = await models.Business.count({
      where: {
        $and: {
          listingAgentCtc_id: analystId,
          stageId: 8,
          lostDate: {
            $between: [dateFrom, dateTo]
          }
        }
      },
      distinct: 'id',
      include: {
        model: models.BusinessLog,
        as: 'BusinessLog',
        where: {
          business_id: {
            $col: 'Business.id'
          }
        }
      }
    })

    return res.status(201).json({
      data: {
        businessPotentialListing,
        businessAppraisal,
        businessForSale,
        businessLost
      }
    })
  } catch (error) {
    return next(error)
  }
}

export const getAnalystReport = async (req, res, next) => {
  const analystId = req.query.analystId
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo
  const stageId = req.query.stageId

  let whereOptions = {
    where: {
      listingAgentCtc_id: {
        $eq: analystId
      }
    }
  }

  let include = [{
    model: models.BusinessLog,
    as: 'BusinessLog',
    where: {
      business_id: {
        $col: 'Business.id'
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
  }]

  if (parseInt(stageId)) {
    whereOptions.where.stageId = {
      $eq: `${parseInt(stageId)}`
    }
  }
  if (stageId && parseInt(stageId) === 8) {
    whereOptions.where.lostDate = {
      $between: [dateFrom, dateTo]
    }
    include = [{
      model: models.BusinessLog,
      as: 'BusinessLog',
      where: {
        business_id: {
          $col: 'Business.id'
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
    }, {
      model: models.BusinessStageNotSigned,
      attributes: ['label'],
      as: 'stageNotSigned',
      where: {
        id: {
          $col: 'Business.stageNotSignedId'
        }
      }
    }, {
      model: models.BusinessStageNotWant,
      attributes: ['label'],
      as: 'stageNotWant',
      where: {
        id: {
          $col: 'Business.stageNotWantId'
        }
      }
    }]
  }

  try {
    const response = await models.Business.findAll(
      Object.assign(whereOptions, {
        attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'stageId', 'saleNotesLostMeeting', 'saleNotesLostWant', 'lostDate', 'afterSalesNotes', 'addLeadNurtureList', 'dateTimeCreated'],
        include: include,
        order: [
          [{
            model: models.BusinessLog,
            as: 'BusinessLog'
          }, 'followUp', 'DESC']
        ]
      })
    )
    return res.status(201).json({
      data: response,
      message: 'Analysts got successfully'
    })
  } catch (error) {
    return next(error)
  }
}
