## 一个动画示例

> 依序播放动画,且每个元素停留的位置不同.

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>07-GSAP动画管理</title>
    <script src="js/TweenMax.js"></script>
    <!--<script src="js/TimelineMax.js"></script>-->
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        div{
            width: 100px;
            height: 100px;
            background: #ccc;
            border: 1px solid #000;
        }
    </style>
</head>
<body>
<div class="box1"></div>
<div class="box2"></div>
<div class="box3"></div>
<script>
    let tm = new TimelineMax();
    tm.add(
        TweenMax.to(".box1", 4, {
            x: 500
        })
    );
    tm.add(
        TweenMax.to(".box2", 3, {
            x: 400
        })
    );
    tm.add(
        TweenMax.to(".box3", 3, {
            x: 300
        })
    );
</script>
</body>
</html>
~~~

