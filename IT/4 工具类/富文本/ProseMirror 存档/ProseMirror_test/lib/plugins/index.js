
// 关键地图
import { keymap } from "prosemirror-keymap"
// 历史记录
import { history } from "prosemirror-history"
// 基本键盘映射
import { baseKeymap } from "prosemirror-commands"

import { Plugin } from "prosemirror-state"

// > 拖放光标
import { dropCursor } from "prosemirror-dropcursor"
// // > 间隙光标
import { gapCursor } from "prosemirror-gapcursor"
// > 菜单栏
import { menuBar } from "prosemirror-menu"
// 菜单 items
import { buildMenuItems } from "./menu"
// 快捷键映射
import { buildKeymap } from "./keymap"
// 生成输入规则
import { buildInputRules } from "./inputrules"

export { buildMenuItems, buildKeymap, buildInputRules }


export function exampleSetup(options) {
  let plugins = [
    // > 生成输入规则
    buildInputRules(options.schema),
    // >构建键映射
    keymap(buildKeymap(options.schema, options.mapKeys)),
    // > 基本键映射
    keymap(baseKeymap),
    // 拖放光标
    dropCursor(),
    // > 间隙光标
    gapCursor()
  ]
  // 
  if (options.menuBar !== false) {
    // 插件
    plugins.push(menuBar({
      floating: options.floatingMenu !== false,
      content: options.menuContent || buildMenuItems(options.schema).fullMenu
    }))
  }

  if (options.history !== false) {
    plugins.push(history())
    let newPlugin = new Plugin(
      {
        props: { attributes: { class: "ProseMirror-example-setup-style" } }
      }
    )
    let plug = plugins.concat(newPlugin)

    return plug
  }

}
