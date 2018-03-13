export const _mapValuesToArray = (array) => {
  if (array.length > 0) {
    if (array[0].firstName) {
      return array.map((item, index) => ({ key: index, text: `${item.firstName} ${item.lastName}`, value: `${item.firstName} ${item.lastName}` }))
    }
    return array.map((item, index) => ({ key: index, text: item.label, value: item.id }))
  }
  return []
}

export const mapValuesOnArrayToDropdownBusinessRegisters = (array) => {
  if (array.length > 0) {
    return array.map((item, index) => ({ key: index, text: item.label, value: item.id }))
  }
  return [{ key: 0, text: 'Nenhum item encontrado', value: 0 }]
}
