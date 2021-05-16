## 事件简介



~~~html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>10-Velocity常用事件</title>
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
  <script src="js/jquery-3.1.1.js"></script>
  <script src="js/velocity.js"></script>
</head>
<body>
<div class="box"></div>
<script>
  $(".box").velocity({
      marginLeft: "500px"
  }, {
    duration: 3000,
    delay: 2000,
    // 动画开始了
    begin: function(elements) {
        console.log("动画开始了", elements);
    },
  	// 动画结束了
    complete: function(elements) {
        console.log("动画结束了", elements);
    },
    /*
    elements：当前执行动画的元素，可以用$(elements)来获取
    complete：整个动画过程执行到百分之多少，该值是递增的，注意：该值为一个十进制数值 并不带单位 (%)
    remaining：整个动画过程还剩下多少毫秒，该值是递减的
    start：动画开始时的绝对时间 (Unix time)
    tweenValue：动画执行过程中 两个动画属性之间的补间值
    * */
    progress: function(elements, complete, remaining, start, tweenValue) {
        // console.log("动画正在执行");
        console.log((complete * 100) + "%");
    }
  });
</script>
</body>
</html>
~~~

