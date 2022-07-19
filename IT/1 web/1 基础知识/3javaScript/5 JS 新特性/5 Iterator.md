## Iterator是什么

> Iterator又叫做**迭代器**, 是一种接口规范, 它规定了不同数据类型统一访问的机制.
>
> 这里的访问机制主要指数据的遍历
>
> 在`ES6`中`Iterator`接口主要用`for...of` 遍历

**默认情况下以下数据类型都实现的Iterator接口**

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象



~~~js
let arr = [1, 3, 5];
for (let value of arr) {
  console.log(value);
}
~~~



## Symbol.iterator属性

> 只要一个数据已经实现了Iterator接口, 那么这个数据就有一个叫做[Symbol.iterator]的属性

1. [Symbol.iterator]的属性会返回一个函数
2. [Symbol.iterator]返回的函数执行之后会返回一个对象
3. [Symbol.iterator]函数返回的对象中又一个名称叫做next的方法
4. next方法每次执行都会返回一个对象{value: 1, done: false}
5. 这个对象中存储了当前取出的数据和是否取完了的标记

~~~js
let arr = [1, 3, 5];
// [Symbol.iterator]的属性会返回一个函数
console.log(arr[Symbol.iterator]);	// ƒ values() { [native code] }
// [Symbol.iterator]返回的函数执行之后会返回一个对象
let it = arr[Symbol.iterator]();
console.log(it);										// Array Iterator
// [Symbol.iterator]函数返回的对象中又一个名称叫做next的方法
console.log(it.next());							// {done: false, value: 1}
console.log(it.next());							// {done: false, value: 1}
console.log(it.next());							// {done: false, value: 1}
console.log(it.next());							// {done: true, value: undefined}

for(let value of arr){
    console.log(value); 						// 1 3 5
}
~~~



## Iterator 自己实现

> 实现一个自己的数组

~~~js

  class MyArray {
    constructor() {
      for (let i = 0; i < arguments.length; i++) {
        this[i] = arguments[i];
      }
      this.length = arguments.length;
    }
    //  Symbol.iterator = 函数名 
    [Symbol.iterator]() {
      let index = 0;
      let that = this;
      return {
        next() {
          // 具体的逻辑判断,自己可以修改
          if (index < that.length) {
            // 但是返回的值,一定要是这个格式
            return { value: that[index++], done: false }
          } else {
            return { value: that[index], done: true }
          }
        }
      }
    }
  }
~~~

## 使用场景

> 1. 解构赋值
> 2. 扩展运算符

**所以如果希望自定义的对象可以使用解构和扩展运算符,那么可以实现自己实现这个方法**

