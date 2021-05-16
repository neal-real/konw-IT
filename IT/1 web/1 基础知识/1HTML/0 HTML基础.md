# HTML 基础

> ​	HTML其实是HyperText Markup Language的缩写, 超文本标记语言

## HTML结构介绍

~~~HTML
<!DOCTYPE html>
<html lang="en">
<!-- 配置 -->
<head>
	  <!-- meta 文档级元数据元素 -->
    <meta charset="UTF-8"> 字符集
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <!-- title 文档标题，也是保存网页时的默认名字 -->
  	<title>Document</title>
</head>
<!-- 容器 -->
<body>
    今天天气很好
</body>
</html>

~~~

### 标签解释

#### html标签

**作用:**
		用于告诉浏览器这是一个网页, 也就是说告诉浏览器我是一个HTML文档
**注意点:**
		其它所有的标签都必须写在html标签里面, 也就是写在html开始标签和结束标签中间

#### head标签

**作用:**
		用于给网站添加一些配置信息
			例如:

   1.    指定网站的标题 / 指定网站的小图片

   2.    添加网站的SEO相关的信息(指定网站的关键字/指定网站的描述信息)

   3.    外挂一些外部的css/js文件

   4.    添加一些浏览器适配相关的内容
         

**注意点:**
         一般情况下, 写在head标签内部的内容都不会显示给用户查看, 也就是说一般情况下写在head标签内部的内容我们都看不到

#### title标签

**作用:**
         专门用于指定网站的标题, 并且这个指定的标题将来还会作为用户保存网站的默认标题

**注意点:**
         title标签必须写在head标签里面



#### body标签

**作用:**
         专门用于定义HTML文档中需要显示给用户查看的内容(文字/图片/音频/视频)

**注意点:**
         虽然说有时候你可能将内容写到了别的地方在网页中也能看到, 但是千万不要这么干, 一定要将需要显示的内容写在body中
         一对html标签中(一个html开始标签和一个html结束标签)只能有一对body标签



## 转义字符

> https://www.runoob.com/tags/ref-entities.html
>
> ~~~
> 空格 = &nbsp;
> ~~~



## 常见标签 class 命名

| 区域     | 类名    |
| -------- | ------- |
| 页头     | header  |
| logo     | logo    |
| 导航条   | nav     |
| 横幅     | banner  |
| 内容区域 | content |
| 页脚     | footer  |




