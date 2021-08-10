/*
 ? 路由文件 处理个权限,验证相关的事情
 # 1.接收用户相关的路由
*/
module.exports = app => {
  const { controller, router } = app;
  // 获取验证码: 手机,邮箱, 图片
  router.get('/authority/smsCode', controller.authority.captcha.smsCode);
  router.get('/authority/emailCode', controller.authority.captcha.emailCode);
  // 校验验证吗:
  router.post('/authority/checkSmsCode', controller.authority.captcha.checkSmsCode);
  router.post('/authority/checkEmailCode', controller.authority.captcha.checkEmailCode);
  // 上传图片
  router.post('/authority/image', controller.authority.image.saveImage);
};
