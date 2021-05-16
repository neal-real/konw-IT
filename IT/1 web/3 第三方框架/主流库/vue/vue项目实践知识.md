# Vue 项目实践

## 项目配置

### 疑问

~~~js
npm run eject  //弹项目
npm run serve  //重启服务器
vue inspect   //webpack全部配置文件
vue inspect --rules  // 查看rules的配置信息
~~~

### 配置使用

~~~js
1. 新建vue.config.js文件
2. 导出配置内容
~~~

##### vue.config.js 演示

~~~js
const prot = 7070;
const title= 'vue项目最佳实践'

module.exports = {
  // 配置服务器接口
  devServer: {
    contentBase: "./dist",
    open: true,
    hot: true,
    port: prot
  },
  // webpack  
  configureWebpack:{
    name : title
  }
}
~~~



规范格式化:

~~~js
配置文件 #以下三选一!!!以下三选一!!!以下三选一!!!
1. 项目根目录下创建.prettierrc 文件
2. 项目根目录下创建prettier.config.js 文件
3. 在package.json 文件中配置prettier属性
# 1. 项目根目录下创建.prettierrc 文件
{
"tabWidth": 2,	// tab缩进大小,默认为2
  "useTabs": false, 	// 使用tab缩进，默认false
  "semi": false,		// 使用分号, 默认true
  "singleQuote": true,	// 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
  "TrailingCooma": "none",	// 行尾逗号,默认none,可选 none|es5|all,es5 包括es5中的数组、对象,all 包括函数对象等所有可选
  "bracketSpacing": true,	// 对象中的空格 默认true
  "jsxBracketSameLine": false,	// JSX标签闭合位置 默认false
  "arrowParens": "avoid",	// 箭头函数参数括号，默认avoid 可选 avoid| always,avoid 能省略括号的时候就省略 例如x => x，always 总是有括号
  "htmlWhitespaceSensitivity": "strict",	//html空格严格程度，可选<css|strict|ignore>
  "bracketSpacing": true, //在bar两边添加空格 ( bar )
}
# 2. 项目根目录下创建prettier.config.js 文件
module.exports = {
"tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "TrailingCooma": "none",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid",
  "htmlWhitespaceSensitivity": "strict",
  "bracketSpacing": true,
}
# 3. 在package.json 文件中配置prettier属性
// package.json 中的 prettier 属性
{
  "prettier": {
    "bracketSpacing": true,   // 是否在对象属性添加空格，这里选择是 { foo: bar }
    "printWidth": 160,        // 指定代码换行的行长度。单行代码宽度超过指定的最大宽度，将会换行，如果都不想换，可以添加 "proseWrap": "never"
    "semi": false,            // 是否在语句末尾打印分号，这里选择不加
    "singleQuote": true      // 是否使用单引号，这里选择使用
  }
}



如果存在不想格式化的文件，可以忽略格式化。使用方式有两种：

项目根目录下创建 .prettierignore 文件
代码注释，如：
<div>
  {/* prettier-ignore */}
  <span   			ugly    format=''   />
</div>


官方文档
https://prettier.io/docs/en/ignore.html
# 在.eslintrc.js 文件下 rules:{}中添加 如下一个 (注意: 重启下项目)
'space-before-function-paren': 0 // 取消函数名后的强制空格

~~~























## 项目结构



## 权限控制



## 数据的交互



## UI库选择

### pc 端

>  element UI 一家独大
>
>  数据可视化: examples

### mobile

