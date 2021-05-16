## 1.通过createElement创建元素存在的问题?

- 如果结构比较简单还好, 但是如果结构比较复杂, 就比较难以下手, 所以大牛们就发明了JSX, 专门用来编写React中的页面结构体

## 2.什么是JSX?

- JSX === JavaScript + X === (XML) === (eXtension)
- JSX 是一个看起来很像 XML 的 JavaScript 语法扩展

## 3.为什么要使用JSX?

- 使用JSX使得我们在React中编写页面结构更为简单、灵活
- JSX 是类型安全的，在编译过程中就能发现错误
- JSX 执行更快，因为它在编译为 JavaScript 代码后进行了优化
- 防止XSS注入攻击

https://zh-hans.reactjs.org/docs/introducing-jsx.html

## 4.JSX本质?

- 浏览器只认识JS不认识JSX, 所以我们编写的JSX代码是无法在浏览器中执行的
- 为了解决这个问题, 我们需要借助babel将JSX转换成JS, 也就是转换成React.createElement();

https://zh-hans.reactjs.org/docs/react-without-jsx.html
https://babeljs.io/repl/

## 5.如何在项目中将JSX转换成JS?

- 导入babel.js
- 在script标签上添加type="text/babel"

## 示例

1. 导入babel.js

```js
<div id="app"></div>
<script type="text/babel">
  // 1.创建虚拟DOM
  let message = '知播渔123';
function myRender() {
  // let oDiv = React.createElement('div', null, message);
  // let oBtn = React.createElement('button', null, '按钮');
  // let oRoot = React.createElement('div', {onClick:myFn}, oDiv, oBtn);
  // 此写法 等于上面的写法
  let oRoot = (
    <div>
		// 使用变量的方式 {}
    <div>{message}</div>
    // 使用绑定事件的方法
    <button onClick={myFn}>按钮</button>
</div>
)

ReactDOM.render(oRoot, document.getElementById('app'), ()=>{
  console.log('已经将虚拟DOM转换成了真实DOM, 已经渲染到界面上了');
});
}
myRender();
function myFn() {
  message = 'www.it666.com';
  myRender();
}
</script>
```

