

## 证书

1. 通过腾讯云免费获取
2. 下载的 ssl 证书后 在`Nginx`文件夹下的两个文件



## 代码

```js
// 部署 https
const express = require("express")
const http = require("http")
const https = require("https")
const fs = require("fs")
const httpsOption = {
  key:fs.readFileSync('./key/2_www.realisbest.net.key','utf8'),
  cert: fs.readFileSync("./key/1_www.realisbest.net_bundle.crt",'utf8')
}

const app = express()
app.set('host', '0.0.0.0');

const httpsServer = https.createServer(httpsOption, app);
// 设置外网可访问和端口
const port = 80
const ssl_port = 443
app.listen(port, () => {
  console.log('服务器开始运行')
})
httpsServer.listen(ssl_port, () => {
  console.log('https服务器开始运行,需要通过443端口访问')
});



```

