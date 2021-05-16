/**
* & 文件说明: 本文件做了 1 件事
* 1. 配置插件中的每一个 item ,并将配置好的插件暴露出去
*/ 

// 提供设置好的快捷键指令
import { toggleMark, setBlockType, wrapIn } from "prosemirror-commands"
import { schema } from "prosemirror-schema-basic"
import { menuPlugin } from "./menu"

// 创建一个菜单栏中的 图标,并设置他的样式,标题,文字内容
function icon(text, name) {
  // 创建元素
  let span = document.createElement("div")
  span.className = "menuicon " + name
  // 鼠标停留显示
  span.title = name
  // 文字内容
  span.textContent = text
  return span
}

// 返回一个指定好指令和 DOM 的对象
function heading(level) {
  return {
    command: setBlockType(schema.nodes.heading, { level }),
    dom: icon("H" + level, "标题" + level)
  }
}
// menuPlugin 是一个数组,里面装好对象,每个对象包含 指令和dom 两个参数
var menu = menuPlugin([
    /*
    指令: 绑定指令和 规则的标记中的 strong 关联, ;
    dom 的 icon 是 字母 B, 鼠标停留显示 strong 
    */  
    { command: toggleMark(schema.marks.strong), dom: icon("B", "⌘+B") },
    { command: toggleMark(schema.marks.em), dom: icon("i", "⌘+I") },
    { command: setBlockType(schema.nodes.paragraph), dom: icon("格式清除", "paragraph") },
    heading(1), 
    heading(2),
    heading(3), 
    heading(4),
    { command: wrapIn(schema.nodes.blockquote), dom: icon("引用", "blockquote") }
  ])


  
export {
  menu
}