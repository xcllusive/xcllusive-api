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
        },
        company_id: 2
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
        },
        company_id: 2
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
      attributes: ['ctcSourceId'],
      as: 'Business',
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        },
        company_id: 2
      },
      include: [{
        model: models.CtcBusinessSource,
        attributes: ['label'],
        as: 'sourceCtc',
        where: {
          id: {
            $col: 'Business.ctcSourceId'
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
      group: ['Business.ctcSourceId']
    })
    const arrayLeadsPerSourceTotalLeadsMerged = _.merge(leadsPerSourceTotalLeads.rows, leadsPerSourceTotalLeads.count)

    const leadsPerSourceSignedUp = await models.Business.findAndCountAll({
      raw: true,
      attributes: ['ctcSourceId'],
      as: 'Business',
      where: {
        dateChangedToSalesMemorandum: {
          $between: [dateFrom, dateTo]
        },
        company_id: 2
      },
      include: [{
        model: models.CtcBusinessSource,
        attributes: ['label'],
        as: 'sourceCtc',
        where: {
          id: {
            $col: 'Business.ctcSourceId'
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
      group: ['Business.ctcSourceId']
    })

    const arrayLeadsPerSourceSignedUpMerged = _.merge(leadsPerSourceSignedUp.rows, leadsPerSourceSignedUp.count)
    const arrayMerged = _.merge(arrayLeadsPerSourceTotalLeadsMerged, arrayLeadsPerSourceSignedUpMerged)
    let arrayLeadsPerSource = arrayMerged
    if (arrayLeadsPerSourceSignedUpMerged.length > 0) {
      const changedArrayName = arrayLeadsPerSourceSignedUpMerged.map(item => {
        return {
          sourceId: item.sourceId,
          'sourceCtc.label': item['sourceCtc.label'],
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
      attributes: ['ctcSourceId'],
      as: 'Business',
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        },
        company_id: 2
      },
      include: [{
        model: models.CtcBusinessSource,
        attributes: ['label'],
        as: 'sourceCtc',
        where: {
          id: {
            $col: 'Business.ctcSourceId'
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
          model: models.CtcBusinessSource,
          as: 'sourceCtc'
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
        },
        company_id: 2
      },
      include: [{
        model: models.CtcBusinessSource,
        as: 'sourceCtc',
        where: {
          id: {
            $col: 'Business.ctcSourceId'
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
        company_id: 2,
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
        company_id: 2,
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
        listingAgentCtc: true,
        active: 1
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
  // const dateFrom = req.query.dateFrom
  // const dateTo = req.query.dateTo

  try {
    const businessNew = await models.Business.count({
      where: {
        $and: {
          listingAgentCtc_id: analystId,
          ctcStageId: 2
        },
        company_id: 2
      },
      distinct: 'id',
      include: {
        model: models.BusinessLog,
        as: 'BusinessLog',
        where: {
          business_id: {
            $col: 'Business.id'
          }
        },
        company_id: 2
      }
    })
    const businessCold = await models.Business.count({
      where: {
        $and: {
          listingAgentCtc_id: analystId,
          ctcStageId: 3
        },
        company_id: 2
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

    const businessPotential = await models.Business.count({
      where: {
        $and: {
          listingAgentCtc_id: analystId,
          ctcStageId: 4,
          company_id: 2
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

    const businessHot = await models.Business.count({
      where: {
        $and: {
          listingAgentCtc_id: analystId,
          ctcStageId: 5,
          company_id: 2
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

    const businessEngaged = await models.Business.count({
      where: {
        $and: {
          listingAgentCtc_id: analystId,
          ctcStageId: 6,
          company_id: 2
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
          ctcStageId: 7,
          company_id: 2
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
        businessNew,
        businessCold,
        businessPotential,
        businessHot,
        businessEngaged,
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
      },
      company_id: 2
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
    model: models.CtcBusinessSource,
    attributes: ['label'],
    as: 'sourceCtc',
    where: {
      id: {
        $col: 'Business.ctcSourceId'
      }
    }
  }]

  if (parseInt(stageId)) {
    whereOptions.where.ctcStageId = {
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
      model: models.CtcBusinessSource,
      attributes: ['label'],
      as: 'sourceCtc',
      where: {
        id: {
          $col: 'Business.ctcSourceId'
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
        attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'ctcStageId', 'saleNotesLostMeeting', 'saleNotesLostWant', 'lostDate', 'afterSalesNotes', 'addLeadNurtureList', 'dateTimeCreated'],
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

export const getEnquiryReport = async (req, res, next) => {
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo
  const listOfIdOfAnalysts = req.query.listOfIdOfAnalysts
  let hasAnalystsSelected = true
  if (listOfIdOfAnalysts === 'false') hasAnalystsSelected = false

  let include = []
  if (hasAnalystsSelected) {
    include = [{
      model: models.EnquiryBusinessBuyer,
      as: 'EnquiryBusinessBuyer',
      attributes: ['dateTimeCreated'],
      where: {
        buyer_id: {
          $col: 'Buyer.id'
        }
      },
      include: [{
        model: models.Business,
        as: 'Business',
        attributes: ['listingAgent_id'],
        where: {
          id: {
            $col: 'EnquiryBusinessBuyer.business_id'
          },
          listingAgentCtc_id: {
            $in: listOfIdOfAnalysts
          },
          company_id: 2
        }
      }]
    }, {
      model: models.BuyerSource,
      as: 'BuyerSource',
      attributes: ['label'],
      where: {
        id: {
          $col: 'Buyer.source_id'
        }
      }
    }]
  } else {
    include = [{
      model: models.EnquiryBusinessBuyer,
      as: 'EnquiryBusinessBuyer',
      attributes: ['dateTimeCreated'],
      where: {
        buyer_id: {
          $col: 'Buyer.id'
        }
      },
      include: [{
        model: models.Business,
        as: 'Business',
        where: {
          id: {
            $col: 'EnquiryBusinessBuyer.business_id'
          },
          company_id: 2
        }
      }]
    }, {
      model: models.BuyerSource,
      as: 'BuyerSource',
      attributes: ['label'],
      where: {
        id: {
          $col: 'Buyer.source_id'
        }
      }
    }]
  }

  try {
    const newEnquiries = await models.Buyer.findAndCountAll({
      raw: true,
      attributes: ['source_id', 'dateTimeCreated'],
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        }
      },
      include: include,
      group: [
        [{
          model: models.BuyerSource,
          as: 'BuyerSource'
        }, 'id']
      ],
      order: [
        [{
          model: models.BuyerSource,
          as: 'BuyerSource'
        }, 'id', 'ASC']
      ]
    })

    if (newEnquiries.count.length === 0) {
      throw new APIError({
        message: 'There`s no data in the period information',
        status: 404,
        isPublic: true
      })
    }

    const arrayNewEnquiries = _.merge(newEnquiries.count, newEnquiries.rows)
    const arrayNewEnquiriesOrderByBigger = arrayNewEnquiries.sort(function (a, b) {
      return b.count - a.count
    })
    const countNewEnquiries = newEnquiries.count.map(item => {
      return item.count
    })
    const totalNewEnquiries = countNewEnquiries.reduce((a, b) => a + b)
    let totalEnquiries = 0
    if (hasAnalystsSelected) {
      totalEnquiries = await models.EnquiryBusinessBuyer.count({
        raw: true,
        where: {
          dateTimeCreated: {
            $between: [dateFrom, dateTo]
          }
        },
        include: [{
          model: models.Business,
          as: 'Business',
          attributes: ['listingAgent_id'],
          where: {
            id: {
              $col: 'EnquiryBusinessBuyer.business_id'
            },
            listingAgentCtc_id: {
              $in: listOfIdOfAnalysts
            },
            company_id: 2
          }
        }]
      })
    } else {
      totalEnquiries = await models.EnquiryBusinessBuyer.count({
        raw: true,
        where: {
          dateTimeCreated: {
            $between: [dateFrom, dateTo]
          }
        },
        include: [{
          model: models.Business,
          as: 'Business',
          where: {
            id: {
              $col: 'EnquiryBusinessBuyer.business_id'
            },
            company_id: 2
          }
        }]
      })
    }

    return res.status(201).json({
      data: {
        arrayNewEnquiriesOrderByBigger,
        totalNewEnquiries,
        totalEnquiries
      }
    })
  } catch (error) {
    return next(error)
  }
}
