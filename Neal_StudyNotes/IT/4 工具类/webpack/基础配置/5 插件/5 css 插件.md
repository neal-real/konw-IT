## 什么是mini-css-extract-plugin?

- 默认情况, 通过style-loader打包的CSS都是直接插入到head中的

1. mini-css-extract-plugin是一个专门用于将打包的CSS内容提取到单独文件的插件
2. 但是插件默认在模式切换后的生产环境中在是不会需要压缩 css 文件,所以压缩 css 文件还需要另外一个插件 `mini-css-extract-plugin`
3. 因为覆盖了压缩选项,导致 js 代码压缩时效,所以需要插件进行 js 文件的压缩





## mini-css-extract-plugin使用

- https://webpack.js.org/plugins/mini-css-extract-plugin/

### 1. mini-css-extract-plugin安装

npm install --save-dev mini-css-extract-plugin

### 2. 配置插件mini-css-extract-plugin

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 插件中添加
plugins: [
  new MiniCssExtractPlugin({
      filename: './css/[name].css',
  })
]
```



### 3. 替换style-loader

- `loader: MiniCssExtractPlugin.loader,`
- 注意点: 如果相关文件资源无法显示, 需要根据打包后的结构手动设置公开路径

```js
// 找到 .css 文件的设置,修改 style-loader
module: {
    rules: [
			{
      test: /\.css$/,
      use:[
          {
            //注销:  loader: "style-loader" 使用下面的
            loader: MiniCssExtractPlugin.loader
						// 如果相关文件资源无法显示, 需要根据打包后的结构手动设置公开路径
            options: {
               publicPath: "xxx"
            }
          },
          {
            loader: "css-loader",
            options: {
              modules: true // 开启CSS模块化
            }
          },
          {
            loader: "postcss-loader"
          }
        ]
      },
    ]
}
```





## 压缩 css 和 js 文件

- 注意: 由于配置了webpack的optimization.minimizer项目会覆盖默认的JS压缩选项,所以JS代码也需要通过插件自己压缩

- mini-css-extract-plugin压缩css
- https://www.npmjs.com/package/mini-css-extract-plugin

### 1. 安装JS代码压缩插件

`npm install --save-dev terser-webpack-plugin`

### 2. 安装CSS代码压缩插件

`npm install --save-dev optimize-css-assets-webpack-plugin`

### 3. 导入插件

```js
// 新的 js 压缩插件
const TerserJSPlugin = require('terser-webpack-plugin');
// css 压缩插件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
```



### 4. 配置webpack优化项

```js
module.exports = {
    // optimization: 配置webpack的优化项
    optimization: {
        minimizer: [
          // 新的 js 压缩插件
          new TerserJSPlugin({}), 
          // css 压缩插件
          new OptimizeCSSAssetsPlugin({})    
        ],
    },
```

