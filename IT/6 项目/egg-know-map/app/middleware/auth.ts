/*
 ? 中间件说明
 > options: 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
 > app: 当前应用 Application 的实例。
*/
module.exports = (options, app) => {
  return async function (ctx, next) {
    // 1.获取需要权限控制的路由地址
    const routes = options.routes;
    // 2.判断当前请求的路由地址是否需要权限控制
    if (ctx.url.match(routes)) {
      // 需要权限控制
      // 3.获取客户端传递过来的JWT令牌
      const token = ctx.cookies.get('token', {
        signed: false,
      });
      // 4.判断客户端有没有传递JWT令牌
      if (token) {
        try {
          // 参数1 token , 参数2 解密 key
          const result = await ctx.service.as.index.verify_token(token, app.config.keys);
          if (ctx.request.body.user_id) {
            if (result._id !== ctx.request.body.user_id) {
              return ctx.body = ctx.msg(403, 'id失效,请重新登录');
            }
          } else {
            return ctx.body = ctx.msg(403, '登录失效,请重新登录');
          }
          console.log('校验通过');
          await next();
        } catch (e) {
          ctx.body = ctx.msg(400, '没有权限,请重新登录');
        }
      } else {
        ctx.body = ctx.msg(403, '没有T权限,请重新登录');
      }
    } else {
      // 不需要权限控制
      await next();
    }
  }
};
