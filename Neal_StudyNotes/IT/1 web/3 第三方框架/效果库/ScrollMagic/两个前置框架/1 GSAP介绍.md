## 什么是GSAP?

> GSAP(GreenSock Animation Platform)是一个从flash时代一直发展到今天的专业动画库
>
> 是一个通过 JS 实现的动画库

## GSAP优点

1. 速度快。GSAP专门优化了动画性能，使之实现和CSS一样的高性能动画效果。
2. 轻量与模块化。模块化与插件式的结构保持了核心引擎的轻量，TweenLite包非常小（基本上低于7kb）。GSAP提供了`TweenLite`,` TimelineLite`,` TimelineMax` 和 `TweenMax`不同功能的动画模块，你可以按需使用。
3. 没有依赖。
4. 灵活控制。不用受限于线性序列，可以重叠动画序列，你可以通过精确时间控制，灵活地使用最少的代码实现动画。

## GSAP版本

- GSAP提供4个库文件供用户使用

1. TweenLite：这是GSAP动画平台的核心部分，使用它可以用来实现大部分的动画效果，适合来实现一些元素的简单动画效果。
2. TimelineLite：一个强大的，轻量级的序列工具，它就如一个存放补间动画的容器，可以很容易的整体控制补间动画，且精确管理补间动画彼此之间的时间关系。比如动画的各种状态，Pause，reverse，restart，speed up，slow down，seek time，add labels等。它适合来实现一些复杂的动画效果。
3. TimelineMax：扩展TimelineLite，提供完全相同的功能再加上有用的（但非必需）功能，如repeat，repeatDelay，yoyo，currentLabel()等。TimelineMax的目标是成为最终的全功能工具，而不是轻量级的。
4. TweenMax：可以完成TimelineLite做的每一件事，并附加非必要的功能，如repeat，yoyo，repeatDelay(重复延迟)等。它也包括许多常见的插件，如CSSPlugin，这样您就不需自行载入多个文件。侧重于全功能的，而不是轻量级的。

> 建议在开发中使用TweenMax这个全功能的js文件，它包括了GreenSock动画平台的所有核心的功能。

## 资源地址

​    官网地址：http://www.greensock.com/

​    github地址：https://github.com/greensock/GreenSock-JS/

​    中文网: https://www.tweenmax.com.cn/