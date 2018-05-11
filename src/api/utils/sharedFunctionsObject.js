export const transformQueryAndCleanNull = obj => {
  Object.keys(obj).forEach(prop => {
    let value = obj[prop]
    if (value !== null && typeof value === 'object')
      obj[prop] = transformQueryAndCleanNull(value)
    else if (value === null) {
      // Yes currently i use uppercase null for this, maybe change it to lowercase
      obj[prop] = ''
    }
  })
  return obj
}
