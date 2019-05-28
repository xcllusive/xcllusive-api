export const formatTelephoneToSendSMS = value => {
  const onlyNumbers = value
  let replaced = onlyNumbers.replace(/-/gi, '')
  replaced = replaced.replace(/ /gi, '')
  replaced = replaced.replace(/;/gi, '')
  replaced = replaced.replace(/<[^>]+>/gi, '')
  replaced = replaced.replace(/<[^>]>/gi, '')
  replaced = replaced.replace(/[.*+?^${}()|[\]\\]/g, '')
  const toString = parseInt(replaced)
  return toString.toString()
}
