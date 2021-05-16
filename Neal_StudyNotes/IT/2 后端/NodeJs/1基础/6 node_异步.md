# node-异步和同步

js编程和提供api中存在同步和异步的关系，因为我自己已经知道他们的概念这里就不赘述了

1. node的异步是用过函数回调的方式进行的。
2. 在函数回调的过程中，会遇到文件依赖。就是文件3需要文件2的结果做先置条件，文件2需要文件1的结果做先置条件。那么遇到这种情况，最初的解决方案是嵌套。但是如果嵌套多了项目就难以理解和维护。所以为了解决回调嵌套的问题。
   1. 出现了**Promise**系统函数来解决这个问题。
   2. 也出现关键字**asyns**关键字用同步的方式编写异步函数的解决方案



### Promise 解决回调嵌套的问题

~~~js
let promis = new Promise ((resolve, reject)=> { 异步函数的调用};
promise.then(result => result; // {name: '张三'})
       .catch(error => console.log(error); // 失败了)
/promise是系统的一个构造函数。
1.resolve是用来在异步函数回调中，接受结果赋值的。
2.reject 用来在异步函数回调用，接受失败信息赋值的。
3.Promise 对象有两个方法用来在外部调用得到异步结果。
4.then方法是结果赋值.catch方法是保存失败信息的。
//直接点是JS的语法，链式编程的意思。
#下面是案例 ，用文件模块来演示回调问题
const fs = require('fs');
/注释的部分，在阐述回调地狱的问题。
// fs.readFile('./1.txt', 'utf8', (err, result1) => {
// 	console.log(result1)
// 	fs.readFile('./2.txt', 'utf8', (err, result2) => {
// 		console.log(result2)
// 		fs.readFile('./3.txt', 'utf8', (err, result3) => {
// 			console.log(result3)
// 		})
// 	})
// });
# 每个函数返回值都是Promise对象，外部可以用.then和.catch方法了
function p1 () {
  let promise = new Promise ((resolve, reject) => {
		fs.readFile('./1.txt', 'utf8', (err, result) => {
			resolve(result)
		})
	});
	return  promise
}

function p2 () {
	return new Promise ((resolve, reject) => {
		fs.readFile('./2.txt', 'utf8', (err, result) => {
			resolve(result)
		})
	});
}

function p3 () {
	return new Promise ((resolve, reject) => {
		fs.readFile('./3.txt', 'utf8', (err, result) => {
			resolve(result)
		})
	});
}
#使用链式编程,就可以一直调用下去，注意没有结束符 ;所以可以一直点下去。
p1().then((r1)=> {
	console.log(r1);
	return p2();
})
.then((r2)=> {
	console.log(r2);
	return p3();
})
.then((r3) => {
	console.log(r3)
})
~~~

### asyns关键字解决异步的问题

#### asyns基础语法

> ​	ES 7 新增异步函数语法，进一步简化promise中繁琐的操作又避免回调地狱的问题
>
> * 用同步的**方式**编写异步函数。

~~~js
#asyns基础语法
/* 
	1.在普通函数定义的前面加上async关键字 普通函数就变成了异步函数
 	2.异步函数默认的返回值是promise对象
 	3.在异步函数内部使用throw关键字进行错误的抛出 
 */
#总结
1. 普通函数定义前加async关键字 普通函数变成异步函数
2. 异步函数默认返回promise对象
3. 在异步函数内部使用return关键字进行结果返回 结果会被包裹的promise对象中 return关键字代替了resolve方法
4. 在异步函数内部使用throw关键字抛出程序异常
5. 调用异步函数再链式调用then方法获取异步函数执行结果
6. 调用异步函数再链式调用catch方法获取异步函数执行的错误信息


async function fn () {
	throw '发生了一些错误';
	return 123;
}

fn ().then(function (data) {
		console.log(data);
 	}).catch(function (err){
 		console.log(err);
})

// 结果会打印 123  和发生了一些错误

~~~

#### await关键词的使用

> ​	应用决定函数执行的顺序

~~~js

/*
*	1. await关键字只能出现在异步函数中
*	2. await promise await后面只能写promise对象 写其他类型的API是不不可以的
*	3. await关键字可是暂停异步函数向下执行 直到promise返回结果
*/
/ async  定义里三个异步函数
async function p1 () {
	return 'p1';
}

async function p2 () {
	return 'p2';
}

async function p3 () {
	return 'p3';
}
/这里这里的异步调用await关键字发挥作用，在回调结果产生以后再执行下面的代码
async function run () {
	let r1 = await p1()
	let r2 = await p2()
	let r3 = await p3()
	console.log(r1)
	console.log(r2)
	console.log(r3)
}
// 调用run函数
run();
~~~

### 最成熟的异步解决方案



~~~js
#真实应用方案
/*
	 1.改造现有异步函数api 让其返回promise对象 从而支持异步函数语法
	 2.调用promisify方法改造现有异步API 让其返回promise对象
	 3.输入异步api本来的参数，但是不写回调。通过赋值变量拿到回调结果
	 4.使用回调结果
*/
const fs = require('fs');
// 1.util改造现有异步函数api 让其返回promise对象 从而支持异步函数语法和关键字async
1. 引入node的包装模块util,
2. 赋值util模块下的promisify函数方法
const promisify = require('util').promisify;
// 2.调用promisify方法改造现有异步API 让其返回promise对象
1.promisify函数用将需要改造的api当做参数
const readFile = promisify(fs.readFile);

async function run () {
	//3.输入异步api本来的参数，但是不写回调。通过赋值变量拿到回调结果
  let r1 = await readFile('./1.txt', 'utf8')
	let r2 = await readFile('./2.txt', 'utf8')
	let r3 = await readFile('./3.txt', 'utf8')
	// 4.使用回调结果
  console.log(r1)
	console.log(r2)
	console.log(r3)
}

run();

~~~

















