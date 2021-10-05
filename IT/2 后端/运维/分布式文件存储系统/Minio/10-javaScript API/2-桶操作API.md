## 1. 构造函数



### new Minio.Client ({endPoint, port, useSSL, accessKey, secretKey})

|                                                              |
| :----------------------------------------------------------- |
| `new Minio.Client ({endPoint, port, useSSL, accessKey, secretKey})` |
| 初使化一个新的client对象。                                   |

**参数**

| 参数           | 类型     | 描述                                                         |
| :------------- | :------- | :----------------------------------------------------------- |
| `endPoint`     | *string* | endPoint是一个主机名或者IP地址。                             |
| `port`         | *number* | TCP/IP端口号。可选，默认值是，如果是http,则默认80端口，如果是https,则默认是443端口。 |
| `accessKey`    | *string* | accessKey类似于用户ID，用于唯一标识你的账户。                |
| `secretKey`    | *string* | secretKey是你账户的密码。                                    |
| `useSSL`       | *bool*   | 如果是true，则用的是https而不是http,默认值是true。           |
| `region`       | *string* | 设置该值以覆盖自动发现存储桶region。（可选）                 |
| `transport`    | *string* | Set this value to pass in a custom transport. (Optional) - To be translated |
| `sessionToken` | *string* | Set this value to provide x-amz-security-token (AWS S3 specific). (Optional) - To be translated |
| `partSize`     | *number* | Set this value to override default part size of 64MB for multipart uploads. (Optional) - To be translated |

**示例**

## 创建连接Minio Server的客户端

```js
Copyvar Minio = require('minio')

var minioClient = new Minio.Client({
    endPoint: 'play.min.io',
    port: 9000,
    useSSL: true,
    accessKey: 'Q3AM3UQ867SPQQA43P2F',
    secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
});
```

## 创建连接AWS S3的客户端

```js
Copyvar Minio = require('minio')

var s3Client = new Minio.Client({
    endPoint:  's3.amazonaws.com',
    accessKey: 'YOUR-ACCESSKEYID',
    secretKey: 'YOUR-SECRETACCESSKEY'
})
```

## 2. 操作存储桶



### makeBucket(bucketName, region[, callback])

创建一个新的存储桶。

**参数**

| 参数            | 类型       | 描述                                                         |
| :-------------- | :--------- | :----------------------------------------------------------- |
| `bucketName`    | *string*   | 存储桶名称。                                                 |
| `region`        | *string*   | 存储桶被创建的region(地区)，默认是us-east-1(美国东一区)，下面列举的是其它合法的值： |
|                 |            | us-east-1                                                    |
|                 |            | us-west-1                                                    |
|                 |            | us-west-2                                                    |
|                 |            | eu-west-1                                                    |
|                 |            | eu-central-1                                                 |
|                 |            | ap-southeast-1                                               |
|                 |            | ap-northeast-1                                               |
|                 |            | ap-southeast-2                                               |
|                 |            | sa-east-1                                                    |
|                 |            | cn-north-1                                                   |
| `callback(err)` | *function* | 回调函数，`err`做为错误信息参数。如果创建存储桶成功则`err`为null。如果没有传callback的话，则返回一个`Promise`对象。 |

**示例**

```js
CopyminioClient.makeBucket('mybucket', 'us-east-1', function(err) {
  if (err) return console.log('Error creating bucket.', err)
  console.log('Bucket created successfully in "us-east-1".')
})
```



### listBuckets([callback])

列出所有存储桶。

**参数**

| 参数                          | 类型       | 描述                                                         |
| :---------------------------- | :--------- | :----------------------------------------------------------- |
| `callback(err, bucketStream)` | *function* | 回调函数，第一个参数是错误信息。`bucketStream`是带有存储桶信息的流。如果没有传callback的话，则返回一个`Promise`对象。 |

bucketStream格式如下:-

| 参数                  | 类型     | 描述             |
| :-------------------- | :------- | :--------------- |
| `bucket.name`         | *string* | 存储桶名称       |
| `bucket.creationDate` | *Date*   | 存储桶创建时间。 |

**示例**

```js
CopyminioClient.listBuckets(function(err, buckets) {
  if (err) return console.log(err)
  console.log('buckets :', buckets)
})
```



#### bucketExists(bucketName[, callback])

验证存储桶是否存在。

**参数**

| 参数            | 类型       | 描述                                                         |
| :-------------- | :--------- | :----------------------------------------------------------- |
| `bucketName`    | *string*   | 存储桶名称。                                                 |
| `callback(err)` | *function* | 如果存储桶存在的话`err`就是null，否则`err.code`是`NoSuchBucket`。如果没有传callback的话，则返回一个`Promise`对象。 |

**示例**

