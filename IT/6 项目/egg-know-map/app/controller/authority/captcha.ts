/*
? 处理验证码相关的路由接口
# 1.接收用户相关的路由
*/


import { Controller } from 'egg';

export default class CaptchaController extends Controller {

  // > 发送邮箱验证码
  public async emailCode() {
    const { ctx } = this;
    const as = this.ctx.service.as.index;
    try {
      const { email, type } = ctx.query;
      if (!type || !email) return ctx.body = ctx.msg(400, '数据不能为 null');
      if (type !== 'signUp' &&type !== 'changeNumber' && type !== 'addEmail') {
        // 判断用户是否存在
        const isExist = await as.isThisUserExist({ email: email })
        if (!isExist) return ctx.body = ctx.msg(400, '用户不存在');
      }
      // 获取邮箱校验码 
      const data = await as.send_captchaByEmail(email, type);
      if (!data) return ctx.body = ctx.msg(400, data);
      ctx.body = ctx.msg(200, '验证码已发送');
    } catch (e) {
      ctx.body = ctx.msg(502, e);
    }
  }
  // > 校验邮箱验证码
  public async checkEmailCode() {
    const { ctx } = this;
    const as = this.ctx.service.as.index;
    const data = ctx.request.body;
    try {
      const result = await as.verify_captchaByEmail(data.email, data.captcha, data.type);
      if (!result)  return ctx.body = ctx.msg(200, '邮箱验证码正确');
      return ctx.body = ctx.msg(400, result);
    } catch (e) {
      ctx.body = ctx.msg(502, e);
    }
  }
  
  // > 获取手机验证码
  public async smsCode() {
    const { ctx } = this;
    const as = this.ctx.service.as.index;
    try {
      const { phone, type } = ctx.query;
      if (!type || !phone) return ctx.body = ctx.msg(400, '数据不能为 null');
      if (type !== 'signUp' &&type !== 'changeNumber' && type !== 'addPhone') {
        const isExist = await as.isThisUserExist({ phone: phone })
        if (!isExist) return ctx.body = ctx.msg(400, '用户不存在');
      }
      const data = await as.send_captchaByPhone(phone, type);
      if (!data) return ctx.body = ctx.msg(400, data);
      ctx.body = ctx.msg(200, '验证码已发送');
    } catch (e) {
      ctx.body = ctx.msg(502, e);
    }
  }
  
  // > 校验手机验证码
  public async checkSmsCode() {
    const { ctx } = this;
    const as = this.ctx.service.as.index;
    const data = ctx.request.body;
    try {
      const result = await as.verify_captchaByPhone(data.phone, data.captcha, data.type);
      if (!result) {
        ctx.body = ctx.msg(200, '验证码正确');
      }
    } catch (e) {
      ctx.body = ctx.msg(502, e);
    }
  }
}
