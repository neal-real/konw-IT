## LInux 下安装卸载 NodeJS

### 下载安装

### 官网中: node 版本选择

> LTS 是 Long Term Support 长期支持,稳定版
>
> Current 是拥有最新特性的实验版

​	下载 https://nodejs.org/zh-cn/download/

node --version 或者 node -v  (显示node的版本号)

~~~js
1. 首先安装wget
yum install -y wget
2. 下载nodejs最新的bin包
// 在资源上鼠标右键复制链接地址
wget https://nodejs.org/dist/v12.16.1/node-v12.16.1-linux-x64.tar.xz
3.解压包
xz -d node-v12.16.1-linux-x64.tar.xz 
tar -xf node-v12.16.1-linux-x64.tar 
4. 部署bin文件(临时性)
//ln指令用于创建关联（类似与Windows的快捷方式）必须给全路径，否则可能关联错误
ln -s /opt/node-v14.4.0-linux-x64/bin/node /usr/bin/node
ln -s /opt/node-v14.4.0-linux-x64/bin/npm /usr/bin/npm
// 改名
mv A B
# 到 ~/node安装目录下的/bin/目录的node和npm目录
5.测试
node -v
npm -v 
// 正确输出版本号，则部署ok
~~~



### 全局配置

~~~js
//0.找到node的安装目录
npm config get prefix
//1.新建一个全局安装的路径（cd 在node文件下）
mkdir ./.npm-global 
//2.配置npm使用新的路径
npm config set prefix './.npm-global'
//3.当前目录打开或者新建.profile 文件，内中加入下面一行
export PATH=./.npm-global/bin:$PATH
//4、更新系统环境变量方法1，临时有效
source ./.profile
// 5. 长久有效
//修改/etc/profile文件
sudo vi /etc/profile 
//在末尾添加以下内容
export PATH=/绝对路径/.npm-global/bin:$PATH
// 保存后更新配置,或重启服务器  
source /etc/profile
#~/ 是相对路径  ./ 是当前路径
~~~



### 修改环境变量 ,实现永久配置bin目录

~~~javascript
/PATH环境变量
命令执行是因为系统知道命令在什么地方， 保存命令所在位置的是 /PATH 环境变量
// 修改
vim /etc/profile
// 添加
export PATH=/绝对路径/bin:$PATH
// 保存，退出，运行
source /etc/profile
检查：
echo $PATH
生效方法：系统重启
有效期限：永久有效
用户局限：对所有用户
,
/ 存疑↓
// ~代表当前用户的home目录,相当于绝对路径到当前用户home下(所有在任意位置皆可)
vim ~/.bashrc
//在最后一行添上：
export PATH=/usr/bin:$PATH
生效方法：（有以下两种）
1、关闭当前终端窗口，重新打开一个新终端窗口就能生效
2、输入“source ~/.bashrc”命令，立即生效
有效期限：永久有效
用户局限：仅对当前用户
~~~



### 1.2 Node卸载

~~~js
//1. 使用 yum 先删除一次
yum remove nodejs npm -y
// 2.手动删除残
进入 /usr/local/lib 删除所有 node 和 node_modules文件夹
进入 /usr/local/include 删除所有 node 和 node_modules 文件夹
// 3. 检查 ~ 文件夹里面的"local" "lib" "include" 文件夹，然后删除里面的所有 "node" 和 "node_modules" 文件夹,可以使用以下命令查找 
find ~/ -name node 
pwd

//4.  进入指定目录删除全部内容
rm -rf /home/[homedir]/.npm

~~~



## 切换下载源

npm config set registry https://registry.npm.taobao.org

npm config set registry https://registry.npmjs.org/



## 查看下载源

npm config get registry