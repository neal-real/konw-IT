# 消息通信

通信主页：https://developer.chrome.com/extensions/messaging



## 7.1. 互相通信概览


注：`-`表示不存在或者无意义，或者待验证。

|                 | injected-script                       | content-script                              | popup-js                                          | background-js                                     |
| --------------- | ------------------------------------- | ------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| injected-script | -                                     | window.postMessage                          | -                                                 | -                                                 |
| content-script  | window.postMessage                    | -                                           | chrome.runtime.sendMessage chrome.runtime.connect | chrome.runtime.sendMessage chrome.runtime.connect |
| popup-js        | -                                     | chrome.tabs.sendMessage chrome.tabs.connect | -                                                 | chrome.extension. getBackgroundPage()             |
| background-js   | -                                     | chrome.tabs.sendMessage chrome.tabs.connect | chrome.extension.getViews                         | -                                                 |
| devtools-js     | chrome.devtools. inspectedWindow.eval | -                                           | chrome.runtime.sendMessage                        | chrome.runtime.sendMessage                        |

## 7.2. 通信详细介绍

### 7.2.1. popup和background

popup可以直接调用background中的JS方法，也可以直接访问background的DOM：

```javascript
// background.js
function test()
{
	alert('我是background！');
}

// popup.js
var bg = chrome.extension.getBackgroundPage();
bg.test(); // 访问bg的函数
alert(bg.document.body.innerHTML); // 访问bg的DOM
```

> 小插曲，今天碰到一个情况，发现popup无法获取background的任何方法，找了半天才发现是因为background的js报错了，而你如果不主动查看background的js的话，是看不到错误信息的，特此提醒。

至于`background`访问`popup`如下（前提是`popup`已经打开）：

```javascript
var views = chrome.extension.getViews({type:'popup'});
if(views.length > 0) {
	console.log(views[0].location.href);
}
```

### 7.2.2. popup或者bg向content主动发送消息

background.js或者popup.js：

```javascript
function sendMessageToContentScript(message, callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		chrome.tabs.sendMessage(tabs[0].id, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}
sendMessageToContentScript({cmd:'test', value:'你好，我是popup！'}, function(response)
{
	console.log('来自content的回复：'+response);
});
```

`content-script.js`接收：

```javascript
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	// console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
	if(request.cmd == 'test') alert(request.value);
	sendResponse('我收到了你的消息！');
});
```

双方通信直接发送的都是JSON对象，不是JSON字符串，所以无需解析，很方便（当然也可以直接发送字符串）。

> 网上有些老代码中用的是`chrome.extension.onMessage`，没有完全查清二者的区别(貌似是别名)，但是建议统一使用`chrome.runtime.onMessage`。

### 7.2.3. content-script主动发消息给后台

content-script.js：

```javascript
chrome.runtime.sendMessage({greeting: '你好，我是content-script呀，我主动发消息给后台！'}, function(response) {
	console.log('收到来自后台的回复：' + response);
});
```

background.js 或者 popup.js：

```javascript
// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自content-script的消息：');
	console.log(request, sender, sendResponse);
	sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});
```

注意事项：

- content_scripts向`popup`主动发消息的前提是popup必须打开！否则需要利用background作中转；
- 如果background和popup同时监听，那么它们都可以同时收到消息，但是只有一个可以sendResponse，一个先发送了，那么另外一个再发送就无效；

### 7.2.4. injected script和content-script

`content-script`和页面内的脚本（`injected-script`自然也属于页面内的脚本）之间唯一共享的东西就是页面的DOM元素，有2种方法可以实现二者通讯：

1. 可以通过`window.postMessage`和`window.addEventListener`来实现二者消息通讯；
2. 通过自定义DOM事件来实现；

第一种方法（推荐）：

`injected-script`中：

```javascript
window.postMessage({"test": '你好！'}, '*');
```

content script中：

```javascript
window.addEventListener("message", function(e)
{
	console.log(e.data);
}, false);
```

第二种方法：

`injected-script`中：

