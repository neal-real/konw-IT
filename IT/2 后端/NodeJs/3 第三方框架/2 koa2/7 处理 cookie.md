## 错误记录

服务器 设置 cookie 可以通过设置实现跨端口 设置 cookie, 无法实现跨根域实现设置 cookie . 根域就是 ip 地址不同. 

1. 127.0.0.1 和 localhost 等于两个不同的 ip 地址

## Koa如何处理cookie?

- Koa中处理cookie不需要引入其他模块, 只要拿到ctx对象就可以操作cookie

- https://demopark.github.io/koa-docs-Zh-CN/
- https://demopark.github.io/koa-docs-Zh-CN/api/context.html

### 和设置 cookie

- 设置 `ctx.cookies.set(name,value,[opions])`

  - 示例: 

    ```js
    // 注意点: 在koa中不能给cookie设置中文的值
    ctx.cookies.set('name', 'lnj', {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    ```

    

- 获取 `ctx.cookies.get(name, [opions]);`

```js
// 1.导入Koa
const Koa = require('koa');
const Router = require('koa-router'); // 导入处理路由的模块
const router = new Router(); // 创建路由对象
const bodyParser = require('koa-bodyparser'); // 导入处理post请求参数的模块

// 2.创建服务端实例对象
const app = new Koa();

app.use(bodyParser()); // 注册处理post请求参数的中间件

// 处理路由
router.get('/setCookie', (ctx, next)=>{
  // 设置中文的情况下要转 base64 格式, 不设置中文可以直接设置 value
  let value = new Buffer('李南江').toString('base64');
  ctx.cookies.set('userName', value, {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  });
});
// 设置
router.get('/getCookie', (ctx, next)=>{
	// 获取 cookie 指定 key 的值
  let value = ctx.cookies.get('userName'); 
  // 转换成中文
  let res = new Buffer(value, 'base64').toString();
  console.log(res);
});
app
  .use(router.routes()) // 启动路由功能
  .use(router.allowedMethods()); // 自动设置响应头

// 3.指定监听的端口
app.listen(3000);
```



## cookie 的额外配置

- https://koa.bootcss.com/#context

- maxAge: 一个数字, 表示从 `Date.now()`: 得到的毫秒数.

- `expires`: 一个 `Date` 对象, 表示 cookie 的到期日期 (默认情况下在会话结束时过期).
- `path`: 一个字符串, 表示 cookie 的路径 (默认是`/`).
- `domain`: 一个字符串, 指示 cookie 的域 (无默认值).
- `secure`: 一个布尔值, 表示 cookie 是否仅通过 HTTPS 发送 (HTTP 下默认为 `false`, HTTPS 下默认为 `true`). [阅读有关此参数的更多信息](https://github.com/pillarjs/cookies#secure-cookies).
- `httpOnly`: 一个布尔值, 表示 cookie 是否仅通过 HTTP(S) 发送，, 且不提供给客户端 JavaScript (默认为 `true`).
- `sameSite`: 一个布尔值或字符串, 表示该 cookie 是否为 "相同站点" cookie (默认为 `false`). 可以设置为 `'strict'`, `'lax'`, `'none'`, 或 `true` (映射为 `'strict'`).
- `signed`: 一个布尔值, 表示是否要对 cookie 进行签名 (默认为 `false`). 如果为 `true`, 则还会发送另一个后缀为 `.sig` 的同名 cookie, 使用一个 27-byte url-safe base64 SHA1 值来表示针对第一个 [Keygrip](https://www.npmjs.com/package/keygrip) 键的 *cookie-name*=*cookie-value* 的哈希值. 此签名密钥用于检测下次接收 cookie 时的篡改.
- `overwrite`: 一个布尔值, 表示是否覆盖以前设置的同名的 cookie (默认是 `false`). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie（无论路径或域）是否在设置此Cookie 时从 Set-Cookie 消息头中过滤掉.

