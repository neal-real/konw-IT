## 组件库 LinUI

>  [LinUI](https://doc.mini.talelin.com/)

## 基本使用

1. 安装:

```shell
# 小程序的项目根目录，执行下面的命令（如果使用了云开发，需要进入miniprogram文件夹下执行下面的命令
npm init

# 如果因为墙的问题,可以使用淘宝源
npm config set registry https://registry.npm.taobao.org 

# 下载 linUI
npm install lin-ui
```

 1.1 方式二：下载代码

直接通过git下载 `Lin UI` 源代码，并将 `dist` 目录（Lin-UI 组件库）拷贝到自己的项目中。

```sh
git clone https://github.com/TaleLin/lin-ui.git
```



2. 配置微信开发者工具

- 要正确使用 Lin UI，需将微信开发者工具的 `Es6 转 ES5` 和 `增强编译` 选项勾选上

  > 设置路径：微信开发者工具右上角 -> 详情 -> 本地设置

- **将基础库版本设置到 `>=2.8.2`**

3. 小程序需要添加一步构建 npm
   1. 在小程序菜单栏中选 `工具`->`构建npm` 
   2. 构建完成后点击确定
   3. 之后目录中会新建 `miniprogram_npm`文件夹, 该文件夹会自动从`node_modules` 中引入框架,不需要额外关心其他的
4. 在页面中引入
   - 引入的组件名 `"l-组件明"`:`"引入路径到组件下的 index 文件"`

```json
{
  "usingComponents":{
    "l-button":"/miniprogram_npm/lin-ui/button/index"
  }
}
```

4. 在页面中使用

```html
 <l-button type="default">默认按钮</l-button>
```





## 全局样式更改

> Lin UI 的样式使用了 Less 作为开发语言，并定义了一系列全局/组件的样式变量，你可以根据需求进行相应调整。

以下是一些最常用的通用变量，所有样式变量可以在这里找到。

- 组件样式变量 找到根目录，打开`config/style/_base.less`文件

```less
// Color 
@default-color          : @theme-color;
@success-color          : #34BFA3;
@warning-color          : #FFE57F;
@error-color            : #F4516C;
@disabled-color         : #DEE2E6;
@selected-color         : fade(@default-color, 90%);
@tooltip-color          : #fff;
@subsidiary-color       : #80848f;
@rate-star-color        : #f5a623;

// Text
@title-color            : #0e0e0e;
@text-color             : #888;
```

- 主题色更改

同样打开根目录，打开`config/style/_theme.less`文件，看到文件中定义了一个变量 `@theme-color` ，如果有主题色修改的需求，更改它即可。

```less
// 主题色

@theme-color            : #2c61b4;                      // 主题色
```

其他 更改完成后，在Lin UI下的根目录里打开终端执行如下所示命令

```bash
npm run build
```

根目录下的 `dist` 文件夹即是编译后的自定义组件。



### [#](https://doc.mini.talelin.com/start/#按需加载组件)按需加载组件

> 按需加载组件需要您配置config文件下的component.json文件

例如只需要 `button` 和 `loading` 两个组件，在`component.json`填入需要的组件名，如下所示代码：

```json
{
  "components": [
    "button",
    "loading"
  ]
}
```

配置完成后，在 `Lin UI` 下的根目录里打开终端执行

```bash
npm run build
```

此时dist文件夹下面会生成button和loading两个组件及其所依赖的组件。

```text
├── dist
│   └── button.                             // button组件
│    ├── index.wxml                         // 组件wxml文件
│    ├── index.wxss                         // 组件wxss文件
│    ├── index.json                         // 组件json文件
│    └── index.js                           // 组件js文件
│   └── loading                             // loading组件
```

根目录下的 `dist` 文件即是编译后的自定义组件，使用时将他拷贝到自己的项目里即可。