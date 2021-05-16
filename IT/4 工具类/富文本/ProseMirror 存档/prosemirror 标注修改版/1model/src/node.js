/**
* & 文件说明: Node类表示 PM 文档的树中的一个节点。
* > 因此，整个文档都是节点的组成,就像一个节点树一样
* > 假设你需要新的内容,你可以在原有的基础创建新的内容,新旧树之间共享相同的部分,这样的树没有向后指针,这样维护简单,性能好
* > 请勿**直接更改Node对象的属性, 多信息请参阅[指南]（/docs/guide/#doc）
*/



// fragment 也是一个持久化数据结构
import { Fragment } from "./fragment"
// 标记 节点上的一小段信息,比如可以加粗之类的
import { Mark } from "./mark"
import { Slice, replace } from "./replace"
import { ResolvedPos } from "./resolvedpos"
import { compareDeep } from "./comparedeep"

// & NULL 属性
const emptyAttrs = Object.create(null)

/**
* > 这个类表示 PM 文档树的节点,整个树从一个根节点对象开始,嵌套表示
* > 更新方式,通过旧 state 创建新 state 保存并表示最新的文档.
* > 其中共享相同部分,不同的部分用来区别不同的状态
*/
export class Node {
  // ? !不要 直接修改 Node 对象的属性: 节点 类型, 属性, 内容,标记.
  constructor(type, attrs, content, marks) {
    // > 当前节点的类型。
    this.type = type
    // > 节点的属性, 以键值对形式表示。只能是 model.NodeSpec.attrs 中的某个类型
    this.attrs = attrs
    // > 此节点下内容,否则为 null;   Fragment.empty = ([], 0)
    this.content = content || Fragment.empty
    // > 给标记赋值,无值则为空数组;   Mark.none = [] 空数组
    this.marks = marks || Mark.none
  }

  /**
  * > 返回此节点的大小，
  */
  get nodeSize() {
    /**
    * 1. 行内元素,大小的表示方式是 指南中 Indexing 的内容说明
    * 2. 文本节点是 字符数
    * 3. 叶节点 1
    * 4. 非叶节点在其内容的大小 加上 2 (开始和结束标签)
    */
    return this.isLeaf ? 1 : 2 + this.content.size
  }

  // > 该节点拥有的子节点个数。
  get childCount() {
    return this.content.childCount
  }

  // & 2 个获取子节点,一个返回错误,一个返回 undefined。
  // > 获取指定位置的子节点。索引超出范围，返回错误。
  child(index) {
    return this.content.child(index)
  }
  // > 获取指定位置的子节点。不存在返回 undefined。
  maybeChild(index) {
    return this.content.maybeChild(index)
  }


  /**
  * > 遍历子节点,使每个子节点调用 `f` 函数
  * > forEach(f: fn(node: Node, offset: number, index: number))
  * @ 参数: (子节点, 子节点相对于当前节点的偏移数字, 它的 index)
  */
  forEach(f) {
    this.content.forEach(f)
  }

  /** 
    * 节点之间递归
    * > 在相对于当前节点内容开始位置的两个位置之间对所有的后代节点递归的调用 f 回调。
    * > 回调的参数是后代节点、后代节点开始位置相对于当前节点的偏移、后代节点的父节点、以及它在父节点中的 index。
    * 函数: nodesBetween( from: number,  to: number,  f: fn (node: Node, pos: number, parent: Node, index: number) → ?⁠bool, startPos: ?⁠number = 0)
  */
  nodesBetween(from, to, f, startPos = 0) {
    this.content.nodesBetween(from, to, f, startPos, this)
  }

  // > 对每一个后代节点调用函数 `f`。当 f 处理一个节点的时候返回 false ，则后续不会递归此节点。
  // .注 上述递归都是深度优先。
  descendants(f) {
    this.nodesBetween(0, this.content.size, f)
  }

  // > 该节点的所有文本内容连接为一个字符串返回。
  get textContent() { 
    return this.textBetween(0, this.content.size, "") 
  }

