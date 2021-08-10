## 小程序使用 npm 的方法

小程序需要添加一步构建 npm

1. 在小程序菜单栏中选 `工具`->`构建npm` 
2. 构建完成后点击确定
3. 之后目录中会新建 `miniprogram_npm`文件夹, 该文件夹会自动从`node_modules` 中引入框架,不需要额外关心其他的
4. 之后正常使用
   1. 初始化项目 `npm init`
   2.  `npm install 包名`
   3. `npm install` 安装依赖...