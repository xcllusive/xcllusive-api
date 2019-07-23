import _ from 'lodash'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'

const _ebitdaAvg = businessSold => {
  let count = 0
  let totalYear = 0

  if (businessSold.year4 > 0) {
    count = count + 1
    totalYear = totalYear + businessSold.year4
  }
  if (businessSold.year3 > 0) {
    count = count + 1
    totalYear = totalYear + businessSold.year3
  }
  if (businessSold.year2 > 0) {
    count = count + 1
    totalYear = totalYear + businessSold.year2
  }
  if (businessSold.year1 > 0) {
    totalYear = totalYear + businessSold.year1
    count = count + 1
  }

  return totalYear / count - businessSold.agreedWageForWorkingOwners
}

export const list = async (req, res, next) => {
  const {
    limit,
    type,
    industry,
    priceRangeStart,
    priceRangeEnd,
    trend,
    pebitdaLastYearOrAvg,
    ebitdaLastYearOrAvg,
    stockValue
  } = req.query
  const offset = req.skip

  const pebitdaFrom = req.query.pebitdaFrom ? req.query.pebitdaFrom : 0
  const pebitdaTo = req.query.pebitdaTo ? req.query.pebitdaTo : 9999999
  const ebitdaFrom = req.query.ebitdaFrom ? req.query.ebitdaFrom : 0
  const ebitdaTo = req.query.ebitdaTo ? req.query.ebitdaTo : 9999999

  try {
    const pebitdaLastYear = `and case when s.year4 > 0 then s.year4 - (s.agreedWageForWorkingOwners - s.agreedWageForMainOwner)    
    between :pebitdaFrom and :pebitdaTo
    else
      case when s.year3 > 0 then
      s.year3 - (s.agreedWageForWorkingOwners - s.agreedWageForMainOwner)  between :pebitdaFrom and :pebitdaTo
      else
        case when s.year2 > 0 then
        s.year2 - (s.agreedWageForWorkingOwners - s.agreedWageForMainOwner)  between :pebitdaFrom and :pebitdaTo
        else
          case when s.year1 > 0 then
          s.year1 - (s.agreedWageForWorkingOwners - s.agreedWageForMainOwner)  between :pebitdaFrom and :pebitdaTo
        end
      end
    end
    end`

    const ebitdaLastYear = `and case when s.year4 > 0 then s.year4 - s.agreedWageForWorkingOwners 
    between :ebitdaFrom and :ebitdaTo
    else
      case when s.year3 > 0 then
      s.year3 - s.agreedWageForWorkingOwners between :ebitdaFrom and :ebitdaTo
      else
        case when s.year2 > 0 then
        s.year2 - s.agreedWageForWorkingOwners between :ebitdaFrom and :ebitdaTo
        else
          case when s.year1 > 0 then
          s.year1 - s.agreedWageForWorkingOwners between :ebitdaFrom and :ebitdaTo
        end
      end
    end
    end`

    // -- and s.businessType = ${type || 's.businessType'}

    const businessesSold = await models.sequelize.query(
      `SELECT s.*, t.label FROM BusinessSolds s, BusinessTypes t
    where s.businessType = t.id
    and s.sold = 1
    ${type && type !== '99' ? 'and s.businessType = :type' : 'and s.businessType = s.businessType'}
    and s.industry like :industry
    and s.soldPrice between :priceRangeStart and :priceRangeEnd
    and s.trend in (:trend)
    ${pebitdaLastYearOrAvg ? pebitdaLastYear : ''}
    ${ebitdaLastYearOrAvg ? ebitdaLastYear : ''}
    and s.stockValue >= :stockValue
    order by 'soldDate', 'DESC'
    limit :limit`, {
        raw: true,
        replacements: {
          industry: industry ? `%${industry}%` : '%%',
          type: type,
          priceRangeStart: priceRangeStart || 0,
          priceRangeEnd: priceRangeEnd || 9999999,
          pebitdaFrom: pebitdaFrom || 0,
          pebitdaTo: pebitdaTo || 9999999,
          ebitdaFrom: ebitdaFrom || 0,
          ebitdaTo: ebitdaTo || 9999999,
          trend: trend ? JSON.parse(trend) : ['up', 'down', 'steady'],
          stockValue: stockValue || 0,
          limit: limit === 49 ? 50000 : limit,
          offset
        },
        model: models.BusinessSold,
        mapToModel: true
      }
    )

    let arrayPebitdaAndEbitdaAvg = []
    let arrayEbitdaAvg = []
    let arrayPebitdaAvg = []
    let caseAvg = 0
    if (!ebitdaLastYearOrAvg && !pebitdaLastYearOrAvg) {
      caseAvg = 1
      businessesSold.map(item => {
        const ebitdaAvg = _ebitdaAvg(item)
        const pebitdaAvg = _ebitdaAvg(item) + item.agreedWageForMainOwner
        if (ebitdaAvg >= ebitdaFrom && ebitdaAvg <= ebitdaTo && (pebitdaAvg >= pebitdaFrom && pebitdaAvg <= pebitdaTo)) {
          arrayPebitdaAndEbitdaAvg.push(item)
        }
      })
    } else {
      if (!ebitdaLastYearOrAvg) {
        caseAvg = 2
        businessesSold.map(item => {
          const ebitdaAvg = _ebitdaAvg(item)
          if (ebitdaAvg >= ebitdaFrom && ebitdaAvg <= ebitdaTo) {
            arrayEbitdaAvg.push(item)
          }
        })
      }
      if (!pebitdaLastYearOrAvg) {
        caseAvg = 3
        businessesSold.map(item => {
          const pebitdaAvg = _ebitdaAvg(item) + item.agreedWageForMainOwner
          if (pebitdaAvg >= pebitdaFrom && pebitdaAvg <= pebitdaTo) {
            arrayPebitdaAvg.push(item)
          }
        })
      }
    }
    const response = {
      data: caseAvg === 1 ? arrayPebitdaAndEbitdaAvg : caseAvg === 2 ? arrayEbitdaAvg : caseAvg === 3 ? arrayPebitdaAvg : businessesSold,
      // pageCount: businessesSold.count,
      // itemCount: Math.ceil(businessesSold.count / req.query.limit),
      message: 'Get businesses sold with sucessfully'
    }
    return res.status(200).json(response)
  } catch (error) {
    return next(error)
  }
}

