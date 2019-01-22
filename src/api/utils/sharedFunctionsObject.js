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
