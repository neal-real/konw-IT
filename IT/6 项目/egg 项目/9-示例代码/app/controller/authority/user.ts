/*
 ? 控制器文件 user 路由的事件处理
 # 1.接收用户相关的路由
*/

import { Controller } from 'egg';
// 注册类型
const enum TypeEnum {
  Phone = 'phone',
  Email = 'email'
}
// 登录类型
const enum LogInTypeEnum {
  password = 'normal',
  captcha = 'captcha'
}
// 重置阶段
const enum resetTypeEnum {
  verify = 'verify',
  reset = 'reset'
}
// 用户信息更新
const enum UpdateTypeEnum {
  avatar = 'avatar',
  nickname = 'nickname',
  password = 'checkPass'
}
// 用户新增绑定
const enum addTypeEnum {
  Email = 'addEmail',
  Phone = 'addPhone'
}

export default class UserController extends Controller {
  // > 用户注册
  public async signUp() {
    const { ctx } = this;
    const as = this.ctx.service.as.index;
    try {
      // 根据注册类型,分支
      let result
      if (ctx.request.body.type === TypeEnum.Phone) {
        result = await as.signUpByPhone(ctx.request.body)
      }
      else if (ctx.request.body.type === TypeEnum.Email) {
        result = await as.signUpByEmail(ctx.request.body)
      }
      else {
        return ctx.body = ctx.msg(400, '注册类型不正确')
      }
      ctx.body = ctx.msg(200, "注册成功", result)
    } catch (error) {
      ctx.body = ctx.msg(400, error)
    }
  }
  // > 用户登录
  public async signIn() {
    const { ctx } = this;
    const as = ctx.service.as.index
    try {
      let result
      // 通过账号密码登录
      if (ctx.request.body.type === LogInTypeEnum.password) {
        result = await as.signInByPassWord(ctx.request.body)
      }
      // 通过验证码登录
      else if (ctx.request.body.type === LogInTypeEnum.captcha) {
        result = await as.signInByCaptcha(ctx.request.body)
      }
      else {
        return ctx.body = ctx.msg(400, '登录类型不正确')
      }
      // 3.生成JWT令牌
      // 第一个参数: 需要保存的数据
      // 第二个参数: 签名使用的密钥
      // 注意点: 如果httpOnly: true, 那么前端是无法获取这个cookie
      const token = as.get_token(result.toJSON(), this.config.keys)
      ctx.cookies.set('token', token, {
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        signed: false,
      });
      ctx.body = ctx.msg(200, "登录成功", result)
    } catch (error) {
      ctx.body = ctx.msg(400, error)
    }
  }
  // > 用户重置密码
  public async resetPassword() {
    const { ctx } = this;
    const as = this.ctx.service.as.index;
    try {
      let result
      // 根据阶段,分支
      if (ctx.request.body.type === resetTypeEnum.verify) {
        if (ctx.request.body.accountType === TypeEnum.Phone) {
          result = await as.resetVerifyByPhone(ctx.request.body)
        } else if (ctx.request.body.accountType === TypeEnum.Email) {
          result = await as.resetVerifyByEmail(ctx.request.body)
        } else {
          return ctx.body = ctx.msg(400, '账号类型不正确')
        }
      } else if (ctx.request.body.type === resetTypeEnum.reset) {
        result = await as.resetPassWord(ctx.request.body)
      } else {
        return ctx.body = ctx.msg(400, '重置阶段不正确')
      }
      ctx.body = ctx.msg(200, "重置验证通过", result)
    } catch (error) {
      ctx.body = ctx.msg(400, error)
    }
  }
  // > 用户信息更新
  public async updateUserInfo() {
    const { ctx } = this;
    const data = this.ctx.request.body
    const as = this.ctx.service.as.index;
    try {
      let result
      if (UpdateTypeEnum.avatar === data.type) {
        result = await as.updateUserAvatar(data)
      } else if (UpdateTypeEnum.nickname === data.type) {
        result = await as.updateUserNickName(data)
      } else if (UpdateTypeEnum.password === data.type) {
        result = await as.updateUserPassword(data)
      } else {
        throw new Error("更新信息类型错误");
      }
      ctx.body = ctx.msg(200, '更新成功', result)
    } catch (error) {
      if (error.message) { error = error.message }
      ctx.body = ctx.msg(400, error)
    }
  }
  // > 变更手机或邮箱
  public async changePhoneAndEmail() {
    const { ctx } = this;
    const data = this.ctx.request.body
    const as = this.ctx.service.as.index;
    try {
      let result
      if (TypeEnum.Phone === data.changeType) {
        result = await as.changeUserPhone(data)
      } else if (TypeEnum.Email === data.changeType) {
        result = await as.changeUserEmail(data)
      } else {
        throw new Error("更新信息类型错误");
      }
      if (result) {
        ctx.body = ctx.msg(200, '变更成功', result)
      } else {
        ctx.body = ctx.msg(400, '变更失败', result)
      }
    } catch (error) {
      if (error.message) { error = error.message }
      ctx.body = ctx.msg(400, error)
    }
  }
  // > 变更手机或邮箱
  public async addinfo() {
    const { ctx } = this;
    const data = this.ctx.request.body
    const as = this.ctx.service.as.index;
    try {
      let result
      if (addTypeEnum.Phone === data.type) {
        result = await as.addUserInfoToPhone(data)
      } else if (addTypeEnum.Email === data.type) {
        result = await as.addUserInfoToEmail(data)
      } else {
        throw new Error("新增类型错误");
      }
      if (result) {
        ctx.body = ctx.msg(200, '绑定成功', result)
      } else {
        ctx.body = ctx.msg(400, '绑定失败', result)
      }
    } catch (error) {
      if (error.message) { error = error.message }
      ctx.body = ctx.msg(400, error)
    }
  }

}

