# 使用TLS安全的访问Minio服务[![Slack](https://slack.min.io/slack?type=svg)](http://slack.minio.org.cn/questions)

本文，我们讲介绍如何在Linux和Windows上配置Minio服务使用TLS。

## 1. 前提条件

- 下载Minio server [这里](http://docs.minio.org.cn/docs/master/minio-quickstart-guide)

## 2. 配置已存在的证书

如果你已经有私钥和公钥证书，你需要将它们拷贝到Minio的config/`certs`文件夹,分别取名为`private.key` 和 `public.crt`。

如果这个证书是被证书机构签发的，`public.crt`应该是服务器的证书，任何中间体的证书以及CA的根证书的级联。

## 3. 生成证书

### Linux

Minio在Linux只支持使用PEM格式的key/certificate。

#### 使用 Let's Encrypt

更多信息，请访问 [这里](http://docs.minio.org.cn/docs/master/generate-let-s-encypt-certificate-using-concert-for-minio)

#### 使用 generate_cert.go (self-signed certificate)

你需要下载 [generate_cert.go](https://golang.org/src/crypto/tls/generate_cert.go?m=text)，它是一个简单的go工具，可以生成自签名的证书，不过大多数情况下用着都是木有问题的。

`generate_cert.go` 已经提供了带有DNS和IP条目的SAN证书:

```sh
Copygo run generate_cert.go -ca --host "10.10.0.3"
```

#### 使用 OpenSSL:

生成私钥:

```sh
Copyopenssl genrsa -out private.key 2048
```

生成自签名证书:

```sh
Copyopenssl req -new -x509 -days 3650 -key private.key -out public.crt -subj "/C=US/ST=state/L=location/O=organization/CN=domain"
```



## mac 

- 生成公钥,私钥的方法百度很多