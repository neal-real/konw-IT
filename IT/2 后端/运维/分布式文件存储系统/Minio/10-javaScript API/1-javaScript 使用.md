## 使用NPM下载

```
npm install --save minio
```

## 初使化Minio Client

你需要设置5个属性来链接Minio对象存储服务。

| 参数      | 描述                                                         |
| :-------- | :----------------------------------------------------------- |
| endPoint  | 对象存储服务的URL                                            |
| port      | TCP/IP端口号。可选值，如果是使用HTTP的话，默认值是`80`；如果使用HTTPS的话，默认值是`443`。 |
| accessKey | Access key是唯一标识你的账户的用户ID。                       |
| secretKey | Secret key是你账户的密码。                                   |
| useSSL    | true代表使用HTTPS                                            |

```js
const Minio = require("minio");
let minioClient = new Minio.Client({
  endPoint: "127.0.0.1",
  port: 9000,
  useSSL: false,
  accessKey: "vOEJy8yESXa8dts0oeqFwQ2ZEB",
  secretKey: "dEfivwIk4iifzxJM8BCcuPQod7YSaCntkxrBENpIPEyUC9wnMveL",
});
```



## API 介绍

- 5部分 API

1. 桶操作 API
2. 对象操作
3. [临时授权操作](#3-临时授权操作)
4. 存储桶策略和通知操作
5. [自定义设置](#5-自定设置)
6. [HTTP 请求可选项](#6-HTTP 请求可选项)



其中预订操作 4 个 API 和自定义操作 1 个 API

在本文章内写明, 其他各自文章

### 3-临时授权操作

>  presigned URL 用于对私有对象提供临时的上传/下载功能。

presignedUrl(httpMethod, bucketName, objectName[, expiry, reqParams, requestDate, cb])

- 生成一个给指定HTTP方法（'httpMethod'）请求用的presigned URL
- .浏览器/移动客户端可以通过这个URL直接下载对象，即使bucket是私有的。此 URL 可设置一个失效时间单位/秒, 默认是7天

**参数**

| 参数                          | 参数类型   | 必填/可选 | 描述                                                         | 示例                                                         |
| :---------------------------- | :--------- | --------- | :----------------------------------------------------------- | ------------------------------------------------------------ |
| httpMethod                    | *string*   | 必填      | http方法，put、get等                                         |                                                              |
| `bucketName`                  | *string*   | 必填      | 存储桶名称。                                                 |                                                              |
| `objectName`                  | *string*   | 必填      | 对象名称                                                     |                                                              |
| `expiry`                      | *number*   | 可选      | 失效时间（以秒为单位），默认是7天<br />(不得大于七天英文版没有此限制) |                                                              |
| `reqParams`                   | *object*   | 可选      | 请求参数                                                     | {<br />versionId:"10fa9946-3f64-4137-a58f-888065c0732e"<br />} |
| `requestDate`                 | *Date*     |           | 一个时间对象,默认是当前,随 URL 一起下发                      |                                                              |
| `callback(err, presignedUrl)` | *function* |           | 当发生错误时，回调函数将以非空err值调用<br />preignedurl将是可以使用GET请求下载对象的URL。<br />如果没有传递回调，则返回Promise。 |                                                              |



**Example1**

```js
// “getObject”方法的预签名url, 设置失效时间为1天
minioClient.presignedUrl('GET', 'mybucket', 'hello.txt', 24*60*60, function(err, presignedUrl) {
  if (err) return console.log(err)
  console.log(presignedUrl)
})
```

**Example2**

```js
/*
'listObject' 对象的方法
用前缀'data'列出'myBucket'中的对象
最多列出1000个
*/
minioClient.presignedUrl('GET', 'mybucket', '', 1000, {'prefix': 'data', 'max-keys': 1000}, function(err, presignedUrl) {
  if (err) return console.log(err)
  console.log(presignedUrl)
})
```

**Example 3**

```js
//获取带有versionid的对象
minioClient.presignedUrl('GET', 'mybucket', '', 1000, {versionId: "10fa9946-3f64-4137-a58f-888065c0732e"}, function(err, presignedUrl) {
  if (err) return console.log(err)
  console.log(presignedUrl)
})
```



presignedGetObject(bucketName, objectName[, expiry, respHeaders, requestDate, cb])

- 生成一个给HTTP GET请求用的presigned URL .
- 浏览器/移动客户端可以通过这个URL直接下载对象，即使bucket是私有的。此 URL 可设置一个失效时间单位/秒, 默认是7天

**参数**

| 参数                          | 参数类型   | 必填/可选 | 描述                                                         |
| :---------------------------- | :--------- | --------- | :----------------------------------------------------------- |
| httpMethod                    | *string*   | 必填      | http方法，put、get等                                         |
| `bucketName`                  | *string*   | 必填      | 存储桶名称。                                                 |
| `objectName`                  | *string*   | 必填      | 对象名称                                                     |
| `expiry`                      | *number*   | 可选      | 失效时间（以秒为单位），默认是7天<br />(不得大于七天英文版没有此限制) |
| respHeaders                   | *object*   | 可选      | 要覆盖的响应头                                               |
| `requestDate`                 | *Date*     |           | 一个时间对象,默认是当前,随 URL 一起下发                      |
| `callback(err, presignedUrl)` | *function* |           | 如果`err`不是null则代表有错误。<br />`presignedUrl`就是可用于临时下载的URL。 <br />如果没有传callback的话，则返回一个`Promise`对象。 |

示例

```js
//过期一天
minioClient.presignedGetObject('mybucket', 'hello.txt', 24*60*60, function(err, presignedUrl) {
  if (err) return console.log(err)
  console.log(presignedUrl)
})
```



presignedPutObject(bucketName, objectName, expiry[, callback])

- 生成一个给HTTP PUT请求用的presigned URL .
-  浏览器/移动客户端可以通过这个URL直接下载对象，即使bucket是私有的。此 URL 可设置一个失效时间单位/秒, 默认是7天

**参数**

| 参数                          | 参数类型   | 必填/可选 | 描述                                                         |
| :---------------------------- | :--------- | --------- | :----------------------------------------------------------- |
| `bucketName`                  | *string*   | 必填      | 存储桶名称。                                                 |
| `objectName`                  | *string*   | 必填      | 对象名称                                                     |
| `expiry`                      | *number*   | 可选      | 失效时间（以秒为单位），默认是7天<br />(不得大于七天英文版没有此限制) |
| `callback(err, presignedUrl)` | *function* |           | 如果`err`不是null则代表有错<br />presignedUrl 用于使用 PUT 请求上传<br />如果没有传递回调，则返回Promise |

**Example**

```js
// 过期一天
minioClient.presignedPutObject('mybucket', 'hello.txt', 24*60*60, function(err, presignedUrl) {
  if (err) return console.log(err)
  console.log(presignedUrl)
})
```



- presignedPostPolicy(policy[, callback])

允许给POST请求的presigned URL设置条件策略。比如接收上传的存储桶名称、名称前缀、过期策略

| 参数                                 | 参数类型   | 描述                                                         |
| :----------------------------------- | :--------- | :----------------------------------------------------------- |
| `policy`                             | *object*   | 由 minioClient.newPostPolicy（）创建的策略对象               |
| `callback(err, {postURL, formData})` | *function* | 如果`err`不是null则代表有错<br />postURL 用于使用post请求上传<br />formData 是POST请求体中的键值对对象。<br />如果没有传递回调，则返回Promise |

创建策略：

```js
var policy = minioClient.newPostPolicy()
```

应用上载策略限制：

```js
//仅对bucket“mybucket”限制策略。
policy.setBucket('mybucket')

// 策略仅限hello.txt对象
policy.setKey('hello.txt')
```

or

```js
// 限制指定 key 和传入对象
policy.setKeyStartsWith('keyPrefix')

var expires = new Date
expires.setSeconds(24 * 60 * 60 * 10)
// 策略有效期 10天
policy.setExpires(expires)

//只允许“文本”
policy.setContentType('text/plain')

//仅允许内容大小在1KB到1MB之间。
policy.setContentLengthRange(1024, 1024*1024)
```

从浏览器中使用 `superagent` 发送POST 请求,内容写在请求体中

```js
minioClient.presignedPostPolicy(policy, function(err, data) {
  if (err) return console.log(err)

  var req = superagent.post(data.postURL)
  _.each(data.formData, function(value, key) {
    req.field(key, value)
  })

  // 文件内容
  req.attach('file', '/path/to/hello.txt', 'hello.txt')

  req.end(function(err, res) {
    if (err) {
      return console.log(err.toString())
    }
    console.log('Upload successful.')
  })
})
```



### 5-自定设置

- setS3TransferAccelerate(endpoint)

  为所有API请求设置AWS S3传输加速端点。
  注意: 此API仅适用于AWS S3，对兼容S3的对象存储服务无操作

参数

| 参数       | 参数类型 | 描述                         |
| :--------- | :------- | :--------------------------- |
| `endpoint` | *string* | 设置为新的 S3 传输加速端点。 |



### 6-HTTP 请求可选项

- setRequestOptions(options)

设置HTTP/HTTPS请求选项。支持的选项有agent (http.Agent())， family(解析主机或主机名时使用的IP地址族)，以及tls相关的选项('agent'， 'ca'， 'cert'， 'cipher '， 'clientCertEngine'， 'crl'， 'dhparam'， 'ecdhCurve'， 'honorCipherOrder'， 'key'， 'passphrase'， 'pfx'， 'rejectUnauthorized'， 'secureOptions'， 'secureProtocol'， 'servername'， ' trustcert '， ' trustcert '， ' trustcert '， ' trustcert '， ' trustcert '， ' trustcert ')。“sessionIdContext”)记录在这里

```js
//不要拒绝自签名证书。
minioClient.setRequestOptions({rejectUnauthorized: false})
```

