/*
 * @Author: Gro lin
 * @Date: 2024-09-28 22:39:09
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-11-18 10:30:22
 */
//
export const softUpdate = (refs, data) => {
  const friends_ = new Map()
  data.forEach((item) => friends_.set(item.id, item))
  refs.value.forEach((item, index) => {
    if (item != null && friends_.has(item.id)) {
      refs.value[index] = friends_.get(item.id)
      friends_.set(item.id, null)
    }
  })
  refs.value = refs.value.filter((item) => item != null)
  friends_.forEach((value) => {
    if (value) refs.value.push(value)
  })
}

export const compareObjBaseA = (a, b) => {
  const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj)

  for (const key in a) {
    if (!b.hasOwnProperty(key)) {
      continue
    }
    if (isObject(a[key]) && isObject(b[key])) {
      if (!compareObjBaseA(a[key], b[key])) {
        return false
      }
    } else if (a[key] !== b[key]) {
      return false
    }
  }
  return true
}
