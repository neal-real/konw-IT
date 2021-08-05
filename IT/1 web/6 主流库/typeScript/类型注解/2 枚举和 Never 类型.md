## 枚举类型

- TS为JS扩展的一种类型, 在原生的JS中是没有枚举类型的
- 枚举本质是数字

## 定义和使用

```typescript
enum Gender{ // 定义了一个名称叫做Gender的枚举类型, 这个枚举类型的取值有两个, 分别是Male和Femal
    Male,
    Femal
}
let val:Gender; // 定义了一个名称叫做val的变量, 这个变量中只能保存Male或者Femal
val = Gender.Male;
val = Gender.Femal;
// 我们可以通过枚举值拿到它对应的数字
console.log(Gender.Male); // 0
// 我们还可以通过它对应的数据拿到它的枚举值
console.log(Gender[0]); // Male
```



## Never类型

- 永远执行不完的函数
- 一般用于抛出异常或根本不可能有返回值的函数

```typescript
function demo():never {
  throw new Error('报错了');
  console.log('打印不了,永远执行不完,这个作用域的代码');
}
demo();

function demo2():never {
  while (true){}
}
demo2();
```

## 
