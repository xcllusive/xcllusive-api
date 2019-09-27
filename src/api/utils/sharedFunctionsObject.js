export const transformQueryAndCleanNull = obj => {
  Object.keys(obj).forEach(prop => {
    let value = obj[prop]
    if (value !== null && typeof value === 'object') {
      obj[prop] = transformQueryAndCleanNull(value)
    } else if (value === null) {
      // Yes currently i use uppercase null for this, maybe change it to lowercase
      obj[prop] = ''
    }
  })
  return obj
}

export const ebitdaAvg = businessSold => {
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

export const ebitdaLastYear = businessSold => {
  if (businessSold.year4 > 0) {
    return businessSold.year4 - businessSold.agreedWageForWorkingOwners
  }
  if (businessSold.year3 > 0) {
    return businessSold.year3 - businessSold.agreedWageForWorkingOwners
  }
  if (businessSold.year2 > 0) {
    return businessSold.year2 - businessSold.agreedWageForWorkingOwners
  }
  if (businessSold.year1 > 0) {
    return businessSold.year1 - businessSold.agreedWageForWorkingOwners
  }
}

export const pebitdaLastYear = businessSold => {
  if (businessSold.year4 > 0) {
    return (
      businessSold.year4 -
      (businessSold.agreedWageForWorkingOwners - businessSold.agreedWageForMainOwner)
    )
  }
  if (businessSold.year3 > 0) {
    return (
      businessSold.year3 -
      (businessSold.agreedWageForWorkingOwners - businessSold.agreedWageForMainOwner)
    )
  }
  if (businessSold.year2 > 0) {
    return (
      businessSold.year2 -
      (businessSold.agreedWageForWorkingOwners - businessSold.agreedWageForMainOwner)
    )
  }
  if (businessSold.year1 > 0) {
    return (
      businessSold.year1 -
      (businessSold.agreedWageForWorkingOwners - businessSold.agreedWageForMainOwner)
    )
  }
}

export const avgProfit = appraisal => {
  let count = 0
  let totalYear = 0
  if (appraisal.renderPdfYear7 && parseInt(appraisal.calcAnnualised1) !== 0 && !isNaN(parseInt(appraisal.calcAnnualised1))) {
    count = count + 1
    totalYear =
      totalYear + appraisal.totalAdjustedProfit7 /* change for the field Total Adjusted Profit INCL. Owners Wages */
  }
  if (appraisal.renderPdfYear5 && parseInt(appraisal.sales5) !== 0 && !isNaN(parseInt(appraisal.sales5))) {
    count = count + 1
    totalYear =
      totalYear + appraisal.totalAdjustedProfit5 /* change for the field Total Adjusted Profit INCL. Owners Wages */
  }
  if (appraisal.renderPdfYear4 && parseInt(appraisal.sales4) !== 0 && !isNaN(parseInt(appraisal.sales4))) {
    count = count + 1
    totalYear =
      totalYear + appraisal.totalAdjustedProfit4 /* change for the field Total Adjusted Profit INCL. Owners Wages */
  }
  if (appraisal.renderPdfYear3 && parseInt(appraisal.sales3) !== 0 && !isNaN(parseInt(appraisal.sales3))) {
    count = count + 1
    totalYear =
      totalYear + appraisal.totalAdjustedProfit3 /* change for the field Total Adjusted Profit INCL. Owners Wages */
  }
  if (appraisal.renderPdfYear2 && parseInt(appraisal.sales2) !== 0 && !isNaN(parseInt(appraisal.sales2))) {
    count = count + 1
    totalYear =
      totalYear + appraisal.totalAdjustedProfit2 /* change for the field Total Adjusted Profit INCL. Owners Wages */
  }
  if (appraisal.renderPdfYear1 && parseInt(appraisal.sales1) !== 0 && !isNaN(parseInt(appraisal.sales1))) {
    count = count + 1
    totalYear =
      totalYear + appraisal.totalAdjustedProfit1 /* change for the field Total Adjusted Profit INCL. Owners Wages */
  }

  return totalYear / count
}
