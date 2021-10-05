## 客户端指令

| mc 客户端指令 | 作用                                            | 备注 |
| ------------- | ----------------------------------------------- | ---- |
| ls            | 列出文件和文件夹                                |      |
| mb            | 创建一个存储桶或一个文件夹。                    |      |
| cat           | 显示文件和对象内容                              |      |
| pipe          | 将一个STDIN重定向到一个对象或者文件或者STDOUT。 |      |
| share         | 生成用于共享的URL                               |      |
| cp            | 拷贝文件和对象                                  |      |
| mirror        | 给存储桶和文件夹做镜像                          |      |
| find          | 基于参数查找文件                                |      |
| diff          | 对两个文件夹或者存储桶比较差异                  |      |
| rm            | 删除文件和对象                                  |      |
| events        | 管理对象通知                                    |      |
| watch         | 监视文件和对象的事件                            |      |
| policy        | 管理访问策略                                    |      |
| config        | 管理mc配置文件                                  |      |
| update        | 检查软件更新                                    |      |
| version       | 输出版本信息                                    |      |
|               |                                                 |      |
|               |                                                 |      |
|               |                                                 |      |



## 全局选项

| 可选项       | 作用                                                   | 示例               |
| ------------ | ------------------------------------------------------ | ------------------ |
| --debug      | 启用到控制台的详细输出。                               | mc --debug ls play |
| --config-dir | mc用于存储数据的JSON格式化配置文件 的路径              |                    |
| --JSON       | 启用JSON 行格式化输出到控制台。                        | mc --JSON ls play  |
| --no-color   | 禁用控制台输出的内置颜色主题。对哑终端有用。           |                    |
| --quiet      | 禁止控制台输出。                                       |                    |
| --insecure   | 禁用 TLS/SSL 证书验证。允许 TLS 连接到证书无效的服务器 |                    |
| --version    | 显示当前版本mc。                                       |                    |



```js
mc alias

该命令提供了一个方便的界面，用于管理可以连接到并对其运行操作的 S3 兼容主机列表。mc aliasmc

mc在 S3 兼容服务上运行的命令需要 为该服务指定一个别名。

mc cat

该命令将文件或对象的内容连接到另一个文件或对象。您还可以使用该命令将指定文件或对象的内容显示到. 具有类似的功能。mc catSTDOUTcatcat

mc cp

该命令将数据从一个或多个源复制到目标 S3 兼容服务。mc cp

mc diff

该MC计算两个文件系统的目录或S3兼容桶之间的差异。仅列出那些丢失或大小不同的对象。也没有比较对象的内容。mc diffmc diffmc diff

mc encrypt

该MC套，更新或禁用默认斗服务器端加密（SSE）模式。MinIO 使用指定的 SSE 模式自动加密对象。mc encrypt

有关配置 SSE 的更多信息，请参阅 加密和密钥管理

mc event

该命令支持添加、删除和列出存储桶事件通知。mc event

MinIO 自动将触发事件发送到配置的通知目标。MinIO 支持 AMQP (RabbitMQ)、Redis、ElasticSearch、NATS 和 PostgreSQL 等通知目标。有关更多信息，请参阅 MinIO 存储桶通知。

mc find

该命令支持在兼容 S3 的主机上查询对象。您还可以使用该命令在文件系统上搜索文件。mc find

mc head

该命令显示对象的第一行，其中是指定给命令的参数。mc headnn

mc ilm

该命令管理存储桶上的对象生命周期管理规则。有关更多信息，请参阅有关对象生命周期管理的 AWS 文档 。mc ilm

mc legalhold

该命令启用或禁用对象合法保留。对对象启用合法保留可防止对对象进行任何修改或删除，相当于在对象上设置一次写入只读 (WORM) 模式。mc legalhold

mc lock

自RELEASE.2020-09-18T00-13-21Z 后弃用 。使用.mc retention

mc ls

该命令列出目标 S3 兼容服务上的所有存储桶和对象。对于文件系统上的目标，具有与命令相同的功能。mc lsmc lsls

mc mb

该命令在指定的路径创建一个新的存储桶或目录。对于 S3 兼容服务上的目标， 创建一个新存储桶。对于文件系统上的目标，具有与.mc mbmc mbmc mbmkdir -p

mc mirror

该命令将内容同步到与 S3 兼容的主机，类似于该实用程序。支持文件系统和 S3 兼容主机作为同步源。mc mirrorrsyncmc mirror

mc mv

该命令将数据从一个或多个源移动到目标 S3 兼容服务。mc mv

mc policy

该命令支持使用 AWS S3 JSON 策略设置或删除存储桶及其内容的匿名 策略。具有匿名策略的存储桶允许公共访问，其中客户端可以执行策略授予的任何操作，而无需执行此操作。mc policy

mc rb

该命令删除目标 S3 兼容服务上的存储桶及其所有内容。mc rb

删除存储桶也会删除与该存储桶关联的任何配置。要仅删除存储桶的内容，请改用。mc rbmc rm

mc retention

该命令为存储区中的一个或多个对象配置一次写入多次读取 (WORM) 锁定设置。您还可以为存储桶设置默认对象锁定设置，其中没有明确对象锁定设置的所有对象都继承存储桶默认值。mc retention

mc rm

该命令删除目标 S3 兼容服务上的对象。要完全删除存储桶，请改用。mc rmmc rb

mc share

该命令生成带有集成访问凭证的临时 URL，用于将对象上传或下载到 S3 兼容主机。临时 URL 在可配置的时间限制后过期。mc share

mc sql

该命令提供了一个 S3 Select 接口，用于对指定的 S3 兼容服务中的对象执行 sql 查询。mc sql

mc stat

该命令显示有关包含在指定的 S3 兼容服务存储桶中的对象的信息。在文件系统路径上使用时具有与命令类似的功能。mc statmc statstat

mc tag

该命令添加、删除和列出与存储桶或对象关联的标签。mc tag

mc tree

该命令以树格式列出存储桶和目录。mc tree

mc update

该命令会自动将mc二进制文件更新为最新的稳定版本。mc update

mc version

该命令启用或禁用存储桶版本控制。mc version

mc watch

该命令监视指定的 S3 兼容
```

