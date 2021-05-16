## 基本使用

> scss 主流做法

~~~scss
$mixin center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.father {
  width: 200px;
  height: 200px;
  background-color: brown;
  @include center;
  .son {
    width: 100px;
    height: 100px;
    background-color: blue;
    @include center;
  }
}
~~~

> sass 非主流做法

~~~sass
$mixin center
  position: absolute
  left: 50%
  top: 50%
  transform: translate(-50%, -50%)

.father
  width: 200px
  height: 200px
  background-color: brown
  @include center
  .son
    width: 100px
    height: 100px
    background-color: blue
    @include center

~~~

## 注释

**scss** 两种注释方式

~~~scss
// 这种注释内容不会出现在生成的css文件中, 是静默注释
/* 这种注释内容会出现在生成的css文件中 */
~~~

 scss 编译为： css

~~~css
/*都是多行注释
*/
~~~



## 作用域

> 1. 变量的定义不必在引用之前事先定义
> 2. 在`{}`外的就是全局变量
> 3. 在`{}`内的就是局部变量
> 4. 其他和 js 一样, 采用就近原则
> 5. 相同作用域 变量名相同,会出现后面覆盖前面的情况

```scss
$var: red;		// 全局变量
#page {
  $var: white;	// 局部变量
  #header {
    color: $var; // blue 变量名相同,会出现后面覆盖前面的情况
  }
  $var: blue;
}
```

下面的 scss 代码示例和上面的代码示例是相同的：

```scss
$var: red;				// 全局变量
#page {
  #header {
    color: $var; // white
  }
  $var: white;		// 局部变量
}
```



## 变量

### 变量声明

> $变量名: 值 ;    
>
> $遍历名相同, 后定义覆盖先定义
>
> 任何可以用作css属性值的赋值都 可以用作scss的变量值

```scss
// 任何可以用作css属性值的赋值都 可以用作scss的变量值
$highlight-color: #F90;
// 变量赋值给变量
$color: $highlight-color;
// 空格的值
$basic-border: 1px solid black;
// 逗号分隔的值
$plain-font: "Myriad Pro"、Myriad、"Helvetica Neue"、Helvetica;
```

### 变量的引用

```scss
$highlight-color: #F90;
.selected {
  border: 1px solid $highlight-color;
}

//编译后

.selected {
  border: 1px solid #F90;
}
```





## 变量插值

> 插值就是选择器和属性名也使用变量
>
> 语法: #{$变量名}

~~~scss
$width: 10px;
$h: height				// 变量插值的定义,代替属性
$hea: #header			// 变量插值的定义 ,代替选择器
// 通过
#{$hea} {					// 变量插值的使用 ,代替选择器
  width: $width;	
  #{$h}: $height;	// 变量插值的定义,代替属性
}
~~~



## 运算

1. 支持 加减乘除 四则运算
2. 参与运算的两个数字只要有一个必须带有单位,
3. 加减法,两个单位不同已左侧为准
4. 乘除发不考虑单位,仅作为数组进行运算
5. 运算要加`()`

```scss
// 运算加括号
margin-left:(-200px / 2) 
```



## 混合/复用

>  混合就是复用代码
>
>  `()`  括号加的时候, 调用也要加

```scss
$mixin center() {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.father {
  width: 200px;
  height: 200px;
  background-color: brown;
  @include center();
  .son {
    width: 100px;
    height: 100px;
    background-color: blue;
    @include center();
  }
}
```

注意点

> - `.bordered` 后面的`()` 添加,会在编译之后消失
> - 如果不加`()` 编译后则会保留

编译:

~~~css
.father {
  width: 200px;
  height: 200px;
  background-color: brown;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.father .son{
	width: 100px;
  height: 100px;
  background-color: blue;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
~~~



### 带参数的混合

> 1. 带参数
> 2. 带默认值参数
> 3. 仅给指定值赋值,其他使用默认值

~~~scss
//1 带参数的混合, bordered不会出现在 css 中
@mixin bordered($w, $h, $color) {
  width: $w;
  height: $h;
  color: $color
}
//2 带默认值得参数, 没有设置就使用默认值
@mixin wh($w: 50px, $h: 50px) {
  width: $w;
  height: $h;
}

.box1 {
  @include bordered(200px, 200px, red) // 带参数的混合
  color: #111;
}

.box2 {
  color: red;
  @include bordered(300px, 300px, skyblue) // 带参数的混合
}

.box3 {
  color: red;
  @include wh() // 带参数的混合
}
//3. 仅设置想改变的部分,带上形参的名称,其他部分使用默认值
.box4 {
  color: red;
  @include wh($h:100px) 
}
~~~



### 可变参数的混合

> 1. 先定义可变参数`$args`, 才通过可变参数拿到所有的实参
> 2. 通过明确形参名称,表明必传参数

~~~scss
/*
方式 1 用... 表示 1 个或多个参数 
			用 $args 表示多个参数一次展开
*/ 
@mixin animate($args...) {
  transition: $args;
}
/*
方式 1 用形参名表示,这个 2 个参数是必须传递参数
			用... 表示 剩余1 个或多个参数 
			用 $args 表示多个参数一次展开
*/ 
@mixin animate($name, $time, $args...) {
  transition: $name $time $args;
}

div{
  width: 200px;
  height: 200px;
  background: red;
  @include animate(all, 3s, linear, 0s)
}

div:hover {
  width: 400px;
  height: 400px;
  background: blue;
}
~~~



## 引入

> 导入”的工作方式和你预期的一样。你可以导入一个 `.scss` 文件，此文件中的所有变量就可以全部使用了

~~~scss
$import "library.scss";
// 使用 library.scss 中的
div {
  @include triangle(Left, 40px, 3s)
}
~~~



## 内置函数

> https://scss.bootcss.com/functions/#string-functions

~~~scss
// 混合两个颜色
.box2 {
  width: 200px;
  height: 200px;
  backgroud: mix(yellow, blue)
}
~~~



##  自定义函数

~~~scss
// 自定义
@function square ($num){
  @return $num * $num +px;
}

.box2 {
  // 使用
  width: square(20);
  height: 200px;
  backgroud: mix(yellow, blue)
}
~~~





## 层级结构

> 伪类选择器的使用
>
> 通过$ 不将子选择器转换为后代选择器,而是转换为子选择器

~~~scss
.father {
	width: 100px;
  height: 100px;
  &:hover {
		width: 200px;
    height: 200px;
  }
}
~~~



## 继承

> 格式 @extend 类名;
>
> 通过继承 就可以实现居中效果

~~~scss
// 定义一个类
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
// 继承方法
.father{
  @extend .center;
  width: 200px;
  height: 200px;
  background-color: brown;
  .son {
    @extend .center;
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

## 条件判断和匹配混合

> 当条件不是 false 或 null 时就会执行

~~~scss
@mixin triangle($dir, $width, $color) {
  width: 0;
  height: 0;
  border-width: $width;
  border-style: solid;
  @if($dir == Up){
     border-color: $color ,transparent transparent transparent; 
  }@else if($dir == Down){
      border-color: transparent transparent $color transparent ;
  }@else {
    //什么都不做
  }
}

// 使用的时候第一个参数填入字符串,即可
div{
  @include triangle(Up, 80px, green)
}
~~~



## 循环

> for 循环和 while 循环
>
> 2 种格式; 第一种包含结束整数,第二种不包含
>
> 1.  @for $i from 起始整数 through 结束整数 {}
> 2.  @for $i from 起始整数 to 结束整数 {}

~~~scss
//for 循环 第1种 5 ,6, 7, 8
ul{
  li{
    background: blue;
    @for $i from 5 through 8 {
        &:nth-child(#{$i}){
        background: skyblue;
        }
    } 
  }
}
//for 循环 第2种 5 ,6, 7
ul{
  li{
    background: blue;
    @for $i from 5 to 8 {
        &:nth-child(#{$i}){
        background: skyblue;
        }
    } 
  }
}
// while 
ul{
  li{
    background: blue;
		$i:5;
    @while($i <= 8)
       &:nth-child(#{$i}){
     	  background: skyblue;
       }
  		$i: $i+1;
    } 
  }
}
~~~





### 通用混合

> 通过`$_` 把相同的代码写入一个功能的类中,这样无论执行那个字符串代码都会先执行这个代码

~~~scss
// $_ 通用混合
@mixin triangle($_, $width, $color) {
  width: 0;
  height: 0;
  border-style: solid;
}
@mixin triangle(Left, $width, $color) {
  border-width: $width;
  border-color: transparent transparent transparent $color;
}

@mixin triangle(Right, $width, $color) {
  border-width: $width;
  border-color: transparent transparent transparent $color;
}

// 使用的时候第一个参数填入字符串,即可
div{
  @include triangle(Right, 80px, green)
}
~~~

