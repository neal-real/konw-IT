## 什么是Animate.css

http://www.animate.net.cn/

https://github.com/animate-css/animate.css

- 其实swiper-animate就是参考Animate.css演变出来的一个插件,
- Animate.css和swiper-animate一样都是用于快速添加动画的,
- 所以会用swiper-animate就会用Animate.css

## Animate.css的使用:

1. 引入animate.css的文件
2. 给需要执行动画的元素添加类名

~~~html

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>01-AnimateCSS使用</title>

<link rel="stylesheet" href="css/animate.css">
<style>
  *{
      margin: 0;
      padding: 0;
  }
  div{
    width: 200px;
    height: 200px;
    background: red;
    margin: 100px auto;

    /* 动画执行 3 次 ,可覆盖类名中的设置*/
    animation-iteration-count: 3;
    /* 默认只有 1-5 秒,想 6s 的话就这里写,然后就覆盖了*/
	  animation-delay: 6s;
  }
  /* 自定义动画的方法 */
  @keyframes myFadeIn {
      from {
          opacity: 0;
          transform: scale(2);
      }

      to {
          opacity: 1;
          transform: scale(1);
      }
  }
  .myFadeIn {
      -webkit-animation-name: myFadeIn;
      animation-name: myFadeIn;
  }
</style>
</head>
<body>
  <!--
  1. 先写基类名称 animated
  2. 写要执行动画的动画类名
  -->
  <!--
  infinite 无限执行动画
  delay-3s 延时几秒执行,1-5 秒可选
  -->
  <div class="animated bounce infinite delay-3s"></div>

  <!-- 自定义动画的, 基类后面写入 自己的类-->
  <div class="animated myFadeIn"></div>
</body>
</html>
~~~

