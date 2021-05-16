/**
* @这是一个传递给 state.Plugin 的构造函数。它提供了插件的配置
* > 该插件设置的 view.EditorProps 属性如果是函数，则函数的 `this` 将绑定到当前实例
* > 允许插件定义 state.StateField，在编辑器 state 对象做一个插槽,记录自己的描述
* > 你可以使用 PluginKey类型 key 插件 ,使其在指定的状态下只可以有一个插件在 描述 对象中,但是可以通过 key 来访问插件的配置和状态,但不能访问插件的实例对象
*/ 
function bindProps(obj, self, target) {
  for (let prop in obj) {
    let val = obj[prop]
    if (val instanceof Function) val = val.bind(self)
    else if (prop == "handleDOMEvents") val = bindProps(val, self, {})
    target[prop] = val
  }
  return target
}

// @Plugins 可以被添加到 editor 中，它们是 [编辑器 state](#state.EditorState) 的一部分，并且能够影响包含它的 state 和 view。
export class Plugin {
  // :: (PluginSpec)
  // @创建一个 plugin。
  constructor(spec) {
    // :: EditorProps
    // @当前插件导出的 [属性](#view.EditorProps)
    this.props = {}
    if (spec.props) bindProps(spec.props, this, this.props)
    // :: Object
    // @当前插件的 [配置对象](#state.PluginSpec)。
    this.spec = spec
    this.key = spec.key ? spec.key.key : createKey("plugin")
  }

  // :: (EditorState) → any
  // @从编辑器的 state 上获取当前插件的 state。
  getState(state) { return state[this.key] }
}

const keys = Object.create(null)

function createKey(name) {
  if (name in keys) return name + "$" + ++keys[name]
  keys[name] = 0
  return name + "$"
}

// @一个插件 key 用来 [标记][tag](#state.PluginSpec.key) 一个插件，通过搜索编辑器的 state 来找到它
export class PluginKey {
  // @新建一个 plugin key
  constructor(name = "key") { this.key = createKey(name) }

  // :: (EditorState) → ?Plugin
  // @用 key 从 state 获取到 key 对应的激活的插件。
  get(state) { return state.config.pluginsByKey[this.key] }

  // :: (EditorState) → ?any
  // @从编辑器的 state 中获取插件的 state。
  getState(state) { return state[this.key] }
}
