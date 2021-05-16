import {Transform} from "prosemirror-transform"
import {Mark} from "prosemirror-model"
import {Selection} from "./selection"

const UPDATED_SEL = 1, UPDATED_MARKS = 2, UPDATED_SCROLL = 4

// ::- An editor state transaction, which can be applied to a state to
// create an updated state. Use
// [`EditorState.tr`](#state.EditorState.tr) to create an instance.
//
// > 一个编辑器 state 的 transaction 可以被用来应用到 state 以创建一个更新的 state。
// 使用 [`EditorState.tr`](#state.EditorState.tr) 来创建一个 transaction 实例。
//
// . 注 EditorState.tr 是一个 getter 函数，每次调用都会 new 一个新的。
//
// Transactions track changes to the document (they are a subclass of
// [`Transform`](#transform.Transform)), but also other state changes,
// like selection updates and adjustments of the set of [stored
// marks](#state.EditorState.storedMarks). In addition, you can store
// metadata properties in a transaction, which are extra pieces of
// information that client code or plugins can use to describe what a
// transacion represents, so that they can update their [own
// state](#state.StateField) accordingly.
//
// > Transactions （它是 [`Transform`](#transform.Transform) 的子类）不仅会追踪对文档的修改，还能追踪 state 的其他变化，
// 比如选区更新以及 [storedmarks](#state.EditorState.storedMarks) 的调整。此外，你还可以在 transaction 中储存 metadata 信息，
// metadata 信息是一种很有用的信息形式以告诉客户端代码或者该 transaction 所代表的含义，然后它们以此来相应的更新它们 [自己的 state](#state.StateField)。
//
// The [editor view](#view.EditorView) uses a few metadata properties:
// it will attach a property `"pointer"` with the value `true` to
// selection transactions directly caused by mouse or touch input, and
// a `"uiEvent"` property of that may be `"paste"`, `"cut"`, or `"drop"`.
//
// > [编辑器的 view](#view.EditorView) 使用下面几个 metadata 属性：它会在 tr 上附加上 `"pointer"` 属性，值 `true` 表示由鼠标或者触摸点击触发的选区 transaction，
// 以及一个 `"uiEvent"` 属性，值可能是 `"paste"`, `"cut"` 或者 `"drop"`。
export class Transaction extends Transform {
  constructor(state) {
    super(state.doc)
    // :: number
    // The timestamp associated with this transaction, in the same
    // format as `Date.now()`.
    //
    // > 与当前 transaction 关联的时间戳，与 `Date.now()` 格式相同。
    this.time = Date.now()
    this.curSelection = state.selection
    // The step count for which the current selection is valid.
    this.curSelectionFor = 0
    // :: ?[Mark]
    // The stored marks set by this transaction, if any.
    //
    // > 当前 transaction 设置的 stored marks，如果有的话。
    this.storedMarks = state.storedMarks
    // Bitfield to track which aspects of the state were updated by
    // this transaction.
    this.updated = 0
    // Object used to store metadata properties for the transaction.
    this.meta = Object.create(null)
  }

