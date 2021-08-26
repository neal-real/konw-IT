/**
 * ^ 本文件完成用户信息更新相关的实现 
 */
const database_updateUserInfo = require('../database/db')
const rule_updateUserInfo = require('../captcha/validate')
const encrypto_updateUserInfo = require('../captcha/encrypto')
const EmailCode_updateUserInfo = require('../captcha/emailCode')
const SmsCode_updateUserInfo = require('../captcha/smsCode')

module.exports = {
  /**
   * > 更新用户头像
   */
  updateUserAvatar(ctx: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await database_updateUserInfo.updateUserInfo(ctx.model, { _id: data.user_id }, { avatar: data.avatar })
        return resolve(result)
      } catch (error) {
        reject(error);
      }
    })
  },

  /**
   * > 更新昵称
   */
  updateUserNickName(ctx: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!data.nickname) return reject("昵称不存在");
        if (!data.nickname.match(/^.{2,12}$/)) return reject("昵称长度在2-12个之间");
        const result = await database_updateUserInfo.updateUserInfo(ctx.model, { _id: data.user_id }, { nickname: data.nickname })
        return resolve(result)
      } catch (error) {
        return reject(error);
      }
    })
  },

  /**
   * > 更新密码
   */
  updateUserPassword(ctx: any, data: any) {
    return new Promise(async (resolve, reject) => {

      try {
        // 校验密码规则
        const z = /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,}$/
        if (data.oldpassword === data.newpassword || !data.oldpassword || !data.newpassword) return reject("新旧密码不能一致,且有值");
        if (!data.newpassword.match(z)) return reject('密码必须是大于8位且是数字,字母,符号组合');
        // 密码加密
        data.oldpassword = encrypto_updateUserInfo.encryptText(data.oldpassword)

        // 查询原密码是否正确
        const isSame = await database_updateUserInfo.isThisTheSamePasswordAsTheDatabase(ctx.model, data.user_id, data.oldpassword)
        if (isSame) {
          data.newpassword = encrypto_updateUserInfo.encryptText(data.newpassword)
          const result = await database_updateUserInfo.updateUserInfo(ctx.model, { _id: data.user_id }, { password: data.newpassword })
          return resolve(result)
        } else {
          return reject("原密码不正确");
        }
      } catch (error) {
        return reject(error);
      }
    })
  },
  // > 验证手机账号验证码, 返回密钥
  changeVerifyByPhone(ctx: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        // 1.校验数据格式
        const resultRule = rule_updateUserInfo.validateDataFormat('changeVerifyPhoneRule', data)
        if (resultRule) return reject(resultRule)
        // 2.校验验证码
        await SmsCode_updateUserInfo.verifySmsCode(ctx, data.phone, data.captcha, data.captchaType);
        // 3.创建校验密钥 
        const secretKey = encrypto_updateUserInfo.encryptText(ctx.request.ip + data.phone + data.userAgent + new Date());
        // 4.保存密钥信息
        ctx.session.changePhone = null // 清空之前的信息
        ctx.session.changePhone = {
          phone: data.phone,
          secretKey: secretKey, // 密钥
          expire: Date.now() + 5 * 60 * 1000 // 验证码5分钟之后过期
        };
        // 5. 返回密钥
        return resolve(secretKey)
      } catch (error) {
        return reject(error);
      }
    })
  },
  /**
   * > 验证手机变更阶段的数据和各种情况
   */
  changeVerifyPhoneData(ctx: any, data: any) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        // 校验变更数据格式
        const resultRule = rule_updateUserInfo.validateDataFormat('changePhoneRule', data)
        if (resultRule) return reject(resultRule)
        // 校验秘钥
        const serverCaptcha = ctx.session.changePhone;
        if (!serverCaptcha) return reject("请获取变更秘钥");
        if (Date.now() > serverCaptcha.expire) {
          ctx.session.changePhone = null;
          return reject('变更手机操作超时,请重新获取验证码');
        } else if (data.secretkey !== serverCaptcha.secretKey) {
          ctx.session.changePhone = null;
          return reject("密钥不正确,请重新获取验证码");
        } else if (serverCaptcha.phone != data.phone) {
          ctx.session.changePhone = null;
          return reject("账号不正确,请重新获取验证码");
        }
        // 校验新的手机验证码
        await SmsCode_updateUserInfo.verifySmsCode(ctx, data.newphone, data.captcha, data.captchaType);
        console.log('通过');
        // 查询新手机是否有其他账号
        const isExist = await database_updateUserInfo.isThisUserExist(ctx.model, { phone: data.newphone })
        console.log('通过');
        if (isExist) return reject("新的号码已存在");
        // 验证用户 id 和手机号是否匹配
        const isMatch = await database_updateUserInfo.isThisUserExist(ctx.model, { _id: data.user_id, phone: data.phone })
        if (!isMatch) return reject("用户与原手机号不匹配");
        // 至 null 秘钥
        ctx.session.changePhone = null;
        resolve()
      } catch (error) {
        return reject(error);
      }
    })
  },

  /**
   * ^ 变更手机号
   * @param ctx 
   * @param data 
   * @returns 
   */
  changeUserPhone(ctx: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        if (data.stage == 'verify') {
          // 返回一个唯一标识符
          return resolve(await this.changeVerifyByPhone(ctx, data))
        } else if (data.stage == 'change') {
          // 验证手机变更阶段的数据和各种情况
          const error = await this.changeVerifyPhoneData(ctx, data)
          if (error) {
            return reject(error)
          }
          const result = await database_updateUserInfo.updateUserInfo(ctx.model, { _id: data.user_id }, { phone: data.newphone })
          return resolve(result)
        } else {
          return reject("阶段类型错误");
        }
      } catch (error) {
        return reject(error);
      }
    })
  },
  /**
   *  > 验证邮箱账号验证码, 返回密钥 
   * @param ctx 
   * @param data 
   * @returns 
   */
  changeVerifyByEmail(ctx: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try { 
        // 1.校验数据格式
        rule_updateUserInfo.validateDataFormat('changeVerifyEmailRule', data)
        // 2.校验验证码
        await EmailCode_updateUserInfo.verifyEmailCode(ctx, data.email, data.captcha, data.captchaType);
        // 3.创建校验密钥 
        const secretKey = encrypto_updateUserInfo.encryptText(ctx.request.ip + data.email + data.userAgent + new Date());
        // 3.保存密钥信息
        ctx.session.changeEmail = null // 清空之前的信息
        ctx.session.changeEmail = {
          email: data.email,
          secretKey: secretKey, // 密钥
          expire: Date.now() + 5 * 60 * 1000 // 重置时效 5分钟之后过期
        };
        return resolve(secretKey)
      } catch (error) {
        return reject(error);
      }
    })
  },
  // > 验证邮箱变更阶段的数据和各种情况
  changeVerifyEmailData(ctx: any, data: any) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        // 校验变更数据格式
        rule_updateUserInfo.validateDataFormat('changeEmailRule', data)
        // 校验秘钥
        const serverCaptcha = ctx.session.changeEmail;
        if (!serverCaptcha) return reject("请获取变更秘钥");
        if (Date.now() > serverCaptcha.expire) {
          ctx.session.changeEmail = null;
          return reject('变更邮箱超时,请重新获取验证码');
        } else if (data.secretkey !== serverCaptcha.secretKey) {
          ctx.session.changeEmail = null;
          return reject("密钥不正确,请重新获取验证码");
        } else if (serverCaptcha.email != data.email) {
          ctx.session.changeEmail = null;
          return reject("账号不正确,请重新获取验证码");
        }
        // 校验新的邮箱验证码
        await EmailCode_updateUserInfo.verifyEmailCode(ctx, data.newemail, data.captcha, data.captchaType);
        // 查询新邮箱是否有其他账号
        const isExist = await database_updateUserInfo.isThisUserExist(ctx.model, { email: data.newemail })
        if (isExist) return reject("新的邮箱已存在");
        // 验证用户 id 和邮箱是否匹配
        const isMatch = await database_updateUserInfo.isThisUserExist(ctx.model, { _id: data.user_id, email: data.email })
        if (!isMatch) return reject("用户与原邮箱号不匹配");
        // 至 null 秘钥
        ctx.session.changeEmail = null;
        resolve()
      } catch (error) {
        return reject(error);
      }
    })
  },

  /**
   * ^ 变更邮箱
   * @param ctx 
   * @param data 
   * @returns 
   */
  changeUserEmail(ctx:any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        let result
        if (data.stage == 'verify') {
          // 返回一个唯一标识符
          result = await this.changeVerifyByEmail(ctx, data)
        } else if (data.stage == 'change') {
          // 验证邮箱变更阶段的数据和各种情况
          await this.changeVerifyEmailData(ctx, data)
          result = await database_updateUserInfo.updateUserInfo(ctx.model, { _id: data.user_id }, { email: data.newemail })
        }else {
          return reject('变更阶段不正确')
        }
        return resolve(result)
      } catch (error) {
        return reject(error);
      }
    })
  }

}