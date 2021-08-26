import { Controller } from 'egg';

export default class RootController extends Controller {
  public async index() {
    const {ctx} = this
    ctx.body = ctx.msg(200, '成功', `hi, aaa}`)
  }
}
