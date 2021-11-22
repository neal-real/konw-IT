## cookie

> - cookie 客户端会话跟踪技术
>
> - session 服务端会话跟踪技术
>
>   

注意点: cookie 默认不会保存数据

### 数据保存

> - cookie的保存,一次仅能保存一条.多条数据要多次保存
> - cookie 的保存限制
>   - 个数限制 20~50 (IE6=20,IE7,8,9+=50;Opera=30;FF50;谷歌53;Safari 无限制)
>   - 大小限制 4KB 左右(4097 个字节) /条

~~~js
document.cookie = "";
// 推荐格式保存为键值对
document.cookie = "key=value";
// 重复设置,是添加不同信息的方法.不会覆盖之前的信息
document.cookie = "key2=value2";

`获取 cookie`
 document.cookie // 返回数据是 "key=value;ke2=value"

~~~

#### 保存时设置有效期

~~~js
// 保存时设置有效期
var date = new Date();
date.setDate(date.getDate() + 1);	// 加一天 
document.cookie = "name = value; expires=" + date.toGMTString() + ";";
~~~

### 二级域名也可以访问

> 必须是自己的域名,否则整个设置都没有反应

~~~js
// 设置二级域名也可以访问
document.cookie = "key2=value2;path=/;domain=网站主域名";
document.cookie = "key2=value2;path=/;domain=knowmap.cn";
~~~





### 保存位置为根路径

~~~js
// 保存时设置保存位置为根路径, 让任何路径的页面都可以拿到 cookie
document.cookie = "key2=value2;path=/";
~~~





### 查看方式

> 默认: 同一个域名下,同一个路径和其子路径,在不同的页面可以访问共同的 cookie
>
> 在保存的同时设置保存路径为根路径则可以让其他路径都访问到

~~~js
// 获取方式
let value = document.cookie
// 通过浏览器的开发者工具 打开 cookies 中对应的网址 可以看到 name 和 value 对应的值
~~~



### cookie 存续时间

> 默认: cookie 保存时间仅存在于浏览器存续阶段.浏览器关闭后消失. 
>
> expires 设置有效时间后
>
> - 时间设置错误,设置的时间是过去,则会马上删除 cookie
> - 时间设置在未来,则无视浏览器是否关闭,会一致保存到时间到期为止

~~~js
var date = new Date();
// 加一天 
date.setDate(date.getDate() + 1);
// ; 号前设置值,后面设置有效期
document.cookie = "name = value; expires=" + date.toGMTString() + ";";
~~~





## 封装cookie

> 

### 添加

~~~js
/**
* > 添加 cookie
* @key(String) = cookie 中的 name
* @value(String) = cookie 中的 value
* @day(int) 有效期; 值是正整数,例如 1 既是 1 天有效期,非必填项目,不填为默认
* @path(String) 是否设置为生效范围 如果需要全路径生效 可设置为 '/'
* @domain(String) 是否需要开启二级域名可访问,例  'knowmap.cn' 则是 knowmap 域名中的二级域名也可以访问
*/ 
function addCookie(key, value, day, path, domain) {
  // 1. 过滤保存路径, 如果未设置为当前路径
  let index = window.location.pathname.lastIndexOf("/");
  let currentPath = window.location.pathname.slice(0, index);
  path = path || currentPath
  // 2. 是否未二级域名开启
  domain = domain || document.domain
  // 3. 处理默认的过期时间 
  if (!day) {
    document.cookie = key + "=" + value + ";path=" + path + ";domain=" + domain + ";";
  } else {
    var date = new Date();
    // 加一天 
    date.setDate(date.getDate() + day);
    // ; 号前设置值,后面设置有效期
    document.cookie = key + "=" + value + ";expires=" + date.toGMTString() + ";path=" + path + ";domain=" + domain + ";";

  }
}
~~~

### 获得

~~~js
/**
* > 获得 cookie
* @key(String) =  key
* @return 成功返回 value
*/ 
function getCookie(key) {
  try {
    let res = document.cookie.split(";")
    for (let i = 0; i < res.length; i++) {
      const temp = res[i].split("=");
      if (temp[0].trim() === key) {
        return temp[i]
      } 
    }
  } catch (error) {
    return error
  }
}
~~~

### 删除

~~~js
/**
* > 删除 cookie
* @key(String) key
* @path(String) 可选,不写则删除默认路径下的 key, 写了则删除指定路径下的 cookie
*/ 
function delCookie(key, path) {
  try {
    // 设置过期时间为昨天,清除 key
    addCookie(key, getCookie(key), -1, path)
  } catch (error) {
    return error
  }
}
~~~



## hash

> hash 就是 url 路径后面`#`号后的备注内容, 用于标注进入当前页面的哪个具体位置或页面
>
> www.knowmap.cn/english#e
>
> e就是标注信息,页面则通过 hash 拿到 e,显示音标 e 被点击后的页面

### 设置			

~~~js
window.location.hash = 2;
window.location.hash = 'e';
window.location.hash = 'book';
~~~

### 获取

~~~js
let hash = window.location.hash // #2
// #号不需要,所以把 #号截取掉
let hash = window.location.hash.substring(1) // 2
// 万一没有的话,设置一个默认值最好. 完整的写法
let hash = window.location.hash.substring(1) || 1 // 2
~~~



