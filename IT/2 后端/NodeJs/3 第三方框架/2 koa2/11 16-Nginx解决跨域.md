## Nginx安装和使用

1. 安装
   下载解压即可
   http://nginx.org/en/download.html
2. 使用
   修改配置文件: `程序根目录/conf/nginx.conf` 文件打开



```js
worker_processes 4; // CPU核数
http {
  server {
    listen 80; // 端口号
    /*
     注释原来的, 重新设置代理地址路径. 
      location /  表示 访问 根路径,就跳转到代理地址
    */
    location / {
      proxy_pass http://192.168.0.107:3001;
    }
		// 请求/api代理的地址时 跳转到 http://127.0.0.1:3000
    location /api { 
      proxy_pass http://127.0.0.1:3000;
      proxy_set_header Host $host;
    }
  }
}
```



