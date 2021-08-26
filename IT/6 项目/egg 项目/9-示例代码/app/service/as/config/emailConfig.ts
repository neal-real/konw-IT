const emailConfig: any = {}
// 邮箱验证模块的内容模板
emailConfig.emailHtmlTemplate = {
  signIn: {
    header: '您正在登录',
    end: '网站'
  },
  signUp: {
    header: '您正在注册',
    end: '网站的账号'
  },
  changeNumber: {
    header: '您正在变更',
    end: '网站绑定的邮箱'
  },
  resetPass: {
    header: '您正在重置',
    end: '网站的账户密码'
  },
  addEmail:{
    header:'你正在向',
    end:'网站绑定新的邮箱'
  }
}
// 邮箱相关配置
emailConfig.emailSmtp = {
  host: "smtp.exmail.qq.com",  // 看推荐
  port: 465,    // 端口号, 看推荐或者网上搜 没有推荐默认可能是 465
  secure: true, // 端口是465写 true, 其他写 false
  user: "knowmap@know-map.com", // 发送邮件的邮箱
  pass: "Wsl19870719"   // 邮箱对应的授权码, 没有授权码写密码
}
// 邮箱发送时的自定义配置
emailConfig.emailSendInfo = {
  from: 'knowmap@know-map.com', // 谁发的
  subject: '知识地图',      //邮件标题
  templatePath: '/emailHtml/mailTemplate.html' //HTML 模板引擎路径
}
// 邮件 HTML 模块读取方法
module.exports = emailConfig;