## ScrollMagic事件



~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>15-ScrollMagic事件</title>
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
    <script src="js/ScrollMagic.js"></script>
    <script src="js/velocity.js"></script>
    <script src="js/animation.velocity.js"></script>
</head>
<body>
<header></header>
<div class="section1"></div>
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
    scene.on("start", function (event) {
        console.log("进入场景");
    });
    scene.on("end", function (event) {
        console.log("离开场景");
    });
    scene.on("progress", function (event) {
        console.log("场景执行过程中" + event.progress);
    });
    // 3.将场景对象添加到控制器对象
    controller.addScene(scene);
</script>
</body>
</html>
~~~

