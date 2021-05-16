## 1.使用React的几种方式?

- 自行配置
    + https://zh-hans.reactjs.org/docs/add-react-to-a-website.html
    + 点击右侧在网站中添加 react.然后跟着步骤做即可
- 通过脚手架自动配置
    + https://zh-hans.reactjs.org/docs/create-a-new-react-app.html



## 2. react.js和react-dom.js

- react.js包含了React和React-Native所共同拥有的核心代码, 主要用于'生成虚拟DOM'
- react-dom.js包含了针对不同平台渲染不同内容的核心代码, 主要用于'将虚拟DOM转换为真实DOM'
- 简而言之:
    + 利用react.js编写界面(创建虚拟DOM)
    + 利用react-dom.js渲染界面(创建真实DOM) 虚拟 DOM 会转成客户端对应的元素



## 3.React如何创建DOM元素?

- 在React中, 我们不能通过 HTML标签 直接创建DOM元素
- 在React中, 我们必须先通过react.js创建虚拟DOM, 在通过react-dom.js渲染元素(创建真实DOM)

## 4.如何通过react.js创建虚拟DOM?

- 通过React.createElement()方法
- 该方法接收3个参数
    + 第一个参数: 需要创建的元素类型或组件
    + 第二个参数: 被创建出来的元素拥有的属性
    + 第三个参数: 被创建出来的元素拥有的内容(可以是多个)

https://zh-hans.reactjs.org/docs/react-api.html#createelement

## 5.如何通过react-dom.js渲染虚拟DOM?

- 通过 ReactDOM.render()方法
- 该方法接收3个参数
    + 第一个参数: 被渲染的虚拟DOM
    + 第二个参数: 要渲染到哪个元素中
    + 第三个参数: 渲染或更新完成后的回调函数

https://zh-hans.reactjs.org/docs/react-dom.html#render

## 6.如何给元素添加监听?

- 给元素添加监听的本质就是给元素添加属性
  所以可以在createElement()的第二个参数中添加

```js
- <button onclick="btnClick">按钮</button>
- React.createElement('button', {onClick: btnClick}, '按钮');

注意事项:
如果想给元素绑定事件, 那么事件名称必须是驼峰命名
```



## 示例

````html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="../react17/react.development.v17.js"></script>
    <script src="../react17/react-dom.development.v17.js"></script>
</head>
<body>
<div id="app"></div>
<script>
    // 1.创建虚拟DOM
    let message = '知播渔';
    // <div>知播渔</div>
    let oDiv = React.createElement('div', null, message);

    // 2.将虚拟DOM转换成真实DOM
    ReactDOM.render(oDiv, document.getElementById('app'), ()=>{
        console.log('已经将虚拟DOM转换成了真实DOM, 已经渲染到界面上了');
    });
</script>
</body>
</html>

````



### 1.render方法注意点

- 多次渲染, 后渲染会覆盖先渲染
- render方法一次只能渲染一个元素/组件

### 2.createElement方法注意点

\- 可以添加3个以上参数, 后续参数都会作为当前创建元素内容处理

### 3.如何给元素添加监听?

- 给元素添加监听的本质就是给元素添加属性
-  所以可以在createElement()的第二个参数中添加

- `<button onclick="btnClick">按钮</button>`
- React.createElement('button', {onClick: btnClick}, '按钮');

### 注意事项:

如果想给元素绑定事件, 那么事件名称必须是驼峰命名

### 多个元素创建示例

- 注意点: 如果想通过React绑定事件, 那么事件名称必须是驼峰命名
- {onClick:myFn}  : React绑定事件, 事件名称必须是驼峰命名

```js

// 1.创建虚拟DOM
let message = '知播渔';
let oDiv = React.createElement('div', null, message);
let oBtn = React.createElement('button', null, '按钮');
// 注意点: 默认createElement方法只能接收3个参数, 但是我们也可以传递3个以上的参数
//        如果我们传递了3个以上参数, 那么从第3个开始都会当做是内容来处理
/*    React.createElement(type, [props], [...children])		* */
let oRoot = React.createElement('div', {onClick:myFn}, oDiv, oBtn);

// 2.将虚拟DOM转换成真实DOM
ReactDOM.render(oRoot, document.getElementById('app'), ()=>{
  console.log('已经将虚拟DOM转换成了真实DOM, 已经渲染到界面上了');
});
function myFn() {
  message = 'www.it666.com';
  // 注意点: 默认情况下载React中, 修改完数据之后, 是不会自动更新界面的
  let oDiv = React.createElement('div', null, message);
  let oBtn = React.createElement('button', null, '按钮');
  let oRoot = React.createElement('div', {onClick:myFn}, oDiv, oBtn);
  ReactDOM.render(oRoot, document.getElementById('app'), ()=>{
    console.log('已经将虚拟DOM转换成了真实DOM, 已经渲染到界面上了');
  });
}
// 注意点: render方法最多只能接收3个参数, 所以不能同时渲染多个元素
// ReactDOM.render(oDiv, oBtn, document.getElementById('app'), ()=>{
//     console.log('已经将虚拟DOM转换成了真实DOM, 已经渲染到界面上了');
// });
// 注意点: 如果多次调用render方法, 那么后渲染的会覆盖先渲染的
// ReactDOM.render(oBtn, document.getElementById('app'), ()=>{
//     console.log('已经将虚拟DOM转换成了真实DOM, 已经渲染到界面上了');
// });

```

