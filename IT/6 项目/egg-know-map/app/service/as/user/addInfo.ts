/**
 * ^ 本文件完成登录相关的具体处理
 */

// 数据规则
const database_addInfo = require('../database/db')
const rule_addInfo = require('../captcha/validate')
const encrypto_addInfo = require('../captcha/encrypto')
const EmailCode_addInfo = require('../captcha/emailCode')
const SmsCode_addInfo = require('../captcha/smsCode')

module.exports = {
  // 
  /**
   * > 给账号绑定邮箱
   * @param ctx 
   * @param data 
   * @returns 
   */
  addUserInfoToPhone(ctx: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        // 1.检查数据格式是否正确
        const resultRule = rule_addInfo.validateDataFormat('addInfoRule', data)
        if (resultRule) return reject(resultRule)
        // 2. 检查验证码
        await SmsCode_addInfo.verifySmsCode(ctx, data.phone, data.captcha, data.type);
        // 3. 查看账号是否冲突
        const isExist = await database_addInfo.isThisUserExist(ctx.model, { phone: data.phone })
        if (isExist) return reject("该手机号已绑定其他账号");
        // 验证用户 id 和邮箱是否匹配
        const userInfo = await database_addInfo.findUserInfo(ctx.model,{ _id: data.user_id })
        if (userInfo.email !== data.email) return reject("用户与原邮箱账号号不匹配");
        if (userInfo.phone) return reject("此账号已绑定邮箱,请从变更邮箱处变更邮箱");
        // 4. 写入账号
        const isUpdata = await database_addInfo.updateUserInfo(ctx.model, {_id: data.user_id}, { phone: data.phone })
        resolve(isUpdata)
      } catch (error) {
        return reject(error);
      }
    })
  },
  // 给账号绑定手机号
  addUserInfoToEmail(ctx: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        // 1.检查数据格式是否正确
        const resultRule = rule_addInfo.validateDataFormat('addInfoRule', data)
        if (resultRule) return reject(resultRule)
        // 2.检查验证码是否有效
        await EmailCode_addInfo.verifyEmailCode(ctx, data.email, data.captcha, data.type);
        // 3. 查找账号是否冲突
        const isExist = await database_addInfo.isThisUserExist(ctx.model,{ email: data.email })
        if (isExist) return reject("该邮箱号已绑定其他账号");
        // 3.1通过 id 获取用户信息
        const userInfo = await database_addInfo.findUserInfo(ctx.model,{ _id: data.user_id })
        // 3.2验证用户 id 和手机是否匹配
        if (userInfo.phone !== data.phone) return reject("用户与原手机账号号不匹配");
        if (userInfo.email) return reject("此账号已绑定邮箱,请从变更邮箱处变更邮箱");
        // 4. 写入账号
        const isUpdata = await database_addInfo.updateUserInfo(ctx.model, {_id: data.user_id}, { email: data.email })
        resolve(isUpdata)
      } catch (error) {
        reject(error);
      }
    })
  }

}