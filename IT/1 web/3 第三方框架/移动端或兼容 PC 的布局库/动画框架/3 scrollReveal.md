## 什么是scrollReveal

> scrollReveal是一个兼容PC端和移动设备的滚动动画库。不同的是 WOW.js 的动画只播放一次，而 scrollReveal.js 的动画可以播放一次或无限次；

## scrollReveal特点

1. 同时兼容PC端和移动端
2. 0依赖（不依赖于jQuery，也不依赖于animate.css）
3.  定制性高，使用简单方便快捷
4. 和animte.css, WoW一样, 不支持低版本浏览器(IE10+)

## 使用步骤

1. 引入框架
2. 搭建结构体
3. 创建ScrollReveal对象
4. 调用ScrollReveal对象的reveal方法, 将需要执行动画的元素给它

## 什么是动画重置?

- 执行动画的元素离开屏幕之后就会被重置
- 重置就是重新设置为动画开始之前的默认样式

## scrollReveal配置

| 属性     | 值类型        | 作用                                                         |
| -------- | ------------- | ------------------------------------------------------------ |
| reset    | boolean       | true / false元素是否在容器边界内来回滚动时都产生动画效果     |
| duration | number        | 500 动画持续时间，单位毫秒                                   |
| delay    | number        | 0 动画的延迟时间，单位毫秒                                   |
| rotate   | object/number | { x: 0, y: 0, z: 0 }  开始的角度，单位degrees                |
| opacity  | number        | 0  开始的透明度                                              |
| scale    | number        | 0.9  开始的缩放值                                            |
| distance | string        | 可用任何CSS单位值，如：’20px’,’10vw’,’5%’ 动画的距离         |
| origin   | string        | ‘top’,’right’,’bottom’,’left’ 动画的方向                     |
| easing   | string        | ‘ease’ ‘ease-out’‘ease-in-out’‘ease-in-out’ 动画的easing效果，可以是任何有效的CSS easing值 |



## scrollReveal事件

~~~js
 beforeReveal    //动画开始之前的回调
    afterReveal     //动画结束时放的回调
    beforeReset     //动画开始被重置
    afterReset      //动画重置结束
~~~





## 基本使用



~~~html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>05-ScrollRevealJS</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        div{
            width: 400px;
            height: 200px;
            line-height: 200px;
            text-align: center;
            margin: 0 auto;
        }
        div:nth-child(odd){
            background: red;
        }
        div:nth-child(even){
            background: blue;
        }
    </style>
    <script src="js/scrollreveal.js"></script>
</head>
<body>
<div>我是第1个div</div>
<div>我是第2个div</div>
<div>我是第3个div</div>
<div>我是第4个div</div>
<div>我是第5个div</div>
<div>我是第6个div</div>
<div>我是第7个div</div>
<div>我是第8个div</div>
<div>我是第9个div</div>
<script>
    let sr = ScrollReveal({
        reset: true,			// 元素是否在容器边界内来回滚动时都产生动画效果默认 false
        duration: 5000,		// 动画持续时间，单位毫秒
        // delay: 5000,		// 动画的延迟时间，单位毫秒
        rotate: {x: 0, y: 0, z: 45},		//开始的角度，单位degrees
        opacity: 0.5,		// 开始的透明度
        scale: 2,				//	开始的缩放值
        distance: "500px",	// 可用任何CSS单位值，如：’20px’,’10vw’,’5%’	动画的距离
        origin: "left",		// ‘top’,’right’,’bottom’,’left’	动画的方向
        easing: "ease-in-out",	// 动画的easing效果，可以是任何有效的CSS easing值
        beforeReveal: function (ele) {
            // 动画开始之前的回调
            // console.log("动画开始之前", ele);
        },
        afterReveal: function (ele) {
            // 动画结束之后的回调
            // console.log("动画结束之后", ele);
        },
        beforeReset: function (ele) {
            // 动画元素被重置之前的回到
            // console.log("动画元素被重置", ele);
        },
        afterReset: function (ele) {
            // 动画元素被重置之后的回到
            console.log("动画元素被重置", ele);
        },
    });
    sr.reveal('div');
</script>
</body>
</html>
~~~

