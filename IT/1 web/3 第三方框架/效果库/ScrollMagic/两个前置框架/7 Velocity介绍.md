## 什么是Velocity?

> Velocity 是一个简单易用、性能极高、功能丰富的轻量级JS动画库。
>
> 它能和 jQuery/Zepto 完美协作，并和$.animate()有相同的 API， 但它不依赖 jQuery，可单独使用。

## Velocity 优点    

Velocity 不仅包含了 $.animate() 的全部功能， 还拥有：颜色动画、转换动画(transforms)、循环、 缓动、SVG 动画、和 滚动动画 等特色功能

## 地址

​    官方地址: https://github.com/julianshapiro/velocity

​    中文文档: http://shouce.jb51.net/velocity/index.html



## Velocity基本使用

1. 导入Velocity文件
2. 利用Velocity实现动画
3. 两种使用方法
   1. 单独使用
   2. 配置 jquery 使用,需要先导入 jQuery

~~~js
// 单独使用, 时间单位是毫秒 3000 既是 3 秒
let oDiv = document.querySelector(".box");
Velocity(oDiv, {
    height: "300px"
}, {
    duration: 3000
});

//配合jQuery使用 : 注意点: 必须先导入jQuery, 再导入velocity
$(".box").velocity({
    height: "300px"
}, {
    duration: 3000
});
~~~

