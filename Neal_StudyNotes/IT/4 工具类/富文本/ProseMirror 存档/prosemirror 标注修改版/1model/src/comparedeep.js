/**
* & 文件说明 深度比较  a 和 b
* @说明 : 深度比较两个对象是否完全一致, 一致返回 真,否则为假
*/ 
export function compareDeep(a, b) {
  if (a === b) return true
  if (!(a && typeof a == "object") ||
      !(b && typeof b == "object")) return false
  let array = Array.isArray(a)
  if (Array.isArray(b) != array) return false
  if (array) {
    if (a.length != b.length) return false
    for (let i = 0; i < a.length; i++) if (!compareDeep(a[i], b[i])) return false
  } else {
    for (let p in a) if (!(p in b) || !compareDeep(a[p], b[p])) return false
    for (let p in b) if (!(p in a)) return false
  }
  return true
}


function 深度比较注释备份(a, b) {
  // > 值与类型 完全一样 返回真
  if (a === b) return true
  // > a 有值 且 类型是对象 或 b 有值且类型是对象 ,返回假
  if (!(a && typeof a == "object") ||!(b && typeof b == "object")) return false
  // > 判断 a 和 b 都是数组 或者都不是数组 ,就可以继续向下
  let array = Array.isArray(a)
  if (Array.isArray(b) != array) return false
  // > 到这 a 和 b 要么都是数组,要么都不是数组
  // > a 是数组
  if (array) {
    // 判断 a 和 b 的长度是否一致, 不一致 返回假
    if (a.length != b.length) return false
    // 长度一致 ,递归遍历
    for (let i = 0; i < a.length; i++) if (!compareDeep(a[i], b[i])) return false
  } 
  // a 不是数组
  else 
  {
    // 
    for (let p in a) if (!(p in b) || !compareDeep(a[p], b[p])) return false
    for (let p in b) if (!(p in a)) return false
  }
  return true
}
