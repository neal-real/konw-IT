

## 不同平台设置环境变量方式

- 例如：windows下配置NODE_ENV

  ```shell
  #首先查看NODE_ENV是否存在
  set NODE_ENV
  #如果不存在则添加环境变量
  set NODE_ENV=production
  #某些时候需要删除环境变量
  set NODE_ENV=
  ```

  

- 例如：Linux下配置NODE_ENV

  ```shell
  #首先查看NODE_ENV是否存在
  echo $NODE_ENV
  #如果不存在则添加环境变量
  export NODE_ENV=production
  #某些时候需要删除环境变量
  unset NODE_ENV
  ```

  

## 什么是cross-env?

cross-env是一款运行跨平台的设置和使用环境变量的脚本。



## 为什么要使用cross-env

因为我们在自定义配置环境变量的时候，由于在不同的环境下，配置的方式也是不同. 所以我们需要使用cross-env来统一配置方式



## cross-env使用

1. 下载

`npm install --save-dev cross-env`

2. 配置 package.json 文件
   - 注意:  这里使用了 nodemon 重启服务模块

```json
"scripts": {
  "dev": "cross-env NODE_ENV=dev nodemon ./app.js",
  "build": "cross-env NODE_ENV=pro nodemon ./app.js"
}
```

3. 运行 不同环境变量

   1. 开发阶段 :` npm run dev`
   2. 上线阶段: `npm run build`

4. 查看环境变量

   ```js
   let 数据库配置;
   if(process.env.NODE_ENV === 'dev'){
   	// 开发阶段
     数据库配置 = {
       
     }
     console.log('开发阶段')
   } else if (process.env.NODE_ENV === 'pro'){
     // 上线阶段
     数据库配置 = {
       
     }
     console.log('上线阶段')
   }
   ```

   