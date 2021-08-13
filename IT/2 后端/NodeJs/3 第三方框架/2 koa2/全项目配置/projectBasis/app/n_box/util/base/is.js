/**
* & 文件说明: 进行各种判断
*/

/**
* > 判断对象是否是空值
* > undefined,null,length是 0 均是 false
* @value :需要判断的值
* @返回值: 无值:返回 false ,有值返回 true
*/
function isNothing(value) {
  if (value === undefined) { return false }
  else if (value === null) { return false }
  else if (value.length === undefined) { return false }
  else if (value.length === 0) { return false }
  return true
}

/**
 * 是否使用同一个内存地址
 * @param {*} obj 对象1
 * @param {*} obj2 对象2
 * @returns 是返回 true ,不是返回 false
 */
function isSameMemoryAddress(obj, obj2) {
  return obj === obj2
}

module.exports = {
  isNothing,
  isSameMemoryAddress
}