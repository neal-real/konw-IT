模板引擎

## art-template模板

> 使用前先安装
>
> npm install art-template express-art-template

~~~js
const express = require('express');
const path = require('path');
const app = express();

// 1.告诉express框架使用什么模板引擎渲染什么后缀的模板文件
//  参数1.模板后缀
//  参数2.使用的模板疫情
app.engine('art', require('express-art-template'))
// 2.告诉express框架模板存放的位置是什么
// 第一个views是express框架的固定项写法, 第二个views是文件夹名
app.set('views', path.join(__dirname, 'views'))
// 3.告诉express框架模板的默认后缀是什么
app.set('view engine', 'art');

app.get('/index', (req, res) => {
	// 1. 拼接模板路径
	// 2. 拼接模板后缀
	// 3. 哪一个模板和哪一个数据进行拼接
	// 4. 将拼接结果响应给了客户端
	res.render('index', {
		msg: 'message'
	})
});

app.get('/list', (req, res) => {
	res.render('list', {
		msg: 'list page'
	})
})


// 端口监听
app.listen(3000);
~~~





## 公共数据



### **app.locals** **对象**

> 将变量设置到app.locals对象下面，这个数据在所有的模板中都可以获取到。

~~~js
 app.locals.users = [{
     name: '张三',
     age: 20
 },{
     name: '李四',
     age: 20
}]

~~~

