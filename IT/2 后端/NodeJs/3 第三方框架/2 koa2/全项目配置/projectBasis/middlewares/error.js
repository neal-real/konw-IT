/**
 * ^ $全局错误监听
*/
const {Error_Custom} = require('../core/error-const')

const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        // 开发环境
        const isErrorCustom = error instanceof Error_Custom
        const isDev = global.config.runtime === 'dev'
        if (isDev && !isErrorCustom) {
            throw error
        }
        // 生成环境
        if (isErrorCustom) {
            ctx.body = {
                msg: error.msg,
                error_code: error.errorCode,
                request: `${ctx.method}-${ctx.path}`
            }
            ctx.status = error.code
        } else {
            ctx.body = {
                msg: "未知错误！",
                error_code: 9999,
                request: `${ctx.method}-${ctx.path}`
            }
            ctx.status = 500
        }
    }
}

module.exports = catchError
