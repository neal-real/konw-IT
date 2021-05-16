# 表单

> 作用: 用于收集用户信息, 让用户填写、选择相关信息

```html
 <form action="提交到哪里" method="post"  enctype="multipart/form-data">
		所有的表单内容，都要写在form标签里面
 </form>
```

### action 属性

```
 action="提交到哪里" #表单提交的地址
```

### method 属性

```
 method="post" # 表单信息提交的方式
```

### enctype 属性

```
 nctype="multipart/form-data"> # 表单提交的数据发送格式
```



## 表单控件

> 1. input就是表单最核心的标签. 
> 2. type属性, 有很多类型的取值, 取值的不同就决定了input标签的功能和外观不同

### 基础 input

```html
 姓名：<input 
        type="text" 
        value="" 
        placeholder=""
        disabled
        >
<!--  type： input 控件类型 -->
<!--  value：实际的值 -->
<!--  placeholder: 提示文本 -->
<!--  disabled: 关闭控件交互 -->
```



### 明文输入框

> 作用: 用户可以在输入框内输入内容

~~~html
账号:<input type="text"/>
~~~



### 暗文输入框

>  作用: 用户可以在输入框内输入内容

~~~html
密码:<input type="password"/>
~~~



### 给输入框设置默认值

~~~html
账号:<input type="text" value="123"/>
密码:<input type="password" value="123"/>
~~~



### 规定输入字段中的字符的最大长度



~~~html
账号: <input type="text" name="fullname" maxlength="8" />
~~~



### 文件上传

> 文件上传有 2 点,
>
> 1. 必须是 POST
> 2. 设置 enctype="multipart/form-data"
> 3. PHP 服务器通过 $_FILES 获取
> 4. 上传大文件, 服务器一般有默认限制.需要修改服务器配置

~~~html

<form action="index.PHP" method="POST" enctype="multipart/form-data">
    <input type="file" name="file" id=""><br>
    <input type="submit" value="提交">
  </form>
~~~



### 标签 label

> 作用: label标签`不会向用户呈现任何特殊效果`。不过，它为鼠标用户改进了可用性
>
> HTML5 labe标签通过包裹内容，就可以实现点击文字选中对应 input
>
> HTML4 labe 通过 for 和 id 属性绑定实现，文字与控件的绑定

```html
 性别:
 <label>
   <input type="radio" name="sex" value="男" checked>男性
 </label>
 <label>
   <input type="radio" name="sex" value="女">女性
 </label>
 <!-- 无论HTML5 或 4 只要有 from 属性就必须有对应 id 属性 -->
 <!-- 无论HTML4 不包裹控件 -->
 性别:
 <input id="A" type="radio" name="sex" value="男" checked>
 <label for="A">男性</label>
 
```



### 单选框

> 单选框 type="radio"
>
> name 相同才可以产生互斥行为，一个被选中，其他取消选中
>
> checked ： 默认选中后有属性, 多个选中，最后一个生效显示

```
 性别:
 <input type="radio" name="sex" value="男"  >男性
 <input type="radio" name="sex" value="女" checked >女性
```



### 复选框

> 复选框 type="checkbox"
>
> 1. name 要相同
> 2. value 属性要有值，向服务器提交的就是 value 值

```html
 爱好:
 <label>
 <input type="checkbox" name="hobby" value="1">足球
 </label>
 <label>
 <input type="checkbox" name="hobby" value="1">篮球
 </label>
 <label>
 <input type="checkbox" name="hobby" value="1">游泳
 </label>
 <label>
 <input type="checkbox" name="hobby" value="1">乒乓球
 </label>
```



### 四种按钮

> button： 普通按钮； 可以简写<button></button>
>
> submit: 提交按钮
>
> - 这个按钮不需要写value自动就有“提交”文字
>
> - 要想通过submit提交数据到服务器, 被提交的表单项都必须设置name属性
> - 默认明文传输(GET)不安全, 可以将method属性设置为POST改为非明文传输(学到Ajax再理解)
>
> reset：重置按钮
>
> - 这个按钮不需要写value自动就有“重置”文字
> - reset只对form表单中表单项有效果
>
> image: 图片按钮

```html
<input type="button" value="按钮">
<input type="submit" value="提交">
<input type="reset" value="重置">
<input type="image" src="lnj.jpg" />
<!-- 按钮的另一种写法 -->
<button>普通按钮</button>
<button type="submit">提交</button>
<button type="reset">重置</button>
```

###  隐藏域

- 作用: 定义隐藏的输入字段
- `<input type="hidden">`
- 暂时不用掌握, 在Ajax中对数据的CRUD操作有非常大的作用
- 



### 下拉菜单 select

> select 下拉菜单 option 是其内部选项
>
> 1. name 要相同
> 2. value 属性要有值，向服务器提交的就是 value 值

```html
<select name="" id="">
  <option value="alipay">支付宝</option>
  <option value="wx">微信</option>
  <option value="bank">网银</option>
</select>
```



### 多行文本 textarea

> select 下拉菜单 option 是其内部选项
>
> 1. cols 属性列数 列表更宽
> 2. rows 属性行数列表更高

```html
<textarea name="" id="" cols="30" rows="10"></textarea>

  <!--禁止手动拉伸-->
<style type="text/css">
    textarea{
        resize: none;
    }
</style>
```



### 数据列表

> 直接在 input 中输入“山”，下拉内容会自动过滤出山东和山西两个选项
>
> - 搞一个输入框
> - 搞一个datalist列表
> - 给datalist列表标签添加一个id
> - 给输入框添加一个list属性,将datalist的id对应的值赋值给list属性即可

```html
省份:
<input type="text" list="省份列表">
<datalist id="省份列表">
  <option value="山西"></option>
  <option value="山东"></option>
  <option value="广西"></option>
  <option value="广东"></option>
  <option value="湖北"></option>
  <option value="湖南"></option>
  <option value="河北"></option>
</datalist>
```



### 下拉列表

- 作用: select标签和ul、ol、dl一样，都是组标签. 用于创建表单中的待选列表, 可以从选择某一个带选项
- 格式:



```html
选择籍贯:
<select>
    <option>北京</option>
    <option>河北</option>
    <option>河南</option>
    <option>山东</option>
    <option>山西</option>
    <option>湖北</option>
    <option>贵州</option>
</select>
```

- 给下拉列表设置默认值
  - 和radio、checkbox一样select也可以设置默认值, 通过selected属性设置



```html
<select>
    <option>北京</option>
    <option>河北</option>
    <option>河南</option>
    <option>山东</option>
    <option>山西</option>
    <option>湖北</option>
    <option selected="selected">贵州</option>
</select>
```

- 给下拉列表添加分组



```html
<select>
    <optgroup label="北京市">
        <option>海淀区</option>
        <option>昌平区</option>
        <option>朝阳区</option>
    </optgroup>
        <optgroup label="广州市">
        <option>天河区</option>
        <option>白云区</option>
    </optgroup>
    <option selected="selected">贵州</option>
</select>
```





### 取色器

- `<input type="color">`
- HTML5中input类型增加了很多type类型, 例如color、date但是都不兼容, 后面讲到浏览器兼容时会重点讲解

日期选择器

- `<input type="date">`



