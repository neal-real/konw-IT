## 常用配置

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>09-Velocity常用配置</title>
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
      // 设置动画开始之前的延迟时间
      // delay: 2000,
      // 设置动画循环的次数
      // 注意点: 从初始位置到指定位置再到初始的位置算一次
      // loop: 2,
      // 设置动画运动的节奏
      // easing: "easeInOutQuint",
      // 设置动画结束之后元素的状态
      // 隐藏元素, 不占用原有的位置
      // display: "none",
      // 隐藏元素, 占用原有的位置
      // visibility: "hidden"
      // 设置动画队列
      // 注意点: 只要设置了动画队列动画就不会自动执行
      queue: "a"
  });
	
  $(".box").velocity({
      marginTop: "500px"
  }, {
      duration: 3000,
      queue: "b"
  });
  // dequeue 指明要执行那个动画队列
  $(".box").dequeue("a");
  // 执行完队列 a 的动画之后,在执行队列 b
  setTimeout(function () {
      $(".box").dequeue("b");
  }, 3000)
</script>
</body>
</html>
~~~

