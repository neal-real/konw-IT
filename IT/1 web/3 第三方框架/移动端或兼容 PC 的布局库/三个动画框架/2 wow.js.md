## 什么是WOW.js

WOW.js是对animate.css的扩充, 让页面滚动更有趣

- 通过WOW.js，可以在页面滚动的过程中逐渐释放动画效果。
- 简单点理解: (wow.js + animate.css) 约等于  (swiper.js + swiper.animate.css)
- 只不过swiper更加强大, 企业中使用频率更高, 所以重点掌握swiper

## wow.js使用

- 引入animate.css
- 引入wow.js
- 给需要执行动画的元素添加类名
- 在JavaScript中初始化wow.js

## 基本使用



~~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>02-WOWJS使用</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        .box{
            width: 400px;
            height: 200px;
            border: 1px solid #000;
            margin: 100px auto;
        }
        .box1{
            width: 200px;
            height: 200px;
            background: red;
            float: left;
        }
        .box2{
            width: 200px;
            height: 200px;
            background: blue;
            float: right;
        }
    </style>
    <!-- 1 引入animate.css -->
    <link rel="stylesheet" href="css/animate.css">
    <!-- 2 引入wow.js -->
    <script src="js/wow.js"></script>
</head>
<body>
<div class="box">
    <!-- 3 给需要执行动画的元素添加类名 -->
    <div class="box1 wow slideInLeft" data-wow-duration="5s"></div>
     <!--
    通过wow.js添加动画, 须写 wow 基类
    slideInLeft 是 Animate.css 中的动画名称, 只要是 Animate.css 中的动画再 wow.js 中都可以使用
    -->
    <div class="box2 wow slideInRight" data-wow-delay="5s" data-wow-iteration="2"></div>
</div>
<script>
  // 4 在JavaScript中初始化wow.js
    new WOW().init();
</script>
</body>
</html>
~~~~





## 配置 wow

~~~js
let wow = new WOW({
  boxClass:     'nj',      // 自定义基类的名称
  animateClass: 'animated', // 指定需要使用的动画库的名称
  offset:       0,          // 在全局统一的设置元素的data-wow-offset
  mobile:       true,       // 在移动端是否需要执行动画
  live:         true,       // 是否需要开启异步加载内容
  callback:     function(box) {
      // 只要有元素执行动画就会调用这个回调函数, 并且会将正在执行动画的元素传递给我们
      console.log(box);
  },
  /*告诉wow.js, data-wow-offset参数谁进行计算偏移位*/
  scrollContainer: ".box",
});
wow.init();
~~~