  /**
  * > 获取 `from` 和 `to` 之间的所有文本内容。
  * > 当 `blockSeparator` 指定的时候，它将会插入到每一个新的块级节点开始的地方。
  * > 当 `leafText` 指定的时候，它将会插入到遇到的每一个非文本叶子节点后面。
  */
  textBetween(from, to, blockSeparator, leafText) {
    return this.content.textBetween(from, to, blockSeparator, leafText)
  }

  // > 返回节点的第一个子节点，如果没有则是 `null`。
  get firstChild() { return this.content.firstChild }

  // > 返回节点的最后一个子节点，如果没有则是 `null`。
  get lastChild() { return this.content.lastChild }

  /**
  * > 测试两个节点是否表示的是文档中相同的部分
  * .备注: 比较的手段是先比较节点的引用，如果相等直接为 true；
  * .否则比较 markup 是否相等，如果不是则返回 false，如果是再递归比较二者的子节点。
  * .markup 指的是节点类型、节点 attributes、和其上的 marks。
  */
  eq(other) {
    return this == other || (this.sameMarkup(other) && this.content.eq(other.content))
  }

  // > 比较当前与指定节点的 markup（包含类型、attributes 和 marks）是否相等。如果相同返回 `true`。
  sameMarkup(other) {
    return this.hasMarkup(other.type, other.attrs, other.marks)
  }

  // > 检查节点是否有指定的类型、attributes 和 marks。
  hasMarkup(type, attrs, marks) {
    return this.type == type &&
      compareDeep(this.attrs, attrs || type.defaultAttrs || emptyAttrs) &&
      Mark.sameSet(this.marks, marks || Mark.none)
  }

  // > 新建一个与当前节点有相同 markup 的节点，包含指定的内容（如果没有指定内容则为空）。
  copy(content = null) {
    if (content == this.content) return this
    return new this.constructor(this.type, this.attrs, content, this.marks)
  }

  // > 新建一个当前节点的副本，包含指定的 marks，而不是当前节点原始的 marks。
  mark(marks) {
    return marks == this.marks ? this : new this.constructor(this.type, this.attrs, this.content, marks)
  }

  // > 创建一个当前节点的副本，该节点仅包含指定位置范围的内容。如果 `to` 没有指定，则默认是当前节点的结束位置。
  cut(from, to) {
    if (from == 0 && to == this.content.size) return this
    return this.copy(this.content.cut(from, to))
  }

  // > 剪切文档指定位置范围的部分，然后作为 `Slice` 对象返回。
  slice(from, to = this.content.size, includeParents = false) {
    if (from == to) return Slice.empty

    let $from = this.resolve(from), $to = this.resolve(to)
    let depth = includeParents ? 0 : $from.sharedDepth(to)
    let start = $from.start(depth), node = $from.node(depth)
    let content = node.content.cut($from.pos - start, $to.pos - start)
    return new Slice(content, $from.depth - depth, $to.depth - depth)
  }

  // > 用指定的 slice 替换指定位置范围的文档内容。slice 必须「适合」该位置范围，也就是说，slice 打开的两侧必须能够正确的连接它两侧被切开的周围的内容，
  // > 同时它的子节点也必须符合放入位置的祖先节点的 scheme 约束。如果有任何违背，那么将会抛出一个 [`ReplaceError`](#model.ReplaceError)。
  replace(from, to, slice) {
    return replace(this.resolve(from), this.resolve(to), slice)
  }

  // > 返回指定位置右侧的节点。
  // >「右侧」为紧挨着指定位置的右侧节点，不存在则为 null。
  nodeAt(pos) {
    for (let node = this; ;) {
      let { index, offset } = node.content.findIndex(pos)
      node = node.maybeChild(index)
      if (!node) return null
      if (offset == pos || node.isText) return node
      pos -= offset + 1
    }
  }

