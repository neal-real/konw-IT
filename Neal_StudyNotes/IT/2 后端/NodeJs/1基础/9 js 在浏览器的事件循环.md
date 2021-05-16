## js 事件环

> js 是事件驱动的编程语言,所以我们需要了解 js 运行的事件循环

## 1.JS是单线程的

  JS中的代码都是串行的, 前面没有执行完毕后面不能执行



## 2.执行顺序

1. 程序运行会从上至下依次执行所有的同步代码
2. 在执行的过程中如果遇到异步代码会将异步代码放到事件循环中
3. 当所有同步代码都执行完毕后, JS会不断检测 事件循环中的异步代码是否满足条件
4. 一旦满足条件就执行满足条件的异步代码



## 3.宏任务和微任务

>  在JS的异步代码中又区分"宏任务(MacroTask)"和"微任务(MicroTask)"

宏任务: 宏/大的意思, 可以理解为比较费时比较慢的任务

微任务: 微/小的意思, 可以理解为相对没那么费时没那么慢的任务



## 4.常见的宏任务和微任务

宏任务: MacroTask

- setTimeout
- setInterval
- setImmediate（IE独有）...

微任务: MicroTask: 

- Promise,
- MutationObserver (是专门用于监听节点的变化)
  - 节点的增删改查, 属性,内容的变化都可以获得
- process.nextTick（node独有) ...

注意点: 所有的宏任务和微任务都会放到自己的执行队列中, 也就是有一个宏任务队列和一个微任务队列

所有放到队列中的任务都采用"先进先出原则", 也就是多个任务同时满足条件, 那么会先执行先放进去的



## 5.完整执行顺序

1.从上至下执行所有同步代码

2.在执行过程中遇到宏任务就放到宏任务队列中,遇到微任务就放到微任务队列中

3.当所有同步代码执行完毕之后, 就执行微任务队列中满足需求所有回调

4.当微任务队列所有满足需求回调执行完毕之后, 就执行宏任务队列中满足需求所有回调

... ...

注意点:

每执行完一个宏任务都会立刻检查微任务队列有没有被清空, 如果没有就立刻清空





## IE 独有

```js
//setImmediate不能设置延迟时间, 并且只能执行一次
setImmediate(function () {
    console.log("setImmediate");
});
```





## MutationObserver

```js
// 选择需要观察变动的节点
const targetNode = document.getElementById('some-id');
/*
 观察器的配置（需要观察什么变动）
 attributes: true, 开启监听属性变化
 childList: true ,开启检查子节点的监听
 subtree: true ,节点树发生变化开启
  */
const config = { attributes: true, childList: true, subtree: true };

// 当观察到变动时执行的回调函数
const callback = function(mutationsList, observer) {
    // 在IE 11中使用传统的for循环
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('添加或删除一个子节点。');
        }
        else if (mutation.type === 'attributes') {
            console.log(mutation.attributeName + ' 属性已修改.');
        }
    }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察(参数一: 需要被观察的节点, 需要开启的配置内容)
observer.observe(targetNode, config);

// 之后，可停止观察
observer.disconnect();

```























## 