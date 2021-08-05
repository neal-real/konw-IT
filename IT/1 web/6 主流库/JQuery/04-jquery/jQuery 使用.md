#	 jQuery 使用

### 下载安装和版本区别

官网下载地址：<http://jquery.com/download/>

jquery大版本分为1.x和2.x和3.x

**区别：2.x3.x版本不再支持IE6/7/8，在中国，用的最多的还是1.x版本**

~~~	
jQuery每一个版本又分为压缩版和未压缩版：
	jquery.js：未压缩版本（开发版本），代码可读性高，推荐在开发和学习阶段使用，方便查看源代码。
	jquery.min.js：压缩版本，去除了注释、换行、空格、并且将一些变量替换成了a,b,c之类的简单字符，基本没有可读性，推荐在项目生产环境使用，因为文件较小，减少网络压力。
需要兼容IE6-8，你可以继续使用1.12版本。底部有旧版本的网页
~~~

### 使用前的准备

##### 1、引用

~~~
本地：<script src="jquery-1.10.2.min.js"></script>
网络：<script src="https://***.js"></script> //查询网络
~~~

##### 2、写入口函数

~~~
<script
	$(document).ready(function(){
	    // 执行代码
	});
	或者
	$(function(){
	    // 执行代码
	});
</script>
~~~

**jQuery 入口函数与 JavaScript 入口函数的区别：**

1. jQuery 的入口函数是在 html 所有标签(DOM)都加载之后，就会去执行。

 	2.	 JS是window.onload事件是等到所有内容，包括外部图片等文件加载完后，才会执行。

### jQuery和Dom对象转换

~~~	
1.	jquery对象转DOM对象
var $li = $(“li”); //jquery 对象集返回一个$li对象数组
//第一种方法（推荐使用） 取出第一个对象的
$li[0]
//第二种方法			也是取出li数组中第一个对象
$li.get(0)
2.	DOM对象转jquery对象
$(domObj);  //Dom包装加上$()即可
~~~

### jQuery选择器

~~~
选择单个				$("名称");
	用双引号包括在内
同时选择多个元素		$("名称，名称1，名称2");
	双引号内用逗号分隔
~~~



### .css设置样式

1. 设置一个样式		：	$("domObj").css("样式名"，"样式值");
2. 设置多个样式(字典对象)：    $("domObj").css({"样式名"，"样式值"  "样式名1"，"样式值1"});
3. 获取样式                 ：    $("domObj").css("样式名); 仅获取元素数组中第一个元素的样式返回

### .class增删改查类

.addClass 		添加类	 $(obj).addClass("类名");  	注意：错误写法(".类名");

.removeClass   	删除类	$(obj).removeClass("类名");

.hasClass		是否有某个类		$(obj).hasClass("类名"); 	返回Boolean值  false/true

.toggleClass		切换类(有就移除，无则添加)	$(obj).toggleClass("类名");

### .attr设置属性

.attr 		设置属性 	$(obj).attr("属性","值");  		使用字典对象可以设置多个属性

​	可以设置自定义属性

~~~
样式 ： style里面写的，用css来操作
属性 ： 在元素里面写的，用attr方法操作
~~~

### .prop设置/获取布尔属性

使用方法与.attr一样 。但是.attr无法设置和获取布尔属性的值，所以需要.prop



 































