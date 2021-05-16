##  node是什么?

> node是JavaScript的运行环境, 是基于V8引擎构建的.
>
> 用来完成服务器相关的工作



### JS浏览器操作类

1. 浏览器类: 弹窗,跳转,历史
2. DOM类 : 标签 创建,获取,设置等
3. 网络操作类 : Ajax websocket等
4. 移动设备操作类  震动,视频,蓝牙等



### nodejs 操作三大模块

1. 核心模块: 安装就有,直接使用 **30-40个** 文档: 在官方文档中http://nodejs.cn/api/
2. 第三方模块: 下载,安装 使用  **有80万**  文档:谁写的谁提供文档
3. 自定义模块:  自己写的自己用



## Node环境和浏览器环境区别

1. 内置对象不同

- 浏览器环境中提供了`window`全局对象

- NodeJS环境中的全局对象不叫`window`, 叫`global`

2. `this`默认指向不同

- 浏览器环境中全局this默认指向window

- `NodeJS`环境中全局this默认指向空对象{}

3. API不同

- 浏览器环境中提供了操作节点的DOM相关API和操作浏览器的BOM相关API

- NodeJS环境中没有HTML节点也没有浏览器, 所以NodeJS环境中没有DOM/BOM



## Node.js模块

### 1.引入机制-有路径时

1. require方法根据模块路径查找模块，如果是完整路径，直接引入模块。
2. 如果模块后缀省略，先找扩展名是.js 的文件,
3. 不到.js 文件,会一次找同名的 .json  .node 文件
4. 找不到.js 文件, 在同级目录找同名的文件夹
5. 如果找到了同名文件夹，找文件夹中的index.js
6. 如果文件夹中没有index.js就会去当前文件夹中的package.json文件中查找main选项中的入口文件
7. 如果找指定的入口文件不存在或者没有指定入口文件就会报错，模块没有被找到



### 引入机制-没有路径时

1. Node.js会假设它是系统模块
2. Node.js会去node_modules文件夹中
   1. 首先看是否有该名字的JS文件
   2. 再看是否有该名字的文件夹
   3. 如果是文件夹看里面是否有index.js
   4. 如果没有index.js查看该文件夹中的package.json中的main选项确定模块入口文件
3. 都找不到,报错

###  2.模块信息的保存

~~~js
#package.json文件
// 项目描述文件，记录了当前项目信息，例如项目名称、版本、作者、github地址、当前项目依赖了哪些第三方模块等。
使用npm init -y命令生成;
#项目依赖
;/项目模块极其依赖信息-》添加到 package.json 文件的 dependencies 字段中
命令：npm install name;
#开发依赖：开发阶段需要的第三方模块和其依赖的模块;
;/记录开发依赖信息-》将模块信息添加到package.json文件的devDependencies字段中
命令：npm install 包名 --save-dev;
#package-lock.json文件
1.锁定包的版本，确保再次下载时不会因为包版本不同而产生问题
2.加快下载速度，该文件中记录了项目所依赖第三方包的树状结构和对应的下载地址，重装时按其下载即可
# node_modules文件夹的问题

~~~



### 3.概念解释

> 静态资源和动态资源

~~~js
#静态资源
无论是谁都返回同样的资源
#动态资源
无论因为访问人不同显示不同的资源
~~~



### 异步串行

> 异步串行的方式有哪些

1. callback
2. promise
3. Gennerator
4. async/await
5. eventEmmiter
6. promisify



## 什么是包?

编写代码的时候尽量遵守单一原则, 也就是一个函数尽量只做一件事情

例如: 读取数据函数/写入数据函数/生成随机数函数等等,

不要一个函数既读取数据又写入数据又生成随机数,

这样代码非常容易出错, 也非常难以维护



在模块化开发中也一样, 在一个模块(一个文件中)尽量只完成一个特定的功能

但是有些比较复杂的功能可能需要由多个模块组成,

例如: jQuery选择器相关的代码在A模块, CSS相关的代码在B模块, ...

​      我们需要把这些模块组合在一起才是完成的jQuery

那么这个时候我们就需要一个东西来维护多个模块之间的关系

这个维护多个模块之间关系的东西就是"包"

简而言之: 一个模块是一个单独的文件, 一个包中可以有一个或多个模块



## NodeJS包的管理

在NodeJS中为了方便开发人员发布、安装和管理包, NodeJS推出了一个包管理工具

NPM(Node Package Manager)

NPM不需要我们单独安装, 只要搭建好NodeJS环境就已经自动安装好了

NPM就相当于电脑上的"QQ管家软件助手", 通过NPM我们可以快速找到我们需要的包,

可以快速安装我们需要的包, 可以快速删除我们不想要的包等等







### 一些资源

1. 文档

   [Node.js 官方文档](https://nodejs.org/en/docs/)            [Node.js 中文文档（非官方）](http://nodejs.cn/)

2. github资源

   [Node.js 包教不包会](https://github.com/alsotang/node-lessons)           [ECMAScript 6 入门](http://es6.ruanyifeng.com/)                    [七天学会 NodeJS](https://github.com/nqdeng/7-days-nodejs) 

3. 社区

   **[Node.js 中文社区](https://cnodejs.org/)** 



> 本文档大量参考相关书籍、文档、博客、手册等资源，最终解释权归 吴明仕 所有；
>
> 
>
> 参考资源相关列表:
>
> [https://nodejs.org/zh-cn/](https://nodejs.org/zh-cn/)   node.js官网 
>
> [http://nodejs.cn/](http://nodejs.cn/)  node.js中文网 
>
> https://en.wikipedia.org/wiki/CommonJS  维基百科 
>
> [《ECMAScript 6 入门》(第三版)](http://es6.ruanyifeng.com/)  阮一峰著 ，电子工业出版社
>
> http://www.expressjs.com.cn/   express中文网
>
> 


