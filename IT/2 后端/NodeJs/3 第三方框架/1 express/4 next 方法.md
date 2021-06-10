

## next 简介

```js
// 1.导入express
const express = require('express');
const path = require('path');
const userRouter = require('./router/user');
const cookieParser = require('cookie-parser')

// 2.调用express方法, 创建服务端实例对象
const app = express();

// express-next方法
/*
1.use既可以处理没有路由地址的请求, 也可以处理有路由地址请求
2.use既可以处理get请求, 也可以处理post请求
3.在处理请求的时候是从上至下的判断的, 哪一个先满足就哪一个来处理
4.如果在处理请求的回调函数中没有调用next方法, 那么处理完之后就不会继续往下判断了
5.如果在处理请求的回调函数中调用了next方法,那么处理完之后还会继续往下判断
* */
app.use((req, res, next)=>{
    console.log('use1 没有路由地址');
    next();
});
app.use('/',(req, res, next)=>{
    console.log('use2 有路由地址');
    next();
});
app.get('/api',(req, res, next)=>{
    console.log('get1 /api');
    next();
});
app.get('/api/user',(req, res, next)=>{
    console.log('get2 /api/user');
    next();
});
app.post('/api',(req, res, next)=>{
    console.log('post1 /api');
    next();
});
app.post('/api/user',(req, res, next)=>{
    console.log('post2 /api/user');
    next();
});

// 3.告诉服务端需要监听哪一个端口
app.listen(3000, ()=>{
    console.log('listen ok');
});
```

##  next 正确用法

- 默认情况下会从上至下的匹配路由处理方法, 一旦匹配到了就会执行,执行完毕之后如果没有调用next就停止,执行完毕之后如果调用了next就继续向下匹配

```js
/* 通过next方法, 我们可以将同一个请求的多个业务逻辑拆分到不同的方法中处理
这样可以提升代码的可读性和可维护性, 以及保证代码的单一性
* */
app.get('/api/user/info',
    (req, res, next)=>{
        console.log('验证用户是否登陆');
        next();
    },
    (req, res, next)=>{
        console.log('用户已经登陆, 可以查看用户信息');
    });
```

