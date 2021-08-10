/**
 * ^ 提供手机短信验证功能
 * #1. 创建发送短信对象
 * #2. 创建短信文本
 * #3. 发送短信
 * #4. 校验短信验证码
*/
const tencentcloud = require("tencentcloud-sdk-nodejs");
const TXConfigInfo = require("../config/TXConfig");

const SmsClient = tencentcloud.sms.v20210111.Client;
// 发送短信的对象
let client: any;

module.exports = {
  // > 1. 创建发送短信对象
  createTransporterInstance() {
    if (client) { return client; }
    const clientConfig = {
      credential: {
        secretId: TXConfigInfo.secret.secretId,
        secretKey: TXConfigInfo.secret.secretKey,
      },
      region: TXConfigInfo.SMSObj.region,
      profile: {
        httpProfile: {
          endpoint: TXConfigInfo.SMSObj.endpoint,
        },
      },
    };
    client = new SmsClient(clientConfig);
    return client;
  },
  // > 2. 创建短信文本
  createSmsInfo(ctx, to: string, type: string) {
    // 1.生成验证码
    let code = Math.random().toString().slice(2, 6).toUpperCase();
    code = code + "";
    // 2.生成发送内容 to是手机号需要加 +86
    const params = {
      PhoneNumberSet: ['+86' + to],
      SmsSdkAppId: TXConfigInfo.paramsInfo.SmsSdkAppId, //app id
      SignName: TXConfigInfo.paramsInfo.SignName,  // 短信标题
      TemplateId: TXConfigInfo.SMSType[type],  // 短信类型
      TemplateParamSet: [code]  // 短信验证码
    };
    // 3.保存验证码
    ctx.session.sms = {
      type: type,
      phone: to,
      code: code,
      expire: Date.now() + 5 * 60 * 1000 // 验证码5分钟之后过期
    };
    return params;
  },
  // > 3. 发送短信 ctx的作用是使用 session 保存验证信息
  async sendSmsCode(ctx, to: string, type: string) {
    if (!to) throw new Error("手机号码不能为空");
    if (!type) throw new Error("验证码类型不能为空");
    if (!TXConfigInfo.phoneNum.number.test(to)) throw new Error("请检查手机号码是否正确");
    const client = await this.createTransporterInstance();
    const params = await this.createSmsInfo(ctx, to, type);
    return new Promise((resolve, reject) => {
      try {
        client.SendSms(params).then(
          (result) => { resolve(result); },
          (err) => { reject(err); }
        )
      } catch (error) { reject(error) }
    });
  },
  // > 4. 校验短信验证码 ctx的作用是使用 session 传递验证信息
  verifySmsCode(ctx: any, phoneNumber: string, clientCode: string, type: string) {
    return new Promise<void>((resolve, reject) => {
      // 1.取出服务端中保存的验证码和过期时间
      if (!ctx.session) return reject('ctx 不存在,请程序核查');
      const serverCaptcha = ctx.session.sms;
      let serverType;
      let serverCode;
      let serverPhone;
      let serverExpire;
      try {
        serverType = serverCaptcha.type;
        serverCode = serverCaptcha.code;
        serverPhone = serverCaptcha.phone;
        serverExpire = serverCaptcha.expire;
      } catch (e) {
        ctx.session.sms = null;
        return reject('验证码仅能使用一次,请重新获取验证码');
      }
      if (Date.now() > serverExpire) {
        ctx.session.sms = null;
        return reject('验证码已经过期,请重新获取验证码');
      } else if (serverType !== type) {
        ctx.session.sms = null;
        return reject('验证码类型不正确,请重新获取验证码');
      } else if (serverCode !== clientCode || serverPhone !== phoneNumber) {
        ctx.session.sms = null;
        return reject('验证码不正确,请重新获取验证码');
      }
      if (serverCode === clientCode && serverPhone === phoneNumber && type === serverType) {
        ctx.session.sms = null;
        resolve()
      }
      // 注意点: 验证码无论验证成功还是失败, 都只能使用一次
      ctx.session.sms = null;
    })
  }
}
