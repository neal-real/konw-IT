/*
? 本文件完成注册相关具体细节功能
# 
*/

// 数据库
const database = require('../database/db')
const rule_SignUP = require('../captcha/validate')
const encrypto = require('../captcha/encrypto')
const EmailCode = require('../captcha/emailCode')
const SmsCode = require('../captcha/smsCode')

export default {
  sigUp(ctx: any, ruleStr: string, codeObj: any, account: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {

        // 1.检查数据格式是否正确, 有返回值即出错
        // 用户协议值类型字符串转布尔
        if (typeof data.userAgreement == 'string') { data.userAgreement = Boolean(data.userAgreement) }
        const resultRule = rule_SignUP.validateDataFormat(ruleStr, data)
        if (resultRule) return reject(resultRule)
        console.log('----');
        // 2. 判断用户是否存在
        const result = await database.isThisUserExist(ctx.model, account)
        if (result) return reject('用户已存在')
        // 3.密码加密
        data.password = encrypto.encryptText(data.password);
        // 4.检查验证码是否有效
        if ('signUpByPhoneRule' === ruleStr) {
          await SmsCode.verifySmsCode(ctx, codeObj.account, codeObj.captcha, codeObj.type);
          // 4. 注册手机账户
          return resolve(database.createUserByPhone(ctx.model, data))
        } else if ('signUpByEmailRule' === ruleStr) {
          await EmailCode.verifyEmailCode(ctx, codeObj.account, codeObj.captcha, codeObj.type);
          // 4. 注册手机账户
          return resolve(database.createUserByEmail(ctx.model, data))
        } else {
          return reject('校验异常')
        }
      } catch (error) {
        reject(error);
      }
    })
  },

  /**
  * > 通过手机注册账号
  * @ctx: egg的 this.ctx 对象
  * @data: 必要的校验数据
  */
  async sigUpByPhone(ctx: any, data: any) {
    const sms = {
      account: data.phone,
      captcha: data.captcha,
      type: data.captchaType
    }
    const account = { phone: data.phone }
    return await this.sigUp(ctx, 'signUpByPhoneRule', sms, account, data)
  },

  /**
  * > 通过邮箱注册账号
  * @ctx: egg的 this.ctx 对象
  * @data: 必要的校验数据
  */
  sigUpByEmail(ctx: any, data: any) {
    // 准备短信验证对象
    const sms = {
      account: data.email,
      captcha: data.captcha,
      type: data.captchaType
    }
    // 准备账号信息对象
    const account = { email: data.email }
    return this.sigUp(ctx, 'signUpByEmailRule', sms, account, data)
  }
}