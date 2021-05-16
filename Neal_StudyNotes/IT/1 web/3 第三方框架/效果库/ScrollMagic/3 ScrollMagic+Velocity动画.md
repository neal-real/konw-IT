## ScrollMagic+Velocity动画

> 场景触发后,动画就开始执行

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>14-ScrollMagic-Velocity动画</title>
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
    <script src="js/velocity.js"></script>
  	<!-- 桥接文件 -->
    <script src="js/animation.velocity.js"></script>
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
        // 注意点: 如果需要结合Velocity来使用, 那么在创建场景的时候就不能指定有效范围
        // duration: 200,
    });
    // 告诉ScrollMagic哪一个元素需要固定
    scene.setPin(".section1");
    scene.setVelocity(".anim", {
        width: "200px",
        height: "200px"
    }, {
        duration: 3000
    });
    // 3.将场景对象添加到控制器对象
    controller.addScene(scene);
</script>
</body>
</html>
```

