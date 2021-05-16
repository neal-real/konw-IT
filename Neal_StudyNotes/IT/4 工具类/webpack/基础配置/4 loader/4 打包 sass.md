## scss-loader

- 自动将scss转换为CSS



## scss-loader使用:

### 安装scss

npm install --save-dev node-sass

### 安装less-loader

npm install --save-dev sass-loader

### 配置less-loader

- 因为loader是从右至左从下至上,所以必须先由sass-loader处理往后才能交给其他loader处理

```js
{
  test: /\.scss$/,
  use: [{
      loader: "style-loader" // 将 JS 字符串生成为 style 节点
  }, {
      loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
  }, {
      loader: "sass-loader" // 将 Sass 编译成 CSS
  }]
}
```

