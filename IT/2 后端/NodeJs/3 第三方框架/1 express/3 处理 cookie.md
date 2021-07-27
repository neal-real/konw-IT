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

## 错误记录

服务器 设置 cookie 可以通过设置实现跨端口 设置 cookie, 无法实现跨根域实现设置 cookie . 根域就是 ip 地址不同. 

1. 127.0.0.1 和 localhost 等于两个不同的 ip 地址
