/*
 ^ 提供手机注册格式验证规范
*/

module.exports = {
    phone: {
        type: 'string',
        trim: true,
        format: /^1[3456789]\d{9}$/,
        message: '手机不符合要求'
    },
    captchaType: {
        type: 'string',
        trim: true,
        format: /^signUp$/,
        message: '验证类型不符合要求'
    },
    password: {
        type: 'string',
        trim: true,
        // 必须是数字字母符号组合
        format: /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,}$/,
        message: '密码必须是大于8位且是数字,字母,符号组合'
    },
    captcha: {
        type: 'string',
        trim: true,
        // 必须是数字字母符号组合
        format: /^[A-Za-z0-9]{4}$/,
        message: '验证码不符合要求'
    },
    nickname: {
        type: 'string',
        trim: true,
        format: /^.{2,12}$/,
        message: '用户名长度在2-12个之间'
    },
    userAgreement: {
        type: 'boolean',
        trim: true,
        format: /^true$/,
        message: '用户协议和隐私协议必须同意'
    }
}
