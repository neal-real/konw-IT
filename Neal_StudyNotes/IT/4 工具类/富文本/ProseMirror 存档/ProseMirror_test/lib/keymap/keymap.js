import {base, keyName} from "w3c-keyname"
import {Plugin} from "prosemirror-state"

// declare global: navigator

const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false

function normalizeKeyName(name) {
  let parts = name.split(/-(?!$)/), result = parts[parts.length - 1]
  if (result == "Space") result = " "
  let alt, ctrl, shift, meta
  for (let i = 0; i < parts.length - 1; i++) {
    let mod = parts[i]
    if (/^(cmd|meta|m)$/i.test(mod)) meta = true
    else if (/^a(lt)?$/i.test(mod)) alt = true
    else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true
    else if (/^s(hift)?$/i.test(mod)) shift = true
    else if (/^mod$/i.test(mod)) { if (mac) meta = true; else ctrl = true }
    else throw new Error("Unrecognized modifier name: " + mod)
  }
  if (alt) result = "Alt-" + result
  if (ctrl) result = "Ctrl-" + result
  if (meta) result = "Meta-" + result
  if (shift) result = "Shift-" + result
  return result
}

function normalize(map) {
  let copy = Object.create(null)
  for (let prop in map) copy[normalizeKeyName(prop)] = map[prop]
  return copy
}

function modifiers(name, event, shift) {
  if (event.altKey) name = "Alt-" + name
  if (event.ctrlKey) name = "Ctrl-" + name
  if (event.metaKey) name = "Meta-" + name
  if (shift !== false && event.shiftKey) name = "Shift-" + name
  return name
}

// :: (Object) → Plugin
// Create a keymap plugin for the given set of bindings.
//
// > 用指定的绑定集合来创建一个按键映射插件。
//
// Bindings should map key names to [command](#commands)-style
// functions, which will be called with `(EditorState, dispatch,
// EditorView)` arguments, and should return true when they've handled
// the key. Note that the view argument isn't part of the command
// protocol, but can be used as an escape hatch if a binding needs to
// directly interact with the UI.
//
// > 绑定应该将按键名和 [命令](#commands) 格式的函数对应起来，该函数将会传入 `(EditorState, dispatch,
// EditorView)` 作为参数来调用，如果它响应了该按键按下，则应该返回 true。记住，view 参数并不是命令协议的一部分，但是如果按键绑定需要直接与 UI
// 交互，则可以将其用来作为应急出口使用。
//
// Key names may be strings like `"Shift-Ctrl-Enter"`—a key
// identifier prefixed with zero or more modifiers. Key identifiers
// are based on the strings that can appear in
// [`KeyEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key).
// Use lowercase letters to refer to letter keys (or uppercase letters
// if you want shift to be held). You may use `"Space"` as an alias
// for the `" "` name.
//
// > 按键的名字可以是形如 `"Shift-Ctrl-Enter"` 的字符串，它是一个按键标识符，可以有 0 个或者多个修饰符做前缀。按键标识符的基础字符串基于这个
// [`KeyEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) 中的按键而来。使用小写字母来表示字母键
// （或者使用大写字母，如果你想要处理 shift 被同时按下的情况）。你也许会使用 `"Space"` 作为 `" "` 的别名。
//
// Modifiers can be given in any order. `Shift-` (or `s-`), `Alt-` (or
// `a-`), `Ctrl-` (or `c-` or `Control-`) and `Cmd-` (or `m-` or
// `Meta-`) are recognized. For characters that are created by holding
// shift, the `Shift-` prefix is implied, and should not be added
// explicitly.
//
// > 修饰符可以以任何顺序指定。只允许 `Shift-`（或者 `s-`)，`Alt-`（或者 `a-`），`Ctrl-`（或 `c-` 或 `Control-`）及 `Cmd-`（或 `m-` 或 `Meta-`）
// 这些修饰符出现。对于通过按下 shift 创建的字符，则 `Shift-` 前缀就是隐式的，不应该再显式添加了。
//
// You can use `Mod-` as a shorthand for `Cmd-` on Mac and `Ctrl-` on
// other platforms.
//
// > 在 Mac 上你可以使用 `Mod-` 作为 `Cmd-` 的简称，在其他平台可以使用 `Ctrl-`。
//
// You can add multiple keymap plugins to an editor. The order in
// which they appear determines their precedence (the ones early in
// the array get to dispatch first).
//
// > 你可以在编辑器中添加多个按键映射插件。它们出现的顺序决定了它们的优先级（数组前面的优先被 dispatch）。
export function keymap(bindings) {
  return new Plugin({props: {handleKeyDown: keydownHandler(bindings)}})
}

// :: (Object) → (view: EditorView, event: dom.Event) → bool
// Given a set of bindings (using the same format as
// [`keymap`](#keymap.keymap), return a [keydown
// handler](#view.EditorProps.handleKeyDown) that handles them.
//
// > 指定一个按键绑定的集合（和 [`keymap`](#keymap.keymap) 使用一样的格式），返回一个处理相应按键事件的 [按键
// 处理函数](#view.EditorProps.handleKeyDown)。
export function keydownHandler(bindings) {
  let map = normalize(bindings)
  return function(view, event) {
    let name = keyName(event), isChar = name.length == 1 && name != " ", baseName
    let direct = map[modifiers(name, event, !isChar)]
    if (direct && direct(view.state, view.dispatch, view)) return true
    if (isChar && (event.shiftKey || event.altKey || event.metaKey || name.charCodeAt(0) > 127) &&
        (baseName = base[event.keyCode]) && baseName != name) {
      // Try falling back to the keyCode when there's a modifier
      // active or the character produced isn't ASCII, and our table
      // produces a different name from the the keyCode. See #668,
      // #1060
      let fromCode = map[modifiers(baseName, event, true)]
      if (fromCode && fromCode(view.state, view.dispatch, view)) return true
    } else if (isChar && event.shiftKey) {
      // Otherwise, if shift is active, also try the binding with the
      // Shift- prefix enabled. See #997
      let withShift = map[modifiers(name, event, true)]
      if (withShift && withShift(view.state, view.dispatch, view)) return true
    }
    return false
  }
}
