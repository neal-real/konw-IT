/**
 * ^ $项目初始化项目
 * # 1.自动路由加载
 * # 2.全局加载错误常量
 * # 3.添加配置文件到全局
*/
const Router = require('koa-router')
const requireDirectory = require('require-directory')
const error_const = require('./error-const')

class InitManager {
  static initCore(app) {
    // 入口方法
    InitManager.app = app;
    // 自动路由加载
    InitManager.initLoadRouters()
    // 加载全局错误监听
    InitManager.loadErrorCustom()
    // 添加配置文件
    InitManager.loadConfig()
  }

  // > 加载全部路由
  static initLoadRouters() {
    // 绝对路径
    const apiDirectory = `${process.cwd()}/app/api`
    console.log(apiDirectory)
    // 路由自动加载
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule
    })
    // 判断 requireDirectory 加载的模块是否为路由
    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }
  // > 添加配置文件到全局变量中
  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.js'
    const config = require(configPath)
    global.config = config
  }
  // > 错误监听对象到全局变量中
  static loadErrorCustom() {
    const errors = require(process.cwd() + 'core/error-const.js')
    global.error = errors
  }
}

module.exports = InitManager
