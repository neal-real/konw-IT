import { Application } from 'egg';

export default (app: Application) => {
  // 首页
  require('./router/main')(app)
  // 用户模块
  require('./router/user')(app)
  // 用户模块
  require('./router/authority')(app)
};
