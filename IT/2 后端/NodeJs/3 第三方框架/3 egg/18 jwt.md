## 保存用户登录状态

1. 服务端生成 jwt 令牌, 发送给客户端
2. 客户端讲令牌保存到 cookie 或者 sessionStorage 或 localStorage 中
   1. cookie: 存储的内容体积不大
   2. sessionStorage: 不需要持久化保存
   3. localStorage: 体积大,又需要持久化保存
3. 客户端每次发送请求一并发送到服务端
4. 服务端通过密钥验证令牌

## 使用

1. 安装

```shell
npm isntall jsonwebtoken
```

2. 在登录成功处 设置密钥

```js
public async login() {
  const { ctx } = this;
  try {
    const result = await ctx.service.user.login(ctx.request.body);
    // 3.生成JWT令牌
    // 第一个参数: 需要保存的数据
    // 第二个参数: 签名使用的密钥
    // 第三个参数: 额外配置
    const token = jwt.sign(result, this.config.keys, { expiresIn: '7 days' });
    result.token = token;
    ctx.body = ctx.msg(200, "登录成功", result)
  } catch (error) {
    if (error.message.search('Validation Failed') != -1) {
      this.ctx.body = ctx.msg(406, '数据校验未通过');
    } else {
      this.ctx.body = ctx.msg(400, error.message);
    }
  }
}
```

3. 在前端获取登录成后, 保存 值  sessionStorage

```js
sessionStorage.setItem('token', data.token)
```

4. 前端在请求头中,添加 token 一起请求

```js
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 添加 token
  config.headers.Authorization = sessionStorage.getItem('token');
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
```



5. 在前端添加路由守卫

   ```js
   // 添加路由守卫, 实现权限控制
   router.beforeEach((to, from, next) => {
     // 1.如果访问的是注册或者登录, 那么就放行
     if(to.path === '/login' || to.path === '/register'){
       return next();
     }
     // 2.获取当前的登录状态
     // const token = sessionStorage.getItem('token');
     const token = Cookies.get('token');
     console.log(token, '!!!!!!!!!!!!!!');
     // 3.如果访问的是其它路由地址, 那么就需要判断是否已经登录
     //   如果已经登录, 那么就放行, 如果没有登录, 那么就强制跳转到登录界面
     if(!token){
       return next('/login');
     }
     next();
   });
   ```

   

## 后端

- 使用中间件

1. 配置

`config/config.default.ts`

```js
// 在此添加您的 egg 中间件配置
config.middleware = ['auth'];
// 添加中间件的配置
config.auth = {
  authUrls: [
    '/user'
  ]
}
```

2. 书写中间件

```js
const jwt = require('jsonwebtoken');
/*
 ? 中间件说明
 > options: 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
 > app: 当前应用 Application 的实例。
*/
module.exports = (options, app) => {
  return async function (ctx, next) {
    // 1.获取需要权限控制的路由地址
    const authUrls = options.authUrls;
    // 2.判断当前请求的路由地址是否需要权限控制
    if (authUrls.includes(ctx.url)) {
      // 需要权限控制
      // 3.获取客户端传递过来的JWT令牌
      const token = ctx.get('authorization');
      // 4.判断客户端有没有传递JWT令牌
      if (token) {
        try {
          await jwt.verify(token, app.config.keys);
          await next();
        } catch (e) {
          ctx.error(400, '没有权限');
        }
      } else {
        ctx.error(400, '没有权限');
      }
    } else {
      // 不需要权限控制
      next();
    }
  }
};

```

































































































