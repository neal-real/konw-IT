## 动画事件

> 动画事件的监听,写在第三个参数的配置中

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>05-GSAP动画常用事件</title>
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
<script>
  let obj = {name: "lnj"};
  TweenMax.to(".box", 3, {
    x: 500,
    delay: 3,
    onStart:function(a, b, c){
      console.log("动画开始了", a, b, c);
      // this 默认指向调用的动画对象, 这里是 TweenMax
      console.log(this);
    },
    // 传值给 onStart 事件
    onStartParams:["123", "456", "789"],
    // 修改 this 的指向给 obj
    onStartScope: obj,
  });
</script>
</body>
</html>
```

