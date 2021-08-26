/**
 * ^ 提供数据格式的校验功能 rule
 * #1.数据校验
*/

const Parameter = require('parameter');
const ruleReal = new Parameter();
module.exports = {
  /**
   * > 数据格式校验
   * @参数1 : 规则文件名
   * @参数2 : 需要校验的数据
   * @返回: 错误原因, 正确无返回值
   */
  validateDataFormat(rule, data) {
    try {
      if (!data)  return '无任何校验数据进入'
    const objRule = require(`./validateDir/${rule}`)
    if (objRule) {
      const error = ruleReal.validate(objRule, data)
      console.log(error);
      return error
    } else {
      return '读取不到规则文件,请检查后在试'
    }
    } catch (error) {
     console.log(error);
     return error.message
    }
  }
}