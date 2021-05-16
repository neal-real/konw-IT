## 什么是webpack-dev-server?

- webpack-dev-server和watch一样可以监听文件变化
- webpack-dev-server可以将我们打包好的程序运行在一个服务器环境下
- webpack-dev-server可以解决企业开发中"开发阶段"的跨域问题



## webpack-dev-server使用

### 1. 安装webpack-dev-server

- https://www.npmjs.com/package/webpack-dev-server
- npm install webpack-dev-server --save-dev

### 2. 配置webpack-dev-server

```js
module.exports = {
  devServer: {
    // 指定运行在服务器环境下的目录
    contentBase: "./bundle",
    // 编译完成后,是否需要自动在浏览器中打开
    open: true,
    // 指定端口 , 默认端口号:8080 
    port: 9090
  }
}
```

### 3. 修改打包指令

在 package.json 文件下修改指令

```json
"scripts": {
  // 使用 npm run start
  "start": "npx webpack-dev-server --config webpack.config.js"
}
```



## 跨域

- 同源策略（Same origin policy）是一种约定，它是浏览器最核心也最基本的安全功能
- 所谓同源是指: 协议，域名，端口都相同,就是同源, 否则就是跨域

## 使用 dev-server 解决跨域问题

- `"/user"` 所有user开头的请求都会被代理到target
  - 例如: 我们发送请求地址: http://127.0.0.1:9090/user
  - 实际发送请求地址: http://127.0.0.1:3000/user
- `changeOrigin: true,`    开启域名跨域(即 target 中是域名不是 ip 地址)
- `secure: false,`          开启 https 协议跨域(请求地址是 https,需要添加此句)
- `pathRewrite:{"": "/api"}`   路径重写, 将路径中的api替换为空
  - 意思是在所有的请求路径中添加一个路径
  - 例如:  http://127.0.0.1:9090/user 
  - 变为  http://127.0.0.1:9090/api/user
- pathRewrite:{"^/api": ""}  猜测是将 api 开头的路径替换未后面的路径

```js
module.exports = {
  devServer: {
    // 指定运行在服务器环境下的目录
    contentBase: "./bundle",
    // 编译完成后,是否需要自动在浏览器中打开
    open: true,
    // 指定端口 , 默认端口号:8080 
    port: 9090,
    proxy: {
      //批量配置,路径
      context: ["/user", "login"]
      target: "http://127.0.0.1:3000", // 代理地址
      changeOrigin: true,     // 域名跨域(即 target 中是域名不是 ip 地址)
      secure: false,          // https跨域(请求地址是 https,需要添加此句)
      pathRewrite:{"^/api": ""} // 路径重写, 将路径中的api替换为空
    }
  }
}
```



```js
// 所有API开头的请求都会被代理到target
// 例如: 我们发送请求地址: http://127.0.0.1:9090/api
//       实际发送请求地址: http://127.0.0.1:3000/api
"/user": {
  target: "http://127.0.0.1:3000",
  changeOrigin: true,
  secure: false,
},
"/log": {
  target: "http://127.0.0.1:3000",
  changeOrigin: true,
  secure: false,
},
```





## dev-server 的工作原理

- webpack-dev-server自动打包并没有真正的放到指定的目录中,因为读写磁盘是非常耗时和消耗性能的,所以为了提升性能webpack-dev-server将转换好的内容直接放到了**内存中**

- 每次打包之后都会自动刷新网页,导致页面全部修改内容丢失. 开发中使用热更新可以仅更新修改的内容





































