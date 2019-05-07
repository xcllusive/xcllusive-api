import models from '../../config/sequelize'
import APIError from '../utils/APIError'
import _ from 'lodash'
import moment from 'moment'

export const getMarketingReport = async (req, res, next) => {
  const dateFrom = req.query.dateFrom
  const dateTo = req.query.dateTo

  try {
    /* starts Leads per Analyst */
    const dateTimeCreated = await models.Business.findAll({
      raw: true,
      attributes: ['listingAgent_id'],
      where:
      // Sequelize.where(
      //   Sequelize.fn('date', Sequelize.col('dateTimeCreated')), 'between', dateFrom,
      //   Sequelize.and(
      //     Sequelize.fn('date', Sequelize.col('dateTimeCreated')), '<=', dateTo
      //   )
      // ),

      {
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
          },
          listingAgent: 1
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
    let arrayFinal = dateTimeCreated
    if (mergeArray.length > 0) {
      const changedArrayName = dateChangedToSalesMemorandum.map(item => {
        return {
          listingAgent_id: item.listingAgent_id,
          countImStage: item.count
        }
      })
      changedArrayName.forEach(items => {
        mergeArray.forEach(items2 => {
          if (items.listingAgent_id === items2.listingAgent_id) {
            const mergeToArray = _.merge(items2, items)
            arrayFinal = _.merge(mergeArray, mergeToArray)
          }
        })
      })
    }

    let sumLeadsAdelaide = 0
    let sumImAdelaide = 0
    let indexAdelaide = 0
    let sumConvertionRateAdelaide = 0
    let sumLeadsCamberra = 0
    let sumImCamberra = 0
    let indexCamberra = 0
    let sumConvertionRateCamberra = 0
    let sumLeadsCowra = 0
    let sumImCowra = 0
    let indexCowra = 0
    let sumConvertionRateCowra = 0
    let sumLeadsGosford = 0
    let sumImGosford = 0
    let indexGosford = 0
    let sumConvertionRateGosford = 0
    let sumLeadsMelbourne = 0
    let sumImMelbourne = 0
    let indexMelbourne = 0
    let sumConvertionRateMelbourne = 0
    let sumLeadsSydney = 0
    let sumImSydney = 0
    let indexSydney = 0
    let sumConvertionRateSydney = 0
    let sumLeadsQueensland = 0
    let sumImQueensland = 0
    let indexQueensland = 0
    let sumConvertionRateQueensland = 0
    arrayFinal.forEach(items => {
      if (!items.countImStage) {
        items.countImStage = 0
      }
      if (items['listingAgent.dataRegion'] === 'Adelaide Office') {
        sumLeadsAdelaide = sumLeadsAdelaide + items.count
        sumImAdelaide = sumImAdelaide + items.countImStage
        if (items.count > 0 && items.countImStage) sumConvertionRateAdelaide = sumConvertionRateAdelaide + (items.count / items.countImStage) * 100
        indexAdelaide++
      }
      if (items['listingAgent.dataRegion'] === 'Camberra Office') {
        sumLeadsCamberra = sumLeadsCamberra + items.count
        sumImCamberra = sumImCamberra + items.countImStage
        if (items.count > 0 && items.countImStage) sumConvertionRateCamberra = sumConvertionRateCamberra + (items.count / items.countImStage) * 100
        indexCamberra++
      }
      if (items['listingAgent.dataRegion'] === 'Cowra Office') {
        sumLeadsCowra = sumLeadsCowra + items.count
        sumImCowra = sumImCowra + items.countImStage
        if (items.count > 0 && items.countImStage) sumConvertionRateCowra = sumConvertionRateCowra + (items.count / items.countImStage) * 100
        indexCowra++
      }
      if (items['listingAgent.dataRegion'] === 'Gosford Office') {
        sumLeadsGosford = sumLeadsGosford + items.count
        sumImGosford = sumImGosford + items.countImStage
        if (items.count > 0 && items.countImStage) sumConvertionRateGosford = sumConvertionRateGosford + (items.count / items.countImStage) * 100
        indexGosford++
      }
      if (items['listingAgent.dataRegion'] === 'Melbourne Office') {
        sumLeadsMelbourne = sumLeadsMelbourne + items.count
        sumImMelbourne = sumImMelbourne + items.countImStage
        if (items.count > 0 && items.countImStage) sumConvertionRateMelbourne = sumConvertionRateMelbourne + (items.count / items.countImStage) * 100
        indexMelbourne++
      }
      if (items['listingAgent.dataRegion'] === 'Sydney Office') {
        sumLeadsSydney = sumLeadsSydney + items.count
        sumImSydney = sumImSydney + items.countImStage
        if (items.count > 0 && items.countImStage) sumConvertionRateSydney = sumConvertionRateSydney + (items.count / items.countImStage) * 100
        indexSydney++
      }
      if (items['listingAgent.dataRegion'] === 'Queensland Office') {
        sumLeadsQueensland = sumLeadsQueensland + items.count
        sumImQueensland = sumImQueensland + items.countImStage
        if (items.count > 0 && items.countImStage) sumConvertionRateQueensland = sumConvertionRateQueensland + (items.count / items.countImStage) * 100
        indexQueensland++
      }
    })
    let arrayAdelaide = []
    arrayAdelaide.push({
      sumLeadsAdelaide,
      sumImAdelaide,
      indexAdelaide,
      sumConvertionRateAdelaide
    })
    let arrayCamberra = []
    arrayCamberra.push({
      sumLeadsCamberra,
      sumImCamberra,
      indexCamberra,
      sumConvertionRateCamberra
    })
    let arrayCowra = []
    arrayCowra.push({
      sumLeadsCowra,
      sumImCowra,
      indexCowra,
      sumConvertionRateCowra
    })
    let arrayGosford = []
    arrayGosford.push({
      sumLeadsGosford,
      sumImGosford,
      indexGosford,
      sumConvertionRateGosford
    })
    let arrayMelbourne = []
    arrayMelbourne.push({
      sumLeadsMelbourne,
      sumImMelbourne,
      indexMelbourne,
      sumConvertionRateMelbourne
    })
    let arraySydney = []
    arraySydney.push({
      sumLeadsSydney,
      sumImSydney,
      indexSydney,
      sumConvertionRateSydney
    })
    let arrayQueensland = []
    arrayQueensland.push({
      sumLeadsQueensland,
      sumImQueensland,
      indexQueensland,
      sumConvertionRateQueensland
    })
    let arrayOffices = []
    arrayOffices.push({
      arrayAdelaide,
      arrayCamberra,
      arrayCowra,
      arrayGosford,
      arrayMelbourne,
      arraySydney,
      arrayQueensland
    })
    /* ends Leads per Analyst */

    /* starts Leads per Source */
    // Adelaide
    const leadsPerSourceAdelaideCreated = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Adelaide Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceAdelaideCreated = _.merge(leadsPerSourceAdelaideCreated.rows, leadsPerSourceAdelaideCreated.count)

    const leadsPerSourceAdelaideIM = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Adelaide Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceAdelaideIMMerge = _.merge(leadsPerSourceAdelaideIM.rows, leadsPerSourceAdelaideIM.count)
    let arrayLeadsPerSourceAdelaide = arrayLeadsPerSourceAdelaideCreated
    if (arrayLeadsPerSourceAdelaideIMMerge.length > 0) {
      const changedArrayAdelaideName = arrayLeadsPerSourceAdelaideIMMerge.map(item => {
        return {
          sourceId: item.sourceId,
          'source.label': item['source.label'],
          'listingAgent.dataRegion': item['listingAgent.dataRegion'],
          countSourceImStageAdelaide: item.count
        }
      })
      arrayLeadsPerSourceAdelaideCreated.forEach(items => {
        changedArrayAdelaideName.forEach(items2 => {
          if (items.sourceId === items2.sourceId) {
            const mergeToArray = _.merge(items2, items)
            arrayLeadsPerSourceAdelaide = _.merge(changedArrayAdelaideName, mergeToArray)
          } else {
            arrayLeadsPerSourceAdelaide = _.merge(changedArrayAdelaideName, arrayLeadsPerSourceAdelaideCreated)
          }
        })
      })
    }

    // Camberra
    const leadsPerSourceCamberraCreated = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Camberra Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceCamberraCreated = _.merge(leadsPerSourceCamberraCreated.rows, leadsPerSourceCamberraCreated.count)

    const leadsPerSourceCamberraIM = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Camberra Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceCamberraIMMerge = _.merge(leadsPerSourceCamberraIM.rows, leadsPerSourceCamberraIM.count)
    let arrayLeadsPerSourceCamberra = arrayLeadsPerSourceCamberraCreated
    if (arrayLeadsPerSourceCamberraIMMerge.length > 0) {
      const changedArrayCamberraName = arrayLeadsPerSourceCamberraIMMerge.map(item => {
        return {
          'source.label': item['source.label'],
          'listingAgent.dataRegion': item['listingAgent.dataRegion'],
          countSourceImStageCamberra: item.count
        }
      })
      arrayLeadsPerSourceCamberraCreated.forEach(items => {
        changedArrayCamberraName.forEach(items2 => {
          if (items.sourceId === items2.sourceId) {
            const mergeToArray = _.merge(items2, items)
            arrayLeadsPerSourceCamberra = _.merge(changedArrayCamberraName, mergeToArray)
          } else {
            arrayLeadsPerSourceCamberra = _.merge(changedArrayCamberraName, arrayLeadsPerSourceCamberraCreated)
          }
        })
      })
    }

    // Cowra
    const leadsPerSourceCowraCreated = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Cowra Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceCowraCreated = _.merge(leadsPerSourceCowraCreated.rows, leadsPerSourceCowraCreated.count)

    const leadsPerSourceCowraIM = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Cowra Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceCowraIMMerge = _.merge(leadsPerSourceCowraIM.rows, leadsPerSourceCowraIM.count)
    let arrayLeadsPerSourceCowra = arrayLeadsPerSourceCowraCreated
    if (arrayLeadsPerSourceCowraIMMerge.length > 0) {
      const changedArrayCowraName = arrayLeadsPerSourceCowraIMMerge.map(item => {
        return {
          sourceId: item.sourceId,
          'source.label': item['source.label'],
          'listingAgent.dataRegion': item['listingAgent.dataRegion'],
          countSourceImStageCowra: item.count
        }
      })
      arrayLeadsPerSourceCowraCreated.forEach(items => {
        changedArrayCowraName.forEach(items2 => {
          if (items.sourceId === items2.sourceId) {
            const mergeToArray = _.merge(items2, items)
            arrayLeadsPerSourceCowra = _.merge(changedArrayCowraName, mergeToArray)
          } else {
            arrayLeadsPerSourceCowra = _.merge(changedArrayCowraName, arrayLeadsPerSourceCowraCreated)
          }
        })
      })
    }

    // Gosford
    const leadsPerSourceGosfordCreated = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Gosford Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceGosfordCreated = _.merge(leadsPerSourceGosfordCreated.rows, leadsPerSourceGosfordCreated.count)

    const leadsPerSourceGosfordIM = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Gosford Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceGosfordIMMerge = _.merge(leadsPerSourceGosfordIM.rows, leadsPerSourceGosfordIM.count)
    let arrayLeadsPerSourceGosford = arrayLeadsPerSourceGosfordCreated
    if (arrayLeadsPerSourceGosfordIMMerge.length > 0) {
      const changedArrayGosfordName = arrayLeadsPerSourceGosfordIMMerge.map(item => {
        return {
          sourceId: item.sourceId,
          'source.label': item['source.label'],
          'listingAgent.dataRegion': item['listingAgent.dataRegion'],
          countSourceImStageGosford: item.count
        }
      })
      arrayLeadsPerSourceGosfordCreated.forEach(items => {
        changedArrayGosfordName.forEach(items2 => {
          if (items.sourceId === items2.sourceId) {
            const mergeToArray = _.merge(items2, items)
            arrayLeadsPerSourceGosford = _.merge(changedArrayGosfordName, mergeToArray)
          } else {
            arrayLeadsPerSourceGosford = _.merge(changedArrayGosfordName, arrayLeadsPerSourceGosfordCreated)
          }
        })
      })
    }

    // Melbourne
    const leadsPerSourceMelbourneCreated = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Melbourne Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceMelbourneCreated = _.merge(leadsPerSourceMelbourneCreated.rows, leadsPerSourceMelbourneCreated.count)

    const leadsPerSourceMelbourneIM = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Melbourne Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceMelbourneIMMerge = _.merge(leadsPerSourceMelbourneIM.rows, leadsPerSourceMelbourneIM.count)
    let arrayLeadsPerSourceMelbourne = arrayLeadsPerSourceMelbourneCreated
    if (arrayLeadsPerSourceMelbourneIMMerge.length > 0) {
      const changedArrayMelbourneName = arrayLeadsPerSourceMelbourneIMMerge.map(item => {
        return {
          sourceId: item.sourceId,
          'source.label': item['source.label'],
          'listingAgent.dataRegion': item['listingAgent.dataRegion'],
          countSourceImStageMelbourne: item.count
        }
      })
      arrayLeadsPerSourceMelbourneCreated.forEach(items => {
        changedArrayMelbourneName.forEach(items2 => {
          if (items.sourceId === items2.sourceId) {
            const mergeToArray = _.merge(items2, items)
            arrayLeadsPerSourceMelbourne = _.merge(changedArrayMelbourneName, mergeToArray)
          } else {
            arrayLeadsPerSourceMelbourne = _.merge(changedArrayMelbourneName, arrayLeadsPerSourceMelbourneCreated)
          }
        })
      })
    }

    // Sydney
    const leadsPerSourceSydneyCreated = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Sydney Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceSydneyCreated = _.merge(leadsPerSourceSydneyCreated.rows, leadsPerSourceSydneyCreated.count)

    const leadsPerSourceSydneyIM = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Sydney Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceSydneyIMMerge = _.merge(leadsPerSourceSydneyIM.rows, leadsPerSourceSydneyIM.count)
    let arrayLeadsPerSourceSydney = arrayLeadsPerSourceSydneyCreated
    if (arrayLeadsPerSourceSydneyIMMerge.length > 0) {
      const changedArraySydneyName = arrayLeadsPerSourceSydneyIMMerge.map(item => {
        return {
          sourceId: item.sourceId,
          'source.label': item['source.label'],
          'listingAgent.dataRegion': item['listingAgent.dataRegion'],
          countSourceImStageSydney: item.count
        }
      })
      arrayLeadsPerSourceMelbourneCreated.forEach(items => {
        changedArraySydneyName.forEach(items2 => {
          if (items.sourceId === items2.sourceId) {
            const mergeToArray = _.merge(items2, items)
            arrayLeadsPerSourceSydney = _.merge(changedArraySydneyName, mergeToArray)
          } else {
            arrayLeadsPerSourceSydney = _.merge(changedArraySydneyName, arrayLeadsPerSourceSydneyCreated)
          }
        })
      })
    }

    // Queensland
    const leadsPerSourceQueenslandCreated = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Queensland Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceQueenslandCreated = _.merge(leadsPerSourceQueenslandCreated.rows, leadsPerSourceQueenslandCreated.count)

    const leadsPerSourceQueenslandIM = await models.Business.findAndCountAll({
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
        as: 'listingAgent',
        where: {
          id: {
            $col: 'Business.listingAgent_id'
          },
          dataRegion: 'Queensland Office'
        }
      }],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceQueenslandIMMerge = _.merge(leadsPerSourceQueenslandIM.rows, leadsPerSourceQueenslandIM.count)
    let arrayLeadsPerSourceQueensland = arrayLeadsPerSourceQueenslandCreated
    if (arrayLeadsPerSourceQueenslandIMMerge.length > 0) {
      const changedArrayQueenslandName = arrayLeadsPerSourceQueenslandIMMerge.map(item => {
        return {
          sourceId: item.sourceId,
          'source.label': item['source.label'],
          'listingAgent.dataRegion': item['listingAgent.dataRegion'],
          countSourceImStageQueensland: item.count
        }
      })
      arrayLeadsPerSourceQueenslandCreated.forEach(items => {
        changedArrayQueenslandName.forEach(items2 => {
          if (items.sourceId === items2.sourceId) {
            const mergeToArray = _.merge(items2, items)
            arrayLeadsPerSourceQueensland = _.merge(changedArrayQueenslandName, mergeToArray)
          } else {
            arrayLeadsPerSourceQueensland = _.merge(changedArrayQueenslandName, arrayLeadsPerSourceQueenslandCreated)
          }
        })
      })
    }

    // STARTS TOTAL LEADS PER SOURCE
    // const totalLeadsPerSourceIM = await models.Business.count({
    //   raw: true,
    //   attributes: ['sourceId'],
    //   as: 'Business',
    //   where: {
    //     dateChangedToSalesMemorandum: {
    //       $between: [dateFrom, dateTo]
    //     }
    //   },
    //   include: [{
    //     model: models.BusinessSource,
    //     attributes: ['label'],
    //     as: 'source',
    //     where: {
    //       id: {
    //         $col: 'Business.sourceId'
    //       }
    //     }
    //   }, {
    //     model: models.User,
    //     attributes: ['dataRegion'],
    //     as: 'listingAgent',
    //     where: {
    //       id: {
    //         $col: 'Business.listingAgent_id'
    //       }
    //     }
    //   }]
    // })
    // FINISHS TOTAL LEADS PER SOURCE

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
    /* ends Total per Source */

    return res.status(201).json({
      data: {
        arrayFinal,
        arrayTotalPerSource,
        totalGeralPerSource,
        arrayLeadsPerSourceAdelaide,
        arrayLeadsPerSourceCamberra,
        arrayLeadsPerSourceCowra,
        arrayLeadsPerSourceGosford,
        arrayLeadsPerSourceMelbourne,
        arrayLeadsPerSourceSydney,
        arrayLeadsPerSourceQueensland,
        arrayOffices
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
        listingAgent: true
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
        listingAgent_id: analystId
      }
    })

    const listBusinessesSalesMemorandum = await models.Business.findAll({
      raw: true,
      attributes: ['id', 'businessName', 'firstNameV', 'lastNameV'],
      where: {
        dateChangedToSalesMemorandum: {
          $between: [dateFrom, dateTo]
        },
        listingAgent_id: analystId
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
          }
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
      }
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
            }
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
        }
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
        officeId: region
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
  const totalDays = (dateB.diff(dateC, 'days') + 1)

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
        dateCreated: moment(item.dateCreated).format('DD/MM/YYYY')
      }
    })

    const countTotalsPerDate = array.map(({
      count
    }) => count)
    const maxTotalsPerDate = Math.max(...countTotalsPerDate)

    const minTotalsPerDate = Math.min(...countTotalsPerDate.filter(zero => zero !== 0))
    const avgTotalsPerDate = Math.round(_.meanBy(array, (p) => p.count))

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
    const avgTotalsAnalystsPerDate = Math.round(_.meanBy(totalAnalysts, (p) => p.count))
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
    const avgTotalsBrokersPerDate = Math.round(_.meanBy(totalBrokers, (p) => p.count))
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

  var dateString = date
  dateString = dateString.substr(3, 2) + '-' + dateString.substr(0, 2) + '-' + dateString.substr(6, 4)
  // const dateStart = moment(dateString).format('YYYY-MM-DD 00:00:00')
  // const dateEnd = moment(dateString).format('YYYY-MM-DD 23:59:59')

  try {
    let dailyTime = 0
    let array = []
    for (let i = 0; i < 24; i++) {
      let dateTimeBegin = moment(dateString).format(`YYYY-MM-DD ${i}:00:00`)
      let dateTimeEnd = moment(dateString).format(`YYYY-MM-DD ${i}:59:59`)
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
