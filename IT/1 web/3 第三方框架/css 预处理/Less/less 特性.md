## 注释

**less**

~~~less
//单行注释
/*
多行注释
*/
~~~

 less 编译为： css

~~~css

/*都是多行注释
*/
~~~



## 变量

### 变量定义

> @变量名:值
>
> @符号作为变量关键字
>
> 

```less
@width: 10px;
@height: @width + 10px; // 变量可以参与运算

#header {
  width: @width;
  height: @height;
}
```

编译为：

```css
#header {
  width: 10px;
  height: 20px;
}
```

## 变量赋值变量

> @变量名: @变量名

## 变量插值

> 上面是使用变量赋值,
>
> 这里是选择器和属性名也使用变量

~~~less
@width: 10px;
@h: height				// 变量插值的定义,代替属性
@hea: #header			// 变量插值的定义 ,代替选择器
// 通过
@{hea} {					// 变量插值的使用 ,代替选择器
  width: @width;	
  @{h}: @height;	// 变量插值的定义,代替属性
}
~~~



## 作用域

> 1. 变量的定义不必在引用之前事先定义
> 2. 在`{}`外的就是全局变量
> 3. 在`{}`内的就是局部变量
> 4. 其他和 js 一样
> 5. 相同作用域 变量名相同,会出现后面覆盖前面的情况

```less
@var: red;		// 全局变量
#page {
  @var: white;	// 局部变量
  #header {
    color: @var; // blue 变量名相同,会出现后面覆盖前面的情况
  }
  @var: blue;
}
```

下面的 Less 代码示例和上面的代码示例是相同的：

```less
@var: red;				// 全局变量
#page {
  #header {
    color: @var; // white
  }
  @var: white;		// 局部变量
}
```



## 运算

1. 支持 加减乘除 四则运算
2. 参与运算的两个数字只要有一个必须带有单位,
3. 加减法,两个单位不同已左侧为准
4. 乘除发不考虑单位,仅作为数组进行运算

```less
// 所有操作数被转换成相同的单位
@conversion-1: 5cm + 10mm; // 结果是 6cm
@conversion-2: 2 - 3cm - 5mm; // 结果是 -1.5cm

// conversion is impossible
@incompatible-units: 2 + 5px - 3cm; // 结果是 4px

// example with variables
@base: 5%;
@filler: @base * 2; // 结果是 10%
@other: @base + @filler; // 结果是 15%
```

> 乘除发不考虑单位,仅作为数组进行运算

```less
@base: 2cm * 3mm; // 结果是 6cm
```

你还可以对颜色进行算术运算：

```less
@color: #224488 / 2; //结果是 #112244
background-color: #112244 + #111; // 结果是 #223355
```

