import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // 从Framework / Plugin覆盖配置
  // 用于cookie标志键，应该改变自己并保持安全
  config.keys = appInfo.name + '_1623820593539_3624';
  /**
   * ^加密模块的 key
   */
  config.cryptoKEY = {
    aesKey: 'www.know-map.com+10086',
    jwtKey: 'wwww.know-map.com+11bbcc'
  }
  // 在此添加您的 egg 中间件配置
  config.middleware = ['auth'];
  // 添加中间件的配置
  config.auth = {
    routes: /^\/main\/|^\/user\//g
  }

  // 在此添加您的特殊配置
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };
  // 跨域相关的配置
  config.cors = {
    // 允许跨域的地址 : 参数格式:{string|Function}  http://localhost:8080/register
    origin: 'http://127.0.0.1:8080',
    // 允许的方法: 参数格式: {string|Array} 
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    // 允许前端携带 cookie
    credentials: true
  };
  // mongodb 登录信息
  config.mongoose = {
    client: {
      url: "mongodb://knowmapAdmin:knowmapwang1987@81.70.50.77:27017/knowmap",
      options: { useNewUrlParser: true, useUnifiedTopology: true }
    }
  };
  // Redis相关配置
  config.redis = {
    // 端口和数据库必须是数值
    client: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
    }
  }

  config.session = {
    key: 'EGG_SESS',  //eggjs默认session的key
    maxAge: 24 * 3600 * 1000,  // 1 day
    httpOnly: true,
    encrypt: true,  // 是否加密
    renew: true  //每次访问页面都会给session会话延长时间
  }
  // 邮箱相关配置
  config.smtp = {
    host: "smtp.exmail.qq.com",  // 看推荐
    port: 465,    // 端口号, 看推荐或者网上搜 没有推荐默认可能是 465
    secure: true, // 端口是465写 true, 其他写 false
    user: "knowmap@know-map.com", // 发送邮件的邮箱
    pass: "Wsl19870719"   // 邮箱对应的授权码, 没有授权码写密码
  }
  // 腾讯云短信相关配置
  config.sms = {
    secretId: 'AKIDOcZFgqlPlqfDVXJp30g5D5h3A1btvgBQ',
    secretKey: 'ziAKErDI7FAoBH6fy1nIWT9XfX9TWIn1'
  }
  // 腾讯云对象存储
  config.cos = {
    secretId: 'AKIDOcZFgqlPlqfDVXJp30g5D5h3A1btvgBQ',
    secretKey: 'ziAKErDI7FAoBH6fy1nIWT9XfX9TWIn1'
  }
  // 配置模板引擎
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  }
  // 返回配置将合并到EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};