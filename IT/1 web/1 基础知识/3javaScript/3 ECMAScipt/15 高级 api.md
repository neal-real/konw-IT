## 数组的遍历

### for of

> ES6中推出,循环遍历数组
>
> for of 会依次取出索引对应的值,给与 value

~~~js
for(let value of arr){
  console.log(value);
}
~~~

### forEach

~~~js
// forEach方法会自动调用传入的函数
// 每次调用都会将当前遍历到的元素和当前遍历到的索引和当前被遍历的数组传递给这个函数
arr.forEach(function (currentValue, currentIndex, currentArray) {
    // console.log(currentValue, currentIndex, currentArray);
    console.log(currentValue);
});
// forEach 的实现方法
Array.prototype.myForEach = function (fn) {
    // this === 调用的对象
    for(let i = 0; i < this.length; i++){
        fn(this[i], i, this);
    }
};

~~~





## 数组查找

### findIndex

> 1. 数组的findIndex方法
> 2. findIndex方法: 定制版的indexOf, 找到返回索引, 找不到返回-1 

~~~js
// 1.数组的findIndex方法
// findIndex方法: 定制版的indexOf, 找到返回索引, 找不到返回-1
let index = arr.findIndex(function (currentValue, currentIndex, currentArray) {
    // console.log(currentValue, currentIndex, currentArray);
    // if(currentValue === 6){
    if(currentValue === 10){
        return true;
    }
});
console.log(index);

// findIndex实现
Array.prototype.myFindIndex = function (fn) {
  for(let i = 0; i < this.length; i++){
      let result = fn(this[i], i, this);
      if(result){
          return i;
      }
  }
  return -1;
}
~~~



### find

> array.find()  返回找到的元素

~~~js
// find 实现
Array.prototype.myFind = function (fn) {
  for(let i = 0; i < this.length; i++){
      let result = fn(this[i], i, this);
      if(result !== undefined){
          return result;
      }
  }
  return undefined;
}
~~~



## filter

> 将满足条件的元素组成一个新的数组返回

~~~js
let arr = [1, 2, 3, 4, 5];
// 满足的条件返回true ,则会添加到一个新数组,并返回这个新数组
let newArray = arr.filter(function (currentValue, currentIndex, currentArray) {
		// 添加条件 ,偶数值返回 true
    if(currentValue % 2 === 0){
        return true;
    }
});
console.log(newArray); // [2, 4]


// filter实现
Array.prototype.myFilter = function (fn) {
  let newArray = [];
  for(let i = 0; i < this.length; i++){
      let result = fn(this[i], i, this);
      if(result){
          newArray.push(this[i]);
      }
  }
  return newArray;
}
~~~



## map

> 将满足条件的元素映射到一个新的数组中
>
> 1. map 会将原数组全部用 undefined 覆盖
> 2. 然后将满足条件的元素,根据它的索引放回原来的位置
> 3. 返回一个和元素长度一样的数组
> 4. 该数组仅满足条件的位置元素有值,其他都是 undefined



~~~js
let arr = [1, 2, 3, 4, 5];
let newArray = arr.map(function (currentValue, currentIndex, currentArray) {
    // console.log(currentValue, currentIndex, currentArray);
    if(currentValue % 2 === 0){
        return currentValue;
    }
});
console.log(newArray); // [undefined, 2, undefined, 4, undefined]


// map实现
Array.prototype.myMap = function (fn) {
    let newArray = new Array(this.length);
    newArray.fill(undefined);
    for(let i = 0; i < this.length; i++){
        let result = fn(this[i], i, this);
        if(result !== undefined){
            newArray[i] = result;
        }
    }
    return newArray;
}
~~~



## 删除

> 需求: 遍历的同时删除数组中所有元素

删除的两种方法

1. arr.splice(2, 1);
   1. 会因为删除的同时,数组元素前移,导致删不干净
2. delete arr[2];   
   1. delete来删除数组中的元素, 数组的length属性不会发生变化

~~~js


for(let i = 0; i < arr.length; i++){
    console.log(arr.length);
    // 注意点: 通过delete来删除数组中的元素, 数组的length属性不会发生变化
    delete arr[i];
}
console.log(arr);
~~~





## 排序

> `sort( )`
>
> - 如果 compareFunction(a, b) 小于 0 ，那么 a 会被排列到 b 之前；
> - 如果 compareFunction(a, b) 等于 0 ， a 和 b 的相对位置不变。
> -  如果 compareFunction(a, b) 大于 0 ， b 会被排列到 a 之前
> -  注意点: 如果元素是字符串类型, 那么比较的是字符串的Unicode编码

~~~js
// 排序数组
let arr = [3, 4, 2, 5, 1];

arr.sort(function (a, b) {
//1. 需要升序排序, 那么就返回a - b;
//2. 需要降序排序, 那么就返回b - a;
    return b - a;
});

// 1/对象排序
let students = [
    {name: "zs", age: 34},
    {name: "ls", age: 18},
    {name: "ww", age: 22},
    {name: "mm", age: 28},
];
// 2. 比较对象中的可以排序值
students.sort(function (o1, o2) {
  return o1.age - o2.age;
});
console.log(students);
~~~



## 字符串

> 在js中字符串可以看做一个特殊的数组, 所以大部分数组的属性/方法字符串都可以使用

### 1.获取字符串长度 

~~~js
let str = "abcd";
console.log(str.length);
~~~

### 2.获取某个字符 [索引]

~~~js
let str = "abcd";
let ch = str[1];
let ch = str.charAt(1);
console.log(ch);
~~~

### 3.字符串查找

> indexOf / lastIndexOf / includes

~~~js
let str = "vavcd";
let index = str.indexOf("v");
let index = str.lastIndexOf("v");
console.log(index);
let result = str.includes("p");
console.log(result);
~~~

### 4.拼接字符串

~~~js
let str1 = "www";
let str2 = "konmap";
let str = str1 + str2; // 推荐
let str = str1.concat(str2);
console.log(str);
~~~

### 5.截取子串

> slice / substring / substr

~~~js
let str = "abcdef";
let subStr = str.slice(1, 3);
let subStr = str.substring(1, 3);
let subStr = str.substr(1, 3);
console.log(subStr);
~~~

### 6.字符串切割

~~~js
let arr = [1, 3, 5];
 let str = arr.join("-");
  console.log(str);
  let str = "1-3-5";
  let arr = str.split("-");
  console.log(arr);
~~~

### 7.判断是否以指定字符串开头

~~~js
let str = "http://www.knowmap.com";
let result = str.startsWith("www");
console.log(result);
~~~

### 8. 判断是否以指定字符串结尾

~~~js
let str = "lnj.jpg";
let result = str.endsWith("png");
console.log(result);
~~~

### 9. 字符串模板

~~~js
let str = "";
let str = '';
let str = `www.kowmap.com`;
console.log(str);
console.log(typeof str);

let name = "lnj";
let age = 34;
let str = `我的名字是${name},我的年龄是${age}`;
console.log(str);
~~~

