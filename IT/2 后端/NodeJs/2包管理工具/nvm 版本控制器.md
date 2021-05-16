## node 版本控制器 NVM

> 同一个服务器有不同的软件，他们依赖不同的 node 版本运行。这种情况就需要使用版本控制在一个环境下使用多个版本的 node

linux 和 mac 使用

github 地址： https://github.com/nvm-sh/nvm



windows: 使用

github 地址： https://github.com/coreybutler/nvm-windows



## NVM 常用命令

> 

| 命令                        | 作用                                           |
| --------------------------- | ---------------------------------------------- |
| nvm ls-remote               | 查看互联网上 node 可用的版本                   |
| nvm install 8.0.0           | 安装指定版本                                   |
| nvm use 8.0.0               | 使用指定版本                                   |
| nvm uninstall 版本号        | 卸载指定版本的nodejs                           |
| nvm run 6.10.3 app.js       | 使用指定版本运行指定文件                       |
| nvm exec 6.10.3 node app.js | 使用指定版本运行 node 的 app                   |
| nvm list                    | 查看所有下载的 node 版本，并指出当前使用的版本 |





### 安装权限被拒情况处理

~~~js
1. // 修改hosts文件 vim /etc/hosts。
2. // 添加一行 199.232.28.133 raw.githubusercontent.com后保存完重新执行一次上述命令。

3. //安装nvm,这样便于管理node的版本。安装步骤如下：
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

// ls -a查看目录下是否有.bashrc文件,没有就创建touch .bashrc,然后vim .bashrc,把
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"拷贝进去后保存退出。
~~~

