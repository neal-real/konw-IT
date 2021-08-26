/*
 ? 处理验证码相关的路由接口
 # 1.接收用户相关的路由
*/

import { Controller } from 'egg';


export default class ImageController extends Controller {
  // 保存图片
  public async saveImage() {
    const as = this.ctx.service.as.index
    try {
      const result = await as.get_avatarUrl(this.ctx.req)
      this.ctx.body = this.ctx.msg(200, '上传成功', result)
    } catch (error) {
      this.ctx.body = this.ctx.msg(400, error)
    }
  }
}
