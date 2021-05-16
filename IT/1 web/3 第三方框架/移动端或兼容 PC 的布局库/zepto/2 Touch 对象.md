## Touch事件对象

> 动端的touch事件也是一个事件, 所以被触发的时候系统也会自动传递一个事件对象给我们

## 原生 Touch 事件

> 单击事件特点
>
> 1. 只有一根手指
> 2. 按下和离开时间不能太久 100ms
> 3. 按下和离开距离不能太远 5px

### touch事件的三个子对象

1. touches:        当前**屏幕上**所有手指的列表
2. targetTouches:  保存了**元素上**所有的手指里列表
3. changedTouches: 当前**屏幕上**刚刚接触的手指或者离开的手指
   - 在ontouchstart(按下)中保存的是刚刚新增的手指
   - 在ontouchend(抬起)中保存的是刚刚离开的手指

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>06-移动端Touch事件对象</title>
  <style>
    div {
      width: 150px;
      height: 150px;
      display: inline-block;
      background: red;
    }
  </style>
</head>
<body>
  <div class="box1"></div>
  <script>
    let oDiv1 = document.querySelector(".box1");
    // 手指按下 事件
    oDiv1.ontouchstart = function (event) {
      console.log("touches1", event.touches);
      console.log("targetTouches1", event.targetTouches);
    }
    oDiv1.ontouchstart = function (event) {
      console.log("按下", event.changedTouches);
    }
    oDiv1.ontouchend = function (event) {
      console.log("抬起", event.changedTouches);
    }
  </script>
</body>
</html>
~~~



### Touch事件的位置

**手指的位置**

1. screenX/screenY是相对于屏幕左上角的偏移位
2. clientX/clientY是相对于可视区域左上角的偏移位
3. pageX/pageY是相对于内容左上角的偏移位

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>07-移动端Touch事件位置</title>
<style>
  *{
      margin: 0;
      padding: 0;
  }
  div{
      width: 1000px;
      height: 100px;
      margin-left: 50px;
      margin-top: 50px;
      background: linear-gradient(to right, red, green);
  }
</style>
</head>
<body>
<div></div>
<script>
let oDiv = document.querySelector("div");
oDiv.ontouchstart = function (event) {
  // event.targetTouches[0] 返回一个伪数组,里面存放第一个Touch对象
  console.log(event.targetTouches[0]);
  // 通过 Touch 对象获得手指相对的位置坐标数
	console.log(event.targetTouches[0].screenX);
  console.log(event.targetTouches[0].screenY);
  // 这里谷歌浏览器有 bug ,在火狐浏览器和真机可以看到正常显示的值
  console.log(event.targetTouches[0].clientX); // 11
  console.log(event.targetTouches[0].clientY); // 63
  console.log(event.targetTouches[0].pageX);  // 686
  console.log(event.targetTouches[0].pageY);  // 63
}
</script>
</body>
</html>
~~~



### 练习:手指拖拽div

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>08-移动端手指位置练习</title>
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
<div></div>
<script>
    /*需求: 通过手指拖拽div*/
    let oDiv = document.querySelector("div");
    let startX = 0;
    let startY = 0;
    let flag = false;
    oDiv.ontouchstart = function (event) {
        if(flag){return}
        flag = true;
        startX = event.targetTouches[0].clientX;
        startY = event.targetTouches[0].clientY;
    }
    oDiv.ontouchmove = function (event) {
        let moveX = event.targetTouches[0].clientX;
        let moveY = event.targetTouches[0].clientY;
        let offsetX = moveX - startX;
        let offsetY = moveY - startY;
        oDiv.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
</script>
</body>
</html>
~~~



### 点透事件

1. 点透问题一般会出现在手机蒙板的情况
   1. 当一个元素放覆盖了另一个元素, 覆盖的元素监听touch事件,而下面的元素监听click事件
   2. 并且touch事件触发后覆盖的元素就消失了, 那么就会出现点透问题
2. 移动端点透问题出现的原因
   1. 当手指触摸到屏幕的时候，系统生成两个事件，一个是touch 一个是click
   2. touch事件先执行,执行完后从文档上消失
   3. click事件有100~300ms延迟, 所以后执行.
   4. 但click事件执行的时候触发的元素已经消失了, 对应的位置现在是下面的元素, 所以就触发了下面元素的click事件
3. 移动端点透问题解决方案
   1. 在touch事件中添加event.preverDefault(); 阻止事件扩散
   2. 使用Zepto, 但是需要注意老版本的Zepto也会出现点透问题
   3. 使用Fastclick, 最早解决点透问题的插件

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>10-移动端点透问题</title>
  <style>
      *{
          margin: 0;
          padding: 0;
      }
      div{
          text-align: center;
          font-size: 40px;
      }
      .click{
          width: 300px;
          height: 300px;
          background: red;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 100px;
      }
      .tap{
          width: 200px;
          height: 200px;
          background: blue;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 150px;
      }
  </style>
</head>
<body>
<div class="click">click</div>
<div class="tap">tap</div>
<script>
  let oClick = document.querySelector(".click");
  let oTap = document.querySelector(".tap");

  oTap.ontouchstart = function (event) {
      this.style.display = "none";
      //  阻止事件扩散
      event.preventDefault(); 
  }
  // 使用 zepto ,需要引入 zepto.js 和 touch.js 模块
  $(oTap).tap(function () {
      oTap.style.display = "none";
  });
  
  // 使用 Fastclick 需要先引入 Fastclick 模块
  // 注意点: 这里的click事件并不是原生的click事件, 是使用的fastclick中的click
  //         这里的click事件已经解决了100~300ms延迟的问题
  oTap.addEventListener("click", function () {
      oTap.style.display = "none";
  });
  oClick.onclick = function () {
      console.log("click");
  }
</script>
</body>
</html>
~~~



