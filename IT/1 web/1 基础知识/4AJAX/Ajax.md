---
typora-root-url: ./images
---

## Ajax

> AJAX  是与服务器交换数据并更新部分网页的艺术,在不重新加载整个页面的情况下
>
> 

使用方法

1. 创建一个异步对象
2. 设置请求方式和请求地址
3. 发送请求
4. 监听状态的变化
   1. onreadystatechange事件 有 4 中状态和 1 个响应码属性
      - 0: 请求未初始化
      - 1: 服务器连接已建立
      - 2: 请求已接收
      - 3: 请求处理中
      - 4: 请求已完成，且响应已就绪
5. 处理返回的结果

~~~js
// 1. 创建一个异步对象
var xmlHttp = new XMLHttpRequest();
// 2. 设置open(请求方式,请求地址,是否异步)
xmlHttp.open('POST', '', true)
// 3. 发送请求
xmlHttp.send();
// 4. 监听状态的变化
xmlHttp.onreadystatechange = function (ev2){
  // 4.1 判断事件在哪个状态中
 if(xmlHttp.readyState === 4) { 
 // 进来就是 4 号状态
 }
  // 5. 处理返回的结果
  consolo.log("接收服务器返回的结果")
}


~~~



















## 发送网络请求



#### ajax在跨域请求时,携带cookie

>  	1. ajax请求发送跨域请求, 默认情况不会在请求中携带cookie信息,避免被窃取
>   		1. 在同一个网站有跨域浏览内容时就会有确认登录状态的需要.
>  	2. 在跨域的情况下需要cookie要设置客户端的请求.withCredentials属性为ture,携带cookie信息(默认值: fals)
>  	3. 在服务端也需要 设置请求头 access-Control-Allow_Credentials:true (允许客户端发送请求时携带icookie)











## jquery 的使用

### 1. 基本使用

> 	1. 基本使用
>  	2. 请求拦截beforeSend 属性
>  	3. jquery 的使用会自动处理跨域问题.

~~~js


$.ajax({
				// 请求方式 取值:post , get
				type: 'post',
				// 请求地址 :在第一次请求后,网站根地址会被缓存,使用省略写法
				url: 'http://www.***.cn/base',
				data: JSON.stringify(params),
 			  // 在请求发送之前调用
				beforeSend: function () {
					// 这里拦截请求,处理数据或逻辑,出来完成返回true,完不成返回flase拦截请求
					// 返回false 请求被拦击不会被发送
					return false;
				},
  			// 请求成功以后函数被调用
				success: function (response) {
					// response为服务器端返回的数据
					// 方法内部会自动将json字符串转换为json对象
					console.log(response);
				},
				// 请求失败以后函数被调用
				error: function (xhr) {
					console.log(xhr)
				}
			})
/*
*	向服务器端发送的请求参数:无论写成 name=zhangsan&age=100或json 最后都会变成格式:name=zhangsan&age=100
*
*/ 
~~~

### 2. 服务器要JSON格式数据

>1. 指定类型JSON类型的数据 : contentType: 'application/json',
>2. JSON.stringify(params)方式转换 变量

~~~js

var params = {name: 'wangwu', age: 300}
		$('#btn').on('click', function () {
			$.ajax({
				// 请求方式
				type: 'post',
				// 请求地址
				url: '/user',
				data: JSON.stringify(params),
				// 指定参数的格式类型 默认值:contentType: 'application/x-www-form-urlencoded'
				contentType: 'application/json',
				// 请求成功以后函数被调用
				success: function (response) {
					// response为服务器端返回的数据
					// 方法内部会自动将json字符串转换为json对象
					console.log(response);
				}
			})
		});
~~~



### 3. 将表单内容拼接成数据的两种方式

#### 1.字符串类型

~~~js
	$('#form').on('submit', function () {
			// 将表单内容拼接成字符串类型的参数
			var params = $('#form').serialize();
			console.log(params) //格式为字符类型数据: username=zhangsan&password=123456
			return false;
		});
~~~

#### 2. 对象类型 封装方法

~~~js
# 使用 
	$('#form').on('submit', function () {
			serializeObject($(this));
			return false;
		});

#封装
// 将表单中用户输入的内容转换为对象类型
		function serializeObject (obj) {
			// 处理结果对象
			var result = {};
      // serializeArray方法可以将表单的非隐藏,提交等无意义内容过滤将表单的name和值作为数组对象保存返回
			// [{name: 'username', value: '用户输入的内容'}, {name: 'password', value: '123456'}]
			var params = obj.serializeArray();

			// 循环数组 将数组转换为对象类型
			$.each(params, function (index, value) {
				result[value.name] = value.value;
			})
			// 将处理的结果返回到函数外部
			return result;
		}
~~~



### 4.发送JSOP格式

> 

~~~js
	$.ajax({
		    url: 'jsonp',
				// 请求方式
				dataType: 'jsonp',
				// 第一个可选参数 向服务器传递函数名的参数名称 !!参数名称
    		jsonp:'cb'
				// 第二个可选参数 可选参数,如果服务器不用callback,可设置
    		jsonCallback: 'fnName'
				data: JSON.stringify(params),
				// 指定参数的格式类型 默认值:contentType: 'application/x-www-form-urlencoded'
				contentType: 'application/json',
				// 请求成功以后函数被调用
				success: function (response) {
					// response为服务器端返回的数据
					// 方法内部会自动将json字符串转换为json对象
					console.log(response);
				}
			})
~~~

### 5. 快捷方法:get和post请求

~~~js
$.get('http://www.example.com', {name: 'zhangsan', age: 30}, function (response) {}) 

$.post('http://www.example.com', {name: 'lisi', age: 22}, function (response) {})

~~~

### 6. 请求数据的等待,可用事件

> 在请求等待的过程,可用使用进度条配合使用
~~~php+HTML
# 通过第三方插件NProgress 来表示进度条
使用NProgress方法
1. 引入css样式
<link rel="stylesheet" href="/js/nprogress/nprogress.css">
2. 引入js文件
<script src="/js/nprogress/nprogress.js"></script>
~~~

使用
~~~js
//一定要 document 去监听,否则无效
// 当页面中有ajax请求发送时触发
$(document).on('ajaxStart', function () {
  NProgress.start() 
})

// 当页面中有ajax请求完成时触发
$(document).on('ajaxComplete', function () {
  NProgress.done() 
})


~~~



