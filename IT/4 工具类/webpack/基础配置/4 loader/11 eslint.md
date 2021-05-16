## 什么是eslint?

- ESLint 是一个插件化的 javascript 代码检测工具，
- 它可以用于检查常见的 JavaScript 代码错误，也可以进行"代码规范"检查，
- 在企业开发中项目负责人会定制一套 ESLint 规则，然后应用到所编写的项目上，
- 从而实现辅助编码规范的执行，有效控制项目代码的质量。
- 在编译打包时如果语法有错或者有不符合规范的语法就会报错, 并且会提示相关错误信息



## 如何使用eslint

1. 对应环境和loader

`npm install eslint --save-dev`

`npm install eslint-loader --save-dev`

2. 生成eslint配置文件

https://www.webpackjs.com/loaders/

eslint 的中文文档:  http://eslint.cn/  

配置 webpack 文件

1. 检查的是打包前的文件,所以需要首先执行

2.     // 由于loader是从右至左从下至上执行
       // 而如果先执行了babel-loader就会对我们的代码进行转换
       // 而我们想检查代码规范的代码并不是转换之后的代码
       // 通过enforce: 'pre'告诉webpack在所有loader执行之前执行

```js
module.exports = {
  module: {
    rules: [
      {
        // 通过enforce: 'pre'告诉webpack在所有loader执行之前执行
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/, // 排除不检查的文件夹
        include: path.resolve(__dirname, 'src'), // 指定检查的文件夹
        loader: 'eslint-loader',
        options: {
          // eslint options (if necessary)
          // fix: true // 发现错误,自动修复,仅在打包的时候修复(可以使用 ide 在编写过程中使用)
        }
      },
    ]
  }
}
```

3. 如何提升开发效率

- 通过阅读打包错误信息来修复不符合规范语法非常低效
- 所以我们可以通过webstrom插件来帮我们完成提示
- webstrom--setting--eslint--autoxxx



## 配置 eslint 文件

1. 在根目录上创建配置文件, 文件名是 : `.eslintrc.js`

### 示例

```js
// .eslintrc.js
// https://eslint.org/docs/user-guide/configuring
module.exports = {
  /*
  不重要,永远写true
  * */
  root: true,
  parserOptions: {
    // parser: 'babel-eslint',
    /*
    默认设置为 3，5（默认）， 你可以使用 6、7、8、9 或 10 来指定你想要使用的 ECMAScript 版本
    * */
    "ecmaVersion": 10,
    /*
    设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)。
    * */
    "sourceType": "module",
    /*
    ecmaFeatures - 这是个对象，表示你想使用的额外的语言特性:
    globalReturn - 允许在全局作用域下使用 return 语句
    impliedStrict - 启用全局 strict mode (如果 ecmaVersion 是 5 或更高)
    jsx - 启用 JSX
    * */
    "ecmaFeatures": {}
  },
  // 指定代码运行的宿主环境
  env: {
    browser: true, // 浏览器
    node: true, // node
    /*
    支持 ES6 语法并不意味着同时支持新的 ES6 全局变量或类型（比如 Set 等新类型）。
    对于 ES6 语法，使用 { "parserOptions": { "ecmaVersion": 6 } }
    * */
    es6: true,
  },
  extends: [
    /*
      引入standard代码规范
      * */
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  /*
  扩展或覆盖规则
  * */
  rules: {
    // 强制语句结束添加，分号
    semi: ["error", "always"],
    // 强制缩进2个空格
    indent: ["error", 4],
    // 方法名和刮号之间不加空格
    'space-before-function-paren': ['error', 'never'],
    "no-unexpected-multiline": "off"
  }
};

```

