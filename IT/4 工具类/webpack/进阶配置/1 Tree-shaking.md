## 什么是Tree-Shaking?

- 过滤掉无用的JS代码和CSS代码, 我们称之为Tree-Shaking
  - 例如: 在a.js中引入了b模块, b模块中有2个方法, 但是我只用到了1个方法
  - 默认情况下会将b模块中所有代码都打包到a.js中,
  - 为了提升网页性能降低打包体积, 我们可以只将用到的方法打包到a.js中



## webpack中如何开启Tree-Shaking?

https://www.webpackjs.com/guides/tree-shaking/



## 开发环境

- webpack.config.js配置, 告诉webpack只打包导入模块中用到的内容

```js
const DevConfig = {
  // 告诉webpack只打包用到的JS代码
  optimization: {
    usedExports: true
  },
}
```

- package.json配置, 告诉webpack哪些文件不做Tree-Shaking
- 位置在那里都行,添加这个配置位置即可
- 下面的意识: 遇到.css 和.less 和.scss 不要过滤, 因为样式表文件引入并没有引用.没有引用的会被默认过滤掉.所以需要写明不需要过滤的文件

```json
{
  "sideEffects": ["*.css", "*.less", "*.scss"],
}
```



## 生产环境

无需进行任何配置, webpack默认已经实现了Tree-Shaking



注意点:

\- 只有ES Modle导入才支持Tree-Shaking

\- 任何导入的文件都会受到 tree shaking 的影响。

这意味着，如果在项目中使用类似 css-loader 并导入 CSS 文件，

则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除：



## 过滤没有用的css 代码

### 使用方法

- 如何开启CSS模块Tree-Shaking

https://github.com/webpack-contrib/purifycss-webpack



### 安装相关插件

`npm i -D purifycss-webpack purify-css glob-all`

### 配置插件

- 配置 webpack 文件
- 位置在 webpack.config.common.js 中. 等上线后移植到 webpack.config.prod.js 中

```js
const PurifyCSS = require("purifycss-webpack");
const glob = require("glob-all");
module.exports = {
  new PurifyCSS({
  paths: glob.sync([
  	// 要做CSS Tree Shaking的需要过滤的文件路径
	  path.resolve(__dirname, "./*.html"),
    // 过滤 js 文件
  	path.resolve(__dirname, "./src/js/*.js"),
  	])
	}),
}
```

