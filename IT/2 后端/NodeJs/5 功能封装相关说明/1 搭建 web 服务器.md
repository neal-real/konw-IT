## 搭建 web 服务器

1. 如何通过原生NodeJS搭建Web服务器
2. 如何处理Get请求, 如何处理POST请求
3. 如何处理不同路径(路由)
4. 如何处理(获取)请求参数

```js
// 1.导入http模块
const http = require('http');
const queryString = require('querystring');

// 2.通过http模块创建服务对象
const server = http.createServer();
// 3.通过服务对象监听用户请求
server.on('request', (req, res)=>{
  console.log('接收到请求');
  // 1.获取请求类型
  let method = req.method.toLowerCase();
  // 2.获取请求路径
  let url = req.url;
  let path = url.split('?')[0];
  // 3.获取请求参数
  let params = '';
  if(method === 'get'){
    // 4.处理请求参数
    params = url.split('?')[1];
    params = queryString.parse(params);
    // 5.处理路由
    if(path === '/login'){
      console.log('处理登录请求', params);
    }else if(path === '/register'){
      console.log('处理注册请求', params);
    }
  }else if(method === 'post'){
    // 4.处理请求参数
    req.on('data', (chuck)=>{
      params += chuck;
    });
    req.on('end', ()=>{
      params = queryString.parse(params);
      // 5.处理路由
      if(path === '/login'){
        console.log('post处理登录请求', params);
      }else if(path === '/register'){
        console.log('post处理注册请求', params);
      }
    });
  }
});
// 4.指定监听的端口号
server.listen(3000);
```

 
