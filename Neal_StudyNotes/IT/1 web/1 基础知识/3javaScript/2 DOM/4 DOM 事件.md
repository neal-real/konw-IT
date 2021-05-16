## 事件

> 用户和浏览器之间的交互行为我们就称之为事件,  比如：点击，移入/移出

## 事件的绑定

> 1. 在JavaScript中所有的HTML标签都可以添加事件
> 2. 元素.事件名称 = function(){}; 
> 3. 当对应事件被触发时候就会自动执行function中的代码

~~~js
// 绑定点击事件
let oBtn = document.querySelector("button");
oBtn.onclick = function () {
    alert("按钮被点击了");
}
~~~



## 监听组合键

> 监听保存组合键

~~~js
document.addEventListener('keydown', (event) => {
  console.log(event)
  var keyCode = event.keyCode || event.which || event.charCode;
  var ctrlKey = event.ctrlKey || event.metaKey;
  if (ctrlKey && keyCode == 83) {
   // 1. 注意：阻止默认事件放在外面，会阻止浏览器或者input/textarea的默认事件
   // 2. 应该放在相应的按键组合中去阻止
    event.preventDefault();
    console.log('保存')
    return false;
  }
})
~~~



## 页面关闭发出提示

> 为避免意外弹出窗口，除非页面已与之交互，否则浏览器可能不会显示在`beforeunload`事件中创建的提示，甚至根本不会显示它们

~~~js
// 设置自定义信息的方法已经废弃, 但是可以在关闭前做些什么事情
window.addEventListener("beforeunload", (e) => {
  console.log('页面要关闭了')
});
~~~



> 以下 的信息 为 true 则是按下了,用以判断组合键

~~~js
altKey: false             // alt键是否按下
ctrl Key: false           // ctrl键是否按下
metaKey: true							//command 键是否按下
shiftKey: false           // shift 键是否按下
code: "KeyR"              // 键名详细文字
key: "r"                  // 键名
keyCode: 82               // 键名对应数字代码
returnValue: false        // 返回 false 则是取消浏览器默认行为

bubbles: true             泡沫:真
cancel Bubble: false      取消泡沫:假
cancelable: true          可取消的:真
char Code: 0              字符代码:0

composed: true            组成:真

current Target: null      当前目标:零
defaultPrevented: true    默认阻止:真
detail: 0                 细节:0
eventPhase: 0             活动阶段:0
isComposing: false        作曲:假
isTrusted: true           信任:真

location: 0           		地点:0

path: (4) [body, html, document, Window]
repeat: false


sourceCapabilities: InputDeviceCapabilities {firesTouchEvents: false}
srcElement: body
target: body
timeStamp: 14090.92000000237
type: "keydown"
which: 82
~~~

