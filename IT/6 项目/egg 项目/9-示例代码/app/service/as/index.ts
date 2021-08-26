/**
 * ? 账号系统的入口文件
 * # AS 全称 accountSystem
*/
import { Service } from 'egg';
// ^ 校验模块引入
const EmailCode = require('./captcha/emailCode')
const SmsCode = require('./captcha/smsCode')
const Encrypto_Index = require('./captcha/encrypto')
const rule = require('./captcha/validate')
// ^ 图片模块引入
import TXCOS from './cos/saveImage';
// ^ 数据库模块引入
const db = require('./database/db')
// // ^ 用户模块引入
import signUp from './user/signUp';
const resetPassword_I = require('./user/resetPassword')
const signIn_I = require('./user/signIn')
const updateUserInfo_I = require('./user/updateUserInfo')
const addInfo_I = require('./user/addInfo')


export default class AS extends Service {
  // -校验模块
  // # 1. 验证码模块
  /**
   * > 1.1 邮箱验证码-发送
   * @参数1: 邮箱地址
   * @参数2: 验证类型:必须和校验时相同
  */
  public async send_captchaByEmail(to: string, type: string) {
    return await EmailCode.sendEmailCode(this.ctx, to, type);
  }
  /**
   * > 1.2 邮箱验证码-校验
   * @参数1: 邮箱地址
   * @参数2: 验证码
   * @参数3: 验证类型:必须和发送时相同
  */
  public async verify_captchaByEmail(email: string, captcha: string, type: string) {
    return await EmailCode.verifyEmailCode(this.ctx, email, captcha, type);
  }
  /**
  *  > 手机证码-发送
  * @参数1: 手机号
  * @参数2: 验证类型
  */
  public async send_captchaByPhone(to: string, type: string) {
    return SmsCode.sendSmsCode(this.ctx, to, type);
  }
  /**
    *  > 1.4 手机验证码-校验
    * @参数1: 手机号
    * @参数2: 验证码
    * @参数3: 验证类型
    */
  public async verify_captchaByPhone(phoneNumber: string, clientCode: string, type: string) {
    return await SmsCode.verifySmsCode(this.ctx, phoneNumber, clientCode, type);
  }

  // # 2. 账号鉴权模块
  // > jwt 提供 token
  public  get_token(json: any, key: string) {
    return Encrypto_Index.cipherTextByJWT(json, key)
  }

  // > jwt 提供 校验结果
  public verify_token(token: string, key: string) {
    return Encrypto_Index.clearTextByJWT(token, key);
  }

  // # 3. 密码加密解密模块
  // > 字符串单向加密 
  public async get_encryptText(text: string) {
    return Encrypto_Index.encryptText(text);
  }
  // > 字符串加密 key1 
  public async get_cipherTextByKey(text: string, key: string) {
    return Encrypto_Index.cipherTextByAES(text, key);
  }
  // > 字符串解密 key1
  public async get_clearTextByKey(text: string, key: string) {
    return Encrypto_Index.clearTextByAES(text, key);
  }
  // # 2. 数据格式校验
  /**
   * > 数据格式校验
   * @参数1 : 规则文件名
   * @参数2 : 需要校验的数据
   */
  public async validate(ruleString: string, data: any) {
    return rule.validateDataFormat(ruleString, data);
  }

  // -图片模块

  /**
   * # 1. 给图片存放到头像图片处
   * 给我图片,返回一个 url
   */
  public async get_avatarUrl(req: any) {
    return await TXCOS.saveUserAvatar(req);
  }

  // -数据库模块

  /**
   * > 判断是否有此用户
   * @model: 数据库模型对象
   * @data:需要的数据 {查询字段:'查询字段的值'}
   * @返回: true 表示存在; false 表示不存在
   */
  public async isThisUserExist(data: any) {
    return await db.isThisUserExist(this.ctx.model, data);
  }


  // - 用户信息模块
  // # 2. 注册模块
  /**
   * > 通过手机号注册
   * @ctx: egg的 this.ctx 对象
   * @data: 必要的校验数据
   */
  public async signUpByPhone(data: any) {
    return await signUp.sigUpByPhone(this.ctx, data);
  }
  /**
   * > 通过邮箱号注册
   * @ctx: egg的 this.ctx 对象
   * @data: 必要的校验数据
   */
  public async signUpByEmail(data: any) {
    return await signUp.sigUpByEmail(this.ctx, data);
  }
  // # 1. 登录模块
  /**
  * > 通过账号密码登录
  * @data: 必要的校验数据
  */
  public async signInByPassWord(data: any) {
    return await signIn_I.signInByPassWord(this.ctx, data);
  }
  /**
  * > 通过验证码登录
  * @data: 必要的校验数据
  */
  public async signInByCaptcha(data: any) {
    return await signIn_I.signInByCaptcha(this.ctx, data);
  }

  // # 3. 更新用户信息模块
  /**
  * > 更新头像
  * @data: 必要的校验数据
  */
   public async updateUserAvatar(data: any) {
    return await updateUserInfo_I.updateUserAvatar(this.ctx, data);
  }
  /**
  * > 更新昵称
  * @data: 必要的校验数据
  */
   public async updateUserNickName(data: any) {
    return await updateUserInfo_I.updateUserNickName(this.ctx, data);
  }
  /**
  * > 更新密码
  * @data: 必要的校验数据
  */
   public async updateUserPassword(data: any) {
    return await updateUserInfo_I.updateUserPassword(this.ctx, data);
  }
  /**
  * > 更新手机
  * @data: 必要的校验数据
  */
   public async changeUserPhone(data: any) {
    return await updateUserInfo_I.changeUserPhone(this.ctx, data);
  }
  /**
  * > 更新邮箱
  * @data: 必要的校验数据
  */
   public async changeUserEmail(data: any) {
    return await updateUserInfo_I.changeUserEmail(this.ctx, data);
  }

  // # 4. 重置密码模块
  /**
   * > 验证手机账号验证码, 返回密钥
   * @data: 必要的校验数据
   */
  public async resetVerifyByPhone(data: any) {
    return resetPassword_I.resetVerifyByPhone(this.ctx, data);
  }
  /**
   * > 验证邮箱账号验证码, 返回密钥
   * @data: 必要的校验数据
   */
  public async resetVerifyByEmail(data: any) {
    return resetPassword_I.resetVerifyByEmail(this.ctx, data);
  }
  /**
  * > 检验密钥并重置密码
  * @data: 必要的校验数据
  */
  public async resetPassWord(data: any) {
    return resetPassword_I.resetPassWord(this.ctx, data);
  }
// # 5. 新增手机和邮箱绑定模块
  /**
  * > 检验密钥并重置密码
  * @data: 必要的校验数据
  */
  public async addUserInfoToPhone(data: any) {
    return addInfo_I.addUserInfoToPhone(this.ctx, data);
  }
  public async addUserInfoToEmail(data: any) {
    return addInfo_I.addUserInfoToEmail(this.ctx, data);
  }
}