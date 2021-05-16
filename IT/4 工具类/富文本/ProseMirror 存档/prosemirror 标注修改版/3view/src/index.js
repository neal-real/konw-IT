// 节点选区
import {NodeSelection} from "prosemirror-state"
// 处理滚动
import {scrollRectIntoView, posAtCoords, coordsAtPos, endOfTextblock, storeScrollPos,
        resetScrollPos, focusPreventScroll} from "./domcoords"

// 视图表述
import {docViewDesc} from "./viewdesc"

// input
import {initInput, destroyInput, dispatchEvent, ensureListeners, clearComposition} from "./input"

// 选区
import {selectionToDOM, anchorInRightPlace, syncNodeSelection} from "./selection"

// 装饰器
import {Decoration, viewDecorations} from "./decoration"

import browser from "./browser"

export {Decoration, DecorationSet} from "./decoration"

//  导出用于测试
export {serializeForClipboard as __serializeForClipboard, parseFromClipboard as __parseFromClipboard} from "./clipboard"

export {endComposition as __endComposition} from "./input"

// ! 要首先确认下已经加载了 style/prosemirror.css 模块作为样式表

// >一个编辑器视图负责整个可编辑文档。它的 state 和行为由 view.DirectEditorProps 决定。
// . 注新建编辑器的第一步就是 new 一个 EditorView。
export class EditorView {

  /**
   * 初始化 编辑器视图
   * @参数`place` : 编辑器的挂载点 值可以直接是 DOM 节点 | 函数(DOM 节点) | mount 对象表示 DOM 节点; 
   * > place是 `null`，编辑器将不会被放到文档中
   * . 注 `place` 是函数的时候，函数的参数通过 document.createElement('div') 创建的 DOM 节点 作为函数的唯一参数传入bundleRenderer.renderToStream
   * . 该节点需要你手动放入PM 文档
  */ 
  constructor(place, props) {

    this._props = props

    // > 编辑器当前的状态
    this.state = props.state

    this.dispatch = this.dispatch.bind(this)

    this._root = null
    this.focused = false
    //Kludge过去经常对付谷歌浏览器的 BUG
    this.trackWrites = null

    // > 一个包含编辑器文档的可编辑 DOM 节点。（你不应该直接操作该节点的内容）
    this.dom = (place && place.mount) || document.createElement("div")
    if (place) {
      if (place.appendChild) place.appendChild(this.dom)
      else if (place.apply) place(this.dom)
      else if (place.mount) this.mounted = true
    }

    // > 指示当前编辑器是否 [可编辑] view.EditorProps.editable
    this.editable = getEditable(this)
    this.markCursor = null
    this.cursorWrapper = null
    updateCursorWrapper(this)
    this.nodeViews = buildNodeViews(this)
    this.docView = docViewDesc(this.state.doc, computeDocDeco(this), viewDecorations(this), this.dom, this)

    this.lastSelectedViewDesc = null

    // > 当编辑器的内容被拖拽的时候，这个对象包含有拖拽内容相关的信息及该内容是否被复制还是被移动。在其他时候，该对象是 null。
    this.dragging = null

    initInput(this)

    this.pluginViews = []
    this.updatePluginViews()
  }
  /**
  *  > 编辑器 view 的 [props（属性）view.EditorProps)
  * . 注 props 是一个 getter 属性，每次通过 view.props 访问到的 props 带的一定是最新的 state
  */ 
  get props() {
    if (this._props.state != this.state) {
      let prev = this._props
      this._props = {}
      for (let name in prev) this._props[name] = prev[name]
      this._props.state = this.state
    }
    return this._props
  }

  /**
  * > 更新 view 的 props。将会立即引起 DOM 的更新
  */ 
  update(props) {
    if (props.handleDOMEvents != this._props.handleDOMEvents) ensureListeners(this)
    this._props = props
    this.updateStateInner(props.state, true)
  }
  /**
  * > 用指定的参数来更新已有的 props 对象，以达到更新 view 的目的。
  * > 等同于 `view.update(Object.assign({}, view.props, props))`。
  */ 
  setProps(props) {
    let updated = {}
    for (let name in this._props) updated[name] = this._props[name]
    updated.state = this.state
    for (let name in props) updated[name] = props[name]
    this.update(updated)
  }
  // > 单独更新编辑器 props 的 `state` 属性。
  updateState(state) {
    this.updateStateInner(state, this.state.plugins != state.plugins)
  }

