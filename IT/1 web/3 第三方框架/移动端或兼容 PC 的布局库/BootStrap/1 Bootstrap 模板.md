

## Bootstrap3

## 兼容配置

1. IE8 需要 Respond.js 配合才能实现对媒体查询`(media query )`的支持
2. 由于浏览器的安全机制, Respond.js 不能通过 `File:// `协议访问
   1. 如果需要测试 IE8 下面的响应式特性, 务必通过 http 协议访问页面
3. IE 兼容模式
   1. Bottstrap 不支持 IE 古老的兼容模式, 为了让 IE 浏览器运行最新的渲染模式下,建议将此`<meta>` 标签加入到页面中

~~~HTML
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <!--可以让部分国产浏览器默认采用高速模式渲染页面-->
    <meta name="renderer" content="webkit">
    <!--为了让 IE 浏览器运行最新的渲染模式下-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--为了保证在移动端能够正常的显示-->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>自己网页的标题</title>
    <!-- 导入Bootstrap的CSS文件 -->
    <link rel="stylesheet" href="css/bootstrap.css">

    <!--导入respond.js文件的目的, 是为了能够在IE8以及IE8以下的浏览器中使用媒体查询-->
    <!--导入html5shiv.js文件的目的, 是为了能够在IE8以及IE8以下的浏览器中使用H5新增的标签-->
    <!--
    [if xxx] ![endif]这个是IE中的条件注释, 只有在IE浏览器下才会执行
    以下代码的含义: 如果当前是IE9以下的浏览器, 那么就导入以下的两个JS文件
    -->
    <!--[if lt IE 9]>
        <script src="js/html5shiv.js"></script>
        <script src="js/respond.js"></script>
    <![endif]-->
</head>
<body>
<!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
<script src="js/jquery-1.12.4.js"></script>
<!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
<script src="js/bootstrap.js"></script>
</body>
</html>
~~~





## Bootstrap 4 模板



~~~HTML
<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <!--为了保证在移动端能够正常的显示-->
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- 导入Bootstrap的CSS文件 -->
    <link rel="stylesheet" href="css/bootstrap.css">
    <title>自己网页的标题</title>
</head>
<body>

<!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
<script src="js/jquery-3.1.1.js"></script>
<!--在Bootstrap4中很多的提示/弹窗都是通过popper.min.js实现的, 所以需要导入-->
<script src="js/popper.js"></script>
<!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
<script src="js/bootstrap.js"></script>
</body>
</html> 
~~~

















































