/**
 * > 时间对象格式化
 * @param {*} date 
 * @returns 2021/08/13 15:30:22
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

/**
 * 转字符串,不足1位前面+0
 * # 事件对象格式化使用
 * @returns 返回字符串形式的值
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}


module.exports = {
  formatTime,

}
