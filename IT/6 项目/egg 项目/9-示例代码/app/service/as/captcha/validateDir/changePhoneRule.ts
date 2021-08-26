/*
 ^ 提供用户变更手机的变更阶段的数据校验
*/

module.exports = {
  changeType: {
    type: 'string',
    trim: true,
    format: /^phone$/,
    message: '验证类型不符合要求'
  },
  stage: {
    type: 'enum',
    values: ['change', 'verify'],
    message: '操作阶段不正确'
  },
  phone: {
    type: 'string',
    trim: true,
    format: /^1[3456789]\d{9}$/,
    message: '手机不符合规则'
  },
  captchaType: {
    type: 'string',
    trim: true,
    format: /^changeNumber$/,
    message: '验证类型不符合要求'
  },
  captcha: {
    type: 'string',
    trim: true,
    // 必须是数字字母符号组合
    format: /^[A-Za-z0-9]{4}$/,
    message: '验证码不符合规则'
  },
  newphone: {
    type: 'string',
    trim: true,
    format: /^1[3456789]\d{9}$/,
    message: '手机不符合规则'
  }
}
