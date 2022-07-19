- ### 使用 redis 保存 session

  #### 1.安装

  ```shell
  npm i egg-session-redis egg-redis --save
  ```

  #### 2.开启插件

  `config/plugin.ts`

  ```tsx
  import { EggPlugin } from 'egg';
  
  const plugin: EggPlugin = {
    // 开启 redis 数据库插件
    sessionRedis: {
      enable: true,
      package: 'egg-session-redis',
    },
    redis: {
      enable: true,
      package: 'egg-redis',
    },
  };
  
  export default plugin;
  ```

  #### 3.添加配置文件

  `config/config.local.ts`

  ```js
  import { EggAppConfig, PowerPartial } from 'egg';
  
  export default () => {
    const config: PowerPartial<EggAppConfig> = {};
    config.redis = {
      clients: {
        adobe: {
          host: '127.0.0.1',
          port: 6379,
          name: 'wechat_redis0',
          password: '',
          db: 0,
        },
        wechat_redis: {
          host: '127.0.0.1',
          port: 6379,
          name: 'wechat_redis1',
          password: '',
          db: 1,
        },
      },
    };
    config.sessionRedis = {
      name: 'adobe',
    };
    config.session = {
      key: 'EGG_SESS',
      maxAge: 24 * 3600 * 1000,
      httpOnly: true,
      encrypt: true,
      renew: true,
    };
    return config;
  };
  ```
  
  #### 4.启动数据库
  
  > 可以使用宝塔面板处理
  >
  > 也可以使用下列方式处理
  
