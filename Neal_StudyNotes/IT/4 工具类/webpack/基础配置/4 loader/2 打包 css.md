## css-loader

- 和图片一样webpack默认能不能处理CSS文件, 所以也需要借助loader将CSS文件转换为webpack能够处理的类型

## css-loader使用

### 1. 安装cssloader

npm install --save-dev css-loader

### 2. 安装styleloader

npm install style-loader --save-dev

### 3. 配置css-loader

- css-loader和style-loader作用
  - css-loader:   解析css文件中的@import依赖关系
  - style-loader: 将webpack处理之后的内容插入到HTML的HEAD代码中
- 添加参数 modules: true ,避免 css 引入图片成为全局引用
  - 然后在导入的地方通过 `import obj from "./xxx.css"`导入
  - 然后在使用的地方通过 `obj.className`方式使用即可

```js
{
    test: /\.css$/,
    use: [ 
      {
       	loader: "style-loader" 
      }, 
      {
				loader: "css-loader",
        optiongs:{
          modules: true
        }
      }
    ]
}
```

