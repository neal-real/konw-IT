// 1.导入Koa
const Koa = require('koa');
// 2. 初始化设置
const InitManager = require('./core/init')
// 3. 全局错误监听
const catchError = require('./middlewares/error')
// 4. post 数据解析
const parser = require('koa-bodyparser')


const app = new Koa();
app.use(catchError)
app.use(parser)
InitManager.initCore(app)
const port = 3000
// 3.指定监听的端口
app.listen(port,()=>{
  console.log('服务器启动')
});