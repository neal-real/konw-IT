/*
 ^ 提供邮箱重置密码的数据校验
*/

module.exports = {
  email: {
    type: 'string',
    trim: true,
    format: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: '邮箱验不符合要求'
  },
  captcha: {
    type: 'string',
    trim: true,
    format: /^[A-Za-z0-9]{4}$/,
    message: '验证码不符合规则'
  },
  codetype: {
    type: 'string',
    trim: true,
    // 必须是数字字母符号组合
    format: /^resetPass|$/,
    message: '验证码类型不符合要求'
  },
  accountType: {
    type: 'string',
    trim: true,
    // 必须是数字字母符号组合
    format: /^email$/,
    message: '账号类型不符合要求'
  },
  userAgent: {  // 用户浏览器部分信息
    type: 'string',
    trim: true,
    message: '验证码类型不符合要求'
  }
}
