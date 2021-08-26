/*
 ? 路由文件 user.ts
 # 1.接收用户相关的路由
*/
module.exports = app => {
  const { controller, router } = app;
  // 不需要登录鉴权的三个
  router.post('/signUp', controller.authority.user.signUp); // 用户注册
  router.post('/signIn', controller.authority.user.signIn); // 用户登录
  router.post('/resetpass', controller.authority.user.resetPassword); // 用户重置密码
  // 已下需要登录鉴权
  router.post('/user/update-userInfo', controller.authority.user.updateUserInfo); // 用户重置密码
  router.post('/user/changeNumber', controller.authority.user.changePhoneAndEmail); // 用户变更手机号或邮箱
  router.post('/user/addinfo', controller.authority.user.addinfo); // 用户新增手机号或邮箱

};
