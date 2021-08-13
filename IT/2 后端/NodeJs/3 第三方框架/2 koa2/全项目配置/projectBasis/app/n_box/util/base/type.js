// 判断类型
function type(value) {
  let name = typeof (value)
  let type = ''
  if (name === Object) {
    type = value.constructor.name
  } else if (name === 'object') {
    /*
      value.constructor.name = HTMLElement
      HTML***Element ***是元素名
      HTMLUnknownElement  自定义?或者元素错误
    */
    type = value.constructor.name
  } else {
    type = name
  }
  return type
}




module.exports = {
  type
}