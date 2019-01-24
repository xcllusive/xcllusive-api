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
  if (appraisal.year6 > 0) {
    count = count + 1
    totalYear =
      totalYear + 3000 /* change for the field Total Adjusted Profit INCL. Owners Wages */
  }
  if (appraisal.year5 > 0) {
    count = count + 1
    totalYear =
      totalYear + 3000 /* change for the field Total Adjusted Profit INCL. Owners Wages */
  }
  if (appraisal.year4 > 0) {
    count = count + 1
    totalYear =
      totalYear + 3000 /* change for the field Total Adjusted Profit INCL. Owners Wages */
  }
  if (appraisal.year3 > 0) {
    count = count + 1
    totalYear =
      totalYear + 3000 /* change for the field Total Adjusted Profit INCL. Owners Wages */
  }
  if (appraisal.year2 > 0) {
    count = count + 1
    totalYear =
      totalYear + 3000 /* change for the field Total Adjusted Profit INCL. Owners Wages */
  }
  if (appraisal.year1 > 0) {
    count = count + 1
    totalYear =
      totalYear + 3000 /* change for the field Total Adjusted Profit INCL. Owners Wages */
  }

  return totalYear / count
}
