## global（全局变量）

| 变量名                       | 作用                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| global                       | 全局的命名空间对象,                                          |
|                              | 以下5个看似全局的，但实际上不是。 它们仅存在于模块的作用域中 |
| __dirname                    | 当前文件**所在文件夹**的绝对路径                             |
| __filename                   | 当前**文件**的绝对路径                                       |
| exports                      | 导出                                                         |
| module                       | 导出                                                         |
| require()                    | 引入                                                         |
|                              |                                                              |
| JS 本身的内置对象            | [内置对象有哪些](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects) |
| URL                          |                                                              |
| URLSearchParams              |                                                              |
|                              |                                                              |
| console                      | 在控制台中输出                                               |
| Buffer 类                    | 用于处理二进制数据。请参见 [Buffer 文档](http://nodejs.cn/api/buffer.html)。 |
|                              |                                                              |
| process                      | 进程对象(webpack 原理)                                       |
| queueMicrotask(callback)     | 任务队列                                                     |
|                              |                                                              |
| WebAssembly(web 组件)        | 作为所有的 W3C [WebAssembly](http://url.nodejs.cn/cEivN6) 的相关功能的命名空间的对象。 关于用法和兼容性，请参见 [Mozilla 开发者网站](http://url.nodejs.cn/g23oec)。 |
|                              |                                                              |
| [`setImmediate()`](#倒计时)  | 宏任务,微任务                                                |
| `clearImmediate()`           |                                                              |
| [`setInterval()`](#倒计时)   | 设置间歇定时器                                               |
| [`clearInterval()`](#倒计时) | 清除间歇定时器                                               |
| [`setTimeout()`](#倒计时)    | 设置超时定时器                                               |
| [`clearTimeout()`](#倒计时)  | 清除超时时定时器                                             |
|                              |                                                              |
| TextDecoder                  | 网页超文本应用技术工作小组                                   |
| TextEncoder                  | 网页超文本应用技术工作小组                                   |


## __dirname

- 当前文件**所在文件夹**的绝对路径

```shell
console.log(__dirname) # /Users/neal/Desktop/node
```



## __filename

- 当前**文件**的绝对路径

```shell
console.log(__filename) # /Users/neal/Desktop/node/app.js
```



## 导出

### exports

- 导出

```js
let name = "knowmap.cn";

function sum(a, b) {
    return a + b;
}
// 导出属性
exports.str = name;
// 导出方法
exports.fn = sum;
`错误写法1`
exports = name;
`错误写法2`
exports = {
    name,
    sum
};
```



### module

- 通过`exports`导出的结果等同上面
- exports 是 module.exports 方法的别名(地址引用关系)
- 当 module.exports 被重新赋值时, 导出对象最终以 module.exports 为准

```js
let name = "knowmap.cn";

function sum(a, b) {
    return a + b;
}
// 导出属性
module.exports.str = name;
// 导出方法
module.exports.fn = sum;
// 等于上面2句
module.exports = {
    name,
    sum
};
`module 可以直接赋值 !!! 企业开发中不要直接赋值
1. 后面的赋值会覆盖前面的赋值
2. 赋值函数获得的是函数本身
3. 赋值属性获得的是变量的值
`
module.exports = name;
module.exports = sum;
```





### require

> 引入
>
> - 不指明模块路径:是加载核心模块或第三方模块
> - 指明加载路径一般就是加载自定义模块
> - 无论什么模块，都是优先从缓存中加载：`如果一个模块被加载两次，则模块中的代码只会被执行一次`

```js
// 引入某个模块对象
require('模块名称/路径	') 
// 获取模块对象
const 模块对象 = require('模块名称/路径	') 
// 仅使用模块对象内部的某个属性或方法名 .这个方式称之为解构
const { 模块对象的属性, 模块对象的某个方法名 } = require('模块名称/路径	') 

// 示例
let aModule = require("路径a");
console.log(aModule); // 打印路径a 文件中的全部内容
console.log(aModule.str); // 打印 str 的值
let res = aModule.fn(10, 20); // 调用函数
console.log(res);// 输出函数运行的结果
```

### 引入机制

#### 引入机制-有路径时

1. require方法根据模块路径查找模块，如果是完整路径，直接引入模块。
2. 如果模块后缀省略，先找扩展名是.js 的文件,
3. 不到.js 文件,会一次找同名的 .json  .node 文件
4. 找不到.js 文件, 在同级目录找同名的文件夹
5. 如果找到了同名文件夹，找文件夹中的index.js
6. 如果文件夹中没有index.js就会去当前文件夹中的package.json文件中查找main选项中的入口文件
7. 如果找指定的入口文件不存在或者没有指定入口文件就会报错，模块没有被找到



#### 引入机制-没有路径时

1. 先加载核心模块，加载执行的速度，仅次于缓存加载
2. 如果核心模块中没有，则加载第三方模块
3. 第三方模块的加载规则：Node.js 先在当前文件的项目,目录中去找 node_modules 目录
   1. 如果找到，则去该目录中找 模块名的目录  如 : moment 
   2. 如果找到 moment 目录， 则找该目录中的 package.json文件
   3. 如果找到 package.json 文件，则找该文件中的 main属性
   4. 如果找到main 属性，则拿到该属性对应的文件
   5. 如果找到 moment 目录之后
      - 没有package.json
      - 或者有 package.json 没有 main 属性
      - 或者有 main 属性，但是指向的路径不存在
      - 则 node 会默认去看一下 moment 目录中有没有 index.js --> index.json--> index.node 文件
      - 如果找不到index 或者 找不到 moment 或者找不到 node_modules
      - 则进入上一级目录找 node_moudles 查找（规则同上)
      - 如果上一级还找不到，继续向上，一直到当前文件所属磁盘的根目录
4. 都找不到,报错





## 倒计时

```js
// 指定延时时间后,执行函数. 并返回一个对象
let tiem = setTimeout(function () {
    console.log("123");
}, 2000);
// 删除延时倒计时
clearTimeout(time)
// 每间隔指定时间,执行函数,并返回一个对象
let time1 = setInterval(function () {
    console.log("123");
}, 1000);
// 删除重复倒计时
clearInterval(time1)
```