  // :: Selection
  // The transaction's current selection. This defaults to the editor
  // selection [mapped](#state.Selection.map) through the steps in the
  // transaction, but can be overwritten with
  // [`setSelection`](#state.Transaction.setSelection).
  //
  // > 该 transaction 的选区。默认是编辑器当前选区经过该 transaction [mapped](#state.Selection.map) 后的选区，不过也会被 [`setSelection`](#state.Transaction.setSelection) 方法给手动设置。
  get selection() {
    if (this.curSelectionFor < this.steps.length) {
      this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor))
      this.curSelectionFor = this.steps.length
    }
    return this.curSelection
  }

  // :: (Selection) → Transaction
  // Update the transaction's current selection. Will determine the
  // selection that the editor gets when the transaction is applied.
  //
  // > 更新当前 transaction 的选区。其会决定 transaction 应用后编辑器的选区。
  setSelection(selection) {
    if (selection.$from.doc != this.doc)
      throw new RangeError("Selection passed to setSelection must point at the current document")
    this.curSelection = selection
    this.curSelectionFor = this.steps.length
    this.updated = (this.updated | UPDATED_SEL) & ~UPDATED_MARKS
    this.storedMarks = null
    return this
  }

  // :: bool
  // Whether the selection was explicitly updated by this transaction.
  //
  // > 选区是否被该 transaction 显式更新过。
  //
  // . 注 即在当前 transaction 中是否显式调用过 setSelection，一个 tr 在应用到 state 之前会 `流过` 所有的 plugin 的 apply 方法，因此这对于判断其他插件是否显式设置过选区很有用。
  get selectionSet() {
    return (this.updated & UPDATED_SEL) > 0
  }

  // :: (?[Mark]) → Transaction
  // Set the current stored marks.
  //
  // > 设置 stored marks。
  setStoredMarks(marks) {
    this.storedMarks = marks
    this.updated |= UPDATED_MARKS
    return this
  }

  // :: ([Mark]) → Transaction
  // Make sure the current stored marks or, if that is null, the marks
  // at the selection, match the given set of marks. Does nothing if
  // this is already the case.
  //
  // > 确保 transaction 设置的 stored marks 或者如果 transaction 没有设置 stored marks 的话，确保光标位置的 marks，与参数指定的 marks 一致。
  // 如果一致的话什么也不做。
  //
  // . 注 如果不一致的话，就让它们一致--这也是「确保」的含义。
  ensureMarks(marks) {
    if (!Mark.sameSet(this.storedMarks || this.selection.$from.marks(), marks))
      this.setStoredMarks(marks)
    return this
  }

  // :: (Mark) → Transaction
  // Add a mark to the set of stored marks.
  //
  // > 在已经设置的 stored marks 集合中增加一个 mark。
  addStoredMark(mark) {
    return this.ensureMarks(mark.addToSet(this.storedMarks || this.selection.$head.marks()))
  }

  // :: (union<Mark, MarkType>) → Transaction
  // Remove a mark or mark type from the set of stored marks.
  //
  // > 在已经设置的 stored marks 集合中移除一个 mark 或者移除一种 mark。
  removeStoredMark(mark) {
    return this.ensureMarks(mark.removeFromSet(this.storedMarks || this.selection.$head.marks()))
  }

  // :: bool
  // Whether the stored marks were explicitly set for this transaction.
  //
  // > 当前 transaction 是否显式设置了 stored marks。
  get storedMarksSet() {
    return (this.updated & UPDATED_MARKS) > 0
  }

  addStep(step, doc) {
    super.addStep(step, doc)
    this.updated = this.updated & ~UPDATED_MARKS
    this.storedMarks = null
  }

  // :: (number) → Transaction
  // Update the timestamp for the transaction.
  //
  // > 更新该 transaction 的时间戳。
  setTime(time) {
    this.time = time
    return this
  }

  // :: (Slice) → Transaction
  // Replace the current selection with the given slice.
  //
  // > 用指定的 slice 替换当前选区。
  replaceSelection(slice) {
    this.selection.replace(this, slice)
    return this
  }

  // :: (Node, ?bool) → Transaction
  // Replace the selection with the given node. When `inheritMarks` is
  // true and the content is inline, it inherits the marks from the
  // place where it is inserted.
  //
  // > 用指定的 node 替换当前选区。如果 `inheritMarks` 是 true 并且 node 的内容是 inline 的话，插入的内容将会继承插入点位置的 marks。
  replaceSelectionWith(node, inheritMarks) {
    let selection = this.selection
    if (inheritMarks !== false)
      node = node.mark(this.storedMarks || (selection.empty ? selection.$from.marks() : (selection.$from.marksAcross(selection.$to) || Mark.none)))
    selection.replaceWith(this, node)
    return this
  }

  // :: () → Transaction
  // Delete the selection.
  //
  // > 删除选区。
  //
  // . 注 选区被删除了，其内容也一起被删除。
  deleteSelection() {
    this.selection.replace(this)
    return this
  }

  // :: (string, from: ?number, to: ?number) → Transaction
  // Replace the given range, or the selection if no range is given,
  // with a text node containing the given string.
  //
  // > 用包含指定文本的文本节点替换指定的 range，如果没有指定 range 的话则替换选区。
  //
  // . 注 range 就是用 from 和 to 表示的一个范围。
  insertText(text, from, to = from) {
    let schema = this.doc.type.schema
    if (from == null) {
      if (!text) return this.deleteSelection()
      return this.replaceSelectionWith(schema.text(text), true)
    } else {
      if (!text) return this.deleteRange(from, to)
      let marks = this.storedMarks
      if (!marks) {
        let $from = this.doc.resolve(from)
        marks = to == from ? $from.marks() : $from.marksAcross(this.doc.resolve(to))
      }
      this.replaceRangeWith(from, to, schema.text(text, marks))
      if (!this.selection.empty) this.setSelection(Selection.near(this.selection.$to))
      return this
    }
  }

  // :: (union<string, Plugin, PluginKey>, any) → Transaction
  // Store a metadata property in this transaction, keyed either by
  // name or by plugin.
  //
  // > 在该 transaction 上储存一个 metadata 信息，可以以 name 或者 plugin 来区分。
  //
  // . 注 因为一个 transaction 可能会被不同的 plugin 设置不同的 metadata 信息，因此需要区分。key 可以传 PluginKey，或者简单一个字符串。
  setMeta(key, value) {
    this.meta[typeof key == "string" ? key : key.key] = value
    return this
  }

  // :: (union<string, Plugin, PluginKey>) → any
  // Retrieve a metadata property for a given name or plugin.
  //
  // > 用指定的 name 或者 plugin key 来获取设置的 metadata 信息。
  //
  // . 注 指定的 name 或者 plugin key 就是上面 setMeta 设置的 key，获取的就是 setMeta 设置的 value。
  getMeta(key) {
    return this.meta[typeof key == "string" ? key : key.key]
  }

  // :: bool
  // Returns true if this transaction doesn't contain any metadata,
  // and can thus safely be extended.
  //
  // > 如果该 transaction 没有包含任何 metadata 信息则返回 true，如此以来就可以被安全的扩展。
  //
  // . 注 有些场景需要对 transaction 做一些额外处理，如合并多个 step，此时如果某个 step 有 metadata 信息，则说明该 step 对某个 plugin 可能有其他的用途，就不能简单的合并 step。
  get isGeneric() {
    for (let _ in this.meta) return false
    return true
  }

  // :: () → Transaction
  // Indicate that the editor should scroll the selection into view
  // when updated to the state produced by this transaction.
  //
  // > 当该 transaction 更新完 state 后，让编辑器将选区滚动到视图窗口之内。
  //
  // . 注 类似 chrome devtools 中，Elements 下对某个元素右键的 「Scroll into view」
  scrollIntoView() {
    this.updated |= UPDATED_SCROLL
    return this
  }

  get scrolledIntoView() {
    return (this.updated & UPDATED_SCROLL) > 0
  }
}
