## async函数

1. async函数是ES8中新增的一个函数, 用于定义一个异步函数
2. async函数函数中的代码会自动从上至下的执行代码

## await操作符

1. await操作符只能在异步函数 async function 中使用
2. await表达式会暂停当前 async function 的执行，等待 Promise 处理完成
3. 若 Promise 正常处理(fulfilled) ，其回调的resolve函数参数作为 await 表达式的值，然后继续执行 async function



## 使用方法

~~~js
function request() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve("拿到的数据");
    }, 1000);
  });
}
// async 声明此函数中 可以 await
async function gen() {
  // 让异步函数书写顺序执行
  let res1 = await request();
  console.log(res1, 1);
  let res2 = await request();
  console.log(res2, 2);
  let res3 = await request();
  console.log(res3, 3);
}
~~~

