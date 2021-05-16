

## swipe 事件

> - 轻扫事件 
> - 属于 Zepto 的Touch 模块

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>12-zepto-滑动事件</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        div{
            width: 100px;
            height: 100px;
            background: red;
            margin-left: 100px;
            margin-top: 100px;
        }
    </style>
    <script src="js/zepto.js"></script>
    <script src="js/event.js"></script>
    <script src="js/touch.js"></script>
    <script src="js/fx.js"></script>

</head>
<body>
<div></div>
<script>
  /*
  1.什么是轻扫事件?
  手指快速的往左边滑动/或者右边滑动/或者上边滑动/或者下边滑动
  * */
  // 轻扫事件监听
  $("div").swipe(function () {
  });
	// 向左边轻扫事件
  $("div").swipeLeft(function () {
    $(this).animate({marginLeft: "0"}, 2000);			    // 设定动画移动效果
  });
  // 向右边轻扫
  $("div").swipeRight(function () {
    $(this).animate({marginLeft: "100px"}, 2000);			// 设定动画移动效果
  });
  // 向上边轻扫
  $("div").swipeUp(function () {
    $(this).animate({marginTop: "0"}, 2000);		    	// 设定动画移动效果
  });
  // 向下边轻扫
  $("div").swipeDown(function () {
    $(this).animate({marginTop: "100px"}, 2000);	    // 设定动画移动效果
  });
</script>
</body>
</html>
~~~



## 事件封装

> 1. 将一套行为放入一个函数中,自定义一个事件名,通过 trigger 触发自定义事件,实现封装

~~~js
// 自定义 nj:clic 行为
$(".box-top li").on("nj:click", function () {
  // 自定义左右滑动翻页行为
  $(this).addClass("active").siblings().removeClass("active");
  let currentIndex = $(this).index();
  $(".line").animate({ left: currentIndex * $(this).width() + "px" }, 500);
  $(".box-bottom").animate({ left: -currentIndex * $(".list1").width() + "px" }, 500);
});
// 监听点击事件,触发翻页行为
$(".box-top li").click(function () {
  $(this).trigger("nj:click");
});
// 监听左滑事件,触发翻页行为
$(".box").swipeLeft(function () {
  $(".box-top li:last").trigger("nj:click");
});
// 监听右滑事件,触发翻页行为
$(".box").swipeRight(function () {
  $(".box-top li:first").trigger("nj:click");
});
~~~

