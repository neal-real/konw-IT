/*
 ^ 提供账号登录数据格式的验证
*/

module.exports = {
  type: {
    type: 'string',
    trim: true,
    format: /^normal$/,
    message: "登录类型不正确"
  },
  accountType: {
    type: 'enum',
    values: ['phone'],
    message: "账号类型不正确"
  },
  phone: {
    type: 'string',
    trim: true,
    format: /^1[3456789]\d{9}$/,
    message: '手机不符合要求'
  },
  password: {
    type: 'string',
    trim: true,
    // 必须是数字字母符号组合
    format: /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,}$/,
    message: '密码必须是大于8位且是数字,字母,符号组合'
  },

}
