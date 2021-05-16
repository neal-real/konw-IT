> less 是一个 CSS 预处理器
>
> 增加了规则、变量、混入、选择器、继承、内置函数等等特性

## less 基本使用



### Node 环境中使用



~~~less
安装到全局环境
npm install less -g
安装在当前环境中
npm i less --save-dev
~~~



### 服务端环境



~~~js
// 1. 引入自己的 less 文件
<link rel="stylesheet/less" type="text/css" href="styles.less" />
// 2. 引入 less.js 的库文件
<script src="less.js" type="text/javascript"></script>
~~~





### 浏览器环境中使用

> 用不到

#### 方式 1

~~~html
<style type="text/less">
  div {
    span {
      background-color: skyblue;
    }
  }
</style> 
<script src="./js/less.js"></script>
~~~

#### 方式 2 

后面根本用不到

> 1. 编写 less 文件
> 2. 利用工具转换为 css 文件
> 3. 引入 css 文件

~~~
转换工具: 
考拉客户端: http://koala-app.com/index-zh.html
转换网页
https://www.matools.com/less
开源中国:https://tool.oschina.net/less
构建工具配置 loader 自动编译: 后续课程内容
注意点: 
	无需引入 less.js, 无需再服务端运行
~~~





## less 开发时的使用方法

