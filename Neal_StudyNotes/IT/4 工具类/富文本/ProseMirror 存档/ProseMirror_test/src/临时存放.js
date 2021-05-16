/**
* & 1. new Schema创建对象,
* & 2.DOM 解析
*/
import { Schema, DOMParser } from "../lib/model/index.js"
// & 规则
import { addListNodes } from '../lib/schema/schema-list.js'
import { schema } from '../lib/schema/schema-basic.js'

// ---------------------------------
// & 核心模块 状态
import { EditorState } from "../lib/state/index.js";
// & 核心模块 视图
import { EditorView } from "../lib/view/index.js";
// ----------------------------------
/**
* & 作者提供的基础设置
* 输入: inputrules
* 键盘映射: keymap
* 菜单:  menu
* 提示: prompt
*/ 
import { exampleSetup } from "../lib/plugins/index.js"


// & 创建规则对象 Schema
const mySchema = new Schema({
  /**
  * 1. 接受三个参数: 节点配置对象, 内容表达式,组
  */ 
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  // 接受标记配置
  marks: schema.spec.marks,
  /**
  * topNode: ?⁠string
  * 当前 schema 顶级节点的名字，默认是 "doc"。
  */
  topNode: 'doc'
})
// & 创建视图 到 view 中挂载
window.view = new EditorView(
  // > 第一个参数 指定的编辑器
  document.querySelector("#editor"),
  // > 第二个参数 是一个 状态 对象
  {
    state:
    // > 创建节点对象
      EditorState.create(
        {
          // 根文档
          doc:
            DOMParser.fromSchema(mySchema).parse(document.querySelector("#editor")),
            // 插件
          plugins:
            exampleSetup({ schema: mySchema })
        }
      )
  }
)
// &  基础结束
/**
* 1. 创建一个规则对象
* 2.创建编辑器视图
    2.1 告知可编辑元素,作为根元素
    2.2 创建状态对象
      2.2.1 声明根文档: 语义化 DPM 解析从 我的规则对象, 解析 DOM id 为 content 的元素
      2.2.2 声明插件: 并把 规则对象传入
* 
*/ 