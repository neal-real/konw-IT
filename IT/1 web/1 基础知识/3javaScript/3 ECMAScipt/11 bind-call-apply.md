## bind

>  bind方法作用: 修改 this 指向

1. 修改函数或者方法中的this为指定的对象, 并且会返回一个修改之后的新函数给我们

2. bind方法除了可以修改this以外, 还可以传递参数, 只不过参数必须写在this对象的后面

~~~js
let obj = {
  name: "zs"
}

function test(a, b) {
    console.log(a, b);
    console.log(this);
}

// 修改 test 内的 this 为 obj
let fn = test.bind(obj);
// 修改 test 内的 this 为 obj ,并给与参数
let fn = test.bind(obj, 10, 20);
// 调用需要自己调用
fn(); // 打印 a,b,this
~~~



## call

> 修改函数内部的 this 指向,并立即调用修改后的函数
>
> call方法除了可以修改this以外, 还可以传递参数, 只不过参数必须写在this对象的后面

~~~js
let obj = {
  name: "zs"
}

function test(a, b) {
    console.log(a, b);
    console.log(this);
}

// 修改 test 内的 this 为 obj, 并且完成了一次 调用 test() 函数
test.call(obj);	// 打印 a,b,this
// 也可有传参数
test.call(obj, 10, 20); // 打印 a,b,this
~~~

## apply

> 修改函数或者方法中的this为指定的对象, 并且会立即调用修改之后的函数

​        注意点: apply方法除了可以修改this以外, 还可以传递参数, 只不过参数必须通过数组的方式传递

~~~js
let obj = {
  name: "zs"
}

function test(a, b) {
    console.log(a, b);
    console.log(this);
}

// 修改 test 内的 this 为 obj, 并且完成了一次 调用 test() 函数
test.apply(obj);	// 打印 a,b,this
// 也可有传参数
test.apply(obj, [10, 20]); // 打印 a,b,this
~~~



## 异同

一样的地方: 

三个方法都是修改 this 的指向



不同的地方

1. bind 返回一个新的函数,并不会调用
   1. 对象.bind(新的对象, 参数 1, 参数 2,....)
2. call 不返回,并立即调用函数
   1. 对象.call(新的对象, 参数 1, 参数 2,....)
3. apply 比较 call  ,参数格式不同 .格式用数组
   1. 对象.call(新的对象, [参数 1, 参数 2,....] )



## 修改对象方法的指向



~~~js
function Person() {
    this.name = "lnj";
    this.say = function () {
        console.log(this);
    }
}
let p = new Person();
// bind 方法
let fn = p.say.bind(obj);
fn();
// call 方法
p.say.call(obj);
// apply 方法
p.say.apply(obj);
~~~