```javascript
var customEvent = document.createEvent('Event');
customEvent.initEvent('myCustomEvent', true, true);
function fireCustomEvent(data) {
	hiddenDiv = document.getElementById('myCustomEventDiv');
	hiddenDiv.innerText = data
	hiddenDiv.dispatchEvent(customEvent);
}
fireCustomEvent('你好，我是普通JS！');
```

`content-script.js`中：

```javascript
var hiddenDiv = document.getElementById('myCustomEventDiv');
if(!hiddenDiv) {
	hiddenDiv = document.createElement('div');
	hiddenDiv.style.display = 'none';
	document.body.appendChild(hiddenDiv);
}
hiddenDiv.addEventListener('myCustomEvent', function() {
	var eventData = document.getElementById('myCustomEventDiv').innerText;
	console.log('收到自定义事件消息：' + eventData);
});
```

## 7.3. 长连接和短连接

其实上面已经涉及到了，这里再单独说明一下。Chrome插件中有2种通信方式，一个是短连接（`chrome.tabs.sendMessage`和`chrome.runtime.sendMessage`），一个是长连接（`chrome.tabs.connect`和`chrome.runtime.connect`）。

短连接的话就是挤牙膏一样，我发送一下，你收到了再回复一下，如果对方不回复，你只能重新发，而长连接类似`WebSocket`会一直建立连接，双方可以随时互发消息。

短连接上面已经有代码示例了，这里只讲一下长连接。

popup.js：

```javascript
getCurrentTabId((tabId) => {
	var port = chrome.tabs.connect(tabId, {name: 'test-connect'});
	port.postMessage({question: '你是谁啊？'});
	port.onMessage.addListener(function(msg) {
		alert('收到消息：'+msg.answer);
		if(msg.answer && msg.answer.startsWith('我是'))
		{
			port.postMessage({question: '哦，原来是你啊！'});
		}
	});
});
```

content-script.js：

```javascript
// 监听长连接
chrome.runtime.onConnect.addListener(function(port) {
	console.log(port);
	if(port.name == 'test-connect') {
		port.onMessage.addListener(function(msg) {
			console.log('收到长连接消息：', msg);
			if(msg.question == '你是谁啊？') port.postMessage({answer: '我是你爸！'});
		});
	}
});
```

# 其它补充

## 8.1. 动态注入或执行JS

虽然在`background`和`popup`中无法直接访问页面DOM，但是可以通过`chrome.tabs.executeScript`来执行脚本，从而实现访问web页面的DOM（注意，这种方式也不能直接访问页面JS）。

示例`manifest.json`配置：

```javascript
{
	"name": "动态JS注入演示",
	...
	"permissions": [
		"tabs", "http://*/*", "https://*/*"
	],
	...
}
```

JS：

```javascript
// 动态执行JS代码
chrome.tabs.executeScript(tabId, {code: 'document.body.style.backgroundColor="red"'});
// 动态执行JS文件
chrome.tabs.executeScript(tabId, {file: 'some-script.js'});
```

## 8.2. 动态注入CSS

示例`manifest.json`配置：

```javascript
{
	"name": "动态CSS注入演示",
	...
	"permissions": [
		"tabs", "http://*/*", "https://*/*"
	],
	...
}
```

JS代码：

```javascript
// 动态执行CSS代码，TODO，这里有待验证
chrome.tabs.insertCSS(tabId, {code: 'xxx'});
// 动态执行CSS文件
chrome.tabs.insertCSS(tabId, {file: 'some-style.css'});
```

## 8.3. 获取当前窗口ID

```javascript
chrome.windows.getCurrent(function(currentWindow)
{
	console.log('当前窗口ID：' + currentWindow.id);
});
```

## 8.4. 获取当前标签页ID

一般有2种方法：

```javascript
// 获取当前选项卡ID
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}
```

获取当前选项卡id的另一种方法，大部分时候都类似，只有少部分时候会不一样（例如当窗口最小化时）

```javascript
// 获取当前选项卡ID
function getCurrentTabId2()
{
	chrome.windows.getCurrent(function(currentWindow)
	{
		chrome.tabs.query({active: true, windowId: currentWindow.id}, function(tabs)
		{
			if(callback) callback(tabs.length ? tabs[0].id: null);
		});
	});
}
```

