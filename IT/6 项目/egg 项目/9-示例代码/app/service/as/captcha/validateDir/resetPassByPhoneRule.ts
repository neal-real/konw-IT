/*
 ^ 提供手机重置密码的数据校验
*/

module.exports = {
  phone: {
      type: 'string',
      trim: true,
      format: /^1[3456789]\d{9}$/,
      message: '手机不符合规则'
  },
  captcha: {
      type: 'string',
      trim: true,
      // 必须是数字字母符号组合
      format: /^[A-Za-z0-9]{4}$/,
      message: '验证码不符合规则'
  },
  codetype: {
      type: 'string',
      trim: true,
      // 必须是数字字母符号组合
      format: /^resetPass$/,
      message: '验证码类型不符合要求'
  },
  accountType: {
    type: 'string',
    trim: true,
    // 必须是数字字母符号组合
    format: /^phone$/,
    message: '账号类型不符合要求'
  },
  userAgent: {  // 用户浏览器部分信息
      type: 'string',
      trim: true,
      message: '验证码类型不符合要求'
  }
}
