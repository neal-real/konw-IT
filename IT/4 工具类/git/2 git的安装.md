## 1. 下载 git

到官网: https://git-scm.com/download/ 中下载对应的系统软件

## 2. mac 安装

1. 安装 brew
2. 安装git
3. 检查是否安装成功

### 1. 安装 brew

~~~shell
brew install git
# 检验方法，打印方法
brew -v
~~~

#### 问题1

> Failed to connect to raw.githubusercontent.com port 443: Connection refused

**`解决方法1(推荐)`**

> 使用国内源

```html
https://gitee.com/cunkai/HomebrewCN
```



解决方法2

~~~shell
1. 修改hosts
sudo vim /etc/hosts
2. 添加内容
199.232.28.133 raw.githubusercontent.com
~~~



### 2. 安装git

```shell
brew install git
```

### 检验是否安装成功

```shell
git --version
# 打印版本号即安装成功
git version 2.24.3 (Apple Git-128)
```





## 基础使用指南

> GIT自学网站推荐: https://backlog.com/git-tutorial/cn/