  updateStateInner(state, reconfigured) {
    let prev = this.state, redraw = false, updateSel = false
    //添加存储的标记时，停止合成，以便可以显示它们
    if (state.storedMarks && this.composing) {
      clearComposition(this)
      updateSel = true
    }
    this.state = state
    if (reconfigured) {
      let nodeViews = buildNodeViews(this)
      if (changedNodeViews(nodeViews, this.nodeViews)) {
        this.nodeViews = nodeViews
        redraw = true
      }
      ensureListeners(this)
    }

    this.editable = getEditable(this)
    updateCursorWrapper(this)
    let innerDeco = viewDecorations(this), outerDeco = computeDocDeco(this)

    let scroll = reconfigured ? "reset"
        : state.scrollToSelection > prev.scrollToSelection ? "to selection" : "preserve"
    let updateDoc = redraw || !this.docView.matchesNode(state.doc, outerDeco, innerDeco)
    if (updateDoc || !state.selection.eq(prev.selection)) updateSel = true
    let oldScrollPos = scroll == "preserve" && updateSel && this.dom.style.overflowAnchor == null && storeScrollPos(this)

    if (updateSel) {
      this.domObserver.stop()
      // Work around an issue in Chrome, IE, and Edge where changing
      // the DOM around an active selection puts it into a broken
      // state where the thing the user sees differs from the
      // selection reported by the Selection object (#710, #973,
      // #1011, #1013, #1035).
      let forceSelUpdate = updateDoc && (browser.ie || browser.chrome) && !this.composing &&
          !prev.selection.empty && !state.selection.empty && selectionContextChanged(prev.selection, state.selection)
      if (updateDoc) {
        // If the node that the selection points into is written to,
        // Chrome sometimes starts misreporting the selection, so this
        // tracks that and forces a selection reset when our update
        // did write to the node.
        let chromeKludge = browser.chrome ? (this.trackWrites = this.root.getSelection().focusNode) : null
        if (redraw || !this.docView.update(state.doc, outerDeco, innerDeco, this)) {
          this.docView.updateOuterDeco([])
          this.docView.destroy()
          this.docView = docViewDesc(state.doc, outerDeco, innerDeco, this.dom, this)
        }
        if (chromeKludge && !this.trackWrites) forceSelUpdate = true
      }
      // Work around for an issue where an update arriving right between
      // a DOM selection change and the "selectionchange" event for it
      // can cause a spurious DOM selection update, disrupting mouse
      // drag selection.
      if (forceSelUpdate ||
          !(this.mouseDown && this.domObserver.currentSelection.eq(this.root.getSelection()) && anchorInRightPlace(this))) {
        selectionToDOM(this, forceSelUpdate)
      } else {
        syncNodeSelection(this, state.selection)
        this.domObserver.setCurSelection()
      }
      this.domObserver.start()
    }

    this.updatePluginViews(prev)

    if (scroll == "reset") {
      this.dom.scrollTop = 0
    } else if (scroll == "to selection") {
      let startDOM = this.root.getSelection().focusNode
      if (this.someProp("handleScrollToSelection", f => f(this)))
        {} // Handled
      else if (state.selection instanceof NodeSelection)
        scrollRectIntoView(this, this.docView.domAfterPos(state.selection.from).getBoundingClientRect(), startDOM)
      else
        scrollRectIntoView(this, this.coordsAtPos(state.selection.head), startDOM)
    } else if (oldScrollPos) {
      resetScrollPos(oldScrollPos)
    }
  }

  destroyPluginViews() {
    let view
    while (view = this.pluginViews.pop()) if (view.destroy) view.destroy()
  }

  updatePluginViews(prevState) {
    if (!prevState || prevState.plugins != this.state.plugins) {
      this.destroyPluginViews()
      for (let i = 0; i < this.state.plugins.length; i++) {
        let plugin = this.state.plugins[i]
        if (plugin.spec.view) this.pluginViews.push(plugin.spec.view(this))
      }
    } else {
      for (let i = 0; i < this.pluginViews.length; i++) {
        let pluginView = this.pluginViews[i]
        if (pluginView.update) pluginView.update(this, prevState)
      }
    }
  }

