/*
 ^ 提供用户变更邮箱的变更阶段的数据校验
*/

module.exports = {
  type: {
    type: 'string',
    trim: true,
    format: /^addPhone|addEmail$/,
    message: '验证类型不符合要求'
  },
  phone: {
    type: 'string',
    trim: true,
    format: /^1[3456789]\d{9}$/,
    message: '手机不符合规则'
  },
  email: {
    type: 'email',
    trim: true,
    message: '邮箱不符合规则'
  },
  user_id: {
    type: 'string',
    trim: true,
    message: '用户名不存在'
  },
  captcha: {
    type: 'string',
    trim: true,
    format: /^[A-Za-z0-9]{4}$/,
    message: '验证码不符合规则'
  }
}
