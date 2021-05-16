## 什么是loader?

- webapck的本质是一个模块打包工具, 所以webpack默认只能处理JS文件,不能处理其他文件,因为其他文件中没有模块的概念, 但是在企业开发中我们除了需要对JS进行打包以外,还有**可能需要对图片/CSS等进行打包**, 所以为了能够**让webpack能够对其它的文件类型进行打包**,在打包之前就必须将其它类型文件**转换**为webpack能够识别处理的模块,用于将其它类型文件转换为webpack能够识别处理模块的工具我们就称之为loader

- webpack中的loader都是用NodeJS编写的, 但是在企业开发中我们完全没有必要自己编写,因为已经有众多大神帮我们编写好了企业中常用的loader, 我们只需要安装、配置、使用即可

## 如何使用loader

1. 通过npm安装对应的loader
2. 按照loader作者的要求在webpack进行相关配置
3. 使用配置好的loader

## loader特点:

1. 单一原则, 一个loader只做一件事情

2. 多个loader会按照从右至左, 从下至上的顺序执行

   1. 例如: 从右至左      [ 'style-loader', 'css-loader' ]

      - 先执行css-loader解析css文件关系拿到所有内容,
      - 再执行style-loader将内容插入到HTML的HEAD代码中

   2. 例如: 从下至上

      ```js
      [{
        loader: "style-loader"
      },{
        loader: "css-loader"
      }]
      ```

      - 先执行css-loader解析css文件关系拿到所有内容
      - 再执行style-loader将内容插入到HTML的HEAD代码中