  /**
  * > 遍历指定属性名所有的值，在编辑器 props 中的属性优先，然后按照插件书写的顺序遍历插件的 props 上的该属性，获取它的值
  * ? if 遇到该属性的值不是 undefined 的话就调用 `f` 函数 ,当 `f` 函数返回一个真值，那么该 somePorp 函数则立即返回该属性值
  * ? 如果 `f` 函数 未提供，则将其当成是一个拥有固定返回值的函数（即遍历到第一个指定属性且有值的话则直接返回该值）
  * . 注 若提供了 f 函数，则 f 函数执行的时候，参数即为遍历到的 prop 的值（一般是个函数）
  * ? if 若 f 函数返回了真值，则 someProp 函数的返回值即为 f 函数本身，并停止遍历；
  * ? if 若 f 函数返回了非真值， 则继续遍历，直到遇到真值才返回。
  * ? if 若 f 函数未提供，则如果 prop 的值不为 undefined，则直接返回该值
  * . 注 一般用法是 view.someProp('handleResize', v => v(view, state, slice, other))，
  * . 这里的 v 即为你写的 prop 属性值。
  */ 
  someProp(propName, f) {
    let prop = this._props && this._props[propName], value
    if (prop != null && (value = f ? f(prop) : prop)) return value
    let plugins = this.state.plugins
    if (plugins) for (let i = 0; i < plugins.length; i++) {
      let prop = plugins[i].props[propName]
      if (prop != null && (value = f ? f(prop) : prop)) return value
    }
  }

  // > 查询当前 view 是否被 focus。
  hasFocus() {
    return this.root.activeElement == this.dom
  }

  // > focus 编辑器。
  // . 注 这个过程会用到特性检测，即检查 dom.focus({preventScroll: true}) 是否支持。
  focus() {
    this.domObserver.stop()
    if (this.editable) focusPreventScroll(this.dom)
    selectionToDOM(this)
    this.domObserver.start()
  }

  // > 获取编辑器所在的根节点。通常情况下是顶级节点 `document`，但是也可能是一个 [shadow DOM]
  get root() {
    let cached = this._root
    if (cached == null) for (let search = this.dom.parentNode; search; search = search.parentNode) {
      if (search.nodeType == 9 || (search.nodeType == 11 && search.host)) {
        if (!search.getSelection) Object.getPrototypeOf(search).getSelection = () => document.getSelection()
        return this._root = search
      }
    }
    return cached || document
  }

  /**
  * > 指定一对儿视口坐标信息，返回该坐标在文档中的位置。如果指定的坐标不在编辑器中，则会返回 null。
  * > 当返回一个对象时，`pos` 属性是离坐标最近的位置，`inside` 属性指示坐标落在的节点的内部节点的位置，
  * > 或者未为 -1，表示该坐标落在了顶级节点的位置，不在任何节点之内。
  * . 注 inside 属性举例：如果 table 结构是 table > td+ > p* > text*，则若 pos 落在了 text 内部，则 inside 就是 text 开头的位置；如果落在了 p 之前的位置(before)，那就是 td 起始的位置(start)。
  * . 注 这个方法非常有用，实际开发的时候会被大量用到，尤其是在处理事件相关的时候，需要 event 的 clientX 和 clientY 的坐标信息，以获得元素的位置信息。
  * . 注 位置信息指的是编辑器内部的位置计数系统，是一个数字，如果想获取位置信息的更多内容，需要 resolve 一下，将其变成 resolvedPos，详见指南。  
  */ 
  posAtCoords(coords) {
    return posAtCoords(this, coords)
  }

  /**
  * > 返回指定文档位置的相对于视口的坐标及大小信息。`left` 和 `right` 总是相同，因为该函数返回的是一个光标的的位置和大小信息。
  * . 注 光标只有高度没有宽度，因此只有 top 和 bottom 及 height 信息；left 和 right 总是一样的，width 总是 0.
  * . 注 这个方法也很常用，因为一般情况下你不会用到 DOM 的坐标信息。
  */ 
  coordsAtPos(pos) {
    return coordsAtPos(this, pos)
  }

  /**
  * > 返回指定位置的 DOM 节点。记住：你 **绝对不应该** 直接修改编辑器内部的 DOM，而只能查看它（虽然即使是检查它也是不必要的）
  * . 注 `查看它` 的意思是只能获取 DOM 的信息，而不要设置。
  */ 
  domAtPos(pos) {
    return this.docView.domFromPos(pos)
  }

