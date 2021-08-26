/*
 ^ 提供密码格式验证规范
*/

module.exports = {
  password: {
    type: 'string',
    trim: true,
    // 必须是数字字母符号组合
    format: /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,}$/,
    message: '密码必须是大于8位且是数字,字母,符号组合'
  },
  email: {
    type: 'email',
    required: false,
    message: '邮箱不符合规则'
  },
  phone: {
    type: 'string',
    trim: true,
    required: false,
    format: /^1[3456789]\d{9}$/,
    message: '手机不符合规则'
  },
}