const { Schema } = require("prosemirror-model")
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// & 文本规则
const textSchema = new Schema({
  nodes: {
    text: {},
    doc: { content: "text*" }
  }
})
// & 节点规则
const noteSchema = new Schema({
  nodes: {
    text: {},
    note: {
      content: "text*",
      toDOM() { return ["note", 0] },
      parseDOM: [{ tag: "note" }]
    },
    notegroup: {
      content: "note+",
      toDOM() { return ["notegroup", 0] },
      parseDOM: [{ tag: "notegroup" }]
    },
    doc: {
      content: "(note | notegroup)+"
    }
  }
})

const { findWrapping } = require("prosemirror-transform")
// 快捷键绑定
function makeNoteGroup(state, dispatch) {
  // 获取选择的节点的 ranges
  let range = state.selection.$from.blockRange(state.selection.$to)
  // 查看是否允许用 note group 包裹这个 ranges
  let wrapping = findWrapping(range, noteSchema.nodes.notegroup)
  // 如果不允许的话，命令不会执行
  if (!wrapping) return false
  // 否则，dispatch 一个 transaction，使用 `wrap` 方法开创建一个实现包裹行为的行为
  if (dispatch) dispatch(state.tr.wrap(range, wrapping).scrollIntoView())
  return true
}

// & 星星规则
let starSchema = new Schema(
  {
    nodes: {
      text: {
        group: "inline",
      },
      star: {
        inline: true,
        group: "inline",
        toDOM() { return ["star", "X"] },
        parseDOM: [{ tag: "star" }]
      },
      paragraph: {
        group: "block",
        content: "inline*",
        toDOM() { return ["p", 0] },
        parseDOM: [{ tag: "p" }]
      },
      boring_paragraph: {
        group: "block",
        content: "text*",
        marks: "",
        toDOM() { return ["p", { class: "boring" }, 0] },
        parseDOM: [{ tag: "p.boring", priority: 60 }]
      },
      doc: {
        content: "block+"
      }
    },
    marks: {
      shouting: {
        toDOM() { return ["shouting"] },
        parseDOM: [{ tag: "shouting" }]
      },
      link: {
        attrs: { href: {} },
        toDOM(node) { return ["a", { href: node.attrs.href }] },
        parseDOM: [{ tag: "a", getAttrs(dom) { return { href: dom.href } } }],
        inclusive: false
      }
    }
  }
)



// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// & 快捷键的处理
const { toggleMark } = require("prosemirror-commands")
const { keymap } = require("prosemirror-keymap")

// 映射对象, 表示快捷键和功能的链接
let starKeymap = keymap({
  "Mod-b": toggleMark(starSchema.marks.shouting),
  "Mod-q": toggleLink,
  "Mod-Space": insertStar
})
// 切换链接
function toggleLink(state, dispatch) {
  let { doc, selection } = state
  if (selection.empty) return false
  let attrs = null
  if (!doc.rangeHasMark(selection.from, selection.to, starSchema.marks.link)) {
    attrs = { href: prompt("Link to where?", "") }
    if (!attrs.href) return false
  }
  return toggleMark(starSchema.marks.link, attrs)(state, dispatch)
}
// 插入星星
function insertStar(state, dispatch) {
  // 获得 星规则下节点数组的星类型规则
  let type = starSchema.nodes.star
  // 获得选中去的开始位置
  let { $from } = state.selection
  // 检查光标所在位置是否允许插入 星 类型的内容
  if (!$from.parent.canReplaceWith($from.index(), $from.index(), type)) {
    return false
  }
  // 可以的话,创建一个新的 星 节点替换选区
  dispatch(state.tr.replaceSelectionWith(type.create()))
  return true
}



// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// & 通过(位置、内容、模式、插件) 创建编辑器视图
const { DOMParser } = require("prosemirror-model")
const { EditorState } = require("prosemirror-state")
const { EditorView } = require("prosemirror-view")
const { baseKeymap } = require("prosemirror-commands")
const { history, undo, redo } = require("prosemirror-history")

let histKeymap = keymap({ "Mod-z": undo, "Mod-y": redo })

// 通过(位置、内容、模式、插件) 创建编辑器视图
function start(place, content, schema, plugins = []) {
  // DOM 解析,从规则中解析内容为 文档
  let doc = DOMParser.fromSchema(schema).parse(content)
  // 生成编辑视图
  return new EditorView(
    // 编辑视图的位置
    place,
    // 创建一个状态(温昂,插件)
    {
      state: EditorState.create({
        doc,
        plugins: plugins.concat([histKeymap, keymap(baseKeymap), history()])
      })
    }
  )
}
// 获取指定 id 的元素
function id(str) { return document.getElementById(str) }


// 处理快捷键
// id是 html 元素中的 id 
start(
  { mount: id("text-editor") },
  id("text-content"),
  textSchema
)
start(
  id("note-editor"),
  id("note-content"),
  noteSchema,
  [keymap({ "Mod-Space": makeNoteGroup })]
)
start(
  id("star-editor"),
  id("star-content"),
  starSchema,
  [starKeymap]
)
