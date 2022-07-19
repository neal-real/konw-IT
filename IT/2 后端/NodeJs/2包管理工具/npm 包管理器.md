## NPM包安装方式

> 安装 nodeJS 自带 NPM 包管理工具

## 基础操作与安装

| 命令                        | 作用                                                   |
| --------------------------- | ------------------------------------------------------ |
| 全局安装                    | 存储在全局node_modules中                               |
| npm install -g 包名         | 全局安装最新版本                                       |
| npm uninstall -g 包名       | 卸载全局中的指定模块                                   |
| npm update -g 包名          | 更新全局模块 (更新失败可以直接使用instal)              |
|                             |                                                        |
| 本地安装                    | 安装当前项目使用的包, 存储在当前项目node_modules中     |
| npm install 包名            | 安装模块                                               |
| npm uninstall 包名          | 卸载模块                                               |
| npm update 包名             | 更新模块                                               |
|                             |                                                        |
| 初始化本地包                |                                                        |
| npm init                    | 初始化package.json文件                                 |
| npm init -y                 | 初始化package.json文件,并提前确认 yes                  |
| npm install 包名 --save     | 生产环境包的依赖-                                      |
| package.json 文件中         | dependencies 是一个关联数组，由包的名称和版本号组成    |
| npm install 包名 --save-dev | devDependencies 开发环境包的依赖-                      |
| package.json 文件中         | devDependencies 是一个关联数组，由包的名称和版本号组成 |
|                             |                                                        |
| npm i                       | 所有的包都会被安装                                     |
| npm i --production          | 只会安装dependencies中的包                             |
| npm i --development         | 只会安装devDependencies中的包                          |
|                             |                                                        |
| npm                         | 查看帮助引导                                           |
|                             |                                                        |
| npm config list             | 查看下载渠道                                           |
|                             |                                                        |
|                             |                                                        |
|                             |                                                        |



## 描述文件

`package.json`, 定义了当前项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）。

npm install 命令根据这个配置文件，自动下载所需的模块，也就是配置项目所需的运行和开发环境

 注意点:`package.json`文件中, **不能加入任何注释**    

​     



## 使用npm初始化项目

npm init 

![](.\img\Snipaste_2018-09-26_14-38-00.png)

## package.json 配置文件

- 设置 "scripts" 可以给 npm 设置的一些快捷指令, 通过 npm run dev(指令名)来执行后面的指令.可以大大简化输入的繁琐.
- node app.js 参数1,参数  后面是可以加参数 ,然后在 js 文件中通过 process.argv 获取到
- scripts 中 key 是 test 和 start 可以在运行是不加 run ; 直接 npm test 或 npm start



```js
"name": "usenpm", // 项目名
"version": "1.0.0", // 版本号
"description": "这是我们第一次使用npm",  // 描述信息
"main": "index.js", // 指定入口文件,没有指定默认找 package.json 同级的 index.js 文件,没有就报错. 指定的情况,会根据路径找入口文件
"scripts": { // npm 设置的一些快捷指令, 就通过 npm run dev(指令名)来执行后面的指令.可以大大简化输入的繁琐
    "dev": "node app.js"
},
"bin":{ // 指定全局指令 nj 执行哪个文件.以后只要是全局安装就可以通过这里指令运行 npm 全局安装的包
  "neal": "index.js"
}
"keywords": [ // 关键字
    "第一次"
],
"author": "itheima6期", // 作者
"license": "ISC" // 当前项目的协议
```



## 解决 npm 被墙问题

npm 存储包文件的服务器在国外，有时候会被墙，速度很慢，所以我们需要解决这个问题。

http://npm.taobao.org/  淘宝的开发团队把 npm 在国内做了一个备份。

安装淘宝的 cnpm：

```shell
# 在任意目录执行都可以
# --global 表示安装到全局，而非当前目录
# --global 不能省略，否则不管用
npm install --global cnpm
```

接下来你安装包的时候把之前的 `npm` 替换成 `cnpm`。

举个例子：

```shell
# 这里还是走国外的 npm 服务器，速度比较慢
npm install jquery

# 使用 cnpm 就会通过淘宝的服务器来下载 jquery
cnpm install jquery
```

如果不想安装 `cnpm` 又想使用淘宝的服务器来下载：

```shell
npm install jquery --registry=https://registry.npm.taobao.org
```

但是每一次手动这样加参数很麻烦，所我们可以把这个选项加入配置文件中：

```shell
# 配置到淘宝服务器
npm config set registry https://registry.npm.taobao.org

# 查看 npm 下载源
npm config get registry

npm config list
```

只要经过了上面命令的配置，则你以后所有的 `npm install` 都会默认通过淘宝的服务器来下载。



## package.json 与 package-lock.json 文件

package.json的作用就是用来记录当前项目及包的使用情况；`不能在package.json中添加注释`

package-lock.json  保存第三方包的版本和下载路径等详细信息；

当我们使用npm管理包时，package.json 及package-lock.json 的内容都会自动更新

### package.json 文件说明

```json
"name": "usenpm", 										// 项目名
"version": "1.0.0", 									// 版本号
"description": "这是我们第一次使用npm",  // 描述信息
"main": "index.js", 									// 指定入口文件
"scripts": { 													// npm 设置的一些指令
    "test": "echo \"Error: no test specified\" && exit 1"
},
"keywords": [ 												// 关键字
    "第一次"
],
"author": "itheima6期", 								// 作者
"license": "ISC" 											// 当前项目的协议
"dependencies": {											// 当前项目运行环境的依赖模块-install
    "jquery": "^3.4.1",
    "swiper": "^4.5.0"
  },
"devDependencies": {									// 当前项目开发环境依赖包-install --save-dev
    "fastclick": "^1.0.6"
  }
```



### package-lock.json 文件说明

```json
{
  "name": "12-npm",						// 项目名
  "version": "1.0.0",					// 版本号
  "lockfileVersion": 1,
  "requires": true,
  "dependencies": {
    "dom7": {
      "version": "2.1.3",
      "resolved": "https://registry.npm.taobao.org/dom7/download/dom7-2.1.3.tgz",
      "integrity": "sha1-pzb5w7+8TKA5qBzQlfl9HX894Zw=",
      "requires": {
        "ssr-window": "^1.0.1"
      }
    },
    "fastclick": {
      "version": "1.0.6",
      "resolved": "https://registry.npm.taobao.org/fastclick/download/fastclick-1.0.6.tgz",
      "integrity": "sha1-FhYlsnsaWAZAWTa9qaLBkm0Gvmo=",
      "dev": true
    },
    "jquery": {
      "version": "3.4.1",
      "resolved": "https://registry.npm.taobao.org/jquery/download/jquery-3.4.1.tgz",
      "integrity": "sha1-cU8fjZ3eS9+lV2S6N+8hRjDYDvI="
    },
    "ssr-window": {
      "version": "1.0.1",
      "resolved": "https://registry.npm.taobao.org/ssr-window/download/ssr-window-1.0.1.tgz",
      "integrity": "sha1-MHUqakZm53Z/C35qpvwv29DZs2k="
    },
    "swiper": {
      "version": "4.5.0",
      "resolved": "https://registry.npm.taobao.org/swiper/download/swiper-4.5.0.tgz",
      "integrity": "sha1-TYcL7E9avi+yWTJYSd0mQckkPA0=",
      "requires": {
        "dom7": "^2.1.3",
        "ssr-window": "^1.0.1"
      }
    }
  }
}

```

