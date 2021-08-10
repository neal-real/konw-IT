/**
 * ^ 本文件是针对Mongoose 框架的数据库操作功能的实现
 * # 1.判断是否有此用户
 * # 2.比较新旧密码是否一致
 * # 3.查询用户信息
 * # 4.通过手机号注册用户
 * # 5.通过邮箱注册用户
 * # 6.通过邮箱注册用户
 * # 7.通过邮箱或手机号,强制更新密码
 * # 8.更新用户信息
 */

module.exports = {
  /**
   * > 判断是否有此用户
   * @model: 数据库模型对象
   * @data:需要的数据 {查询字段:'查询字段的值'}
   * @返回: true 表示存在; false 表示不存在
   */
  isThisUserExist(model: any, data: object) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await model.User.findOne(data);
        if (result) return resolve(true)
        return resolve(false)
      } catch (error) {        
        return reject(error);
      }
    })
  },

  /**
   * > 比较新旧密码是否一致
   * @model: 数据库模型对象
   * @user_id: 用户id
   * @password: 用户密码(请提前加密哦)
   * @返回: true 表示一致; false 表示不同
   */
  async isThisTheSamePasswordAsTheDatabase(model: any, user_id, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await model.User.findOne({ _id: user_id });
        if (result.password === password) return resolve(true)
        return resolve(false)
      } catch (error) {
        reject(error);
      }
    })
  },
 
   /**
   * > 查询用户信息
   * @model: 数据库模型对象
   * @data: {查询字段:查询值,...}
   * @返回: 用户信息(取出密码和信息变更记录后的)
   */
  async findUserInfo(model: any, data: object) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await model.User.findOne(data);
        if (result) {
          result.password = null // 用户密码过滤
          result.updated_at = null
          return resolve(result)
        }
        return reject("账号或密码错误,请检查后重试");
      } catch (error) {
        reject(error);
      }
    })
  },

   /**
   * > 通过手机号注册用户
   * @model: 数据库模型对象
   * @data: {字段:值,...}
   * @返回: 用户信息(取出密码后的)
   */
  async createUserByPhone(model: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const realData = {
          nickname: data.nickname,
          phone: data.phone,
          password: data.password,
          created_at: new Date(),
          updated_at: { updated_at: new Date(), remark: '创建用户' }
        }
        const result = await model.User.create(realData);
        result.password = null // 删除有时失效,设置为 null 
        if (result) return resolve(result)
        return reject("注册失败");
      } catch (error) {
        reject(error);
      }
    })
  },

   /**
   * > 通过邮箱注册用户
   * @model: 数据库模型对象
   * @data: {字段:值,...}
   * @返回: 用户信息(取出密码后的)
   */
  async createUserByEmail(model: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const realData = {
          nickname: data.nickname,
          email: data.email,
          password: data.password,
          created_at: new Date(),
          updated_at: { updated_at: new Date(), remark: '创建用户' }
        }
        const result = await model.User.create(realData);
        result.password = null // 删除有时失效,设置为 null 
        if (result) return resolve(result)
        return reject("注册失败");
      } catch (error) {
        reject(error);
      }
    })
  },
     /**
   * > 通过邮箱或手机号,强制更新密码
   * @model: 数据库模型对象
   * @data: {account :{email:值,...}|{phone:值,...},password:密码}
   * @返回: 用户信息(取出密码后的)
   */
  async updatePassword(model: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await model.User.updateOne(data.account, { password: data.password })
        if (result.nModified == 1) return resolve('更新成功')
        return resolve('更新失败,数据没有发生改变');
      } catch (error) {
        reject(error);
      }
    })
  },
  // > 更新用户信息
  async updateUserInfo(model: any, id, update) {
    return new Promise(async (resolve, reject) => {
      try {
        // 1. 更新备注字段
        await model.User.updateOne(id, { $push: { updated_at: { updated_at: new Date(), remark: update } } })
        // 2. 完成主要更新任务
        const result = await model.User.updateOne(id, update)
        if (result.nModified == 1) return resolve('更新成功')
        return resolve('更新失败,数据没有发生改变');
      } catch (error) {
        reject(error);
      }
    })
  }
}
