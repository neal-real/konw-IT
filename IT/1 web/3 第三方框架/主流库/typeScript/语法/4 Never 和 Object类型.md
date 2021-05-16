## Never类型

- 表示的是那些永不存在的值的类型
- 一般用于抛出异常或根本不可能有返回值的函数

```typescript
function demo():never {
    throw new Error('报错了');
}
demo();

function demo2():never {
    while (true){}
}
demo2();
```

## Object类型

- 表示一个对象

```typescript
let obj:object; // 定义了一个只能保存对象的变量
// obj = 1;
// obj = "123";
// obj = true;
obj = {name:'lnj', age:33};
console.log(obj);
```

