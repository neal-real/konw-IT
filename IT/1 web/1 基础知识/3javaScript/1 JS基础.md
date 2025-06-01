## 4基础概念

1. javaScript 的使用环境
2. javaScript 的应用场景
3. javaScript 的组成
4. javaScript 的学习范围
5. javaScript 的浏览器API分类
6. javaScript 的线程和异步



## 使用环境

> 在绝大多数浏览器的支持下，可以在多种平台下运行（如[Windows](https://baike.baidu.com/item/Windows)、[Linux](https://baike.baidu.com/item/Linux)、Mac、Android、iOS等）



## 应用场景

1. **网页特效** *
2. **服务端开发(Node.js)** *
3. 命令行工具(Node.js)
4. 桌面程序(Electron)
5. App(Cordova)
6. 控制硬件-物联网(Ruff)
7. 游戏开发(cocos2d-js)





## 组成

```js
1 ECMAScript - JavaScript的核心
//ECMAScript是一套语法标准，描述了基本语法和数据类型，是JavaScript的核心。
2 BOM - 浏览器对象模型
//一套浏览器功能的API,BOM操作浏览器窗口，比如：弹出框、控制浏览器跳转、获取分辨率等
3 DOM - 文档对象模型
//页面元素的API,DOM可以把HTML看做是文档树，通过DOM提供的API可以对树上的节点进行操作
```



## 学习范围

> JS学习的内容分为两部分

1. 语言结构
   1. 语言结构部分主要时语言规则及内置对象；
2. 宿主环境提供的API
   1. 以浏览器为例 (js还可以运行在服务器/操作系统)，
      1. 浏览器控制类
      2. DOM操作类
      3. 网络控制类



![img](file:///Volumes/备份盘/project/gitHub/Neal_StudyNotes/IT/1.前端/3javaScript/ECMAScipt/img/1.1.5.png?lastModify=1616383359)



## JS基础-浏览器API

基础概念

~~~javascript
/浏览器的API的三种类型；
浏览器操控类(BOM)、页面文档操控类(DOM)、网络控制类;
/实际上提供了更多
1.文档对象模型(DOM)
2.设备API
3.通信API
4.数据管理API
5.特权API
6.已认证应用程序的私有API
~~~



## JS 的线程和异步

> - JS 中的代码都是串行代码, 前面没有执行完毕后面的不能执行
>
> - 作为浏览器脚本语言，JavaScript的主要用途是与用户互动，以及操作DOM,这决定了它只能是单线程，否则会带来很复杂的同步问题。
>
>   - 假设JS是多线程的: 
>
>     现在有一个线程要修改元素中的内容, 一个线程要删除该元素, 这时浏览器应该以哪个线程为准？



### 同步代码和异步代码

> JS除了"事件绑定的函数"和"回调函数"以外的都是同步代码

### JS 的执行顺序

1. 程序运行会从上至下依次执行所有的同步代码
2. 在执行的过程中如果遇到异步代码会将异步代码放到事件循环中
3. 当所有同步代码都执行完毕后, JS会不断检测 事件循环中的异步代码是否满足条件
4. 一旦满足条件就执行满足条件的异步代码

### JS 也是事件驱动的程序

> 在 iOS 中也是有一个类型系统循环的函数的概念.
>
> 在 JS 中也是这样有一个类型 JS 循环事件一直在监听所有的事件发生,通过不同的事件执行不同的代码

扩展阅读: https://segmentfault.com/a/1190000015042127

