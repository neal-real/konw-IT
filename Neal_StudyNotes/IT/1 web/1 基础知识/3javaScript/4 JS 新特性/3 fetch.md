# 仅做了解,开发中使用 Axios

## fetch

> - 和Ajax一样都是用于请求网络数据的
> - fetch是ES6中新增的, 基于Promise的网络请求方法
> - 

## fetch基本使用

~~~js
fetch(url, {options})
    .then()
    .catch();
~~~



## get

> 传参数通过 url : 	?teacher=lnj&age=34

~~~js
fetch("http://127.0.0.1/jQuery/Ajax/41.php?teacher=lnj&age=34", {
  method: "get"
}).then(function (res) {
  // console.log(res.text());
  // 拿服务器返回的字符串 用这个
  return res.text();
  // 拿服务器返回的 json 用这个
  return res.json();
}).then(function (data) {
  // 这里获得数据
  console.log(data);
  console.log(typeof data);
}).catch(function (e) {
  console.log(e);
});
~~~



## post



~~~js
fetch("http://127.0.0.1/jQuery/Ajax/41.php", {
  method: "post",
  body: JSON.stringify({teacher:"zq", age:666})
}).then(function (res) {
  // console.log(res.text());
  // return res.text();
  return res.json();
}).then(function (data) {
  console.log(data);
  console.log(typeof data);
}).catch(function (e) {
  console.log(e);
});
~~~

