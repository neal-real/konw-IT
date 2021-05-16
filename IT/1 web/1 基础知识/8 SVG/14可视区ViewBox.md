## 什么是ViewBox?

- ViewBox就是可视区域, 用户能看到的区域
- 默认情况下，可视区域的大小和内容区域大小是一致的
- 但是我们也可以手动修改可视区域的大小



## ViewBox属性格式

- viewBox="x y width height"
- x:修改可视区域x方向位置
- y:修改可视区域y方向位置
- width/height: 修改可视区域尺寸, **近大远小**

## 基础示例

### 等比缩放

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>19-SVG-ViewBox上</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        svg{
            display: block;
            margin: 0 auto;
            border: 1px solid #000;
        }
        div{
            width: 150px;
            height: 150px;
            border: 1px solid #000;
            overflow: auto;
        }
        div>p{
            white-space: nowrap;
        }
    </style>
</head>
<body>
<!-- 坐标和宽高相同,作为参考值 -->
<svg width="200" height="200" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="50" fill="red"></circle>
</svg>
 <!-- 可视区向左移动 50px -->
<svg width="200" height="200" viewBox="50 0 200 200">
    <circle cx="100" cy="100" r="50" fill="red"></circle>
</svg>
<!-- 可视区向上移动 50px -->
<svg width="200" height="200" viewBox="0 50 200 200">
    <circle cx="100" cy="100" r="50" fill="red"></circle>
</svg>
<!-- 可视区 宽高比 svg 的宽高 变大两倍  -->
<svg width="200" height="200" viewBox="0 0 400 400">
    <circle cx="100" cy="100" r="50" fill="red"></circle>
</svg>
<!-- 可视区 宽高比 svg 的宽高 一半  -->
<svg width="200" height="200" viewBox="0 0 100 100">
    <circle cx="100" cy="100" r="50" fill="red"></circle>
</svg>
</body>
</html>
~~~

### 非等比缩放

> viewBox的尺寸不是等比缩放的, 那么系统就会调整viewBox的位置, 我们设置的x/y会失效
>
> 使用`preserveAspectRatio`属性来设置对齐方式: **设置的是注意没空格和大写**
>
> - preserveAspectRatio 第一个参数
>   - xMin	viewport和viewBox左边对齐
>   - xMid	viewport和viewBox x轴中心对齐
>   - xMax	viewport和viewBox右边对齐
>   - YMin	viewport和viewBox上边缘对齐。注意Y是大写。
>   - YMid	viewport和viewBox y轴中心点对齐。注意Y是大写。
>   - YMax	viewport和viewBox下边缘对齐。注意Y是大写。
> - preserveAspectRatio 第二个参数
>   - meet	保持纵横比缩放viewBox适应viewport，受
>   - slice	保持纵横比同时比例小的方向放大填满viewport，攻
>   - none	扭曲纵横比以充分适应viewport，变态

~~~HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>20-SVG-ViewBox下</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        svg{
            display: block;
            margin: 0 auto;
            border: 1px solid #000;
        }
    </style>
</head>
<body>
<!-- 让 x 和 y 都是 0 对齐 -->
<svg width="200" height="200" viewBox="0 0 50 150" preserveAspectRatio="xMinYMin">
    <circle cx="50" cy="50" r="50" fill="red"></circle>
</svg>
<!-- 让 x 和 y 都是 0 对齐 -->
<svg width="200" height="200" viewBox="0 0 150 50" preserveAspectRatio="xMinYMin">
    <circle cx="50" cy="50" r="50" fill="red"></circle>
</svg>

</body>
</html>
~~~

