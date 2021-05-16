## 什么是html-withimg-loader?

- 我们通过file-loader或者url-loader已经可以将JS或者CSS中用到的图片打包到指定目录中了但是file-loader或者url-loader并不能将HTML中用到的图片打包到指定目录中所以此时我们就需要再借助一个名称叫做"html-withimg-loader"的加载器来实现HTML中图片的打包

## html-withimg-loader使用

- https://www.npmjs.com/package/html-withimg-loader

## 安装html-withimg-loader

- npm install html-withimg-loader --save

## 配置html-withimg-loader

```js
{
    test: /\.(htm|html)$/i,
    loader: 'html-withimg-loader'
}
```

