/*
 ^ 提供邮箱验证功能
 #1. 向指定邮箱发送验证码
 #2. 拿到验证码,验证指定邮箱
*/
const nodemailer = require("nodemailer");
let transporter;
async function emailType(ctx, type: any, code: any) {
  let obj = {
    code: code,
    text: '',
    text2: ''
  }
  if (type === 'logIn') {
    obj.text= "您正在登录"
    obj.text2 = "网站"
  } else if (type === 'registered'){
    obj.text= "您正在注册"
    obj.text2 = "网站的账号"
  } else if (type === 'changeNumber'){
    obj.text= "您正在变更"
    obj.text2 = "网站绑定的邮箱"
  } else if (type==='resetPass'){
    obj.text= "您正在重置"
    obj.text2 = "网站的账户密码"
  } else {
    throw new Error("请求格式不正确");
  }
  const result = await ctx.renderView(`/emailHtml/mailTemplate.html`,obj)
  if (result) return result
  throw new Error("空模板,请联系管理员.");
}
export default {

  // > 创建邮件对象
  createTransporterInstance(ctx) {
    // 存在不创建
    if (transporter) {
      return transporter;
    }
    // 不存在创建
    transporter = nodemailer.createTransport({
      host: ctx.app.config.smtp.host,
      port: ctx.app.config.smtp.port,
      secure: ctx.app.config.smtp.secure, // true for 465, false for other ports
      auth: {
        user: ctx.app.config.smtp.user, // 发送邮件的邮箱
        pass: ctx.app.config.smtp.pass, // 邮箱对应的授权码
      },
    });
    return transporter;
  },

  // >发送邮箱验证码
  async createEmailInfo(ctx, to: string, type: string) {
    // 1.生成验证码
    let code = Math.random().toString(16).slice(2, 6).toUpperCase();
    // 2.生成发送内容
    let info = {
      from: 'knowmap@know-map.com', // 谁发的
      to: to, // 发给谁
      subject: "知识地图", // 邮件标题
      // text: emailType(type, code), // 邮件内容
      html: await emailType(ctx, type, code)// 也是内容,但是用 html 方式编写
    };
    // 3.保存验证码
    ctx.session.email = {
      email: to,
      type: type,
      code: code,
      expire: Date.now() + 15 * 60 * 1000 // 验证码15分钟之后过期
    };
    return info;
  },

  /*
    > 获得邮箱验证码",
    @ctx:egg 本身",
    @to:验证码发送到哪个邮箱",
    @$返回值:#返回数据",
  */
  async sendEmailCode(ctx, to: string, type: string) {
    const transporter = this.createTransporterInstance(ctx);
    // 发送邮箱验证码
    const info = await this.createEmailInfo(ctx, to, type);
    return new Promise((resolve, reject) => {
      // 发送邮件
      transporter.sendMail(info, (err, data) => {
        // 返回结果
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    });
  },

  /*
    > 验证邮件",
    @ctx:egg 本身",
    @clientCode:用户填写的验证码",
    @$返回值:#返回数据",
  */
  verifyEmailCode(ctx, email:string, captcha:string, type:string){
    // 1.取出服务端中保存的验证码和过期时间
    const serverCaptcha = ctx.session.email;
    let serverEmail;
    let serverType;
    let serverCode;
    let serverExpire;
    try {
      serverEmail = serverCaptcha.email;
      serverType = serverCaptcha.type;
      serverCode = serverCaptcha.code;
      serverExpire = serverCaptcha.expire;
    } catch (e) {
      // 注意点: 验证码无论验证成功还是失败, 都只能使用一次
      ctx.session.email = null;
      throw new Error('请重新获取验证码');
    }

    if (Date.now() > serverExpire) {
      // 注意点: 验证码无论验证成功还是失败, 都只能使用一次
      ctx.session.email = null;
      throw new Error('验证码已经过期,请重新获取验证码');
    } else if (serverCode !== captcha || serverEmail!== email) {
      // 注意点: 验证码无论验证成功还是失败, 都只能使用一次
      ctx.session.email = null;
      throw new Error('验证码不正确,请重新获取验证码');
    } else if (serverType !== type){
      ctx.session.email = null;
      throw new Error('验证码类型不正确,请重新获取验证码');
    }
    if (serverCode === captcha && serverEmail === email && type === serverType) {
      ctx.session.sms = null;
      return true
    }
    // 注意点: 验证码无论验证成功还是失败, 都只能使用一次
    ctx.session.email = null;
  }
}
