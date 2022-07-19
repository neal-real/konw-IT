## promise 

> ES6 的新增异步编程解决方案, 在代码中表现是一个对象
>
> 解决需求: 避免了回调函数层层嵌套产生的`回调地狱`情况
>
> ​	promise对象可以将异步操作以同步流程来表示, 避免了回调函数层层嵌套(回调地狱)

## 创建 promise

> promise对象不是异步的, 只要创建promise对象就会立即执行存放的代码

### 语法:

~~~js
new Promise( function(resolve, reject) {
  // 执行代码
});
~~~

### 解释

> - promise对象是通过状态的改变来实现的, 只要状态发生改变就会自动触发对应的函数
> - Promise对象三种状态
>   - pending:   默认状态，只要没有告诉`promise`任务是成功还是失败就是`pending`状态
>   - fulfilled(resolved): 只要调用`resolve`函数, 状态就会变为`fulfilled`, 表示操作成功
>   - rejected:  只要调用 rejected 函数, 状态就会变为 rejected , 表示操作失败
> - 状态一旦改变既不可逆.
>   - 既从 pending 变为 fulfilled(resolved) , 那么永远都是 fulfilled( resolved )
>   - 既从 pending 变为 rejected , 那么永远都是 rejected
> - 监听Promise状态改变:
>   - resolved --> then()
>   - rejected --> catch()

~~~js
let promise = new Promise(function (resolve, reject) {
		// 调用 resolve 函数改变状态为 resolved
    resolve();
  	// 调用 reject 函数改变状态为 rejected
    reject();
});

// 打印 promise 即可查看
console.log(promise);
// 调用 resolve 就会来到 .then
promise.then(function () {
    console.log("then");
});
// 调用 reject 就会来到 .catch
promise.catch(function () {
    console.log("catch");
});
~~~



### then 方法

> 1. then方法接收两个参数
>    - 第一个参数是状态切换为成功时的回调
>    - 第二个参数是状态切换为失败时的回调
> 2. promise对象可以多次调用then方法,该promise对象的状态改变时所有then方法都会被执行
> 3. then方法每次执行完毕后会返回一个新的promise对象
> 4. 可以通过上一个promise对象的then方法给下一个promise对象的then方法传递参数
>    - 无论是在上一个promise对象成功的回调还是失败的回调传递的参数都会传递给下一个promise对象成功的回调
> 5. 如果then方法返回的是一个Promise对象, 那么会将返回的Promise对象的执行结果中的值传递给下一个then方法

~~~Js
// 创建一个 promise 对象
let promise = new Promise(function (resolve, reject) {
  resolve("111"); // 将状态修改为成功
});
// 创建一个 promise 对象
let ppp = new Promise(function (resolve, reject) {
  reject("bbb"); // 将状态修改为失败
});
// promise对象 调用.then 方法,接收 data 对象
let p2 = promise.then(function (data) {
  console.log("成功1", data);
  // then方法返回的是一个Promise对象,返回时的 ppp 执行结果的值.
  return ppp;
}, function (data) {
  console.log("失败1", data);
  return "bbb";
});
// pp 虽然是失败对调,但是传递过来后还是成功函数接收值,bbb
p2.then(function (data) {
  // 这里接收的是 ppp 对象通过 resolve 返回的值
  console.log("成功2", data); 
}, function (data) {
  console.log("失败2", data);
});
// 最终打印 
//成功1 111 
//成功2 bbb
~~~



### catch 方法

> - catch 其实是 then(undefined, () => {}) 的语法糖
>
>   - 和then一样, 在修改promise状态时, 可以传递参数给catch方法中的回到函数
>
>   - 和then一样, 同一个promise对象可以多次调用catch方法,当该promise对象的状态时所有catch方法都会被执行
>
>   - 和then一样, catch方法每次执行完毕后会返回一个新的promise对象
>
>   - 和then方法一样, 上一个promise对象也可以给下一个promise成功的传递参数
>
>     论是在上一个promise对象成功的回调还是失败的回调传递的参数,都会传递给下一个promise对象成功的回调
>
>   - 和then一样, catch方法如果返回的是一个Promise对象, 那么会将返回的Promise对象的执行结果中的值传递给下一个catch方法
>
> - 和**then方法第二个参数的区别**在于, catch方法可以捕获上一个promise对象then方法中的异常
>
> - catch 只能传入一个函数
>
> - 如果promise的状态是失败, 但是没有对应失败的监听就会报错
>
> 不使用链式编程的报错的元音: 
>
> 1. then方法会返回一个新的promise, 新的promise会继承原有promise的状态
> 2. 如果新的promise状态是失败, 但是新的promise没有对应失败的监听也会报错

~~~js

let promise = new Promise(function (resolve, reject) {
  // resolve(); // 将状态修改为成功
  reject(); // 将状态修改为失败
});
// 如果需要分开监听, 也就是通过then监听成功通过catch监听失败,那么必须使用链式编程, 否则会报错
promise.then(function () {
  console.log("成功");
}).catch(function () {
  console.log("失败");
});

` 不使用链式编程的原因是
    1.只要调用 reject 就必须有失败的监听.
		2.catch是 then 函数第二参数的语法糖,调用 reject 后then 必须监听失败,既然 then 没有设置第二个参数,就必须使用链式编程的.catch 接收失败的结果.
		3. 因为链式编程会接收上一个 promise 传递值,无论成功失败都会进入下一个 promise 的第一个参数中
`
~~~



## 手写 promise

**Promise特点**

1. 创建时必须传入一个函数, 否则会报错
2. 会给传入的函数设置两个回调函数
3. 刚创建的Promise对象状态是pending
4. 状态一旦发生改变就不可再次改变
5. 可以通过then来监听状态的改变
   1. 如果添加监听时状态已经改变, 立即执行监听的回调
   2. 如果添加监听时状态还未改变, 那么状态改变时候再执行监听回到
   3. 同一个Promise对象可以添加多个then监听, 状态改变时所有的监听按照添加顺序执行







































