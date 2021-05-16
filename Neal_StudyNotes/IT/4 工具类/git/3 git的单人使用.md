## GIT命令-个人开发流程

### 一、准备工作(只做一次):

1. 创建一个工作区
2. 在工作区中的打开git终端
3. 通过git init指令, 初始化版本库
4. 通过git config user.name "姓名"
   	      git config user.email "邮箱"
   	  设置用户名和邮箱(不设置要挨骂)
5. 通过git config -l查看设置情况

### 二、开发阶段(反复执行)

1. 编写代码
2. 通过"`git add` 文件名称"/"`git add .`" 添加到版本库的暂缓区中
3. 通过git commit -m"说明" 将暂缓区的文件添加到HEAD指针指向的分支中
   (默认只有一个分支, master分支, 也称之为主分支)
   注意点:
   	1.不是写一句代码就add commit一次, 应该是完成一个功能后再add commit
   	2.commit时-m注释一定要认真编写, 与当前提交内容保持一致, **否则要挨骂**

### 单人使用Git管理项目好处:

​    1.可以通过git status查看哪些文件没有被管理, 修改了哪些文件
​      红色(没有被管理或者被修改了)、绿色(在暂缓区)
​    2.可以通过 git diff查看具体修改了哪些代码
​    3.可以通过git log / git reflog查看项目演变历史
​	4.可以通过git reset --hard 版本号  在任意版本之间切换
​	5.无需备份多个文件, 每次commit提交Git会自动备份



- `git help` ：git指令帮助手册
  - 查看其他指令的做法：git help 其他指令

## 个人仓库的各种操作

### 终端

1. 切换目录至需要创建仓库的位置
2. 初始化个人仓库
3. 设置配置信息

**切换目录**

```shell
cd 目录路径
```

**仓库初始化(个人仓库)**

> 仓库文件目录
>
> - HEAD: 指向当前分支的一个提交
> - description:  项目的描述信息
> - config:   项目的配置信息
> - info/:    里面有一个exclude文件，指定本项目要忽略的文件
> - objects/: Git对象库(commit/tree/blob/tag)
> - refs/:    标识每个分支指向哪个提交
> - hooks/:   默认的hook脚本

```shell
git init
```

### GIT设置配置信息

> **初次新设备初次使用一定要配置**

- 配置用户名：`git config user.name "用户名"`（用于跟踪修改记录）
- 配置邮箱：`git config user.email "邮箱"`（用于多人开发间的沟通）
- `git config -l` :   查看配置信息
- `git config -e` :   编辑配置信息



### 查文件的状态

- `git status` ：查文件的状态
  - 查看某个文件的状态：`git status 文件名`
  - 查看当前路径所有文件的状态：`git status`

```shell
# 红色文件说明文件都是新建还没有纳入管理范围
# 绿色文件说明文件现在暂缓区
# 没有文件,说明文件都已经在某个分支中了
```



### 将工作区的文件保存到暂缓区

`git add` ：将工作区的文件保存到暂缓区

- 保存某个文件到暂缓区：`git add 文件名`
- 保存当前路径的所有文件到暂缓区：`git add .`（注意，最后是一个点 . ）



### 将暂缓区的文件提交到当前分支

`git commit`：将暂缓区的文件提交到当前分支

- 提交某个文件到分支：`git commit -m ”注释” 文件名`
- 保存当前路径的所有文件到分支：`git commit -m ”注释”`









### 查看文件最新改动的地方

`git diff` ：查看文件最新改动的地方

- 查看某个文件的最新改动的地方：`git diff 文件名`
- 查看当前路径所有文件最新改动的地方：`git diff`



### 查看分支引用记录（能够查看所有的版本号）

`git reflog` ：查看分支引用记录（能够查看所有的版本号）



### 删除文件

`git rm`：删除文件（删完之后要进行commit操作，才能同步到版本库）



### 版本回退

`git reset`：版本回退（建议加上––hard参数，git支持无限次后悔）

- 回退到上一个版本：`git reset ––hard HEAD^`
- 回退到上上一个版本：`git reset ––hard HEAD^^`
- 回退到上N个版本：`git reset ––hard HEAD~N（N是一个整数）`
- 回退到任意一个版本：`git reset ––hard 版本号（版本号用7位即可）`



https://github.com/github/gitignore)

### 查看文件的修改日志

`git log` ：查看文件的修改日志

- 查看某个文件的修改日志：`git log 文件名`
- 查看当前路径所有文件的修改日志：`git log`
- 用一行的方式查看简单的日志信息：`git log ––pretty=oneline`
- 查看最近的N次修改：`git log –N`（N是一个整数）





### Git忽略提交规则 - .gitignore配置

> 被过滤掉的文件就不会出现在git仓库中（gitlab或github）了，当然本地库中还有，只是push的时候不会上传。

别看了, 你想要的都在这[企业开发专用链接]

```shell
#               表示此为注释,将被Git忽略
*.a             表示忽略所有 .a 结尾的文件
!lib.a          表示但lib.a除外
/TODO           表示仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO
build/          表示忽略 build/目录下的所有文件，过滤整个build文件夹；
doc/*.txt       表示会忽略doc/notes.txt但不包括 doc/server/arch.txt
 
bin/:           表示忽略当前路径下的bin文件夹，该文件夹下的所有内容都会被忽略，不忽略 bin 文件
/bin:           表示忽略根目录下的bin文件
/*.c:           表示忽略cat.c，不忽略 build/cat.c
debug/*.obj:    表示忽略debug/io.obj，不忽略 debug/common/io.obj和tools/debug/io.obj
**/foo:         表示忽略/foo,a/foo,a/b/foo等
a/**/b:         表示忽略a/b, a/x/b,a/x/y/b等
!/bin/run.sh    表示不忽略bin目录下的run.sh文件
*.log:          表示忽略所有 .log 文件
config.php:     表示忽略当前路径的 config.php 文件
 
/mtk/           表示过滤整个文件夹
*.zip           表示过滤所有.zip文件
/mtk/do.c       表示过滤某个具体文件

```

------

## 

### 文件添加版本管理

```shell
# 需要注意的是，gitignore还可以指定要将哪些文件添加到版本管理中，如下：
!*.zip
!/mtk/one.txt

# 唯一的区别就是规则开头多了一个感叹号，Git会将满足这类规则的文件添加到版本管理中。为什么要有两种规则呢？
# 想象一个场景：假如我们只需要管理/mtk/目录中的one.txt文件，这个目录中的其他文件都不需要管理，那么.gitignore规则应写为：：
/mtk/*
!/mtk/one.txt

# 假设我们只有过滤规则，而没有添加规则，那么我们就需要把/mtk/目录下除了one.txt以外的所有文件都写出来！
# 注意上面的/mtk/*不能写为/mtk/，否则父目录被前面的规则排除掉了，one.txt文件虽然加了!过滤规则，也不会生效！

----------------------------------------------------------------------------------
# 还有一些规则如下：
fd1/*
# 说明：忽略目录 fd1 下的全部内容；注意，不管是根目录下的 /fd1/ 目录，还是某个子目录 /child/fd1/ 目录，都会被忽略；

/fd1/*
# 说明：忽略根目录下的 /fd1/ 目录的全部内容；

/*
!.gitignore
!/fw/ 
/fw/*
!/fw/bin/
!/fw/sf/
# 说明：忽略全部内容，但是不忽略 .gitignore 文件、根目录下的 /fw/bin/ 和 /fw/sf/ 目录；注意要先对bin/的父目录使用!规则，使其不被排除。
```