## 8.5. 本地存储

本地存储建议用`chrome.storage`而不是普通的`localStorage`，区别有好几点，个人认为最重要的2点区别是：

- `chrome.storage`是针对插件全局的，即使你在`background`中保存的数据，在`content-script`也能获取到；
- `chrome.storage.sync`可以跟随当前登录用户自动同步，这台电脑修改的设置会自动同步到其它电脑，很方便，如果没有登录或者未联网则先保存到本地，等登录了再同步至网络；

需要声明`storage`权限，有`chrome.storage.sync`和`chrome.storage.local`2种方式可供选择，使用示例如下：

```javascript
// 读取数据，第一个参数是指定要读取的key以及设置默认值
chrome.storage.sync.get({color: 'red', age: 18}, function(items) {
	console.log(items.color, items.age);
});
// 保存数据
chrome.storage.sync.set({color: 'blue'}, function() {
	console.log('保存成功！');
});
```

## 8.6. webRequest

通过webRequest系列API可以对HTTP请求进行任性地修改、定制，这里通过`beforeRequest`来简单演示一下它的冰山一角：

```javascript
//manifest.json
{
	// 权限申请
	"permissions":
	[
		"webRequest", // web请求
		"webRequestBlocking", // 阻塞式web请求
		"storage", // 插件本地存储
		"http://*/*", // 可以通过executeScript或者insertCSS访问的网站
		"https://*/*" // 可以通过executeScript或者insertCSS访问的网站
	],
}


// background.js
// 是否显示图片
var showImage;
chrome.storage.sync.get({showImage: true}, function(items) {
	showImage = items.showImage;
});
// web请求监听，最后一个参数表示阻塞式，需单独声明权限：webRequestBlocking
chrome.webRequest.onBeforeRequest.addListener(details => {
	// cancel 表示取消本次请求
	if(!showImage && details.type == 'image') return {cancel: true};
	// 简单的音视频检测
	// 大部分网站视频的type并不是media，且视频做了防下载处理，所以这里仅仅是为了演示效果，无实际意义
	if(details.type == 'media') {
		chrome.notifications.create(null, {
			type: 'basic',
			iconUrl: 'img/icon.png',
			title: '检测到音视频',
			message: '音视频地址：' + details.url,
		});
	}
}, {urls: ["<all_urls>"]}, ["blocking"]);
```

## 8.7. 国际化

插件根目录新建一个名为`_locales`的文件夹，再在下面新建一些语言的文件夹，如`en`、`zh_CN`、`zh_TW`，然后再在每个文件夹放入一个`messages.json`，同时必须在清单文件中设置`default_locale`。

`_locales\en\messages.json`内容：

```javascript
{
	"pluginDesc": {"message": "A simple chrome extension demo"},
	"helloWorld": {"message": "Hello World!"}
}
```

`_locales\zh_CN\messages.json`内容：

```javascript
{
	"pluginDesc": {"message": "一个简单的Chrome插件demo"},
	"helloWorld": {"message": "你好啊，世界！"}
}
```

在`manifest.json`和`CSS`文件中通过`__MSG_messagename__`引入，如：

```javascript
{
	"description": "__MSG_pluginDesc__",
	// 默认语言
	"default_locale": "zh_CN",
}
```

JS中则直接`chrome.i18n.getMessage("helloWorld")`。

测试时，通过给chrome建立一个不同的快捷方式`chrome.exe --lang=en`来切换语言，如：

![img](https://images2015.cnblogs.com/blog/352797/201707/352797-20170711102158259-417770023.png)

英文效果：

![img](https://images2015.cnblogs.com/blog/352797/201707/352797-20170711102210868-1502746521.png)

中文效果：

![img](https://images2015.cnblogs.com/blog/352797/201707/352797-20170711102221478-1089926751.png)

## 8.8. API总结

比较常用用的一些API系列：

- chrome.tabs
- chrome.runtime
- chrome.webRequest
- chrome.window
- chrome.storage
- chrome.contextMenus
- chrome.devtools
- chrome.extension