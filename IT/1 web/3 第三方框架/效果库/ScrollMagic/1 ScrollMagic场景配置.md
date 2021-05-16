## 场景配置

> 1. 创建一个控制器对象controller
> 2. 创建一个场景对象scene(并配置)
>    1. 告诉ScrollMagic哪一个元素需要固定
> 3. 将场景对象添加到控制器对象

~~~HTML

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>12-ScrollMagic场景配置</title>
  <script src="js/ScrollMagic.js"></script>
  <style>
    *{
        margin: 0;
        padding: 0;
    }
    header{
        width: 100%;
        height: 100px;
        background: #000;
    }
    div{
        width: 100%;
        height: 200px;
    }
    .section1{
        background: red;
    }
    .section2{
        background: green;
    }
    .section3{
        background: blue;
    }
    .section4{
        background: deeppink;
    }
    footer{
        width: 100%;
        height: 2000px;
        background: #000;
    }
  </style>
</head>
<body>
<header></header>
<div class="section1"></div>
<div class="section2"></div>
<div class="section3"></div>
<div class="section4"></div>
<footer></footer>
<script>
  // 官方文档: http://scrollmagic.io/docs/index.html
  // 1.创建一个控制器对象controller
  let controller = new ScrollMagic.Controller();
  // 2.创建一个场景对象scene
  let scene = new ScrollMagic.Scene({
    // 告诉ScrollMagic从什么位置开始当前的场景, offset 是偏移多少的量后再固定.
    offset: 0,
    // 告诉ScrollMagic当前的场景从哪一个元素开始
    // triggerElement: "选择器",
    // triggerElement: ".section3",
    triggerElement: "header",
    // 告诉ScrollMagic当前的场景从指定元素相对于视口的什么位置开始
    // triggerHook: "onEnter",
    // triggerHook: "onCenter",
    triggerHook: "onLeave",
    // 告诉ScrollMagic当前的场景的有效范围,超出这个范围就失去固定效果
    duration: 200,
    reverse: false,
  });
  // 2.1 告诉ScrollMagic哪一个元素需要固定 
  // pushFollowers: false 不添加额外的元素,就让固定指定元素. 默认是 true 可以比较效果
  // scene.setPin(".section1", {pushFollowers: false});
  scene.setPin(".section1");
  // 3.将场景对象添加到控制器对象
  controller.addScene(scene);
</script>
</body>
</html>
~~~

