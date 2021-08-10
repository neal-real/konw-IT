/*
 ^ 提供手机验证码登录的数据校验
*/

module.exports = {
  type: {
    type: 'string',
    trim: true,
    format: /^captcha$/,
    message: "登录类型不正确"
  },
  phone: {
    type: 'string',
    trim: true,
    required: false,
    format: /^1[3456789]\d{9}$/,
    message: '手机不符合要求'
  },
  email: {
    type: 'email',
    trim: true,
    required: false,
    message: '邮箱验不符合要求,请检查后再试'
  },
  style: {
    type: 'string',
    trim: true,
    format: /^signIn$/,
    message: '验证码类型不符合要求'
  },
  captcha: {
    type: 'string',
    trim: true,
    // 必须是数字字母符号组合
    format: /^[A-Za-z0-9]{4}$/,
    message: '验证码不符合要求'
},

}
