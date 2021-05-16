## 什么是HtmlWebpackPlugin

- HtmlWebpackPlugin会在打包结束之后**自动创建一个包含基本声明的index.html**, 并将打包好的JS自动引入到这个文件中



## HtmlWebpackPlugin使用

https://www.webpackjs.com/plugins/html-webpack-plugin/

### 1. 安装HtmlWebpackPlugin

npm install --save-dev html-webpack-plugin

### 2. 配置HtmlWebpackPlugin

1. 引入

   - `const HtmlWebpackPlugin = require('html-webpack-plugin');`

2. 添加插件 key, 并创建一个插件对象

   - `plugins: [new HtmlWebpackPlugin()]`

3. 默认情况下生成html文件并没有压缩,

   让html文件压缩设置  `minify: { collapseWhitespace: true,}`

```js
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./index.js",
  /*
  plugins: 告诉webpack需要新增一些什么样的功能
  * */
  plugins: [
    new HtmlWebpackPlugin({
      // 指定打包的模板, 如果不指定会自动生成一个空的
      template: "./index.html",
      minify: {
          // 告诉htmlplugin打包之后的html文件需要压缩
          collapseWhitespace: true,
      }
    })
  ]
};
```





## HtmlWebpackPlugin高级使用

- 详细配置信息:  https://github.com/jantimon/html-webpack-plugin#configuration
- 默认情况下HtmlWebpackPlugin生成的html文件是一个空(基本框架)的文件,
- 如果想指定生成文件中的内容可以通过配置模板的方式来实现



## 配置模板

```js
// 使用指定的 html 模板
plugins: [new HtmlWebpackPlugin({
  template: "index.html"
})]
```