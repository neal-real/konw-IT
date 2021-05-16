
/**
* & 文件说明: 本文件做了 2 件事
* 1. 声明了一个菜单视图
* 2. 将菜单视图,放入插件对象中 ,并暴露这个插件
*/
// 菜单视图:
class MenuView {

  constructor(items, editorView) {
    this.items = items
    this.editorView = editorView
    
    this.dom = document.createElement("div")
    this.dom.className = "menubar"
    // 循环添加 items 到 dom 中
    items.forEach(({ dom }) => this.dom.appendChild(dom))
    this.update()
    // 监听事件按下按钮
    this.dom.addEventListener("mousedown", e => {
      // 取消事件的默认动作
      e.preventDefault()
      // 赋予编辑视图焦点
      editorView.focus()
      // 循环编列 items
      items.forEach(({ command, dom }) => {
        /**
        * dom.contains 当前DOM对象返回的节点中的子节点是否包含e.target 中的节点
        * target 事件属性可返回事件的目标节点（触发该事件的节点），如生成事件的元素、文档或窗口
        * 触发事件的节点,确实在 dom 中的情况返回 true
        */
        if (dom.contains(e.target))
          // 利用命令对象的方法,给予 editorView 的状态\  dispatch 和 编辑视图本身
          // ? 目的可能是为了绑定 点击图标和快捷键指令的关系
          command(editorView.state, editorView.dispatch, editorView)
      })
    })
    // 设置样式
    this.setNormalStyle(this.dom.style)
  }
  // 设置普通样式
  setNormalStyle(styleObj) {
    // 编辑栏的背景色
    styleObj.backgroundColor = '#rgba(0, 0, 0, 0.3)'
    // 编辑栏的底部边框
    styleObj.borderBottom = 'rgba(100, 100, 100, 0.2) 0.5px solid'
    // 编辑栏的高度
    styleObj.height = '26px'
    styleObj.display = 'flex'
    styleObj.alignItems = 'center'
  }
  // 更新
  update() {
    // 遍历 items
    this.items.forEach(({ command, dom }) => {
      // 获得绑定的 指令对象.
      let active = command(this.editorView.state, null, this.editorView)
      // 文档的样式,返回值是 true 则设置为 null ,否则隐藏
      dom.style.display = active ? "" : "none"
    })
  }
  // 销毁
  destroy() { this.dom.remove() }
}


// 从状态中提供一个插件对象, 提供一个插件对象, 创建一个视图
import { Plugin } from "prosemirror-state"

// 菜单视图对象就是最上方那一排菜单, 根据 item数组中的对象,装机 菜单视图对象 MenuView
// & 创建一个包含 菜单栏视图的 插件
function menuPlugin(items) {
  return new Plugin({
    view(editorView) {
      let menuView = new MenuView(items, editorView)
      console.log(items)
      // 编辑器的视图的 dom.解析节点.在编辑器视图前的dom 插入菜单视图的 dom
      editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom)
      return menuView
    }
  })
}



export {
  menuPlugin
}