## 什么是sourcemap?

- webpack打包后的文件会自动添加很多代码, 在开发过程中非常不利于我们去调试
- 因为如果运行`webpack`打包后的代码,错误提示的内容也是打包后文件的内容
- 所以为了降低调试的难度, 提高错误代码的阅读性, 我们就需要知道打包后代码和打包之前代码的映射关系
- 只要有了这个映射关系我们就能很好的显示错误提示的内容, 存储这个映射关系的文件我们就称之为`sourcemap`

## 如何开启sourcemap

https://www.webpackjs.com/configuration/devtool/

- 在webpack.config.js中添加 key: devtool
  - devtool: "xxx",

## devtool 取值

- 结尾是source-map:
  - 会单独生成sourcemap文件, 通过单独文件来存储映射关系
  - 优势: 提示信息全面,可以直接定位到错误代码的行和列
  - 缺点: 打包速度慢

- 取值有 inline 
  - 不会单独生成sourcemap文件, 会将映射关系存储到打包的文件中, 并且通过base64字符串形式存储

- 取值有cheap
  - 生成的映射信息只能定位到错误行不能定位到错误列

- 取值有module
  - 不仅希望存储我们代码的映射关系, 还希望存储第三方模块映射关系, 以便于第三方模块出错时也能更好的排错

| **devtool**                    | 生产环境 | **品质(quality)**      |
| ------------------------------ | -------- | ---------------------- |
| (none)                         | yes      | 打包后的代码           |
| eval                           | no       | 生成后的代码           |
| cheap-eval-source-map          | no       | 转换过的代码（仅限行） |
| cheap-module-eval-source-map   | no       | 原始源代码（仅限行）   |
| eval-source-map                | no       | 原始源代码             |
| cheap-source-map               | no       | 转换过的代码（仅限行） |
| cheap-module-source-map        | no       | 原始源代码（仅限行）   |
| inline-cheap-source-map        | no       | 转换过的代码（仅限行） |
| inline-cheap-module-source-map | no       | 原始源代码（仅限行）   |
| source-map                     | yes      | 原始源代码             |
| inline-source-map              | yes      | 原始源代码             |
| hidden-source-map              | no       | 原始源代码             |
| nosources-source-map           | yes      | 无源代码内容           |

## 实际开发中的取值

### 开发阶段

取值`devtool: "development: cheap-module-eval-source-map"`

?? `devtool: "cheap-module-eval-source-map"`

- 只需要行错误信息, 并且包含第三方模块错误信息, 并且不会生成单独sourcemap文件

### 生产阶段

取值 `devtool: "production: cheap-module-source-map"`

- 只需要行错误信息, 并且包含第三方模块错误信息, 并且会生成单独sourcemap文件