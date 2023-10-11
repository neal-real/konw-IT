// 菜单功能
import {
  wrapItem,
  blockTypeItem,
  Dropdown,
  DropdownSubmenu,
  joinUpItem,
  liftItem,
  selectParentNodeItem,
  undoItem,
  redoItem,
  icons,
  MenuItem
} from "prosemirror-menu"

import { NodeSelection } from "prosemirror-state"

import { toggleMark } from "prosemirror-commands"

import { wrapInList } from "prosemirror-schema-list"
//        文本字段   打开提示
import { TextField, openPrompt } from "./prompt"

// 帮助创建特定类型的项目
// > 判断是否可以插入(状态,节点类型)
function canInsert(state, nodeType) {
  let $from = state.selection.$from
  for (let d = $from.depth; d >= 0; d--) {
    let index = $from.index(d)
    if ($from.node(d).canReplaceWith(index, index, nodeType)) 
    return true
  }
  return false
}
// 插入图片 item
function insertImageItem(nodeType) {
  return new MenuItem({
    title: "Insert image",
    label: "Image",
    enable(state) { return canInsert(state, nodeType) },
    run(state, _, view) {
      let { from, to } = state.selection, attrs = null
      if (state.selection instanceof NodeSelection && state.selection.node.type == nodeType)
        attrs = state.selection.node.attrs
      openPrompt({
        title: "Insert image",
        fields: {
          src: new TextField({ label: "Location", required: true, value: attrs && attrs.src }),
          title: new TextField({ label: "Title", value: attrs && attrs.title }),
          alt: new TextField({
            label: "Description",
            value: attrs ? attrs.alt : state.doc.textBetween(from, to, " ")
          })
        },
        callback(attrs) {
          view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)))
          view.focus()
        }
      })
    }
  })
}
// > 命令 item
function cmdItem(cmd, options) {
  let passedOptions = {
    label: options.title,
    run: cmd
  }
  for (let prop in options) passedOptions[prop] = options[prop]
  if ((!options.enable || options.enable === true) && !options.select)
    passedOptions[options.enable ? "enable" : "select"] = state => cmd(state)

  return new MenuItem(passedOptions)
}
// 标记为: 活动?
function markActive(state, type) {
  let { from, $from, to, empty } = state.selection
  if (empty) {
    return type.isInSet(state.storedMarks || $from.marks())
  }
  else {
    return state.doc.rangeHasMark(from, to, type)
  }
}
// 标记 item(标记类型, 可选项)
function markItem(markType, options) {
  let passedOptions = {
    active(state) {
      return markActive(state, markType)
    },
    enable: true
  }
  for (let prop in options) {
    passedOptions[prop] = options[prop]
  }
  return cmdItem(toggleMark(markType), passedOptions)
}

// > 链接 item
function linkItem(markType) {
  return new MenuItem({
    title: "Add or remove link",
    icon: icons.link,
    active(state) { return markActive(state, markType) },
    enable(state) { return !state.selection.empty },
    run(state, dispatch, view) {
      if (markActive(state, markType)) {
        toggleMark(markType)(state, dispatch)
        return true
      }
      openPrompt({
        title: "Create a link",
        fields: {
          href: new TextField({
            label: "Link target",
            required: true
          }),
          title: new TextField({ label: "Title" })
        },
        callback(attrs) {
          toggleMark(markType, attrs)(view.state, view.dispatch)
          view.focus()
        }
      })
    }
  })
}
// > 包装列表项
function wrapListItem(nodeType, options) {
  return cmdItem(wrapInList(nodeType, options.attrs), options)
}
// 建造菜单的 items
export function buildMenuItems(schema) {
  // console.log(schema)
  // r 就是工具栏案例中的菜单
  let r = {}

  /**
  * & 创建每一个 item 并确保他们有对应的规则设置
  * 
  */
  let type
  // 判断 schema.marks.strong 是否有值,有值添加到 r,否则跳过
  if (type = schema.marks.strong)
    r.toggleStrong = markItem(type, { title: "加粗风格", icon: icons.strong })
  if (type = schema.marks.em)
    r.toggleEm = markItem(type, { title: "斜体", icon: icons.em })
  if (type = schema.marks.code)
    r.toggleCode = markItem(type, { title: "Toggle code font", icon: icons.code })
  if (type = schema.marks.link)
    r.toggleLink = linkItem(type)

  if (type = schema.nodes.image)
    r.insertImage = insertImageItem(type)
  if (type = schema.nodes.bullet_list)
    r.wrapBulletList = wrapListItem(type, {
      title: "在项目符号列表中换行",
      icon: icons.bulletList
    })
  if (type = schema.nodes.ordered_list)
    r.wrapOrderedList = wrapListItem(type, {
      title: "Wrap in ordered list",
      icon: icons.orderedList
    })
  if (type = schema.nodes.blockquote)
    r.wrapBlockQuote = wrapItem(type, {
      title: "Wrap in block quote",
      icon: icons.blockquote
    })
  if (type = schema.nodes.paragraph)
    r.makeParagraph = blockTypeItem(type, {
      title: "Change to paragraph",
      label: "Plain"
    })
  if (type = schema.nodes.code_block)
    r.makeCodeBlock = blockTypeItem(type, {
      title: "改变代码块",
      label: "代码"
    })
  if (type = schema.nodes.heading)
    for (let i = 1; i <= 10; i++)
      r["makeHead" + i] = blockTypeItem(type, {
        title: "改变标题 " + i,
        label: "标题 " + i,
        attrs: { level: i }
      })
  if (type = schema.nodes.horizontal_rule) {
    let hr = type
    r.insertHorizontalRule = new MenuItem({
      title: "插入水平尺",
      label: "水平线",
      enable(state) { return canInsert(state, hr) },
      run(state, dispatch) { dispatch(state.tr.replaceSelectionWith(hr.create())) }
    })
  }

  /**
  * & 打包 Item 为 Items
  */


  // 清楚空的数组
  let cut = arr => arr.filter(x => x)
  // 下拉列表 出入
  r.insertMenu = new Dropdown(
    cut(
      [
        r.insertImage,
        r.insertHorizontalRule
      ]
    ),
    { label: "插入" }
  )
  r.typeMenu = new Dropdown(
    cut(
      [
        r.makeParagraph,
        r.makeCodeBlock,
        // 下拉子菜单
        r.makeHead1 && new DropdownSubmenu(
          cut(
            [
              r.makeHead1,
              r.makeHead2,
              r.makeHead3,
              r.makeHead4,
              r.makeHead5,
              r.makeHead6
            ]
          ),
          { label: "标题" }
        )
      ]
    ),
    { label: "扩展" }
  )
  // > 前四个 加粗,斜体,行内代码,链接
  r.inlineMenu = [
    cut(
      [
        r.toggleStrong,
        r.toggleEm,
        r.toggleCode,
        r.toggleLink
      ]
    )
  ]
  // >最后 符号列表,有序列表, 块引用, 连接项目, 提升项目,选择父节点项
  r.blockMenu = [
    cut(
      [
        r.wrapBulletList,
        r.wrapOrderedList,
        r.wrapBlockQuote,
        joinUpItem,
        liftItem,
        selectParentNodeItem
      ]
    )
  ]
  // 完整菜单  concat() 拼接所有元素为数组
  r.fullMenu = r.inlineMenu.concat(
    // 插入菜单      // 类型菜单
    [[r.insertMenu, r.typeMenu]],
    // 撤销     // 反撤销
    [[undoItem, redoItem]],
    // 块级菜单
    r.blockMenu
  )
  console.log(r)
  return r
}