```js
CopyminioClient.bucketExists('mybucket', function(err) {
  if (err) {
     if (err.code == 'NoSuchBucket') return console.log("bucket does not exist.")
     return console.log(err)
  }
  // if err is null it indicates that the bucket exists.
  console.log('Bucket exists.')
})
```



### removeBucket(bucketName[, callback])

删除存储桶。

**参数**

| 参数            | 类型       | 描述                                                         |
| :-------------- | :--------- | :----------------------------------------------------------- |
| `bucketName`    | *string*   | 存储桶名称。                                                 |
| `callback(err)` | *function* | 如果存储桶删除成功则`err`为`null`。如果没有传callback的话，则返回一个`Promise`对象。 |

**示例**

```js
CopyminioClient.removeBucket('mybucket', function(err) {
  if (err) return console.log('unable to remove bucket.')
  console.log('Bucket removed successfully.')
})
```



### listObjects(bucketName, prefix, recursive)

列出存储桶中所有对象。

**参数**

| 参数         | 类型     | 描述                                                         |
| :----------- | :------- | :----------------------------------------------------------- |
| `bucketName` | *string* | 存储桶名称。                                                 |
| `prefix`     | *string* | 要列出的对象的前缀 (可选，默认值是`''`)。                    |
| `recursive`  | *bool*   | `true`代表递归查找，`false`代表类似文件夹查找，以'/'分隔，不查子文件夹。（可选，默认值是`false`） |

**返回值**

| 参数     | 类型     | 描述                   |
| :------- | :------- | :--------------------- |
| `stream` | *Stream* | 存储桶中对象信息的流。 |

对象的格式如下：

| 参数               | 类型     | 描述             |
| :----------------- | :------- | :--------------- |
| `obj.name`         | *string* | 对象名称。       |
| `obj.prefix`       | *string* | 对象名称的前缀。 |
| `obj.size`         | *number* | 对象的大小。     |
| `obj.etag`         | *string* | 对象的etag值。   |
| `obj.lastModified` | *Date*   | 最后修改时间。   |

**示例**

```js
Copyvar stream = minioClient.listObjects('mybucket','', true)
stream.on('data', function(obj) { console.log(obj) } )
stream.on('error', function(err) { console.log(err) } )
```



### listObjectsV2(bucketName, prefix, recursive)

使用S3 listing objects V2版本API列出所有对象。

**参数**

| 参数         | 类型     | 描述                                                         |
| :----------- | :------- | :----------------------------------------------------------- |
| `bucketName` | *string* | 存储桶名称。                                                 |
| `prefix`     | *string* | 要列出的对象的前缀。（可选，默认值是`''`）                   |
| `recursive`  | *bool*   | `true`代表递归查找，`false`代表类似文件夹查找，以'/'分隔，不查子文件夹。（可选，默认值是`false`） |

**返回值**

| 参数     | 类型     | 描述                   |
| :------- | :------- | :--------------------- |
| `stream` | *Stream* | 存储桶中对象信息的流。 |

对象的格式如下：

| 参数               | 类型     | 描述             |
| :----------------- | :------- | :--------------- |
| `obj.name`         | *string* | 对象名称。       |
| `obj.prefix`       | *string* | 对象名称的前缀。 |
| `obj.size`         | *number* | 对象的大小。     |
| `obj.etag`         | *string* | 对象的etag值。   |
| `obj.lastModified` | *Date*   | 最后修改时间。   |

**示例**

```js
Copyvar stream = minioClient.listObjectsV2('mybucket','', true)
stream.on('data', function(obj) { console.log(obj) } )
stream.on('error', function(err) { console.log(err) } )
```



### listIncompleteUploads(bucketName, prefix, recursive)

列出存储桶中未完整上传的对象。

**参数**

| 参数         | 类型     | 描述                                                         |
| :----------- | :------- | :----------------------------------------------------------- |
| `bucketname` | *string* | 存储桶名称。                                                 |
| `prefix`     | *string* | 未完整上传的对象的前缀。（可选，默认值是`''`）。             |
| `recursive`  | *bool*   | `true`代表递归查找，`false`代表类似文件夹查找，以'/'分隔，不查子文件夹。（可选，默认值是`false`） |

**返回值**

| 参数     | 类型     | 描述           |
| :------- | :------- | :------------- |
| `stream` | *Stream* | 对象格式如下： |

| 参数            | 类型      | 描述                     |
| :-------------- | :-------- | :----------------------- |
| `part.key`      | *string*  | 对象名称。               |
| `part.uploadId` | *string*  | 对象的上传ID。           |
| `part.size`     | *Integer* | 未完整上传的对象的大小。 |

**示例**

```js
Copyvar Stream = minioClient.listIncompleteUploads('mybucket', '', true)
Stream.on('data', function(obj) {
  console.log(obj)
})
Stream.on('end', function() {
  console.log('End')
})
Stream.on('error', function(err) {
  console.log(err)
})
```