## Symbol

- Symbol是ES6中新增的一种数据类型, 被划分到了基本数据类型中
- js 中的数据类型有
  - 基本数据类型: 字符串、数值、布尔、undefined、null、Symbol
  - 引用数据类型: Object

## Symbol的作用

> 用来表示一个独一无二的值
>
> 1. 在企业开发中如果需要对一些第三方的插件、框架进行自定义的时候
> 2. 可能会因为添加了同名的属性或者方法, 将框架中原有的属性或者方法覆盖掉
> 3. 为了避免这种情况的发生, 框架的作者或者我们就可以使用Symbol作为属性或者方法的名称

## 使用方法

> 1. 在`Symbol` 生成的时候,可以添加一个标记 ,这个标记仅仅用于区分,没有其他任何含义
>
> - 方法: 在`Symbol('标记名称')`
>
> 2. 如果想使用变量作为对象属性的名称, 那么必须加上[]

~~~js
// 声明两个独一无二的变量
let name = Symbol("name");
let say = Symbol("say");
let obj = {
  // 注意点: 如果想使用变量作为对象属性的名称, 那么必须加上[]
	// 这个变量可以用作存储属性
  [name]: "abc",
  // 这个变量可以用作存储方法
  [say]: function (age) {
    console.log("say"+ age);
  }
}
// 获取值
let abc = obj[name]
// 使用方法
obj[say](12)
~~~



## 注意点

> 1. 通过Symbol生成独一无二值时传入的字符串仅仅是一个标记, 方便我们阅读代码, 没有其它任何意义
> 2. 做类型转换的时候不能转换成数值
> 3. 不能做任何运算
> 4. Symbol生成的值作为属性或方法名称时, 一定更要保存下来, 否则后续无法使用
> 5. for循环无法遍历出Symbol的属性和方法

~~~js
//  4. 先保存 name
let name = Symbol("name");
let obj = {
  // 在使用  
  [name]: "abc"
	// 这样直接使用的方法是错误的
  [Symbol("name")]: "abcccc"
}
console.log(obj[name]);


// 5.for循环无法遍历出Symbol的属性和方法
let name = Symbol("name");
let say = Symbol("say");
let obj = {
    // 注意点: 如果想使用变量作为对象属性的名称, 那么必须加上[]
    [name]: "abc",
    [say]: function () {
        console.log("say");
    },
    age: 34,
    gender: "man",
    hi: function () {
        console.log("hi");
    }
}
` 这是错误的, 通过 for 无法看到 symbol 的属性和方法`
// for(let key in obj){
//     console.log(key);
// }
// 只有通过 Object.getOwnPropertySymbols(对象) 可以看到
console.log(Object.getOwnPropertySymbols(obj));



~~~

