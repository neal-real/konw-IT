
const TXConfig: any = {}

// 腾讯云 账号密钥
TXConfig.secret = {
  secretId: 'AKIDOcZFgqlPlqfDVXJp30g5D5h3A1btvgBQ',
  secretKey: 'ziAKErDI7FAoBH6fy1nIWT9XfX9TWIn1'
}
// 腾讯云短信模板类型
TXConfig.SMSType = {
  signIn: '1046029', // 登录模板号
  signUp: '1045236',  // 注册模板号
  changeNumber: '1045237',  // 变更手机号模板号
  resetPass: '1048917',  // 重置密码模板号
  addPhone: '1062601'  // 重置密码模板号
}
// 腾讯云 短信 app 号和签名
TXConfig.paramsInfo = {
  SmsSdkAppId: "1400549750",
  SignName: "知识地图",
}
// 腾讯云短信相关对象常量
TXConfig.SMSObj = {
  region: 'ap-beijing',
  endpoint: "sms.tencentcloudapi.com",
}
// 手机号正则验证
TXConfig.phoneNum = {
  number: /^1[3456789]\d{9}$/
}
// 腾讯云对象存储相关常量
TXConfig.cos = {
  cos_imageDir: "/Volumes/neal/system/cos-image", // 图片临时存放目录
  max_ImageSize1M: 1 * 1024 * 1024,
  max_ImageSize2M: 2 * 1024 * 1024,
  max_ImageSize3M: 3 * 1024 * 1024,
  max_ImageSize5M: 5 * 1024 * 1024,
  picturePrefix: 'knowMapAvatar',
  BucketName: 'knowmap-1305340458',
  Region: 'ap-nanjing',    
  avatar_path: '/userAvatar/avatar',
  StorageClass: 'STANDARD',

}
// 邮件 HTML 模块读取方法
module.exports = TXConfig;