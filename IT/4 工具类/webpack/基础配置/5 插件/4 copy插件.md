## 什么是copy-webpack-plugin

- 在打包项目的时候除了JS/CSS/图片/字体图标等需要打包以外, 可能还有一些相关的文档也需要打包, 文档内容是固定不变的, 我们只需要将对应的文件拷贝到打包目录中即可
- 这时我们就可以使用copy-plugin来实现文件的拷贝



## copy-webpack-plugin使用

- https://www.webpackjs.com/plugins/copy-webpack-plugin/

## 安装copy-webpack-plugin

- npm install --save-dev copy-webpack-plugin



## 配置copy-webpack-plugin

1. 参数是一个数组, 每一个元素一个对象
2. 对象
   1.  from 指定好要 copy 哪个目录内的文件,
   2. to 指定打包目录(默认是 disr 下)的指定的目录位置

```js
const CopyWebpackPlugin = require('copy-webpack-plugin');

plugins: [
  new CopyWebpackPlugin(
    [
	    {from:"./doc", to:"./doc"},
      {from:"路径/目录名", to:"[打包目录下的]路径/目录名"}    
		]
  )
];
```

