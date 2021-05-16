## 方法



~~~html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>06-GSAP动画常用方法</title>
  <script src="js/TweenMax.js"></script>
  <style>
      *{
          margin: 0;
          padding: 0;
      }
      div{
          width: 100px;
          height: 100px;
          background: red;
      }
  </style>
</head>
<body>
<div class="box"></div>
<!-- 通过操作动画对戏, 然后用监听点击事件, 调用动画方法即可-->
<button class="start">开始</button>
<button class="paused">暂停</button>
<button class="toggle">切换</button>
<button class="restart">重新开始</button>
<script>
// 1. 创建动画的时候,会返回一个动画对象.
  let tm = TweenMax.to(".box", 3, {
      x: 500,
      paused: true
  });
  // console.log(tm);
  let oStartBtn = document.querySelector(".start");
  oStartBtn.onclick = function () {
    // 开启动画
    tm.play();
  }

  let oPauseBtn = document.querySelector(".paused");
  oPauseBtn.onclick = function () {
    // 动画暂停
    tm.pause();
  }

  let oToggleBtn = document.querySelector(".toggle");
  oToggleBtn.onclick = function () {
    // true 就是暂停动画
    tm.paused(true);
    // false 就是开始动画
    tm.paused(false);
    // 方法本身有一个布尔返回值, 可以得到当前动画的是否在执行
    console.log(tm.paused());
    // 切换动画执行和暂停之间的状态
    tm.paused(!tm.paused());
  }

  let oRestartBtn = document.querySelector(".restart");
  oRestartBtn.onclick = function () {
    // 动画重新开始
    tm.restart();
  }
</script>
</body>
</html>
~~~

