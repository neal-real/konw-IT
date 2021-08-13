/**
 * ^ $全局错误常量
 * # 1.说明
*/
class Error_Custom extends Error {
  constructor(msg = '服务器异常', errorCode = 10000, code = 400) {
      super()
      this.errorCode = errorCode
      this.code = code
      this.msg = msg
  }
}

class Error_Parameter extends Error_Custom {
  constructor(msg, errorCode) {
      super()
      this.code = 400
      this.msg = msg || '参数错误'
      this.errorCode = errorCode || 10000
  }
}

class Error_NotFound extends Error_Custom {
  constructor(msg, errorCode) {
      super()
      this.code = 404
      this.msg = msg || '资源未找到'
      this.errorCode = errorCode || 10000
  }
}

class Error_AuthFailed extends Error_Custom {
  constructor(msg, errorCode) {
      super()
      this.code = 401
      this.msg = msg || '授权失败'
      this.errorCode = errorCode || 10004
  }
}

class Error_Forbidden extends Error_Custom {
  constructor(msg, errorCode) {
      super()
      this.code = 403
      this.msg = msg || '禁止访问'
      this.errorCode = errorCode || 10006
  }
}




module.exports = {
  Error_Custom,
  Error_Parameter,
  Error_NotFound,
  Error_AuthFailed,
  Error_Forbidden
}
