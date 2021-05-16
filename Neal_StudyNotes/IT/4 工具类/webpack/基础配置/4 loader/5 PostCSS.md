## 什么是PostCSS?

- https://www.postcss.com.cn/
- PostCSS和sass/less不同, 它不是CSS预处理器
- PostCSS是一款使用插件去转换CSS的工具，
- PostCSS有许多非常好用的插件

例如

- autoprefixer(自动补全浏览器前缀)
- postcss-pxtorem(自动把px代为转换成rem)
- ... ...

## 使用PostCSS自动补全浏览器前缀

### 1. 安装postcss-loader

npm i -D postcss-loader

### 2.  安装需要的插件

npm i -D autoprefixer

### 3. 配置postcss-loader

在css-loader or less-loader or sass-loader之前添加postcss-loader

```js
{
  test: /\.scss$/,
  use: [
        {
          loader: "style-loader" // 将 JS 字符串生成为 style 节点
        }, {
          loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
        }, {
          loader: "sass-loader" // 将 Sass 编译成 CSS
        }, {
          loader: "postcss-loader" // 将在最前方添加
        }
    ]
}
```

### 4. 创建postcss-loader配置文件

`postcss.config.js`

https://github.com/browserslist/browserslist#queries

### 5. 在配置文件中配置autoprefixer

- 如果需要适配的浏览器完全兼容则不会添加前缀

在配置文件 `postcss.config.js `中 添加以下配置

```js
module.exports = {
  plugins: {
    "autoprefixer": {
      "overrideBrowserslist": [
        "ie >= 8", // 兼容IE7以上浏览器
        "Firefox >= 3.5", // 兼容火狐版本号大于3.5浏览器
        "chrome  >= 35", // 兼容谷歌版本号大于35浏览器,
        "opera >= 11.5" // 兼容欧朋版本号大于11.5浏览器,
      ]
    }
  }
};
```



## 使用PostCSS自动将px转换成rem

- https://www.npmjs.com/package/postcss-pxtorem



### 1. 安装postcss-pxtorem

npm install postcss-pxtorem -D

### 3. 在配置文件中配置postcss-pxtorem

- propList: ['*']   值是: array , 可以从px更改到rem的属性

  - 值需要精确匹配: ["height"]
  - 使用通配符 * 启用所有属性。 示例：['*']
  -  在单词的开头或者结尾使用 *。 ( ['*position*'] 将匹配 background-position-y )*
  - 使用 与属性不匹配。! 示例：['*','letter-spacing']!*
  - 将"非"前缀与其他前缀合并。 示例：['*','font*']!

- rootValue (Number) root 元素的字体大小

- unitPrecision (Number) 允许REM单位增长到的十进制数

- selectorBlackList ( array ) 要忽略和离开的选择器

  - 如果值为字符串，它将检查选择器是否包含字符串

  - ['body'] 将匹配 .body-class

  - 如果值为 regexp，它将检查选择器是否匹配正则表达式。

    [/^body$/] 将匹配 body，但不匹配 .body

- replace (Boolean) 替代包含rems的规则，而不是添加回退。

- mediaQuery (Boolean) 允许在媒体查询中转换 px。

- minPixelValue (Number) 设置要替换的最小像素值。

```js
"postcss-pxtorem": {
	rootValue: 100, // 根元素字体大小
//  propList: ["height"]	// 单独配置需要更改的属性
  propList: ['*']  // 所有属性转换
}
```





## 其他配置属性

```js
//⽤来⽣成页面的 title 元素
title: 
//指定生成html的⽂件名，默认是 index.html, 也可以直接配置带有子目录。
filename: "myindex.html"
//模板文件路径，⽀持加载器，⽐如 html!./index.html
template: "./src/index.html"
/*
* 注⼊所有的资源到特定的 template 或者 templateContent 中，
* 值: true或body，所有的 javascript 资源将被放置到 body 元素的底部
* 值: 'head' 将放置到 head 元素 中。
**/
inject: true | 'head' | 'body' | false 
//将添加一个唯一的 webpack 编译 hash 到所有包含的脚本和 CSS ⽂文件，对于解除 cache 很有用。
cache: true | false，如果为 true, 这是默认值，仅仅在文件修改之后才会发布文件。
//如果为 true, 这是默认值，错误信息会写⼊到 HTML 页面中
showErrors: true | false, 
// 允许只添加某些块 (⽐如，仅 unit test 块)
chunks: 
//允许控制块在添加到页面之前的排序方式，支持的值:'none' | 'default' | {function}-default:'auto'
chunksSortMode: 
// 允许跳过某些块，(比如，跳过单元测试的块)
excludeChunks: 
```

