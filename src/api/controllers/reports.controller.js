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

    // console.log('AQUIIII')
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
            },
            listingAgent: 1
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

    const mergeArray = _.merge(dateTimeCreated, dateTimeCreatedCount)
    const changedArrayName = dateChangedToSalesMemorandum.map(item => {
      return {
        listingAgent_id: item.listingAgent_id,
        countImStage: item.count
      }
    })
    // console.log('testarray', changedArrayName)
    // console.log(mergeArray)
    // console.log(changedArrayName)
    // const arrayFinal = _.merge(mergeArray, changedArrayName)
    let arrayFinal = []
    changedArrayName.forEach(items => {
      // console.log(items)
      mergeArray.forEach(items2 => {
        if (items.listingAgent_id === items2.listingAgent_id) {
          // console.log('items2, ', items2, items)
          const mergeToArray = _.merge(items2, items)

          arrayFinal = _.merge(mergeArray, mergeToArray)

          // arrayFinal = arrayFinal.push({
          //   mergeToArray
          // })
          // console.log(arrayFinal)
        }
      })
    })

    console.log(arrayFinal)

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
        // console.log('items', items)
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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Adelaide Office'
          }
        }
      ],
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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Adelaide Office'
          }
        }
      ],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceAdelaideIMMerge = _.merge(leadsPerSourceAdelaideIM.rows, leadsPerSourceAdelaideIM.count)
    const changedArrayAdelaideName = arrayLeadsPerSourceAdelaideIMMerge.map(item => {
      return {
        'source.label': item['source.label'],
        'listingAgent.dataRegion': item['listingAgent.dataRegion'],
        countSourceImStageAdelaide: item.count
      }
    })
    const arrayLeadsPerSourceAdelaide = _.merge(arrayLeadsPerSourceAdelaideCreated, changedArrayAdelaideName)

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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Camberra Office'
          }
        }
      ],
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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Camberra Office'
          }
        }
      ],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceCamberraIMMerge = _.merge(leadsPerSourceCamberraIM.rows, leadsPerSourceCamberraIM.count)
    const changedArrayCamberraName = arrayLeadsPerSourceCamberraIMMerge.map(item => {
      return {
        'source.label': item['source.label'],
        'listingAgent.dataRegion': item['listingAgent.dataRegion'],
        countSourceImStageCamberra: item.count
      }
    })
    const arrayLeadsPerSourceCamberra = _.merge(arrayLeadsPerSourceCamberraCreated, changedArrayCamberraName)

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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Cowra Office'
          }
        }
      ],
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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Cowra Office'
          }
        }
      ],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceCowraIMMerge = _.merge(leadsPerSourceCowraIM.rows, leadsPerSourceCowraIM.count)
    const changedArrayCowraName = arrayLeadsPerSourceCowraIMMerge.map(item => {
      return {
        'source.label': item['source.label'],
        'listingAgent.dataRegion': item['listingAgent.dataRegion'],
        countSourceImStageCowra: item.count
      }
    })
    const arrayLeadsPerSourceCowra = _.merge(arrayLeadsPerSourceCowraCreated, changedArrayCowraName)

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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Gosford Office'
          }
        }
      ],
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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Gosford Office'
          }
        }
      ],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceGosfordIMMerge = _.merge(leadsPerSourceGosfordIM.rows, leadsPerSourceGosfordIM.count)
    const changedArrayGosfordName = arrayLeadsPerSourceGosfordIMMerge.map(item => {
      return {
        'source.label': item['source.label'],
        'listingAgent.dataRegion': item['listingAgent.dataRegion'],
        countSourceImStageGosford: item.count
      }
    })
    const arrayLeadsPerSourceGosford = _.merge(arrayLeadsPerSourceGosfordCreated, changedArrayGosfordName)

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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Melbourne Office'
          }
        }
      ],
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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Melbourne Office'
          }
        }
      ],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceMelbourneIMMerge = _.merge(leadsPerSourceMelbourneIM.rows, leadsPerSourceMelbourneIM.count)
    const changedArrayMelbourneName = arrayLeadsPerSourceMelbourneIMMerge.map(item => {
      return {
        'source.label': item['source.label'],
        'listingAgent.dataRegion': item['listingAgent.dataRegion'],
        countSourceImStageMelbourne: item.count
      }
    })
    const arrayLeadsPerSourceMelbourne = _.merge(arrayLeadsPerSourceMelbourneCreated, changedArrayMelbourneName)

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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Sydney Office'
          }
        }
      ],
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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Sydney Office'
          }
        }
      ],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceSydneyIMMerge = _.merge(leadsPerSourceSydneyIM.rows, leadsPerSourceSydneyIM.count)
    const changedArraySydneyName = arrayLeadsPerSourceSydneyIMMerge.map(item => {
      return {
        'source.label': item['source.label'],
        'listingAgent.dataRegion': item['listingAgent.dataRegion'],
        countSourceImStageSydney: item.count
      }
    })
    const arrayLeadsPerSourceSydney = _.merge(arrayLeadsPerSourceSydneyCreated, changedArraySydneyName)

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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Queensland Office'
          }
        }
      ],
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
          as: 'listingAgent',
          where: {
            id: {
              $col: 'Business.listingAgent_id'
            },
            dataRegion: 'Queensland Office'
          }
        }
      ],
      group: ['Business.sourceId']
    })
    const arrayLeadsPerSourceQueenslandIMMerge = _.merge(leadsPerSourceQueenslandIM.rows, leadsPerSourceQueenslandIM.count)
    const changedArrayQueenslandName = arrayLeadsPerSourceQueenslandIMMerge.map(item => {
      return {
        'source.label': item['source.label'],
        'listingAgent.dataRegion': item['listingAgent.dataRegion'],
        countSourceImStageQueensland: item.count
      }
    })
    const arrayLeadsPerSourceQueensland = _.merge(arrayLeadsPerSourceQueenslandCreated, changedArrayQueenslandName)

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
        }
      ]
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
