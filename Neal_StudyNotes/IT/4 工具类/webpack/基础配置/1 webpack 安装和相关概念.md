# webpack

>  - webpack是一套基于NodeJS的"模块打包工具"
>  - Webpack是打包模块化JavaScript的工具，它会从⼊口模块解析模块化导入语句，递归地找出文件的所有依赖，将⼊⼝和其依赖打包到⼀个单独的文件中

## 使用方法

1. 初始化项目
2. 安装 webpack 和脚手架
3. 运行打包指令: npx webpack index.js
   1. index.js 需要放在 src 文件夹中, index.js 可以省略
4. 打包后的文件,会放在 dist 目录中,名叫 main.js



## 安装

~~~js
 `全局安装 (不推荐,因为不同项目会有版本差异问题导致冲突,构建失败`
//V4+版本时，需要额外安装webpack-cli 
 npm install webpack webpack-cli -g
// 全局安装的版本检测
webpack -v
# 补充
// 卸载
npm uninstall webpack webpack-cli -g
~~~



## 本地安装

```shell
# 初始化项目
npm init -y
# 本地安装 webpack
npm i -D webpack 
# 安装webpack V4+版本时，需要额外安装webpack-cli
npm i -D webpack-cli
# npx帮助我们在项⽬目中的node_modules⾥里里查找webpack
npx webpack -v
# 安装指定版本
npm i -D webpack@<version>
# 安装最新的体验版本 可能包含bug,不不要⽤用于⽣生产环境
npm i -D webpack@beta
# 卸载
npm uninstall webpack webpack-cli -g
```





## 零配置的webpack项目

> ​	4版本以后推出

### 打包

~~~js
//此命令会让webpack去找同级的src目录
npx webpack  
//默认回去找./src目录的index.js文件 打包到dist改为main.js

~~~
