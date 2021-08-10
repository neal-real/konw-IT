module.exports = {
  // 返回成功码
  msg(status = 800, msg: any, data = null) {
    if (Array.isArray(msg)) { msg = msg[0] }
    if (msg instanceof Object) { console.log(msg); }
    return {
      code: status,
      msg: msg,
      data: data
    }
  }
};
