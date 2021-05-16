## less-loader

- 自动将less转换为CSS



## less-loader使用:

### 安装less

npm install --save-dev less

### 安装less-loader

npm install --save-dev less-loader

### 配置less-loader

- 因为loader是从右至左从下至上,所以必须先由less-loader处理往后才能交给其他loader处理

```js
{
    test: /\.less$/,
    use: [{
        loader: "style-loader"
    }, {
        loader: "css-loader"
    }, {
        loader: "less-loader"
    }]
}
```

