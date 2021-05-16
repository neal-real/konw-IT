## 什么是YARN

- Yarn是由Facebook、Google、Exponent 和 Tilde 联合推出了一个新的 JS 包管理工具
- Yarn 是为了弥补 npm5.0之前 的一些缺陷而出现的, 现在推荐使用 npm
- NPM的5.0之前的缺陷
  - npm install的时候巨慢
  - 一个项目，npm install的时候无法保持一致性



## YARN的优点

> 特性： 
>
> 1. 并行安装 : yarn 同步每个package并行安装，提高了优势
> 2.  离线安装: 若之前已经安装过安装包，yarn 从之前的缓存中提
> 3. 安装版本统一 : yarn 有锁定文件(lock file) 记录了确切被安装模块的版本号，每次新增文件时，yarn会创建（或更新）yarn.lock这个文件，保证每次安装依赖时都是一样的模块版本。

## 安装

> 官方下载不下来 可以去 geihub 下载
>
> https://github.com/yarnpkg/yarn/releases

### macOS

```
curl -o- -L https://yarnpkg.com/install.sh | bash
```



### Linux 

~~~javascript
https://yarn.bootcss.com/docs/install/#centos-stable

/在CentOS，Fedora和RHEL上，您可以通过我们的RPM软件包存储库安装Yarn。

curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo

/如果尚未安装Node.js，则还应该配置 NodeSource存储库：

curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
然后，您可以简单地：

sudo yum install yarn
## OR ##
sudo dnf install yarn
~~~



## 配置下载源

~~~javascript
// 查看 现在使用的下载源
yarn config get registry
// 指定使用的源
yarn config set registry 'https://registry.npm.taobao.org/'
~~~



## 基本操作

**添加依赖包**

```js
// 初始化一个项目
yarn init
// 装包
yarn add 包名称
yarn add 包名称 --dev
yarn add 包名称@[version]
yarn add 包名称@[tag]
分别添加到 
yarn add [package] --dev				`devDependencies(开发依赖项)`
yarn add [package] --peer				`peerDependencies(对等依赖关系)` 
yarn add [package] --optional		`optionalDependencies(可选依赖项)` 

// 更新包
yarn upgrade 包名称
// 删除包
yarn remove 包名称
// 安装所有包
yarn	或		yarn install
// 发布包
yarn publish
// 查看包的缓存列表
yarn cache list
// 全局安装包 == npm -g
yarn global add xxx			// 全局 下载
yarn global upgrade xxx
yarn global remove xxx

```



