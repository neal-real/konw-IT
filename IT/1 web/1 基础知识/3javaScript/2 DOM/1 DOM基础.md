>  文档对象模型 (DOM)

## 1 基本概念

~~~JavaScript
#DOM是JavaScript操作网页的接口，全称为“文档对象模型”(Document Object Model);
//它的作用是将网页转为一个JavaScript对象，从而可以用 #脚本# 进行操作(增删改查)
1.浏览器会根据DOM模型，将结构化文档(比如HTML和XML)解析成一系列的节点,再由这些节点组成一个树状结构(DOM Tree),所有的节点和最终的树状结构，都有规范的对外接口
2.JavaScript是一门编程语言，而DOM是浏览器对HTML文档结构化后的一个模型; 
3.严格地说，DOM不属于JavaScript，但是我们最常用的就是使用JavaScript操作DOM; 
~~~



<img src="../../../../../../../../../Users/Equal/Desktop/markdown/img/20180526-215645.png" alt="20180526-215645" style="zoom:40%;" />

## 2 节点的概念

1. DOM的最小组成单位叫做节点(node)。

2. 最顶层的是document节点，它代表了整个文档；是文档的根节点。

   1. 每张网页都有自己的document节点，window.document属性就指向这个节点的。

3. 只要浏览器开始载入HTML文档，这个节点对象就存在了，可以直接调用。 

4. 每一个HTML标签元素，在DOM树上都会转化成一个Element节点对象; 

5. 文档里面最高一层一般是HTML标签，其他HTML标签节点都是它的下级;

6. 根节点以外，其他节点对于周围的节点都存在三种关系:

   1. ~~~js
      父节点关系(parentNode):直接的那个上级节点 
      子节点关系(childNodes):直接的下级节点 
      同级节点关系(sibling):拥有同一个父节点的节点
      ~~~

7. 节点分类

   1. > 节点的类型有三种

   2. ~~~js
      文本节点 : 类型数字:3 // 3 是元素和元素之间存在的内容.内容则是包含换行符空格在内的内容.
      元素节点: 类型数字 1
      属性节点: 类型是 2  // 废弃
      // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
      ~~~

   3. 







## 3 常用dom操作

* 获取页面元素，注册事件

* 属性操作，样式操作

* 节点属性，节点层级

* 动态创建元素

* 事件：注册事件的方式、事件的三个阶段、事件对象 

  ~~~js
  `User Interface`  用户界面，我们所看到的浏览器
  `Browser engine`  浏览器引擎，用来查询和操作渲染引擎
  `Rendering engine` 用来显示请求的内容，负责解析HTML、CSS，并把解析的内容显示出来
  `Networking`   网络，负责发送网络请求
  `JavaScript Interpreter(解析者)`   JavaScript解析器，负责执行JavaScript的代码
  `UI Backend`   UI后端，用来绘制类似组合框和弹出窗口
  `Data Persistence(持久化)`  数据持久化，数据存储  cookie、HTML5中的sessionStorage
  ~~~

