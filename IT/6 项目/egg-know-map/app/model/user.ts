module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const userSchema = new Schema({
    // 用户名
    nickname: {
      type: String,
      required: true,
      trim: true,
      maxLength: 12,
      minLength: 2
    },
    // 手机号
    phone: {
      type: String,
      trim: true,
      match: /^1[3456789]\d{9}$/
    },
    // 邮箱
    email: {
      type: String,
      trim: true,
    },
    //用户密码
    password: {
      type: String,
      required: true,
      trim: true
    },
    // 头像 
    avatar: {
      type: String,
      default: 'https://know-map-1252008071.cos.ap-shanghai.myqcloud.com/public/avatar/knowmap-512.png'
    },
    // 创建日期
    created_at: {
      type: Date,
    },
    // 修改日期
    updated_at: {
      type: Array,
      properties: [
        {
          updated_at: { type: Date },
          remark: { type: String }
        }
      ]
    }
  });

  return mongoose.model('user', userSchema, 'user');
}
