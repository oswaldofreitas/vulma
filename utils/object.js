export function deepValue(obj, key) {
  return key.split('.').reduce((child, key) => {
    if (child && key in child)
      return child[key]
    return undefined
  }, obj)
}
