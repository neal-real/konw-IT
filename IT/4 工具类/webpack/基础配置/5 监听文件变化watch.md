## 开发中用 dev-server

## 什么是watch?

- webpack 可以监听打包文件变化，当它们修改后会重新编译打包
- 那么如何监听打包文件变化呢?  使用 watch

## watch相关配置watchOptions

poll: 1000 // 每隔多少时间检查一次变动

aggregateTimeout:  // 防抖, 和函数防抖一样, 改变过程中不重新打包, 只有改变完成指定时间后才打包

ignored: 排除一些巨大的文件夹, 不需要监控的文件夹, 例如 node_modules



## watch 使用



```js
module.exports = {
    watch: true,
    watchOptions: {
			// 防抖,改变过程中不重新打包, 只有改变完成指定时间后才打包,,单位毫秒
      aggregateTimeout: 300, 
      // 每隔多少时间检查一次变动, 单位毫秒 1000 = 1秒
      poll: 1000, 
			// 排除一些巨大的文件夹, 不需要监控的文件夹
      ignored: /node_modules/ 
    },
}
```

