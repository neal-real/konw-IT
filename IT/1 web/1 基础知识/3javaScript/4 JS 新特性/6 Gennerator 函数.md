## Generator 函数基本使用

> - Generator 函数是 ES6 提供的一种异步编程解决方案
> - Generator 函数内部可以封装多个状态, 因此又可以理解为是一个状态机
> - **让Generator具有价值的是yield关键字**

### 定义Generator函数

> 只需要在普通函数的function后面加上*即可

~~~js
// * 定义Generator函数
function* 函数名() {
	// 没有调用 next()之前不会执行任何内容
}
~~~



### Generator函数和普通函数区别

1. 调用Generator函数后, 无论函数有没有返回值, 都会**返回**一个**迭代器对象**
2. 调用Generator函数后, 函数中封装的代码不会立即被执行

## yield关键字

1. 在`Generator`函数内部使用`yield`关键字定义状态,标记分割点
2. `yield`关键字可以让` Generator`内部的逻辑能够切割成多个部分
3. 通过调用迭代器对象的`next`方法执行一个部分代码
   1. 执行哪个部分就会**返回**哪个部分定义的状态
4. 传参
   1. 在调用`next`方法的时候可以传递一个参数, 这个参数会传递给上一个`yield`
   2. 第一个调用`next`不能传参

### 举例: 

~~~js
// * 定义Generator函数
function* gen() {
  console.log("123");
  let res = yield "aaa";

  console.log(res);		// abc
  console.log("567");
  yield 1 + 1;

  console.log("789");
  yield true;
}
let it = gen();
// 调用Generator函数后, 函数中封装的代码不会立即被执行
console.log(it);					// 什么都不会做
// 调用第一个部分,从函数开始-到 第一个 yield 关键字为止
let it1 = it.next()				// 会打印gen 函数中的 123
console.log(it1);					// value: "aaa", done: false
// 调用此句 ,res 的值时 abc
let it2 = it.next("abc")	// 会打印gen 函数中的 567
console.log(it2); 				// value: 2, done: false

let it3 = it.next()				// 会打印gen 函数中的 789
console.log(it3);					// {value: true, done: false}

let it4 = it.next()				// 
console.log(it4);					// {value: undefined, done: true}
~~~





## 应用场景

> 1. 让函数返回多个值
> 2. 利用 Generator 函数，可以在任意对象上快速部署 Iterator 接口
> 3. 同步的流程来表示异步的操作



### 让函数返回多个值

~~~js
/*
应用场景, 让函数返回多个值
* */
function* calculate(a, b) {
  yield a + b;
  yield a - b;
}
let it = calculate(10, 5);
console.log(it.next().value); // 15
console.log(it.next().value); // 5
~~~



### 快速部署 Iterator 接口

1. Generator 函数也是一个函数
2. Generator 函数会返回一个迭代器对象
3. 迭代器对象有next方法
4. next方法每次执行都会返回一个对象{value: xxx, done: false}

~~~js
// 1.快速部署 Iterator 接口 给 obj 对象
let obj = {
  name: "lnj",
  age: 34,
  gender: "man"
}
// 2. 定义一个 Generator 函数
function* gen(){
  // 3. 处理逻辑
  let keys = Object.keys(obj);
  for(let i = 0; i < keys.length; i++){
    	// 4 分割节点
      yield obj[keys[i]];
  }
}
// 5 给对象声明一个 Symbol.iterator 属性并赋值 Generator 函数
obj[Symbol.iterator] = gen;
// 拿到返回的 迭代器对象
let it = obj[Symbol.iterator]();
// 每次调用获得 obj 的一个属性值
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());

~~~





### 同步的流程来表示异步的操作

> **现实中也不会这么用, 但是这个是 async 和 await 的实现原理**

~~~js
function request() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve("拿到的数据");
    }, 1000);
  });
}
function* gen() {
  yield request();
  yield request();
  yield request();
}
let it = gen();
// console.log(it.next().value);
it.next().value.then(function (data) {
  console.log(data, 1);
  return it.next().value;
}).then(function (data) {
  console.log(data, 2);
  return it.next().value;
}).then(function (data) {
  console.log(data, 3);
});
~~~