不过，Less 提供的 [色彩函数](https://less.bootcss.com/functions/#color-operations) 更有使用价值。



## 混合/复用

>  混合就是复用代码

```less
.bordered() {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}

.box1 {
  color: #111;
  .bordered;			// 不带()的写法效果是一样的
}

.box2 {
  color: red;
  .bordered();
}
```

注意点

> - `.bordered` 后面的`()` 添加,会在编译之后消失
> - 如果不加`()` 编译后则会保留

编译:

~~~css
/* 如果不加 .bordered() 这段代码则会出现在 css 中
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
*/
.box1 {
  color: #111;
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
.box2 {
  color: red;
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
~~~



### 带参数的混合

> 1. 带参数
> 2. 带默认值参数
> 3. 仅给指定值赋值,其他使用默认值

~~~less
// 带参数的混合, bordered不会出现在 css 中
.bordered(@w, @h) {
  width: @w;
  height: @h;
}
// 带默认值得参数, 没有设置就使用默认值
.wh(@w: 50px, @h: 50px) {
  width: @w;
  height: @h;
}

.box1 {
  .bordered(200px, 200px) // 带参数的混合
  color: #111;
}

.box2 {
  color: red;
  .bordered(300px, 300px) // 带参数的混合
}

.box3 {
  color: red;
  .wh() // 带参数的混合
}
.box4 {
  color: red;
  .wh(@h:100px) // 仅设置想改变的部分,带上形参的名称,其他部分使用默认值
}
~~~



### 可变参数的混合

> 1. 通过@arguments 完成扩展
> 2. 通过明确形参名称,表明必传参数

~~~less
/*
方式 1 用... 表示 1 个或多个参数 
			用 @arguments 表示多个参数一次展开
*/ 
.animate(...) {
  transition: @arguments;
}
/*
方式 1 用形参名表示,这个 2 个参数是必须传递参数
			用... 表示 剩余1 个或多个参数 
			用 @arguments 表示多个参数一次展开
*/ 
.animate(@name, @time, ...) {
  transition: @name @time @arguments;
}

div{
  width: 200px;
  height: 200px;
  background: red;
  .animate(all, 3s, linear, 0s)
}

div:hover {
  width: 400px;
  height: 400px;
  background: blue;
}
~~~



### 匹配模式的混合

> 通过设置一个字符串做形参, 形成类似枚举的效果.避免因为类名相同,出现覆盖的情况
>
> 使用的时候第一个值使用字符串

~~~less
.triangle(Left, @width, @color) {
  width: 0;
  height: 0;
  border-width: @width;
  border-style: solid;
  border-color: transparent transparent transparent @color;
}

.triangle(Right, @width, @color) {
  width: 0;
  height: 0;
  border-width: @width;
  border-style: solid;
  border-color: transparent transparent transparent @color;
}

// 使用的时候第一个参数填入字符串,即可
div{
  .triangle(Right, 80px, green)
}
~~~

### 通用混合

> 通过`@_` 把相同的代码写入一个功能的类中,这样无论执行那个字符串代码都会先执行这个代码

~~~less
// @_ 通用混合
.triangle(@_, @width, @color) {
  width: 0;
  height: 0;
  border-style: solid;
}
.triangle(Left, @width, @color) {
  border-width: @width;
  border-color: transparent transparent transparent @color;
}

.triangle(Right, @width, @color) {
  border-width: @width;
  border-color: transparent transparent transparent @color;
}

// 使用的时候第一个参数填入字符串,即可
div{
  .triangle(Right, 80px, green)
}
~~~

## 引入

> 导入”的工作方式和你预期的一样。你可以导入一个 `.less` 文件，此文件中的所有变量就可以全部使用了

~~~js
@import "library"; // 扩展为.less的可以省略扩展名
div {
  .triangle(Left, 40px, 3s)
}
~~~



## 内置函数

> https://less.bootcss.com/functions/#string-functions

~~~less
@str: './../images/1.jpg';
// 使用内置函数替换@str 中的 1 为 2
@str: replace(@str, '1', '2');
.box1 {
  width: 200px;
  height: 200px;
  backgroud: url(@str1)
}
.box2 {
  width: 200px;
  height: 200px;
  backgroud: url(@str2)
}

//----------------
// 降低饱和度
.box2 {
  width: 200px;
  height: 200px;
  backgroud: desaturate(yellow, 50%)
}
// 提示饱和度的方法
.box2:hover {
  width: 200px;
  height: 200px;
  backgroud: saturate(yellow, 50%)
}
~~~



## 层级结构

> 伪类选择器的使用
>
> & 告诉 less 转换的时候直接拼接在选择器即可

~~~less
.clearfix {
  display: block;
  zoom: 1;
  // 通过 & 写在 .clearfix 里面 来表示 .clearfix 自身
  &:after {
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
~~~



## 继承

> 通过继承 就可以实现居中效果

~~~less
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.father:extend(.center) {
  width: 200px;
  height: 200px;
  background-color: brown;
  .son:extend(.center) {
    width: 100px;
    height: 100px;
    background-color: blue;
  }
}
~~~

## 混合和继承的区别

> 都是通过并集选择器实现
>
> 混合是拷贝很多份代码
>
> 继承是仅保留一份

## 条件判断

> 通过 when 表达式,使用比较运算符,满足条件执行内部代码,否则不执行
>
> 等于号 主需要注意 是一个等号 =

~~~js
// 只有宽度等于 100 的情况下才执行内部设置
.size(@width, @height) when (@width = 100px) {
  width: @width;
  height:@height;
}
// 高度或者宽度有一个等于 100px 就满足条件
.size(@width, @height) when (@width = 100px),(@height = 100px){
  width: @width;
  height:@height;
}
// 高度和宽度都等于 100px 就满足条件
.size(@width, @height) when (@width = 100px)and(@height = 100px){
  width: @width;
  height:@height;
}
// 可以使用布尔结果的内置函数作为条件
// https://less.bootcss.com/functions/#type-functions
// 是否是像素,是像素则可以设置成功
.size(@width, @height) when (isPixel(@width)) {
  width: @width;
  height:@height;
}

div{
  .size(80px, 100px)
}
~~~



## 映射（Maps）

> 类似对象的`['key']`的方法

```less
#colors() {
  primary: blue;
  secondary: green;
}

.button {
  // 取出 primary属性对应的 blue 值
  color: #colors[primary];
  border: 1px solid #colors[secondary];
}
```

输出符合预期：

```css
.button {
  color: blue;
  border: 1px solid green;
}
```





























