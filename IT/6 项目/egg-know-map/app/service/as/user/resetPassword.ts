/**
 * ^ 本文件完成重置密码功能
 * # 1.通过手机号重置
 * # 1.通过邮箱重置
*/
const database = require('../database/db')
const rule = require('../captcha/validate')
const encrypto = require('../captcha/encrypto')
const EmailCode = require('../captcha/emailCode')
const SmsCode = require('../captcha/smsCode')

module.exports = {
  // > 返回密钥
  rest_secretKey(ctx: any, ruleStr: string, codeObj: any, data: any) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        // 1.校验数据格式
        const resultRule = rule.validateDataFormat(ruleStr, data)
        if (resultRule) return reject(resultRule)
        // 2.校验验证码
        if ('resetPassByPhoneRule' === ruleStr && data.accountType ==='phone') {
          await SmsCode.verifySmsCode(ctx, codeObj.account, codeObj.captcha, codeObj.type);
        } else if ('resetPassByEmailRule' === ruleStr  && data.accountType ==='email') {
          await EmailCode.verifyEmailCode(ctx, codeObj.account, codeObj.captcha, codeObj.type);
        } else {
          return reject('校验异常')
        }
        // 3.创建校验密钥 
        const secretkey = encrypto.encryptText(ctx.request.ip + codeObj.account + data.userAgent + new Date());
        // 4.保存密钥信息
        ctx.session.resetInfo = null // 清空之前的信息
        ctx.session.resetInfo = {
          [data.accountType]: codeObj.account,
          secretkey: secretkey, // 密钥
          expire: Date.now() + 5 * 60 * 1000 // 验证码5分钟之后过期
        };
        // 5. 返回密钥
        return resolve(secretkey)
      } catch (error) {
        reject(error)
      }
    })
  },
  // >校验密钥
  reset_check(ctx: any, ruleStr: string, data: any) {
    return new Promise<void>((resolve, reject) => {
      try {
        // 1.密码格式是否正确
        const resultRule = rule.validateDataFormat(ruleStr, data)
        if (resultRule) return reject(resultRule)
        // 2. 密码加密
        data.password = encrypto.encryptText(data.password);
        // 3. 拼接新的数据
        let newData
        if (data.phone && !data.email && data.accountType == 'phone') {
          newData = { account: { phone: data.phone }, password: data.password }
        } else if (data.email && !data.phone && data.accountType == 'email') {
          newData = { account: { email: data.email }, password: data.password }
        } else {
          reject('数据类型错误,请检查后重试')
        }
        // 4. 校验新的校验码和密钥信息
        const serverCaptcha = ctx.session.resetInfo;
        if (!serverCaptcha) return reject('请重新获取密钥');
        if (Date.now() > serverCaptcha.expire) {
          ctx.session.resetInfo = null;
          return reject('重置密码超时,请重新获取验证码');
        } else if (data.secretkey !== serverCaptcha.secretkey) {
          ctx.session.resetInfo = null;
          return reject("密钥不正确,请重新获取验证码");
        } else if (serverCaptcha.phone != data.phone || serverCaptcha.email != data.email) {
          ctx.session.resetInfo = null;
          return reject("账号不正确,请重新获取验证码");
        }
        // 5. 清空校验信息
        ctx.session.resetInfo = null;
        // 6. 更新数据库
        return resolve(database.updatePassword(ctx.model, newData))
      } catch (error) {
        reject(error)
      }
    })
  },
  /**
   * > 验证手机账号验证码, 返回密钥
   * @ctx: egg的 this.ctx 对象
   * @data: 必要的校验数据
   */
  async resetVerifyByPhone(ctx: any, data: any) {
    const codeObj = {
      account: data.phone,
      captcha: data.captcha,
      type: data.codetype
    }
    return await this.rest_secretKey(ctx, 'resetPassByPhoneRule', codeObj, data)
  },

  /**
   * > 验证邮箱账号验证码, 返回密钥
   * @ctx: egg的 this.ctx 对象
   * @data: 必要的校验数据
   */
  async resetVerifyByEmail(ctx: any, data: any) {
    const codeObj = {
      account: data.email,
      captcha: data.captcha,
      type: data.codetype
    }
    return await this.rest_secretKey(ctx, 'resetPassByEmailRule', codeObj, data)
  },

  /**
   * > 检验密钥并重置密码
   * @ctx: egg的 this.ctx 对象
   * @data: 必要的校验数据
   */
  async resetPassWord(ctx: any, data: any) {
    return await this.reset_check(ctx, 'passwordRule', data)
  }

}
