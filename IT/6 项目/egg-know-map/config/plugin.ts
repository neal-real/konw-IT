import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // mongoose 数据库开启
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  // 开启 redis 数据库插件
  sessionRedis: {
    enable: true,
    package: 'egg-session-redis',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  // 开启跨域插件
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  // 配置模板
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks'
  }
};

export default plugin;
