/**
 * ^ 提供邮箱验证功能
 * # 1. 读取静态模板作为邮件模板
 * # 2. 根据配置创建邮件对象
 * # 3. 配置邮件内容并保存值 session 中
 * # 4. 发送邮件的验证码
 * # 5. 校验邮件的验证码
*/
const nodemailer = require("nodemailer");
const emailConfigInfo = require("../config/emailConfig");
let transporter;
module.exports = {
  // > 1. 读取邮件 HTML 静态模板
  async emailTemplate(ctx, type: any, code: any, path: string) {
    if (!emailConfigInfo.emailHtmlTemplate[type]) throw new Error("请求格式不正确");
    let obj = {
      code: code,
      header: emailConfigInfo.emailHtmlTemplate[type].header,
      end: emailConfigInfo.emailHtmlTemplate[type].end
    }
    const result = await ctx.renderView(path, obj)
    if (result) return result
    throw new Error("空模板,请联系管理员.")
  },

  // > 2. 根据配置创建邮件对象
  createTransporterInstance() {
    // 存在不创建
    if (transporter) {
      return transporter;
    }
    // 不存在创建
    transporter = nodemailer.createTransport({
      host: emailConfigInfo.emailSmtp.host,
      port: emailConfigInfo.emailSmtp.port,
      secure: emailConfigInfo.emailSmtp.secure, // 对于465端口为True，对于其他端口为false
      auth: {
        user: emailConfigInfo.emailSmtp.user, // 发送邮件的邮箱
        pass: emailConfigInfo.emailSmtp.pass, // 邮箱对应的授权码
      },
    });
    return transporter;
  },

  // > 3. 配置邮件内容并保存值 session 中
  async createEmailInfo(ctx, to: string, type: string) {
    // 1.生成验证码
    let code = Math.random().toString(16).slice(2, 6).toUpperCase();
    // 2.生成发送内容
    let info = {
      from: emailConfigInfo.emailSendInfo.from, // 谁发的
      to: to, // 发给谁
      subject: emailConfigInfo.emailSendInfo.subject, // 邮件标题
      // text: emailType(type, code), // 邮件内容
      html: await this.emailTemplate(ctx, type, code, emailConfigInfo.emailSendInfo.templatePath)// 也是内容,但是用 html 方式编写
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

  /**
   * ^ 4.发送邮件的验证码
   * @ctx:egg 本身"
   * @to:验证码发送到哪个邮箱"
   * @返回值:#返回数据"
   */
  async sendEmailCode(ctx, to: string, type: string) {
    // 1. 创建邮件发送对象
    const transporter = this.createTransporterInstance();
    // 2. 创建邮件发送对象需要的配置信息
    const info = await this.createEmailInfo(ctx, to, type);
    return new Promise((resolve, reject) => {
      // 3.发送邮件
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
  /**
  * ^ 5. 校验邮件的验证码
  * @ctx:egg 本身"
  * @clientCode:用户填写的验证码",
  * @返回值:#返回数据"
  */
  verifyEmailCode(ctx, email: string, captcha: string, type: string) {
    return new Promise<void>((resolve, reject) => {
      // 1.取出服务端中保存的验证码和过期时间
      if (!ctx.session) return reject('ctx 不存在,请程序核查');
      const serverCaptcha = ctx.session.email;
      if (!serverCaptcha) return reject('验证码不存在,请重新获取验证码');
      let serverEmail;
      let serverType;
      let serverCode;
      let serverExpire;
      try {
        serverEmail = serverCaptcha.email;
        serverType = serverCaptcha.type;
        serverCode = serverCaptcha.code;
        serverExpire = serverCaptcha.expire;
      } catch (error) {
        ctx.session.email = null;
        return reject('验证码仅能使用一次,请重新获取验证码');
      }

      if (Date.now() > serverExpire) {
        ctx.session.email = null;
        return reject('验证码已经过期,请重新获取验证码');
      } else if (serverType !== type) {
        ctx.session.email = null;
        return reject('验证码类型不正确,请重新获取验证码');
      } else if (serverCode !== captcha || serverEmail !== email) {
        ctx.session.email = null;
        return reject('验证码不正确,请重新获取验证码');
      }
      if (serverCode === captcha && serverEmail === email && type === serverType) {
        ctx.session.email = null;
        resolve()
      }
      // 注意点: 验证码无论验证成功还是失败, 都只能使用一次
      ctx.session.email = null;
    })
  }
}
