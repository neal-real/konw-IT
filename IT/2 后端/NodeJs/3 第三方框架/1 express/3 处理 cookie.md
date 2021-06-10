## 处理cookie

- 其他 cookie 配置项 : https://www.expressjs.com.cn/4x/api.html#res.cookie

## 设置 cookie

```js
app.get('/setCookie', (req, res, next)=>{
	/*
	第一个参数: cookie 的 key
  第二个参数: cookie 的 vlue
  第三个参数: cookie 的 配置
  */ 
  res.cookie(
    'username',
    'lnj',
    {httpOnly: true, path: '/', maxAge: 10000}
  );
  res.end();
});

```



## 获取 Cookie

- 使用第三方 插件 cookieParse
  - 安装:  `npm install cookie-parser`

```js
// 导入
const cookieParser = require('cookie-parser')
// 注册
app.use(cookieParser());
// 获取 Cookie
app.get('/getCookie', (req, res, next)=>{
  console.log(req.cookies);
});
```