  /**
  * > 寻找指定位置的 DOM 节点。如果位置不指向一个 node 前面或者该 node 是一个不透明的 node view 的话，则返回 null。
  * > 该方法设计的目的是让你能够在 DOM 上调用类似 `getBoundingClientRect` 方法。**绝对不要** 直接修改编辑器的 DOM 元素，也不要通过这种方式添加样式之类的，因为你的修改可能随着节点的重绘被立即覆盖掉。
  * . 注 domAtPos 获取的是指定位置的 DOM 宽高和坐标信息，nodeDOM 获取的是指定位置的 DOM。你可以通过 nodeDOM 获取到 DOM 后再手动获取位置信息。
  */ 
  nodeDOM(pos) {
    let desc = this.docView.descAt(pos)
    return desc ? desc.nodeDOM : null
  }

  /**
  * > 返回指定 DOM 的位置信息。（它会尽可能的优先选择直接检查文档结构来获取位置信息，而不是用四处寻找逐个探测的方式，但是有些情况下，比如指定的是一个事件 target，那你别无选择只能逐个 target 的进行测试）
  * . 注 这句话的意思是，如果你直接通过 ProseMirror 的接口，如 nodeDOM，通过 pos 获取到了 DOM，然后通过该方法相当于是一个逆过程，以获取到 pos。然而，如果你传给该函数的参数是来自于 event.target
  * .那么 ProseMirror 只能通过挨个节点检查的方式，来确定它在 ProseMirror 的位置。 
  * > 如果位置落在了一个叶子节点，那么 `bias` 参数可以用来决定使用叶子节点的哪一侧。
  * . 注 bias > 0 是右侧，否则是左侧，默认是左侧。
  */ 
  posAtDOM(node, offset, bias = -1) {
    let pos = this.docView.posFromDOM(node, offset, bias)
    if (pos == null) throw new RangeError("DOM position not inside the editor")
    return pos
  }

  /**
  * > 返回如果光标往指定方向移动的话，当前光标是否是一个文本 block 的末尾。例如，当指定方向为 `「left」` 的话，如果光标向左移动一个单位的距离将会离开文本 block，则会返回 true。
  * > 默认使用的是view 当前的 state，也可以传入一个不同的 state。
  * . 注 文本 block，一般情况下指的是 paragraph 这种的，以 text 为直接子元素的节点。该方法的移动指定方向后检测的位置是 state.selection.$head。
  */ 
  endOfTextblock(dir, state) {
    return endOfTextblock(this, state || this.state, dir)
  }

  // > 从 DOM 中移除编辑器，并销毁所有的 [node views](#view.NodeView)。
  destroy() {
    if (!this.docView) return
    destroyInput(this)
    this.destroyPluginViews()
    if (this.mounted) {
      this.docView.update(this.state.doc, [], viewDecorations(this), this)
      this.dom.textContent = ""
    } else if (this.dom.parentNode) {
      this.dom.parentNode.removeChild(this.dom)
    }
    this.docView.destroy()
    this.docView = null
  }

  // 用于测试
  dispatchEvent(event) {
    return dispatchEvent(this, event)
  }

  /**
  * > 派发一个 transaction。会调用 [`dispatchTransaction`](#view.DirectEditorProps.dispatchTransaction) （如果设置了的话），否则默认应用该 transaction 到当前 state，
  * > 然后将其结果（新的 state）作为参数，传入 [`updateState`](#view.EditorView.updateState) 方法。该方法被绑定在 view 对象上，因此可以容易地被调用。
  * . 注 必须调用 view.dispatch(transaction) 才可以触发一个更改。该方法一般情况下用在事件响应函数里面，但是你也可以用在任何能访问到 view 的地方。
  * 反过来说，比如在 plugin 的 state 的 apply 内，你访问不到 view，也就不能 dispatch 一个 tr。如果你强行在其内 dispatch 了一个 tr（如通过将 view 放到 window 作为全局访问的方法），那么会导致循环调用以致内存溢出。
  * 
  */ 
  dispatch(tr) {
    let dispatchTransaction = this._props.dispatchTransaction
    if (dispatchTransaction) dispatchTransaction.call(this, tr)
    else this.updateState(this.state.apply(tr))
  }
}

function computeDocDeco(view) {
  let attrs = Object.create(null)
  attrs.class = "ProseMirror"
  attrs.contenteditable = String(view.editable)

  view.someProp("attributes", value => {
    if (typeof value == "function") value = value(view.state)
    if (value) for (let attr in value) {
      if (attr == "class")
        attrs.class += " " + value[attr]
      else if (!attrs[attr] && attr != "contenteditable" && attr != "nodeName")
        attrs[attr] = String(value[attr])
    }
  })

  return [Decoration.node(0, view.state.doc.content.size, attrs)]
}

