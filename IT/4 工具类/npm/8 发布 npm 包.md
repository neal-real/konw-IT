## 准备



~~~sh
# 查看本机使用的程序版本号
nvm --version

node --version

npm --version
#查看当前使用 node 版本
nvm list
~~~



## 初始化-发布

- https://registry.npm.taobao.org/ 用来在事后调整过来

~~~sh
# 创建文件夹
mkdir newDirName
# 进入文件夹
cd newDirName
# 初始化 npm 项目: 1.写项目名称、简介、GitHub 地址、开源协议等信息
npm init
# 创建入口文件 index.js
在入口方法导入关键方法或属性
module.exports = consoleFunc
# 查看发布地址是否正确
npm config list  #查看现在下载源是否是"https://registry.npmjs.org/"
# 不是的话，修改发布地址为官方 
npm set registry https://registry.npmjs.org/
# 添加 npm 账号信息： 没有的话去 npm 官方注册
npm adduser
用户名：
密码：
邮箱：邮箱必须经过验证，使用注册时的邮箱
# 查询是否登录成功
npm whoami  #返回用户名
# 发布 npm 包
npm publish  
# 在个人信息中的 packages 中可以查看当前包
~~~



## 使用

~~~shell
# 创建新的项目，初始化，然后安装自己的包
yarn 项目名称 # npm 和 yarn 是想通的
# 引入项目 
const consoleFunc = require('项目名称')
consoleFunc()
# 运行 
node index.js
#或者使用 yarn 配置 package.json 文件

~~~

![image-20210204154200967](img/image-20210204154200967.png)

~~~shell
# 运行 strart 替换的指令
yarn start 
~~~



## 项目规范

1. 包的规范

```shell
- package.json必须在包的顶层目录下
- 二进制文件应该在bin目录下
- JavaScript代码应该在lib目录下
- 文档应该在doc目录下
- 单元测试应该在test目录下
```

2. package.json字段分析(了解)

```shell
- name：包的名称，必须是唯一的，由小写英文字母、数字和下划线组成，不能包含空格
- description：包的简要说明
- version：符合语义化版本识别规范的版本字符串
    + 主版本号：当你做了不兼容的 API 修改
    + 子版本号：当你做了向下兼容的功能性新增
    + 修订号：当你做了向下兼容的问题修正
- keywords：关键字数组，通常用于搜索
- maintainers：维护者数组，每个元素要包含name、email（可选）、web（可选）字段
- contributors：贡献者数组，格式与maintainers相同。包的作者应该是贡献者数组的第一- 个元素
- bugs：提交bug的地址，可以是网站或者电子邮件地址
- licenses：许可证数组，每个元素要包含type（许可证名称）和url（链接到许可证文本的- 地址）字段
- repositories：仓库托管地址数组，每个元素要包含type（仓库类型，如git）、url（仓- 库的地址）和path（相对于仓库的路径，可选）字段
- dependencies：生产环境包的依赖，一个关联数组，由包的名称和版本号组成
- devDependencies：开发环境包的依赖，一个关联数组，由包的名称和版本号组成
```

## 3.自定义包实现步骤

```shell
3.自定义包实现步骤
1.创建一个包文件夹
2.初始化一个package.json文件
3.初始化一个包入口js文件
  注意点: 如果没有配置main, 默认会将index.js作为入口
          如果包中没有index.js, 那么就必须配置main
4.根据包信息配置package.json文件
  注意点: 通过scripts可以帮我们记住指令, 然后通过npm run xxx方式就可以执行该指令
          如果指令的名称叫做start或者test, 那么执行的时候可以不加run
5.给package.json添加bin属性, 告诉系统执行全局命令时需要执行哪一个JS文件
6.在全局命令执行的JS文件中添加 #! /usr/bin/env node
7.通过npm link 将本地包放到全局方便我们调试

4.将自定义包发布到官网
1.在https://www.npmjs.com/注册账号
2.在终端输入npm addUser
3.在终端输入npm publish
```