  // > 如果有的话，返回指定偏移量后面的直接子节点，同时返回它的 index 以及相对于当前节点的偏移。
  childAfter(pos) {
    let { index, offset } = this.content.findIndex(pos)
    return { node: this.content.maybeChild(index), index, offset }
  }

  // > 如果有的话，返回指定偏移量前面的直接子节点，同时返回它的 index 以及相对于当前节点的偏移。
  childBefore(pos) {
    if (pos == 0) return { node: null, index: 0, offset: 0 }
    let { index, offset } = this.content.findIndex(pos)
    if (offset < pos) return { node: this.content.child(index), index, offset }
    let node = this.content.child(index - 1)
    return { node, index: index - 1, offset: offset - node.nodeSize }
  }

  // > resolve 文档中指定的位置，返回一个关于此位置上下文信息的 [object](#model.ResolvedPos)。
  resolve(pos) { return ResolvedPos.resolveCached(this, pos) }

  resolveNoCache(pos) { return ResolvedPos.resolve(this, pos) }

  // > 测试文档中指定的位置范围内是否有指定的 mark 或者 mark 类型。
  rangeHasMark(from, to, type) {
    let found = false
    if (to > from) this.nodesBetween(from, to, node => {
      if (type.isInSet(node.marks)) found = true
      return !found
    })
    return found
  }

  // > 是否是一个块级节点（非内联节点的都是块级节点）。
  get isBlock() { return this.type.isBlock }

  /**
  * > 是否是一个文本块节点（textblock），即有内联内容的块级节点
  * > 为 true 表示这个 node 是个含有 inline content 的 block nodes
  */
  get isTextblock() { return this.type.isTextblock }

  // > 节点是否允许内联内容。
  get inlineContent() { return this.type.inlineContent }

  // > 节点是否是内联元素（文本节点或者能够出现在文本之间的节点都是内联节点）。
  get isInline() { return this.type.isInline }

  // > 是否是文本节点。
  get isText() { return this.type.isText }

  // > 是否是一个叶子节点。为 true 表示该 node 不允许含有任何 content
  get isLeaf() { return this.type.isLeaf }

  // > 是否是一个原子节点，例如，它没有一个直接可编辑的内容。它的值通常与 `isLeaf` 一样，不过可以通过节点配置对象上的 [`atom` 属性](#model.NodeSpec.atom) 进行设置。
  // （典型的使用场景是节点展示成一个不可编辑的 [node view](#view.NodeView)）。
  get isAtom() { return this.type.isAtom }

  // > 为了 debug 目的获取当前节点的字符串表示。
  toString() {
    if (this.type.spec.toDebugString) return this.type.spec.toDebugString(this)
    let name = this.type.name
    if (this.content.size)
      name += "(" + this.content.toStringInner() + ")"
    return wrapMarks(this.marks, name)
  }

  // > 获取当前节点指定 index 的 content match; content match 在 ProseMirror 中也是一个专有名词。
  contentMatchAt(index) {
    let match = this.type.contentMatch.matchFragment(this.content, 0, index)
    if (!match) throw new Error("Called contentMatchAt on a node with invalid content")
    return match
  }

  // > 测试用指定的 fragment（默认是空的 fragment） 替换 `from` 到 `to`（from 和 to 是子节点位置 index） 之间的内容是否合法（即符合 schema 约束）。
  // 你可以可选的传入 `start` 和 `end`（start 和 end 都是子节点的位置 index）以只用 fragment 的一部分替换。
  canReplace(from, to, replacement = Fragment.empty, start = 0, end = replacement.childCount) {
    let one = this.contentMatchAt(from).matchFragment(replacement, start, end)
    let two = one && one.matchFragment(this.content, to)
    if (!two || !two.validEnd) return false
    for (let i = start; i < end; i++) if (!this.type.allowsMarks(replacement.child(i).marks)) return false
    return true
  }

