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
    }
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
      client: {
        host: '127.0.0.1',
        port: 6379,  // 端口必须是数值
        password: '',
        db: 0,// 数据库也必须是数值
      }
    };
    return config;
  };
  ```

  #### 4.启动数据库

  1. 下载 : mac https://redis.io/download

     或者

     ```shell
     wget http://download.redis.io/releases/redis-6.2.4.tar.gz
     tar xzf redis-6.2.4.tar.gz
     # 可以改名名 redis
     cd redis-6.2.4
     ```

  2. 使用命令编译安装

  3. -  **make** 命令后，redis 的 **src** 目录下会出现编译后的 redis 服务程序 redis-server，还有用于测试的客户端程序 redis-cli：

     ```shell
     #在 redis 目录下执行
     make
     ```

  4. 切换目录

     ```shell
     cd src
     ```

     

  5. 启动 redis 服务

  6. - 启动成功显示

       `3809:M 17 Jun 2021 18:28:35.352 # Server initialized`

       `3809:M 17 Jun 2021 18:28:35.352 * Ready to accept connections`

     ```shell
     # 使用默认配置启动服务器
     ./redis-server
     # 或者使用配置文件启动服务器
     ./redis-server ../redis.conf
     ```

  7. 连接服务器(到这一步就可以了)

     ```shell
     ./redis-cli -h 127.0.0.1 -p 6379
     ```

  8. 验证的方法,是否保存成功,可以看下面

  9. 调用一次图像验证码, 保存生成的验证码

  10. 在初次连接 redis 服务器后,可以验证是否可以正确获得验证码,此步骤可以省略

      - code\":\"uLbS" 

      ```shell
      # 获取验证吗
      keys *
      # 返回: 1) "9b30e393-104d-44c9-a80c-82ed845dd174"
      # 解析
      get get "9b30e393-104d-44c9-a80c-82ed845dd174"
      
      # 返回: "{\"captcha\":{\"code\":\"uLbS\",\"expire\":1623926045493},\"_expire\":1624012385494,\"_maxAge\":86400000}"
      
      ```

      

  ### 扩展功能

  `/app/extend/helper.ts`

  ```js
  import ImageCode from '../util/imageCode';
  
  module.exports = {
      createImageCode() {
          return ImageCode.createImageCode(this.ctx);
      },
      verifyImageCode(clientCode){
          ImageCode.verifyImageCode(this.ctx, clientCode);
      }
  };
  ```

  

  ## 实现完整功能的封装

  ### 1. 创建图片验证码功能

  1. 创建文件和相关目录, 最终创建文件`app/util/imageCode.ts`
  2. 引入第三方库 `import svgCaptcha = require('svg-captcha');`
  3. 写入代码,并导出

  ```js
  // imageCode.ts
  /*
    ^ 图片验证码功能
    ^ 备注: 功能不完善
  */
  import svgCaptcha = require('svg-captcha');
  
  export default {
    // > 生成验证码,并返回
    createImageCode(ctx) {
      // 1.设置验证配置
      const c = svgCaptcha.create({
        size: 4, // 验证码长度
        width: 160,// 验证码图片宽度
        height: 60,// 验证码图片高度
        fontSize: 50, // 验证码文字大小
        ignoreChars: '0oO1ilI', // 验证码字符中排除内容 0o1i
        noise: 4, // 干扰线条的数量
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        background: '#eee' // 验证码图片背景颜色
      });
      // 2.保存生成的验证码
      ctx.session.captcha = {
        code: c.text,
        expire: Date.now() + 60 * 1000 // 验证码1分钟之后过期
      };
      // 3.将验证码发送给客户端
      return c.data;
    },
    // > 对验证码进行验证
    verifyImageCode(ctx, clientCode) {
      // 1.取出服务端中保存的验证码和过期时间
      const serverCaptcha = ctx.session.captcha;
      let serverCode;
      let serverExpire;
      try {
        serverCode = serverCaptcha.code;
        serverExpire = serverCaptcha.expire;
      } catch (e) {
        // 注意点: 验证码无论验证成功还是失败, 都只能使用一次
        ctx.session.captcha = null;
        throw new Error('请重新获取验证码');
      }
  
      if (Date.now() > serverExpire) {
        // 注意点: 验证码无论验证成功还是失败, 都只能使用一次
        ctx.session.captcha = null;
        throw new Error('验证码已经过期');
      } else if (serverCode !== clientCode) {
        // 注意点: 验证码无论验证成功还是失败, 都只能使用一次
        ctx.session.captcha = null;
        throw new Error('验证码不正确');
      }
      // 注意点: 验证码无论验证成功还是失败, 都只能使用一次
      ctx.session.captcha = null;
    }
  }
  ```

  

  ### 2. 将方法添加至 helper.ts

  - 知识属于 egg 框架中扩展模块的部分

  `app/extend/helper.ts`

  ```js
  import ImageCode from '../util/imageCode';
  
  module.exports = {
    createImageCode() {
      return ImageCode.createImageCode(this.ctx);
    },
    verifyImageCode(clientCode){
      ImageCode.verifyImageCode(this.ctx, clientCode);
    }
  };
  ```

  

  

  ### 示例: 获取验证码

  ```js
  // app/router.ts
  import { Application } from 'egg';
  export default (app: Application) => {
    const { controller, router } = app;
    // 请求验证码
    router.get('/captcha', controller.util.imageCode);
  	// 注册
    router.post('/register', controller.user.create);
  };
  
  
  //  app/controller/util.ts
  import { Controller } from 'egg';
  export default class UtilController extends Controller {
    // 生成验证吗
    public async imageCode() {
      ctx.body = this.ctx.helper.createImageCode();
    }
  }
  ```

  ### 示例: 验证验证码

  ```js
  // app/controller/user.ts
  // app/controller/user.ts
  import { Controller } from 'egg';
  
  export default class UserController extends Controller {
  
    private validateUserInfo() {
      const { ctx } = this;
      const data = ctx.request.body;
      // 校验当前的验证码是否正确
      ctx.helper.verifyImageCode(data.captcha);
    }
  }
  ```

  

  ## 注意点

  - 请求验证码和验证验证码的客户端**必须是同一个**,因为 egg 会自动返回 一个名为 `EGG_SESS`的 cookie. 客户端不一致是无法校验同一个验证码
