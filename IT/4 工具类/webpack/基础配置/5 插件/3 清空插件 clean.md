## 什么是clean-webpack-plugin

- webpack-clean-plugin会在打包之前将我们指定的文件夹清空
- 应用场景每次打包前将dist目录清空, 然后再存放新打包的内容, 避免新老混淆问题



## clean-webpack-plugin使用

- https://github.com/johnagan/clean-webpack-plugin

### 1. 安装clean-webpack-plugin

npm install --save-dev clean-webpack-plugin

### 2. 配置clean-webpack-plugin

- `const { CleanWebpackPlugin } = require('clean-webpack-plugin');`
- `plugins: [new CleanWebpackPlugin()]`

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
	plugins: [
      new HtmlWebpackPlugin(),
    	// 引入 clean 插件
      new CleanWebpackPlugin()
	]
}
```

