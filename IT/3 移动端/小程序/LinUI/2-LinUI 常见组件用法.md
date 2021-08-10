## LinUI 常见组件用法

[官方文档地址](https://doc.mini.talelin.com/component/view/avatar.html)

详细的用法官方文档都有



## 头像类型

组件支持三种类型，Icon(字符图片)、图片(jpeg 或 png 格式图片) 以及`open-data用户微信头像`，三种类型的优先级依次是`open-data`、Icon和图片。

### 用户微信头像

1. 引入组件在 ***.json 引入 或在全局 app.json 中引入

   ```js
   {
     "component": true,
     "usingComponents": {
       "l-button":"/miniprogram_npm/lin-ui/button/index",
       "l-avatar":"/miniprogram_npm/lin-ui/avatar/index"
     }
   }
   ```

   

- placement :显示用户名在头像的哪个方向
- open-data: 获取用户头像和姓名
- size: 默认单位是 rpx ,但因为图片和元素之间没有间距,所以会显得比原生 `image` 元素大一点

```html
<l-avatar placement="bottom" open-data="{{['userAvatarUrl','userNickName']}}" />
```



### 