function updateCursorWrapper(view) {
  if (view.markCursor) {
    let dom = document.createElement("img")
    dom.setAttribute("mark-placeholder", "true")
    view.cursorWrapper = {dom, deco: Decoration.widget(view.state.selection.head, dom, {raw: true, marks: view.markCursor})}
  } else {
    view.cursorWrapper = null
  }
}

function getEditable(view) {
  return !view.someProp("editable", value => value(view.state) === false)
}

function selectionContextChanged(sel1, sel2) {
  let depth = Math.min(sel1.$anchor.sharedDepth(sel1.head), sel2.$anchor.sharedDepth(sel2.head))
  return sel1.$anchor.start(depth) != sel2.$anchor.start(depth)
}

function buildNodeViews(view) {
  let result = {}
  view.someProp("nodeViews", obj => {
    for (let prop in obj) if (!Object.prototype.hasOwnProperty.call(result, prop))
      result[prop] = obj[prop]
  })
  return result
}

function changedNodeViews(a, b) {
  let nA = 0, nB = 0
  for (let prop in a) {
    if (a[prop] != b[prop]) return true
    nA++
  }
  for (let _ in b) nB++
  return nA != nB
}








// > Props 就是一些可以传递给编辑器的 view，或者用在插件中的值。这个接口列出了支持的 props。

// > 不同的事件处理函数可能都返回 `true` 表示它们处理了相应的事件。view 将会在事件发生时帮你调用 `preventDefault`。但是 `handleDOMEvents` 
// 中的事件需要你负责去手动调用。

// > 不同的 prop 有不同的处理方式。prop 是函数的话则会在某个时刻调用：最开始的时候是寻找在 view 上的 prop，然后按照 plugin 书写的顺序查找其上的 prop，按顺序调用，直到它们中的某一个返回了 true 才终止。
// 而对于其他一些 porps，会使用遇到的第一个 prop 返回的值。
//   > 其是一个对象，键是 DOM 事件名，值是事件处理函数。事件处理函数将会先于 ProseMirror 处理任何发生在可编辑 DOM 元素上的事件之前调用。
//   与其他事件处理函数（此处指的是下面这些 ProseMirror 自己的事件处理函数）相反的是，当该函数返回 true 的时候，你需要手动调用 `preventDefault`（或者不调用，如果你想允许默认行为发生的话）
//   
//   . 注 可以理解为，handleDOMEvents 中定义的事件比较原始，一切都需要你自己来掌控。之所以其内定义的事件处理函数会发生于 ProseMirror 事件处理之前，一个原因我猜是因为
//   如果 ProseMirror 事件处理完了之后再调用用户定义的事件处理函数，则需要再处理一遍 DOM 的更新。

//   > 当编辑器接收到一个 `keydown` 事件的时候调用。

//   > 当编辑器接收到一个 `keypress` 事件的时候调用。

//   > 无论何时用户直接输入了文字的时候，该处理函数将会在输入内容应用到 DOM 之前调用。如果该函数返回 `true`，则用户输入文本到编辑器的默认行为将会被阻止。
//   . 注 该方法通常用来拦截输入，然后生成新的输入，如自动转换 markdown 语法，或者按下某个键执行特殊操作的时候比较有用。

//   > 为每一个点击事件冒泡路径上的节点从内到外都调用一遍该函数。如果是内部节点，则 `direct` 将会是 true。

//   > 当编辑器被点击的时候调用，函数执行顺序位于 `handleClickOn` 函数之后。

//   > 同`handleClickOn`，只是针对双击事件。

//   > 同 `handleClick` 只是针对双击事件。

//   > 同`handleClickOn`，只是针对三击事件。

//   > 同 `handleClick` 只是针对三击事件

//   > 可以用来覆盖默认的粘贴行为。`slice` 是被编辑器格式化后的粘贴内容，不顾你也可以通过直接访问事件对象来获取原始的粘贴内容。
//   . 注 粘贴事件中的数据位于 event.dataTransfer 对象上。
//   > 当有东西被放入编辑器的时候调用。如果是从当前编辑器选区放入的，则 `moved` 参数会是 true（因此选区的内容应该被删除）。
//   > 当 view 更新了 state 之后，尝试将选区滚动到视图中的时候调用该函数。该函数可能返回 false，表示它不处理滚动；或者返回 true，表示让默认行为发生。
//   > 在指定的起点和终点新建一个选区。

//   > [parser](#model.DOMParser) 用来从 DOM 中读取编辑器的变化。默认情况下（如果不设置的话）调用 [`DOMParser.fromSchema`](#model.DOMParser^fromSchema) 方法，参数是编辑器的 schema。

