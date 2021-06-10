## 使用脚手架模式

安装 `npm install -g express-generator`



## 使用 express 项目

1. 使用脚手架指令创建项目

```shell
# 指令 项目名
express demo
```

2. 进入项目目录

```shell
cd demo
```



3. 初始化项目

```shell
npm install
```



4. 启动项目

```shell
npm start
# 可以使用自动重启项目插件和环境变量插件
```





## 示例代码

app.js

```js
// 导入了一些第三方的模块
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 导入了处理路由的模块
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// 创建了服务端实例对象
var app = express();

// 处理动态网页
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// 处理post请求参数
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 解析cookie
app.use(cookieParser());

// 处理静态网页
app.use(express.static(path.join(__dirname, 'public')));

// 注册处理路由模块
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 处理错误
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

```

