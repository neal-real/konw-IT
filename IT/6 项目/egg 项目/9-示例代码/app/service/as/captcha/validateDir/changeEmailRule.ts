/*
 ^ 提供用户变更邮箱的变更阶段的数据校验
*/

module.exports = {
  changeType: {
    type: 'string',
    trim: true,
    format: /^email$/,
    message: '验证类型不符合要求'
  },
  stage: {
    type: 'enum',
    values: ['change', 'verify'],
    message: '操作阶段不正确'
  },
  email: {
    type: 'string',
    trim: true,
    format:  /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: '邮箱不符合规则'
  },
  newemail: {
    type: 'string',
    trim: true,
    format:  /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: '邮箱不符合规则'
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
  }
}
