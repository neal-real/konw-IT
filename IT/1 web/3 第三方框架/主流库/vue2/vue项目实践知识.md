# Vue 项目实践

## 项目配置

### 疑问

~~~js
npm run eject  //弹项目
npm run serve  //重启服务器
vue inspect   //webpack全部配置文件
vue inspect --rules  // 查看rules的配置信息
~~~

### 配置使用

~~~js
1. 新建vue.config.js文件
2. 导出配置内容
~~~

##### vue.config.js 演示

~~~js
const prot = 7070;
const title= 'vue项目最佳实践'

module.exports = {
  // 配置服务器接口
  devServer: {
    contentBase: "./dist",
    open: true,
    hot: true,
    port: prot
  },
  // webpack  
  configureWebpack:{
    name : title
  }
}
~~~























## 项目结构



## 权限控制



## 数据的交互



## UI库选择

### pc 端

>  element UI 一家独大
>
>  数据可视化: examples

### mobile

