import Network from './network';
// 注册请求方法, 请求地址: register , 数据中的属性有对象或数组时,使用 qs 转成字符串
export const signUp = (data:{})=>Network.post('/signUp', data);
export const signIn = (data:{})=>Network.post('/signIn', data);              // 登录
export const sendCodeByEmail = (data:{})=>Network.get('/authority/emailCode', data);  // 获取邮箱验证码
export const sendCodeByPhone = (data:{})=>Network.get('/authority/smsCode', data);    // 获取手机验证码
// 重置密码 -> 1. 获取验证码
export const checkcaptcha = (data:{})=>Network.post('/', data);              // 重置密码
export const resetpassword = (data:{})=>Network.post('/', data);              // 重置密码

