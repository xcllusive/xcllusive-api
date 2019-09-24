import models from '../../config/sequelize'
import APIError from '../utils/APIError'
import _ from 'lodash'
import moment from 'moment'

export const getMarketingReport = async (req, res, next) => {
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo

  try {
    const offices = await models.OfficeRegister.findAll({
      raw: true,
      attributes: ['id', 'label'],
      where: {
        id: {
          $ne: 3
        }
      },
      order: [
        ['id', 'ASC']
      ]
    })
    const leadsPerAnalyst = await Promise.all(
      offices.map(async item => {
        /* LEADS PER ANALYST */
        const totalLeads = await models.Business.findAndCountAll({
          raw: true,
          attributes: ['listingAgent_id'],
          where: {
            dateTimeCreated: {
              $between: [dateFrom, dateTo]
            },
            company_id: 1
          },
          include: [{
            model: models.User,
            attributes: ['firstName', 'lastName', 'dataRegion'],
            as: 'listingAgent',
            where: {
              id: {
                $col: 'Business.listingAgent_id'
              },
              officeId: item.id
            }
          }],
          group: [
            [{
              model: models.User,
              as: 'listingAgent'
            }, 'id']
          ]
        })
        const totalLeadsMerged = _.merge(totalLeads.rows, totalLeads.count)

        const signedUp = await models.Business.count({
          raw: true,
          attributes: ['listingAgent_id'],
          where: {
            dateChangedToSalesMemorandum: {
              $between: [dateFrom, dateTo]
            },
            company_id: 1
          },
          include: [{
            model: models.User,
            attributes: ['firstName', 'lastName', 'dataRegion'],
            as: 'listingAgent',
            where: {
              id: {
                $col: 'Business.listingAgent_id'
              },
              officeId: item.id
            }
          }],
          group: [
            [{
              model: models.User,
              as: 'listingAgent'
            }, 'id']
          ]
        })
        let addLeadsSignedUp = totalLeads.rows
        if (totalLeadsMerged.length > 0) {
          const signedUpImStage = signedUp.map(item => {
            return {
              listingAgent_id: item.listingAgent_id,
              countImStage: item.count
            }
          })
          signedUpImStage.forEach(signedUp => {
            totalLeadsMerged.forEach(leads => {
              if (signedUp.listingAgent_id === leads.listingAgent_id) {
                const mergeToArray = _.merge(leads, signedUp)
                addLeadsSignedUp = _.merge(totalLeadsMerged, mergeToArray)
              }
            })
          })
        }
        const arrayOffices = _.uniq(addLeadsSignedUp, 'listingAgent_id')

        const ctcLeadsPerOffice = await models.Business.count({
          raw: true,
          attributes: ['company_id'],
          as: 'Business',
          where: {
            dateTimeCreated: {
              $between: [dateFrom, dateTo]
            },
            company_id: 2
          },
          include: [{
            model: models.User,
            attributes: ['dataRegion'],
            as: 'listingAgent',
            where: {
              id: {
                $col: 'Business.listingAgent_id'
              },
              officeId: item.id
            }
          }],
          group: [
            [{
              model: models.User,
              as: 'listingAgent'
            }, 'dataRegion']
          ]
        })
        const ctcLeadsPerOfficeCount = ctcLeadsPerOffice.map(item => {
          return {
            countCtc: item.count
          }
        })
        let arrayFinal = []
        if (arrayOffices.length !== 0) {
          const mergeWithCtcLeads = _.merge(arrayOffices, ctcLeadsPerOfficeCount)

          mergeWithCtcLeads.forEach(item => {
            arrayFinal.push({
              listingAgent_id: item.listingAgent_id,
              firstName: item['listingAgent.firstName'],
              lastName: item['listingAgent.lastName'],
              dataRegion: item['listingAgent.dataRegion'],
              totalLeads: item.count,
              signed: item.countImStage ? item.countImStage : 0,
              convertionRate: item.countImStage > 0 ? `${Math.trunc((item.countImStage / item.count) * 100)}%` : 0,
              countCtc: item.countCtc > 0 ? item.countCtc : null
            })
          })
        } else {
          ctcLeadsPerOfficeCount.forEach(ctcLeads => {
            arrayFinal.push({
              dataRegion: item.label,
              countCtc: ctcLeads.countCtc > 0 ? ctcLeads.countCtc : null
            })
          })
        }
        return arrayFinal
      })
    )
    const totalLeads = await models.Business.count({
      as: 'Business',
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [{
        model: models.User,
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          officeId: {
            $ne: 3
          }
        }
      }]
    })
    const totalSignedUp = await models.Business.count({
      as: 'Business',
      where: {
        dateChangedToSalesMemorandum: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [{
        model: models.User,
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          listingAgent: 1,
          active: 1,
          officeId: {
            $ne: 3
          }
        }
      }]
    })

    /* LEADS PER SOURCE */
    const leadsPerSource = await Promise.all(
      offices.map(async item => {
        const leadsPerSourceCreated = await models.Business.findAndCountAll({
          raw: true,
          attributes: ['sourceId'],
          as: 'Business',
          where: {
            dateTimeCreated: {
              $between: [dateFrom, dateTo]
            },
            company_id: 1
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
            attributes: ['dataRegion', 'officeId'],
            as: 'listingAgent',
            where: {
              id: {
                $col: 'Business.listingAgent_id'
              },
              officeId: item.id
            }
          }],
          group: ['Business.sourceId']
        })
        const mergeLeadsPerSource = _.merge(leadsPerSourceCreated.rows, leadsPerSourceCreated.count)

        const leadsPerSourceSignedUp = await models.Business.findAndCountAll({
          raw: true,
          attributes: ['sourceId'],
          as: 'Business',
          where: {
            dateChangedToSalesMemorandum: {
              $between: [dateFrom, dateTo]
            },
            company_id: 1
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
            attributes: ['dataRegion', 'officeId'],
            as: 'listingAgent',
            where: {
              id: {
                $col: 'Business.listingAgent_id'
              },
              officeId: item.id
            }
          }],
          group: ['Business.sourceId']
        })

        const mergeLeadsPerSourceSignedUp = _.merge(leadsPerSourceSignedUp.rows, leadsPerSourceSignedUp.count)
        let arrayLeadsPerSourceOffices = mergeLeadsPerSource
        if (mergeLeadsPerSourceSignedUp.length > 0) {
          const changeArrayName = mergeLeadsPerSourceSignedUp.map(item => {
            return {
              sourceId: item.sourceId,
              'source.label': item['source.label'],
              'listingAgent.dataRegion': item['listingAgent.dataRegion'],
              'listingAgent.officeId': item['listingAgent.officeId'],
              countSignedUp: item.count
            }
          })
          mergeLeadsPerSource.forEach(items => {
            changeArrayName.forEach(items2 => {
              if (items.sourceId === items2.sourceId) {
                const mergeToArray = _.merge(items2, items)
                arrayLeadsPerSourceOffices = _.merge(changeArrayName, mergeToArray)
              } else {
                arrayLeadsPerSourceOffices = _.merge(changeArrayName, mergeLeadsPerSource)
              }
            })
          })
        }

        let arrayFinalLeadsPerSource = []
        arrayLeadsPerSourceOffices.map(item => {
          arrayFinalLeadsPerSource.push({
            sourceId: item.sourceId,
            sourceLabel: item['source.label'],
            dataRegion: item['listingAgent.dataRegion'],
            officeId: item['listingAgent.officeId'],
            totalLeads: item.count,
            totalSignedUp: item.countSignedUp ? item.countSignedUp : 0,
            convertionRate: item.countSignedUp > 0 ? `${Math.trunc((item.countSignedUp / item.count) * 100)}%` : 0
          })
        })
        return arrayFinalLeadsPerSource
      })
    )

    const totalPerSource = await models.Business.findAndCountAll({
      raw: true,
      attributes: ['sourceId'],
      as: 'Business',
      where: {
        dateTimeCreated: {
          $between: [dateFrom, dateTo]
        },
        company_id: 1
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

    return res.status(200).json({
      leadsPerAnalyst,
      leadsPerSource,
      totalLeads,
      totalSignedUp,
      totalConvertionRate: Math.trunc((totalSignedUp / totalLeads) * 100),
      arrayTotalPerSource,
      totalGeralPerSource
    })
  } catch (error) {
    return next(error)
  }
}

export const getAllAnalysts = async (req, res, next) => {
  const {
    companyId
  } = req.query
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

  let whereOptions = {}
  if (parseInt(companyId) === 1) {
    whereOptions = {
      listingAgent: true,
      active: 1
    }
  } else {
    whereOptions = {
      listingAgentCtc: true,
      active: 1
    }
  }

  try {
    const allAnalysts = await models.User.findAll({
      raw: true,
      where: whereOptions,
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

export const getAnalystReport = async (req, res, next) => {
  const analystId = req.query.analystId
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo
  const stageId = req.query.stageId

  let whereOptions = {
    where: {
      listingAgent_id: {
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

export const getQtdeBusinessesStagePerUser = async (req, res, next) => {
  const analystId = req.query.analystId
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo

  try {
    const businessPotentialListing = await models.Business.count({
      where: {
        $and: {
          listingAgent_id: analystId,
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
          listingAgent_id: analystId,
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
          listingAgent_id: analystId,
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
          listingAgent_id: analystId,
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

export const getBusinessesPerAnalystSource = async (req, res, next) => {
  const analystSourceId = req.query.analystSourceId
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo
  const type = req.query.type
  const officeId = req.query.officeId

  let whereOptions = {}
  let whereOptionIM = {}
  if (type === 'analyst') {
    whereOptions = {
      dateTimeCreated: {
        $between: [dateFrom, dateTo]
      },
      listingAgent_id: analystSourceId,
      company_id: 1
    }
    whereOptionIM = {
      dateChangedToSalesMemorandum: {
        $between: [dateFrom, dateTo]
      },
      listingAgent_id: analystSourceId,
      company_id: 1
    }
  }
  if (type === 'source' || type === 'totalSource') {
    whereOptions = {
      dateTimeCreated: {
        $between: [dateFrom, dateTo]
      },
      sourceId: analystSourceId,
      company_id: 1
    }
    whereOptionIM = {
      dateChangedToSalesMemorandum: {
        $between: [dateFrom, dateTo]
      },
      sourceId: analystSourceId,
      company_id: 1
    }
  }
  if (type === 'sourceSold') {
    whereOptions = {
      dateChangedToSalesMemorandum: {
        $between: [dateFrom, dateTo]
      },
      sourceId: analystSourceId,
      company_id: 1
    }
    whereOptionIM = {
      dateChangedToSalesMemorandum: {
        $between: [dateFrom, dateTo]
      },
      sourceId: analystSourceId,
      company_id: 1
    }
  }

  try {
    let listBusinessesDateCreated = []
    let listBusinessesSalesMemorandum = []
    let businessSold = []
    if (type === 'analyst') {
      listBusinessesDateCreated = await models.Business.findAll({
        raw: true,
        attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'dateTimeAssignToAgent', 'dateTimeFirstOpenByAgent'],
        where: whereOptions
      })

      listBusinessesSalesMemorandum = await models.Business.findAll({
        raw: true,
        attributes: ['id', 'businessName', 'firstNameV', 'lastNameV'],
        where: whereOptionIM
      })
    }
    // cayo
    if (type === 'source') {
      listBusinessesDateCreated = await models.Business.findAll({
        raw: true,
        attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'dateTimeAssignToAgent', 'dateTimeFirstOpenByAgent', 'listingAgent_id'],
        where: whereOptions,
        include: [{
          model: models.User,
          as: 'listingAgent',
          attributes: ['id'],
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            officeId: officeId
          }
        }]
      })

      listBusinessesSalesMemorandum = await models.Business.findAll({
        raw: true,
        attributes: ['id', 'businessName', 'firstNameV', 'lastNameV'],
        where: whereOptionIM,
        include: [{
          model: models.User,
          as: 'listingAgent',
          attributes: ['id'],
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            officeId: officeId
          }
        }]
      })
    }
    if (type === 'totalSource') {
      listBusinessesDateCreated = await models.Business.findAll({
        raw: true,
        attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'dateTimeAssignToAgent', 'dateTimeFirstOpenByAgent', 'listingAgent_id'],
        where: whereOptions
      })

      listBusinessesSalesMemorandum = await models.Business.findAll({
        raw: true,
        attributes: ['id', 'businessName', 'firstNameV', 'lastNameV'],
        where: whereOptionIM
      })
    }
    if (type === 'sourceSold') {
      listBusinessesDateCreated = await models.Business.findAll({
        raw: true,
        attributes: ['id', 'businessName', 'firstNameV', 'lastNameV', 'dateTimeAssignToAgent', 'dateTimeFirstOpenByAgent'],
        where: whereOptions
      })

      const sold = await models.BusinessSold.findAll({
        raw: true,
        attributes: ['soldPrice'],
        where: {
          sold: true,
          dateTimeCreated: {
            $between: [dateFrom, dateTo]
          }
        },
        include: [{
          model: models.Business,
          attributes: ['id', 'businessName', 'firstNameV', 'lastNameV'],
          where: {
            id: {
              $col: 'BusinessSold.business_id'
            },
            sourceId: analystSourceId
          }
        }]
      })

      sold.map(item => {
        businessSold.push({
          id: item['Business.id'],
          businessName: item['Business.businessName'],
          firstNameV: item['Business.firstNameV'],
          lastNameV: item['Business.lastNameV']
        })
      })
    }
    return res.status(201).json({
      data: {
        listBusinessesDateCreated,
        listBusinessIMSold: type === 'analyst' || type === 'source' ? listBusinessesSalesMemorandum : businessSold
      }
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
          listingAgent_id: {
            $in: listOfIdOfAnalysts
          },
          company_id: 1
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
          company_id: 1
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
            listingAgent_id: {
              $in: listOfIdOfAnalysts
            },
            company_id: 1
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
            company_id: 1
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

export const getUsersPerRegion = async (req, res, next) => {
  const region = req.query.region

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
    // Verify exists buyer
    const users = await models.User.findAll({
      where: {
        officeId: region,
        active: 1
      },
      order: [
        ['firstName', 'ASC']
      ]
    })

    if (!users) {
      throw new APIError({
        message: 'Users not found',
        status: 404,
        isPublic: true
      })
    }

    return res.status(201).json({
      data: _mapValuesToArray(users),
      message: 'Get users per region succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const activityRequestControlPerUser = async (req, res, next) => {
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo
  const userId = req.query.userIdSelected

  const dateB = moment(dateTo)
  const dateC = moment(dateFrom)
  const totalDays = dateB.diff(dateC, 'days') + 1

  try {
    let date = null
    let array = []
    let listUserActivity = null
    for (let i = 0; i < totalDays; i++) {
      date = moment(dateFrom).add(i, 'days')
      const dateStart = moment(date).format('YYYY-MM-DD 00:00:00')
      const dateEnd = moment(date).format('YYYY-MM-DD 23:59:59')
      listUserActivity = await models.ControlActivity.count({
        raw: true,
        attributes: ['userId_logged', 'dateCreated'],
        where: {
          userId_logged: userId,
          dateTimeCreated: {
            $between: [dateStart, dateEnd]
          }
        },
        group: ['userId_logged', 'dateCreated']
      })
      if (listUserActivity.length === 0) {
        array.push({
          userId_logged: parseInt(userId),
          dateCreated: moment(date).format('YYYY-MM-DD'),
          count: 0
        })
      } else {
        array.push({
          userId_logged: parseInt(userId),
          dateCreated: moment(date).format('YYYY-MM-DD'),
          count: listUserActivity[0].count
        })
      }
    }

    const formattedListUserActivity = array.map(item => {
      return {
        userId_logged: item.userId_logged,
        activity: item.count,
        dateCreated: `${moment(item.dateCreated).format('DD/MM')} [${moment(item.dateCreated).format('dddd')}]`,
        dateRaw: moment(item.dateCreated).format('YYYY-MM-DD')
      }
    })

    const countTotalsPerDate = array.map(({
      count
    }) => count)
    const maxTotalsPerDate = Math.max(...countTotalsPerDate)

    const minTotalsPerDate = Math.min(...countTotalsPerDate.filter(zero => zero !== 0))
    const avgTotalsPerDate = Math.round(_.meanBy(array, p => p.count))

    /* Get Total From All Analysts */
    const totalAnalysts = await models.ControlActivity.count({
      raw: true,
      include: [{
        model: models.User,
        as: 'userLogged',
        where: {
          id: {
            $col: 'ControlActivity.userId_logged'
          },
          listingAgent: 1,
          roles: {
            $like: '%BUSINESS_MENU%'
          }
        }
      }],
      where: {
        dateCreated: {
          $between: [dateFrom, dateTo]
        }
      },
      group: ['dateCreated', 'userId_logged']
    })
    const countTotalsAnalystsPerDate = totalAnalysts.map(({
      count
    }) => count)
    const maxTotalsAnalystsPerDate = Math.max(...countTotalsAnalystsPerDate)
    const avgTotalsAnalystsPerDate = Math.round(_.meanBy(totalAnalysts, p => p.count))
    /* End */

    /* Get Total From All Brokers */
    const totalBrokers = await models.ControlActivity.count({
      raw: true,
      include: [{
        model: models.User,
        as: 'userLogged',
        where: {
          id: {
            $col: 'ControlActivity.userId_logged'
          },
          listingAgent: 0,
          userType: 'Broker',
          roles: {
            $notLike: '%BUSINESS_MENU%'
          }
        }
      }],
      where: {
        dateCreated: {
          $between: [dateFrom, dateTo]
        }
      },
      group: ['dateCreated', 'userId_logged']
    })
    const countTotalsBrokersPerDate = totalBrokers.map(({
      count
    }) => count)
    const maxTotalsBrokersPerDate = Math.max(...countTotalsBrokersPerDate)
    const avgTotalsBrokersPerDate = Math.round(_.meanBy(totalBrokers, p => p.count))
    /* End */

    return res.status(201).json({
      data: formattedListUserActivity,
      maxTotalsPerDate,
      minTotalsPerDate,
      avgTotalsPerDate,
      maxTotalsAnalystsPerDate,
      avgTotalsAnalystsPerDate,
      maxTotalsBrokersPerDate,
      avgTotalsBrokersPerDate
    })
  } catch (error) {
    return next(error)
  }
}

export const getDailyTimeActivityReport = async (req, res, next) => {
  const id = req.query.id
  const date = req.query.date

  try {
    let dailyTime = 0
    let array = []
    for (let i = 0; i < 24; i++) {
      let dateTimeBegin = moment(date).format(`YYYY-MM-DD ${i}:00:00`)
      let dateTimeEnd = moment(date).format(`YYYY-MM-DD ${i}:59:59`)
      dailyTime = await models.ControlActivity.count({
        raw: true,
        attributes: ['dateTimeCreated'],
        where: {
          userId_logged: id,
          dateTimeCreated: {
            $between: [dateTimeBegin, dateTimeEnd]
          }
        }
      })
      array.push({
        time: i <= 9 ? `0${i}:00:00` : `${i}:00:00`,
        activity: dailyTime
      })
    }
    const user = await models.User.findOne({
      raw: true,
      where: {
        id: id
      }
    })
    return res.status(201).json({
      data: array,
      user,
      message: 'Get report succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const getCtcBusinessesPerOffice = async (req, res, next) => {
  const dataRegion = req.query.dataRegion
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
        company_id: 2
      },
      include: [{
        model: models.User,
        attributes: ['dataRegion'],
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: dataRegion
        }
      }]
    })

    return res.status(201).json({
      data: {
        listBusinessesDateCreated
      }
    })
  } catch (error) {
    return next(error)
  }
}

export const getSoldBySource = async (req, res, next) => {
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo

  try {
    const sourceBusinesses = await models.Business.findAndCountAll({
      raw: true,
      attributes: ['id'],
      where: {
        dateChangedToSalesMemorandum: {
          $between: [dateFrom, dateTo]
        }
      },
      include: [{
        model: models.BusinessSource,
        attributes: ['label', 'id'],
        as: 'source',
        where: {
          id: {
            $col: 'Business.sourceId'
          }
        }
      }],
      group: ['Business.sourceId']
    })
    const countBusinessSource = _.merge(sourceBusinesses.rows, sourceBusinesses.count)

    let totalEngaged = 0
    let totalSold = 0
    let totalSoldPrice = 0
    const arraySoldPriceBySource = await Promise.all(
      countBusinessSource.map(async item => {
        let totalSoldPricePerSource = 0
        const soldPrice = await models.BusinessSold.findAndCountAll({
          raw: true,
          attributes: ['soldPrice'],
          where: {
            sold: true,
            dateTimeCreated: {
              $between: [dateFrom, dateTo]
            }
          },
          include: [{
            model: models.Business,
            attributes: ['id'],
            where: {
              id: {
                $col: 'BusinessSold.business_id'
              },
              sourceId: item['source.id']
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
            }]
          }]
        })
        const businessSold = _.merge(soldPrice.rows, soldPrice.count)
        if (businessSold.length > 0) {
          businessSold.map(sold => {
            if (item['source.id'] === sold['Business.source.id']) {
              totalSoldPricePerSource = totalSoldPricePerSource + sold.soldPrice
            }
            totalSoldPrice = totalSoldPrice + sold.soldPrice
          })
        }
        totalEngaged = totalEngaged + item.count
        totalSold = totalSold + soldPrice.count

        return {
          sourceId: item['source.id'],
          sourceLabel: item['source.label'],
          totalPerSource: item.count,
          countBusinessSold: soldPrice.count,
          totalSoldPricePerSource: totalSoldPricePerSource
        }
      })
    )

    return res.status(201).json({
      data: arraySoldPriceBySource,
      totalEngaged,
      totalSold,
      totalSoldPrice,
      message: 'Analysts got successfully'
    })
  } catch (error) {
    return next(error)
  }
}
