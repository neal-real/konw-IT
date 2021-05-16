# meta标签

> 文档级元数据元素
>
> 元标签： 表示网页的基础配置
>
> 1. 文档字符集: charset="UTF-8" (默认字符集)
> 2. 关键词
> 3. 网页等级
> 4. 使用语言
> 5. 作者等基本信息
> 6. **核心作用是能够做搜索引擎优化（SEO）**

| 字符集      | 涵盖字符                                                     | 1 个汉字的字节数 | 使用场景                 |
| ----------- | ------------------------------------------------------------ | ---------------- | ------------------------ |
| UTF-8       | 涵盖全球所有使用的文字和大量图形字符                         | 3                | 非单一文字的网页         |
| gb2312(gbk) | 所有汉字字符(简体、繁体) 和英语、少量韩文、日文和少量图形字符 | 2                | 制作仅有汉语和英语的网页 |

~~~html
<head>	`文档头：用来设置网页相关元数据`
	<meta>	`设置字符编码/网页关键字词`		
  <title>	`网页标题`
  <base>	`所有相对链接的基准URL`		
  <link> 	`外联其他资源到本网页内`
  <style> ` 样式代码书写位置` </style>
~~~



## meta 设置分类

~~~HTML
<!DOCTYPE html>
<html lang="en">
<head>
  	<!-- 字符集 -->
    <meta charset="UTF-8">
  	<meta http-equiv="" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    今天天气很好
</body>
</html>
~~~



## mete 两大分类

### http-equiv

> http-equiv 相当于http的文件头作用，向浏览器传一些信息，帮助浏览器正确地显示网页内容

~~~HTML
<!--
X-UA-Compatible 描述：IE8的专用标记，
用来指定IE8浏览器去模拟某个特定版本的IE浏览器的渲染方式，以此来解决部分兼容问题。
-->
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<!-- 
content-type 描述：设定页面使用的字符集 
-->
<meta http-equiv="content-Type" content="text/html; charset=utf-8">
<!-- 
告诉IE浏览器，无论是否用DTD声明文档标准，IE8/9都会以IE7引擎来渲染页面。 
-->
<meta http-equiv="X-UA-Compatible" content="IE=7">  
<!--
告诉IE浏览器，IE8/9都会以IE8引擎来渲染页面
-->
<meta http-equiv="X-UA-Compatible" content="IE=8">  
<!--
告诉IE浏览器，IE8/9及以后的版本都会以最高版本IE来渲染页面。 
-->
<meta http-equiv="X-UA-Compatible" content="IE=edge">  
<!--
代码IE=edge告诉IE使用最新的引擎渲染网页，chrome=1则可以激活Chrome Frame.
-->
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<!--
PS：谷歌添加一个插件：Google Chrome Frame（谷歌内嵌浏览器框架GCF），这个插件可以让用户的IE浏览器外不变，但用户在浏览网页时，实际上使用的是Google Chrome浏览器内核，而且支持IE6、7、8等多个版本的IE浏览器。
-->
~~~

#### http-equiv其他属性

~~~html

<!--
expires：设定网页的过期时间
PS：必须使用GMT的时间格式
-->
<meta http-equiv="expires"content="Fri,12Jan200118:18:18GMT">
<!--
refresh 描述：自动刷新并指向新页面
PS：2代表页面停留2秒后跳转到后面的网址上
-->
<meta http-equiv="Refresh" content="2;URL=https://www.baidu.com">
<!--
set-cookie 描述 ：如果网页过期，那么自动删除本地cookie
PS：必须使用GMT的时间格式
-->
<meta http-equiv="Set-Cookie"content="cookie value=xxx;expires=Friday,12-Jan-200118:18:18GMT；path=/">
<!--
windows-target 描述 ：强制页面在当前窗口中以独立页面显示，可以防止自己的网页被别人当作一个frame页调用
-->
<meta http-equiv="Window-target" content="_top">
<!--
cache-control： 缓存机制
-->
<meta http-equiv="cache-control" content="no-cache">
<!-- content值设定
Public：指示响应可被任何缓存区缓存。
Private：指示对于单个用户的整个或部分响应消息，不能被共享缓存处理。这允许服务器仅仅描述当用户的部分响应消息，此响应消息对于其他用户的请求无效
no-cache：指示请求或响应消息不能缓存
no-store：用于防止重要的信息被无意的发布。在请求消息中发送将使得请求和响应消息都不使用缓存
max-age：指示客户机可以接收生存期不大于指定时间（以秒为单位）的响应
min-fresh：指示客户机可以接收响应时间小于当前时间加上指定时间的响应
max-stale：指示客户机可以接收超出超时期间的响应消息。如果指定max-stale消息的值，那么客户机可以接收超出超时期指定值之内的响应消息
-->
~~~



### name变量

> 属性主要用于描述网页，与之对应的属性值为content，content中的内容主要是便于搜索引擎机器人查找信息和分类信息用的

~~~html
<!--
name对应值的说明
-->
<!--	author 描述 ：标注网页的作者	-->
<meta name="author" content="dashen" />
<!--	keywords 描述：页面关键词，用于被搜索引擎收录	-->
<meta name="keywords" content="知识地图,属于你自己的知识地图">
<!-- description 描述：页面描述，用于搜索引擎收录 -->
<meta name="description" content="知识地图，打造属于你自己的知识结构，在这里绘制属于你的知识地图，这份知识地图将会陪伴你一生，使你和你的家庭永久受益于你的经验，知识，感悟和总结。这一生你需要一份属于你自己的知识地图">
<!-- viewport 描述：视口用于控制页面缩放 -->
<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, minimum-scale=1, user-scalable=no">
<!-- renderer 描述：指定双核浏览器默认以何种方式渲染页面。 -->
<meta name="renderer" content="webkit">	<!-- 默认webkit内核 -->
<meta name="renderer" content="ie-comp">	<!-- 默认IE兼容模式 -->
<meta name="renderer" content="ie-stand">	<!-- 默认IE标准模式 -->
<!-- generator 描述：说明网站的采用的什么软件制作 -->
<meta name="generator" content="Microsoft"/>
<!-- revised 描述：网页文档的修改时间 -->
<meta name="revised" content="设计网, 6/24/2015"/>
<!-- robots 描述：用来告诉爬虫机器人哪些页面需要索引，哪些页面不需要索引 -->
<meta name="robots" content="all|none|index|follow|noindex|nofollow" />
<!-- 取值：all|none|index|noindex|follow|nofollow, 默认all
all：文件将被检索，且页面上的链接可以被查询；
none：文件将不被检索，且页面上的链接不可以被查询；
index：文件将被检索；
follow：页面上的链接可以被查询；
noindex：文件将不被检索，但页面上的链接可以被查询；
nofollow：文件将不被检索，页面上的链接可以被查询。
-->
<!-- copyright 描述：网站版权信息 -->
<meta name="copyright" content="本页版权XXX所有。All Rights Reserved" />
~~~

## 额外补充

### title 标签

~~~html
<title>知识地图</title>
~~~

**作用:**
         专门用于指定网站的标题, 并且这个指定的标题将来还会作为用户保存网站的默认标题

**注意点:**
         title标签必须写在head标签里面



## 网站 SEO 排名

### 网页 title 标题  

标题长度: Google 35 个中文名  baidu 28 个中文

格式: 网站名(产品名)-网站的介绍

### Keywords 关键字

> 限制在 6-8 个关键词左右 ,电商网站可以多几个

### Description 网站说明