  // > 测试用指定的节点类型替换当前节点 `from` 到 `to` index 之间的子元素是否合法。
  canReplaceWith(from, to, type, marks) {
    if (marks && !this.type.allowsMarks(marks)) return false
    let start = this.contentMatchAt(from).matchType(type)
    let end = start && start.matchFragment(this.content, to)
    return end ? end.validEnd : false
  }

  /**
  * > // > 测试指定节点的内容是否可以添加到当前节点的最后。
  * 如果指定节点是空的，那么只有当至少一个节点类型能够出现在这两个节点之内的时候才会返回 true（以避免合并完全不兼容的节点）。
  */
  canAppend(other) {
    if (other.content.size) return this.canReplace(this.childCount, this.childCount, other.content)
    else return this.type.compatibleContent(other.type)
  }

  // > 检查当前节点和节点的所有后代是否符合当前节点的规则，如果不符合的话会抛出一个错误。
  check() {
    if (!this.type.validContent(this.content))
      throw new RangeError(`节点的内容不符合当前节点规则 ${this.type.name}: ${this.content.toString().slice(0, 50)}`)
    this.content.forEach(node => node.check())
  }

  // > PM 节点 转为 JSON ,返回 JSON ; 这里的序列化后是个对象。
  toJSON() {
    let obj = { type: this.type.name }
    for (let _ in this.attrs) {
      obj.attrs = this.attrs
      break
    }
    if (this.content.size)
      obj.content = this.content.toJSON()
    if (this.marks.length)
      obj.marks = this.marks.map(n => n.toJSON())
    return obj
  }

  // > 从 JSON 转为 PM 节点, 返回 PM 节点
  static fromJSON(schema, json) {
    if (!json) throw new RangeError("Invalid input for Node.fromJSON")
    let marks = null
    if (json.marks) {
      if (!Array.isArray(json.marks)) throw new RangeError("Invalid mark data for Node.fromJSON")
      marks = json.marks.map(schema.markFromJSON)
    }
    if (json.type == "text") {
      if (typeof json.text != "string") throw new RangeError("Invalid text node in JSON")
      return schema.text(json.text, marks)
    }
    let content = Fragment.fromJSON(schema, json.content)
    return schema.nodeType(json.type).create(json.attrs, content, marks)
  }
}
//  JS 继承语法 extends Node
/**
* & 扩展节点 新增文本节点
* > JS 继承语法 extends Node
*/
export class TextNode extends Node {
  constructor(type, attrs, content, marks) {
    super(type, attrs, null, marks)

    if (!content) throw new RangeError("Empty text nodes are not allowed")
    // > 对于文本节点，它包含了节点的文本内容
    this.text = content
  }
  // 转成字符串
  toString() {
    if (this.type.spec.toDebugString) return this.type.spec.toDebugString(this)
    return wrapMarks(this.marks, JSON.stringify(this.text))
  }
  // > 获得文本的内容
  get textContent() { return this.text }
  // 文本之间?
  textBetween(from, to) { return this.text.slice(from, to) }
  // > 获得文本节点的长度
  get nodeSize() { return this.text.length }
  // > 文本的标记
  mark(marks) {
    return marks == this.marks ? this : new TextNode(this.type, this.attrs, this.text, marks)
  }
  // > 判断文本是否相同,相同返回 this ,否则 生成一个新的文本节点
  withText(text) {
    if (text == this.text) return this
    return new TextNode(this.type, this.attrs, text, this.marks)
  }
  // > 剪切
  cut(from = 0, to = this.text.length) {
    if (from == 0 && to == this.text.length) return this
    return this.withText(this.text.slice(from, to))
  }
  // > 判断是否一样
  eq(other) {
    return this.sameMarkup(other) && this.text == other.text
  }
  // > 内容序列化
  toJSON() {
    let base = super.toJSON()
    base.text = this.text
    return base
  }
}
// >  包装标记
function wrapMarks(marks, str) {
  for (let i = marks.length - 1; i >= 0; i--)
    str = marks[i].type.name + "(" + str + ")"
  return str
}
