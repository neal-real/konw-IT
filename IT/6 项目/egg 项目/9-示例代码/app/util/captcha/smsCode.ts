/*
 ^ 提供手机短信验证功能
 #1. 向指定手机号码发送验证码
 #2. 拿到验证码,验证指定手机号码
*/

const tencentcloud = require("tencentcloud-sdk-nodejs");

const SmsClient = tencentcloud.sms.v20210111.Client;
const SMSType = {
  logIn: '1046029', // 登录模板号
  registered: '1045236',  // 注册模板号
  changeNumber: '1045237',  // 变更手机号模板号
  resetPass: '1048917'  // 重置密码模板号
}

// 发送短信的对象
let client: any;
export default {
  // 创建发送短信对象
  createTransporterInstance(ctx) {
    // 是否发送
    if (client) {
      return client;
    }
    const clientConfig = {
      credential: {
        secretId: ctx.app.config.sms.secretId,
        secretKey: ctx.app.config.sms.secretKey,
      },
      region: "ap-beijing",
      profile: {
        httpProfile: {
          endpoint: "sms.tencentcloudapi.com",
        },
      },
    };

    client = new SmsClient(clientConfig);
    return client;
  },
  // 创建短信
  createSmsInfo(ctx, to: string, type: string) {
    // 1.生成验证码
    let code = Math.random().toString().slice(2, 6).toUpperCase();
    code = code + "";
    // 2.生成发送内容 to是手机号需要加 +86
    const params = {
      PhoneNumberSet: [
        '+86' + to
      ],
      SmsSdkAppId: "1400549750",
      SignName: "知识地图",
      TemplateId: SMSType[type],
      TemplateParamSet: [
        code
      ]
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
  // 发送短信
  async sendSmsCode(ctx, to: string, type: string) {
    if (!to) throw new Error("手机号码不能为空");
    if (!type) throw new Error("验证码类型不能为空");
    if (!/^1[3456789]\d{9}$/.test(to)) throw new Error("请检查手机号码是否正确");
    const client = await this.createTransporterInstance(ctx);
    const params = await this.createSmsInfo(ctx, to, type);
    return new Promise((resolve, reject) => {
      try {
        client.SendSms(params).then(
          (result) => {
            resolve(result);
          },
          (err) => {
            reject(err);
          }
        )
      } catch (error) {
        reject(error)
      }
    });
  },
  // 验证验证码 注意点: 验证码无论验证成功还是失败, 都只能使用一次
  verifySmsCode(ctx, phoneNumber, clientCode, type) {
    // 1.取出服务端中保存的验证码和过期时间
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
      ctx.session.email = null;
      throw new Error('请重新获取验证码');
    }

    if (Date.now() > serverExpire) {
      ctx.session.email = null;
      throw new Error('验证码已经过期,请重新获取验证码');
    } else if (serverCode !== clientCode || serverPhone !== phoneNumber) {
      ctx.session.email = null;
      throw new Error('验证码不正确,请重新获取验证码');
    } else if (serverType !== type){
      ctx.session.email = null;
      throw new Error('验证码类型不正确,请重新获取验证码');
    }
    if (serverCode === clientCode && serverPhone === phoneNumber && type === serverType) {
      ctx.session.sms = null;
      return true
    }
    // 注意点: 验证码无论验证成功还是失败, 都只能使用一次
    ctx.session.sms = null;
  }
}
