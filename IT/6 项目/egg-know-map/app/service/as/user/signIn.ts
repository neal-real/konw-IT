/**
 * ^ 本文件完成登录相关的具体处理
 */

// 数据规则
const database_SignIn = require('../database/db')
const rule_SignIn = require('../captcha/validate')
const encrypto_SignIn = require('../captcha/encrypto')
const EmailCode_SignIn = require('../captcha/emailCode')
const SmsCode_SignIn = require('../captcha/smsCode')

module.exports = {
  // 账号密码登录
  signInByPassWord(ctx: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        // 1.准备查找数据 
        let newData
        // 2.检查数据格式是否正确
        if (data.accountType == 'phone') {
          const resultRule = rule_SignIn.validateDataFormat('signInByPhoneRule', data)
          if (resultRule) return reject(resultRule)
          newData = { phone: data.phone, password: data.password }
        } else if (data.accountType == 'email') {
          const resultRule = rule_SignIn.validateDataFormat('signInByEmailRule', data)
          if (resultRule) return reject(resultRule)
          newData = { email: data.email, password: data.password }
        } else {
          return reject('登录类型不正确');
        }
        // 3.密码加密
        newData.password = encrypto_SignIn.encryptText(newData.password);
        // 4. 查找用户, 找不到直接报错
        return resolve(await database_SignIn.findUserInfo(ctx.model, newData))
      } catch (error) {
        return reject(error);
      }
    })
  },
  // 通过验证码登录
  signInByCaptcha(ctx: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        // 1.检查数据格式是否正确
        const resultRule = rule_SignIn.validateDataFormat('signInByCaptchaRule', data)
        if (resultRule) return reject(resultRule)
        // 2. 准备数据
        const newData = { [data.accountType]: data.phone }
        if (data.phone && !data.email) {
          // 3.检查验证码是否有效
          await SmsCode_SignIn.verifySmsCode(ctx, data.phone, data.captcha, data.style);
        } else if (!data.phone && data.email) {
          // 3.检查验证码是否有效
          await EmailCode_SignIn.verifyEmailCode(ctx, data.email, data.captcha, data.style);
        } else {
          return reject('登录账号不明确,请检查后再试')
        }

        // 4. 查找用户, 找不到直接报错
        return resolve(await database_SignIn.findUserInfo(ctx.model, newData))
      } catch (error) {
        reject(error);
      }
    })
  }

}