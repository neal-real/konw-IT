### 配置文件说明

 1. 项目根目录下 创建 `webpack.config.js` 文件
 2. 配置文件如下方法书写

 - webpack 默认仅认识js和json文件

 - webpack配置注意事项
   - 配置文件的名称必须叫做: `webpack.config.js`, 否则直接输入 npx webpack打包会出错
   - 修改其它名称, 在输入打包命令时候必须通过 --config 指定配置文件名称
   - `npx webpack --config xxx`
   - 可以通过 package.json 的配置 script 指令简化输入
     - 运行是 npm run 指令名

~~~js
const path = require("path");
module.exports = {
  entry: "./src/index.js", 							// 必填:指定解析的入口文件
  output: {															// 输出
		filename: "main.js",								// 将所有文件打包到生成名为main.js
		path: path.resolve(__dirname, "./dist")	// 指定输出文件的路径, 必须是绝对路路径
	},
  mode:"development"										  // 打包模式 
  module: {																// 模块:告知webpack认知其他资源
    rules:[
      {
        test:/\.png$/,
        use:"file-loader"
      }
    ]
  }
};
~~~



| 配置 key                                     |                                            | 配置值                             |
| -------------------------------------------- | ------------------------------------------ | ---------------------------------- |
| **mode: 打包模式**                           |                                            | development(开发环境,不会压缩代码) |
|                                              |                                            | production(生产环境, 会压缩代码)   |
|                                              |                                            | none                               |
| entry : 指定项目入口文件(从哪个文件开始解析) |                                            | 默认: "./src/inde.js"              |
| output: 打包后放在指定位置                   |                                            |                                    |
|                                              | filename: 指定文件名                       | string                             |
|                                              | path:指定路径(必须绝对路径)                | string                             |
| module: 模块,                                | 告诉webpack如何处理webpack不能够识别的文件 |                                    |



~~~js
const path = require("path");
module.exports = {
	// 必填:指定解析的入口文件
  entry: "./src/index.js", 
	// 输出
  output: {
		// 将所有文件打包到生成名为main.js
		filename: "main.js",
		// 指定输出文件的路径, 必须是绝对路路径
		path: path.resolve(__dirname, "./dist")
	},
  // 打包模式
  mode:"development"
  // 模块:告知webpack认知其他资源
  module: {
    rules:[
      // 处理图片
      {
        test:/\.png$/,
        use:"file-loader"
      }
    ]
  }
};
~~~



## 书写方式

1. 字符串形式, 方便快速配置
2. 数组形式,可以进行单独值的更详细配置

```js
const path = require("path");
module.exports = {
  module: {
      rules: [
          // 打包CSS规则
          {
              test: /\.css$/,
            	// 书写方式1 
              use: [ 'style-loader', 'css-loader' ]
              // 书写方式1  可以在每个 loader 下面配置更多信息
              use:[
                  {
                      loader: "style-loader",
                  },
                  {
                      loader: "css-loader"
                  }
              ]
          }
      ]
  }
};
```



