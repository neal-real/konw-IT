## ScrollMagic+GSAP动画

​	  <!-- 添加桥接文件-->

1. 添加的动画,需要在场景触发后动画进度和滚动形成联动效果.
2. 两种用法

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>13-ScrollMagic-GSAP动画</title>
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
        p{
            width: 100px;
            height: 100px;
            background: purple;
            margin: 0 auto;
        }
    </style>
    <script src="js/ScrollMagic.js"></script>
    <script src="js/TweenMax.js"></script>
	  <!-- 添加桥接文件-->
    <script src="js/animation.gsap.js"></script>
</head>
<body>
<header></header>
<div class="section1">
    <p class="anim"></p>
</div>
<div class="section2"></div>
<div class="section3"></div>
<div class="section4"></div>
<footer></footer>
<script>
    // 1.创建一个控制器对象controller
    let controller = new ScrollMagic.Controller();
    // 2.创建一个场景对象scene
    let scene = new ScrollMagic.Scene({
        offset: 100,
        duration: 200,
    });
    // 告诉ScrollMagic哪一个元素需要固定
    scene.setPin(".section1");
    /*  用法 1
    // 创建一个GSAP动画
    let tm = TweenMax.to(".anim", 3, {
        width: 200,
        height: 200
    });
    scene.setTween(tm);
    */
	  // 用法 2
    scene.setTween(".anim", 3, {
        width: 200,
        height: 200
    });
    // 3.将场景对象添加到控制器对象
    controller.addScene(scene);
</script>
</body>
</html>
~~~

