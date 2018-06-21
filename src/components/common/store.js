export function saveToLocal(id, key, value) {
  let seller = localStorage._seller_
  // seller将会是一个JSON，例如 {111：{key: , }， 222：{}}，其中111和222就是不同商家的id
  if (!seller) {
    seller = {}
    seller[id] = {} // 对象的key可以是数字，这时不能用object.key来取， 用object[key]
  } else {
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  localStorage._seller_ = JSON.stringify(seller)
}

export function loadFromLocal(id, key, def) {
  let seller = localStorage._seller_
  if (!seller) {
    return def
  }
  seller = JSON.parse(seller)[id]
  if (!seller) {
    return def
  }
  let ret = seller[key]
  return ret || def
}