//   > 可以被用来在 HTML 文本被 parser _之前_ 转换一下。

//   > 用来从粘贴板中读取内容后 [parser](#model.DOMParser) 。如果没有给，则使用 [`domParser`](#view.EditorProps.domParser) 属性。
//   > 转换粘贴的纯文本。如果粘贴的文本是纯文本的话，`plain` 将会是 true。

//   > 将粘贴板中的文本 parse 成文档 slice。将会在 [`transformPastedText`](#view.EditorProps.transformPastedText) 之后调用。
//   默认行为是将文本分割成多行，然后使用 `<p>` 标签包裹之，然后再对其调用 [clipboardParser`](#view.EditorProps.clipboardParser)。如果粘贴的内容是纯文本，则 `plain` 将会是 true。

//   > 可以用来在将粘贴的内容应用到文档之前转换一下。

//   > 允许你为 node 或者 marks 自定义渲染和行为逻辑。该对象键是 node 或者 mark 名，值是对应的构造函数。
//   构造函数返回一个 [`NodeView`](#view.NodeView) 对象，来实现节点的展示逻辑。
//   对于 nodes 来说，第三个参数 `getPos` 是一个函数，调用它可以获取 node 当前的位置，这对于创建一个 transaction 然后更新它很有用。
//   对于 marks 来说，第三个参数是一个 boolean 值，指示 mark 的内容是否是 inline 的。

//   > `decoration` 是一个在当前 node 周围激活的 node decoration 或者 inline decoration 数组。
//   他们会自动绘制，通常情况下你可以忽略它们，不过它们也可以用来为 node view 提供上下文信息，而不是将它们添加到文档中。
//
//   . 注 最后一句话的意思是，在 plugin.props 的 decoration 属性上，你可以通过构造 decoration 的时候添加一些额外的信息，然后在 node view 中拿到这些信息来搞事情。

//   > 该函数用来序列化 DOM，然后将其放入粘贴板。如果没有指定，则会使用 [`DOMSerializer.fromSchema`](#model.DOMSerializer^fromSchema) 方法返回的结果。

//   > 当复制内容到粘贴板的时候，该方法将会被调用以用来获取选区内的文本。默认情况下，编辑器会在选区范围使用 [`textBetween`](#model.Node.textBetween) 方法。

//   > 一个展示在 view 上的 [document decorations（文档装饰器）](#view.Decoration) 集合。

//   > 当它返回 false，那么 view 的内容不能直接编辑。
//
//   . 注 不能直接编辑的意思就是用户不能将光标放入进去，然后编辑。但是仍然可以通过 dispatch transaction 进行编辑。

//   > 控制可编辑元素上的 DOM attributes。可以是一个对象，或者是一个函数接收编辑器的 state，然后返回一个对象。
//   默认情况下，元素将会被设置一个 `「ProseMirror」` 类名，以及一个由 [`editable` prop](#view.EditorProps.editable) 决定的 `contentEditable` attributes。
//   在此处提供的其他类名将会被附加上去。对于其他 attributes，最先提供的将会被使用（就像 [`someProp`](#view.EditorView.someProp) 一样）。
//
//   . 注 原文中的 prop 和 attribute 我个人觉得应该分开翻译而不能都翻译成 `属性`，但是找不到合适的中文进行区分，
//   部分翻译资料（如上古时期的 jQuery），将 attr 和 prop 分别翻译成「属性」和「特性」，在此处感觉也不是很妥当，因此索性不翻译了。

//   > 当滚动光标位置到视口的时候，决定光标与视口尾部的距离（单位是像素）多大才开始滚动。默认是 0。

//   > 当光标滚动到视口中的时候，决定光标离视口上下方的距离，默认是 5（像素为单位）。

// > 直接在 view 中使用的 props 对象有两个字段不能被用在 plugin 的 props 字段上：

//   > 编辑器当前的 state。
//
//   . 注 plugin 有自己的 state 字段，其与 props 平级，因此不作为 props 的属性。

//   > view dispatch 一个 transaction 后（更新 state 前），transaction 会先经过此回调函数。
//   如果你设置了该函数，你应该需要保证该函数以调用 view 的 [`updateState`](#view.EditorView.updateState) 方法结束。
//   `updateState` 方法接受一个 [applied](#state.EditorState.apply) 过该 transaction 的 state 作为参数。回调的 `this` 绑定到 view 实例上。