export const get = async (req, res, next) => {
  const {
    idAppraisal
  } = req.params

  try {
    const appraisal = await models.Appraisal.findOne({
      where: {
        id: idAppraisal
      }
    })

    if (!appraisal) {
      throw new APIError({
        message: 'Appraisal not found',
        status: 400,
        isPublic: true
      })
    }

    if (!appraisal.comparableDataSelectedList || appraisal.comparableDataSelectedList === '') {
      throw new APIError({
        message: 'Appraisal selected list is empty',
        status: 400,
        isPublic: true
      })
    }

    const businessSoldselectedListOnlyId = JSON.parse(appraisal.comparableDataSelectedList)

    const comparableDataSelectedList = await models.BusinessSold.findAll({
      where: {
        id: Array.from(businessSoldselectedListOnlyId)
      },
      include: [{
        attributes: ['label'],
        model: models.BusinessType,
        as: 'BusinessType',
        where: {
          id: {
            $col: 'BusinessSold.businessType'
          }
        }
      }]
    })

    return res.status(200).json({
      data: comparableDataSelectedList,
      message: 'Get Selected list'
    })
  } catch (error) {
    return next(error)
  }
}

export const save = async (req, res, next) => {
  const {
    appraisalId,
    selectedList
  } = req.body

  // if (selectedList.isArray()) {
  //   throw new APIError({
  //     message: 'Selected list is not array',
  //     status: 400,
  //     isPublic: true
  //   })
  // }

  const selectedListOnlyId = _.map(selectedList, 'id')

  try {
    await models.Appraisal.update({
      comparableDataSelectedList: JSON.stringify(selectedListOnlyId)
    }, {
      where: {
        id: appraisalId
      }
    })

    return res.status(200).json({
      data: null,
      message: 'Get Selected list'
    })
  } catch (error) {
    return next(error)
  }
}

export const getBusinessTypeAny = async (req, res, next) => {
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
    const typeList = await models.BusinessType.findAll({
      raw: true,
      attributes: ['id', 'label'],
      order: [
        ['label', 'ASC']
      ]
    })
    return res.status(200).json({
      data: _mapValuesToArray(typeList),
      message: 'Got Business Type List'
    })
  } catch (error) {
    return next(error)
  }
}
