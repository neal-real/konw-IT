import {Slice, Fragment} from "prosemirror-model"
import {ReplaceStep, ReplaceAroundStep} from "prosemirror-transform"

const classesById = Object.create(null)

// ::- Superclass for editor selections. Every selection type should
// extend this. Should not be instantiated directly.
//
// > 编辑器选区的超类。所有的选区类型都扩展自它。不应该直接实例化。
export class Selection {
  // :: (ResolvedPos, ResolvedPos, ?[SelectionRange])
  // Initialize a selection with the head and anchor and ranges. If no
  // ranges are given, constructs a single range across `$anchor` and
  // `$head`.
  //
  // > 用指定的 head 和 anchor 和 ranges 初始化一个选区。如果没有 ranges 指定，则构造一个包含 `$anchor` 和 `$head` 位置的 range。
  constructor($anchor, $head, ranges) {
    // :: [SelectionRange]
    // The ranges covered by the selection.
    //
    // > 选区覆盖到的 ranges。
    this.ranges = ranges || [new SelectionRange($anchor.min($head), $anchor.max($head))]
    // :: ResolvedPos
    // The resolved anchor of the selection (the side that stays in
    // place when the selection is modified).
    //
    // > 选区 resolved 过的 anchor 位置（即当选区变化的时候，其不动的一侧）。
    this.$anchor = $anchor
    // :: ResolvedPos
    // The resolved head of the selection (the side that moves when
    // the selection is modified).
    //
    // >选区 resolved 过的 head 位置（即当选区变化时，移动的一侧）。
    //
    // . 注 「选区变化时」可能是用户造成的，如用户用鼠标从左到右选择，则选区起始（左侧）是 anchor，即「锚点」；选区右侧（鼠标所在位置）是 head，即动点。
    this.$head = $head
  }

  // :: number
  // The selection's anchor, as an unresolved position.
  //
  // > 选区的 anchor 的位置。
  get anchor() { return this.$anchor.pos }

  // :: number
  // The selection's head.
  //
  // > 选区的 head 的位置。
  get head() { return this.$head.pos }

  // :: number
  // The lower bound of the selection's main range.
  //
  // > 选区位置较小一侧的位置。
  //
  // . 注 无论选区是如何选的，一般情况下 from 是选区的左侧起始位置。
  get from() { return this.$from.pos }

  // :: number
  // The upper bound of the selection's main range.
  //
  // > 选区位置较大的一侧。
  //
  // . 注 无论选区是如何选的，一般情况下 to 是选区的右侧结束位置。
  //
  // . 注 均不考虑多个选区的情况，而且似乎 chrome 等浏览器也不支持多选区，只是在一些编辑器中为了编辑方便，有多个选区的存在。
  get to() { return this.$to.pos }

  // :: ResolvedPos
  // The resolved lower  bound of the selection's main range.
  //
  // > resolve 过的选区的位置较小的一侧。
  get $from() {
    return this.ranges[0].$from
  }

  // :: ResolvedPos
  // The resolved upper bound of the selection's main range.
  //
  // > resolve 过的选区的位置较大的一侧。
  get $to() {
    return this.ranges[0].$to
  }

  // :: bool
  // Indicates whether the selection contains any content.
  //
  // > 表示选区是否包含任何内容。
  get empty() {
    let ranges = this.ranges
    for (let i = 0; i < ranges.length; i++)
      if (ranges[i].$from.pos != ranges[i].$to.pos) return false
    return true
  }

  // eq:: (Selection) → bool
  // Test whether the selection is the same as another selection.
  //
  // > 测试当前选区与另一个选区是否相等。

  // map:: (doc: Node, mapping: Mappable) → Selection
  // Map this selection through a [mappable](#transform.Mappable) thing. `doc`
  // should be the new document to which we are mapping.
  //
  // > 通过一个 [mappable](#transform.Mappable) 对象来 map 当前选区。 `doc` 参数应该是我们正在 mapping 的新的 document。
  //
  // . 注 一般通过 `tr.doc` 拿到将要 mapping 到的新的 document。

  // :: () → Slice
  // Get the content of this selection as a slice.
  //
  // > 获取选区内容的 slice 形式。
  content() {
    return this.$from.node(0).slice(this.from, this.to, true)
  }

  // :: (Transaction, ?Slice)
  // Replace the selection with a slice or, if no slice is given,
  // delete the selection. Will append to the given transaction.
  //
  // > 用指定的 slice 替换当前选区，如果没有给 slice，则删除选区。该操作会附加到指定 transaction 最后。
  //
  // . 注 替换后会将新的选区（光标）放到插入的内容的右侧。如果插入的内容是一个 inline 节点，则向右寻找该节点后面的位置。
  // 如果不是 inline 节点，则向左寻找。
  // 
  // . 注 英文原文档有多处使用了「backward」、「forward」、「back」之类的字眼，但是在不同的上下文中，其含义是不同的，因此此处意译为了「向左」或者「向右」，
  // 不习惯的可以鼠标悬浮查看原英文文档。
  replace(tr, content = Slice.empty) {
    // Put the new selection at the position after the inserted
    // content. When that ended in an inline node, search backwards,
    // to get the position after that node. If not, search forward.
    let lastNode = content.content.lastChild, lastParent = null
    for (let i = 0; i < content.openEnd; i++) {
      lastParent = lastNode
      lastNode = lastNode.lastChild
    }

    let mapFrom = tr.steps.length, ranges = this.ranges
    for (let i = 0; i < ranges.length; i++) {
      let {$from, $to} = ranges[i], mapping = tr.mapping.slice(mapFrom)
      tr.replaceRange(mapping.map($from.pos), mapping.map($to.pos), i ? Slice.empty : content)
      if (i == 0)
        selectionToInsertionEnd(tr, mapFrom, (lastNode ? lastNode.isInline : lastParent && lastParent.isTextblock) ? -1 : 1)
    }
  }

  // :: (Transaction, Node)
  // Replace the selection with the given node, appending the changes
  // to the given transaction.
  //
  // > 用指定的 node 替换当前选区，该操作会附加到指定的 transaction 最后。
  replaceWith(tr, node) {
    let mapFrom = tr.steps.length, ranges = this.ranges
    for (let i = 0; i < ranges.length; i++) {
      let {$from, $to} = ranges[i], mapping = tr.mapping.slice(mapFrom)
      let from = mapping.map($from.pos), to = mapping.map($to.pos)
      if (i) {
        tr.deleteRange(from, to)
      } else {
        tr.replaceRangeWith(from, to, node)
        selectionToInsertionEnd(tr, mapFrom, node.isInline ? -1 : 1)
      }
    }
  }

  // toJSON:: () → Object
  // Convert the selection to a JSON representation. When implementing
  // this for a custom selection class, make sure to give the object a
  // `type` property whose value matches the ID under which you
  // [registered](#state.Selection^jsonID) your class.
  //
  // > 将当前选区转换成 JSON 表示的格式。当在自己实现的 selection 类中实现此方法的时候，需要确保给这个返回的对象一个 `type` 属性，
  // 属性值是你 [注册](#state.Selection^jsonID) selection 时候的 ID。

  // :: (ResolvedPos, number, ?bool) → ?Selection
  // Find a valid cursor or leaf node selection starting at the given
  // position and searching back if `dir` is negative, and forward if
  // positive. When `textOnly` is true, only consider cursor
  // selections. Will return null when no valid selection position is
  // found.
  //
  // > 在指定的位置寻找一个可用的光标或叶节点选区，如果 `dir` 参数是负的则往左寻找，如果是正的则向右寻找。当 `textOnly` 是 true 的时候，则只考虑光标选区。
  // 如果没有可用的选区位置，则返回 null。
  //
  // . 注 此方法对在粘贴或者一番操作后，不知道应该将光标放到哪个合适的位置时的情况尤为有用，它会自动寻找一个合适的位置，而不用手动 setSelection，对此种情况还有用的一个方法是下面的 near 方法。
  static findFrom($pos, dir, textOnly) {
    let inner = $pos.parent.inlineContent ? new TextSelection($pos)
        : findSelectionIn($pos.node(0), $pos.parent, $pos.pos, $pos.index(), dir, textOnly)
    if (inner) return inner

    for (let depth = $pos.depth - 1; depth >= 0; depth--) {
      let found = dir < 0
          ? findSelectionIn($pos.node(0), $pos.node(depth), $pos.before(depth + 1), $pos.index(depth), dir, textOnly)
          : findSelectionIn($pos.node(0), $pos.node(depth), $pos.after(depth + 1), $pos.index(depth) + 1, dir, textOnly)
      if (found) return found
    }
  }

  // :: (ResolvedPos, ?number) → Selection
  // Find a valid cursor or leaf node selection near the given
  // position. Searches forward first by default, but if `bias` is
  // negative, it will search backwards first.
  //
  // > 在指定的位置寻找一个可用的光标或者叶节点选区。默认向右搜索，如果 `bias` 是负，则会优先向左搜索。
  static near($pos, bias = 1) {
    return this.findFrom($pos, bias) || this.findFrom($pos, -bias) || new AllSelection($pos.node(0))
  }

  // :: (Node) → Selection
  // Find the cursor or leaf node selection closest to the start of
  // the given document. Will return an
  // [`AllSelection`](#state.AllSelection) if no valid position
  // exists.
  //
  // > 寻找一个指定文档最开始的光标或叶节点选区。如果没有可用的位置存在，则返回 [`AllSelection`](#state.AllSelection)。
  static atStart(doc) {
    return findSelectionIn(doc, doc, 0, 0, 1) || new AllSelection(doc)
  }

  // :: (Node) → Selection
  // Find the cursor or leaf node selection closest to the end of the
  // given document.
  //
  // > 寻找一个指定文档最末尾的光标或者叶节点选区。
  static atEnd(doc) {
    return findSelectionIn(doc, doc, doc.content.size, doc.childCount, -1) || new AllSelection(doc)
  }

  // :: (Node, Object) → Selection
  // Deserialize the JSON representation of a selection. Must be
  // implemented for custom classes (as a static class method).
  //
  // > 反序列化一个选区的 JSON 表示。必须在自定义的 selection 类中实现该方法（作为一个静态类方法）。
  static fromJSON(doc, json) {
    if (!json || !json.type) throw new RangeError("Invalid input for Selection.fromJSON")
    let cls = classesById[json.type]
    if (!cls) throw new RangeError(`No selection type ${json.type} defined`)
    return cls.fromJSON(doc, json)
  }

  // :: (string, constructor<Selection>)
  // To be able to deserialize selections from JSON, custom selection
  // classes must register themselves with an ID string, so that they
  // can be disambiguated. Try to pick something that's unlikely to
  // clash with classes from other modules.
  //
  // > 为了能够从 JSON 中反序列化一个选区，自定义的 selection 类必须用一个字符串 ID 来注册自己，以消除歧义。
  // 尽量要用一个不会与其他模块的类名冲突的字符串。
  static jsonID(id, selectionClass) {
    if (id in classesById) throw new RangeError("Duplicate use of selection JSON ID " + id)
    classesById[id] = selectionClass
    selectionClass.prototype.jsonID = id
    return selectionClass
  }

  // :: () → SelectionBookmark
  // Get a [bookmark](#state.SelectionBookmark) for this selection,
  // which is a value that can be mapped without having access to a
  // current document, and later resolved to a real selection for a
  // given document again. (This is used mostly by the history to
  // track and restore old selections.) The default implementation of
  // this method just converts the selection to a text selection and
  // returns the bookmark for that.
  //
  // > 获取一个选区的 [bookmark](#state.SelectionBookmark)，它是一个无需访问当前 document 即可被 mapped
  // 然后再在 mapped 后通过指定一个 document 再解析成一个真实选区的值。（这个方法最可能被用在 history 中，以进行
  // 选区追踪和恢复旧选区）该方法的默认实现仅仅是转换当前选区为一个文本选区，然后返回文本选区的 bookmark。
  getBookmark() {
    return TextSelection.between(this.$anchor, this.$head).getBookmark()
  }
}

// :: bool
// Controls whether, when a selection of this type is active in the
// browser, the selected range should be visible to the user. Defaults
// to `true`.
//
// > 控制该选区类型在浏览器中被激活的时候是否对用户可见。默认是 `true`。
Selection.prototype.visible = true

// SelectionBookmark:: interface
// A lightweight, document-independent representation of a selection.
// You can define a custom bookmark type for a custom selection class
// to make the history handle it well.
//
// > 一个轻量的，文档无关的选区形式。你可以对一个自定义选区类来自定义一个 bookmark 类型，使 history 正确处理它（自定义选区的 bookmark）。
//
//   map:: (mapping: Mapping) → SelectionBookmark
//   Map the bookmark through a set of changes.
//   
//   > 在一系列的文档修改后 map 该 bookmark 到一个新的 bookmark。
//
//   resolve:: (doc: Node) → Selection
//   Resolve the bookmark to a real selection again. This may need to
//   do some error checking and may fall back to a default (usually
//   [`TextSelection.between`](#state.TextSelection^between)) if
//   mapping made the bookmark invalid.
//
//   > 将该 bookmark 再解析成一个真实选区。可能需要做一些错误检查，并且如果 mapping 后该 bookmark 变得不可用的话，则会回滚到
//   默认行为（通常是 [`TextSelection.between`](#state.TextSelection^between)）。

// ::- Represents a selected range in a document.
//
// > 表示文档中的一个选区范围。
export class SelectionRange {
  // :: (ResolvedPos, ResolvedPos)
  constructor($from, $to) {
    // :: ResolvedPos
    // The lower bound of the range.
    //
    // > 选区范围位置较小的一侧。
    this.$from = $from
    // :: ResolvedPos
    // The upper bound of the range.
    //
    // > 选区范围位置较大的一侧。
    this.$to = $to
  }
}

// ::- A text selection represents a classical editor selection, with
// a head (the moving side) and anchor (immobile side), both of which
// point into textblock nodes. It can be empty (a regular cursor
// position).
//
// > 一个文本选区代表一个典型的编辑器选区，其有一个 head（移动的一侧）和一个 anchor（不动的一侧），二者都
// 指向一个文本块节点。它可以是空的（此时表示一个正常的光标位置）。
//
// . 注 文本块节点，即文本节点的直接父节点。如定义了 doc > p > text，则文本块节点即 p 节点。
export class TextSelection extends Selection {
  // :: (ResolvedPos, ?ResolvedPos)
  // Construct a text selection between the given points.
  //
  // > 构造一个包含指定两点的文本选区。
  constructor($anchor, $head = $anchor) {
    super($anchor, $head)
  }

  // :: ?ResolvedPos
  // Returns a resolved position if this is a cursor selection (an
  // empty text selection), and null otherwise.
  //
  // > 如果当前选区是一个光标选区（一个空的文本选区），则返回其 resolved 过的位置，否则返回 null。
  get $cursor() { return this.$anchor.pos == this.$head.pos ? this.$head : null }

  map(doc, mapping) {
    let $head = doc.resolve(mapping.map(this.head))
    if (!$head.parent.inlineContent) return Selection.near($head)
    let $anchor = doc.resolve(mapping.map(this.anchor))
    return new TextSelection($anchor.parent.inlineContent ? $anchor : $head, $head)
  }

  replace(tr, content = Slice.empty) {
    super.replace(tr, content)
    if (content == Slice.empty) {
      let marks = this.$from.marksAcross(this.$to)
      if (marks) tr.ensureMarks(marks)
    }
  }

  eq(other) {
    return other instanceof TextSelection && other.anchor == this.anchor && other.head == this.head
  }

  getBookmark() {
    return new TextBookmark(this.anchor, this.head)
  }

  toJSON() {
    return {type: "text", anchor: this.anchor, head: this.head}
  }

  static fromJSON(doc, json) {
    if (typeof json.anchor != "number" || typeof json.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON")
    return new TextSelection(doc.resolve(json.anchor), doc.resolve(json.head))
  }

  // :: (Node, number, ?number) → TextSelection
  // Create a text selection from non-resolved positions.
  //
  // > 用一个非 resolved 过的位置作为参数来创建一个文本选区。
  static create(doc, anchor, head = anchor) {
    let $anchor = doc.resolve(anchor)
    return new this($anchor, head == anchor ? $anchor : doc.resolve(head))
  }

  // :: (ResolvedPos, ResolvedPos, ?number) → Selection
  // Return a text selection that spans the given positions or, if
  // they aren't text positions, find a text selection near them.
  // `bias` determines whether the method searches forward (default)
  // or backwards (negative number) first. Will fall back to calling
  // [`Selection.near`](#state.Selection^near) when the document
  // doesn't contain a valid text position.
  //
  // > 返回一个跨越指定 anchor 和 head 位置的选区，如果它们不是一个文本位置，则调用 findFrom 就近寻找一个可用的文本选区。
  // `bias` 决定就近向哪个方向寻找，默认是向左，值为负时是向右。如果文档不包含一个可用的文本位置，
  // 则调用 [`Selection.near`](#state.Selection^near) 方法。
  static between($anchor, $head, bias) {
    let dPos = $anchor.pos - $head.pos
    if (!bias || dPos) bias = dPos >= 0 ? 1 : -1
    if (!$head.parent.inlineContent) {
      let found = Selection.findFrom($head, bias, true) || Selection.findFrom($head, -bias, true)
      if (found) $head = found.$head
      else return Selection.near($head, bias)
    }
    if (!$anchor.parent.inlineContent) {
      if (dPos == 0) {
        $anchor = $head
      } else {
        $anchor = (Selection.findFrom($anchor, -bias, true) || Selection.findFrom($anchor, bias, true)).$anchor
        if (($anchor.pos < $head.pos) != (dPos < 0)) $anchor = $head
      }
    }
    return new TextSelection($anchor, $head)
  }
}

Selection.jsonID("text", TextSelection)

class TextBookmark {
  constructor(anchor, head) {
    this.anchor = anchor
    this.head = head
  }
  map(mapping) {
    return new TextBookmark(mapping.map(this.anchor), mapping.map(this.head))
  }
  resolve(doc) {
    return TextSelection.between(doc.resolve(this.anchor), doc.resolve(this.head))
  }
}

// ::- A node selection is a selection that points at a single node.
// All nodes marked [selectable](#model.NodeSpec.selectable) can be
// the target of a node selection. In such a selection, `from` and
// `to` point directly before and after the selected node, `anchor`
// equals `from`, and `head` equals `to`..
//
// > 一个 node （节点）选区是一个指向单独节点的选区。所有的配置为 [selectable](#model.NodeSpec.selectable)
// 的 node 节点都可以是一个 node 选区的目标。在这个类型的选区中，`from` 和 `to` 直接指向选择节点的前面和后面，
// `anchor` 等于 `from`，`head` 等于 `to`。
//
// . 注 node 选区就是当选中一个节点的时候的选区类型。
export class NodeSelection extends Selection {
  // :: (ResolvedPos)
  // Create a node selection. Does not verify the validity of its
  // argument.
  //
  // > 新建一个 node 选区。不会验证参数的可用性。
  //
  // . 注 因为不会验证参数的可用性，所以需要保证参数 $pos 是一个 resolved 过的可用 pos。
  constructor($pos) {
    let node = $pos.nodeAfter
    let $end = $pos.node(0).resolve($pos.pos + node.nodeSize)
    super($pos, $end)
    // :: Node The selected node.
    //
    // > 当前选择的 node。
    this.node = node
  }

  map(doc, mapping) {
    let {deleted, pos} = mapping.mapResult(this.anchor)
    let $pos = doc.resolve(pos)
    if (deleted) return Selection.near($pos)
    return new NodeSelection($pos)
  }

  content() {
    return new Slice(Fragment.from(this.node), 0, 0)
  }

  eq(other) {
    return other instanceof NodeSelection && other.anchor == this.anchor
  }

  toJSON() {
    return {type: "node", anchor: this.anchor}
  }

  getBookmark() { return new NodeBookmark(this.anchor) }

  static fromJSON(doc, json) {
    if (typeof json.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON")
    return new NodeSelection(doc.resolve(json.anchor))
  }

  // :: (Node, number) → NodeSelection
  // Create a node selection from non-resolved positions.
  //
  // > 以一个未 resolved 过的位置来新建一个 node 选区。
  static create(doc, from) {
    return new this(doc.resolve(from))
  }

  // :: (Node) → bool
  // Determines whether the given node may be selected as a node
  // selection.
  //
  // > 判断给的节点是否可以被选中作为一个 node 选区。
  static isSelectable(node) {
    return !node.isText && node.type.spec.selectable !== false
  }
}

NodeSelection.prototype.visible = false

Selection.jsonID("node", NodeSelection)

class NodeBookmark {
  constructor(anchor) {
    this.anchor = anchor
  }
  map(mapping) {
    let {deleted, pos} = mapping.mapResult(this.anchor)
    return deleted ? new TextBookmark(pos, pos) : new NodeBookmark(pos)
  }
  resolve(doc) {
    let $pos = doc.resolve(this.anchor), node = $pos.nodeAfter
    if (node && NodeSelection.isSelectable(node)) return new NodeSelection($pos)
    return Selection.near($pos)
  }
}

// ::- A selection type that represents selecting the whole document
// (which can not necessarily be expressed with a text selection, when
// there are for example leaf block nodes at the start or end of the
// document).
//
// > 代表了选中整个文档的选区类型（此时可能用文本选区类型来表示不是必要的，比如当一个文档开头或者结尾有一个叶节点的时候）。
export class AllSelection extends Selection {
  // :: (Node)
  // Create an all-selection over the given document.
  //
  // > 创建一个覆盖指定文档的 AllSelection 选区类型。
  constructor(doc) {
    super(doc.resolve(0), doc.resolve(doc.content.size))
  }

  replace(tr, content = Slice.empty) {
    if (content == Slice.empty) {
      tr.delete(0, tr.doc.content.size)
      let sel = Selection.atStart(tr.doc)
      if (!sel.eq(tr.selection)) tr.setSelection(sel)
    } else {
      super.replace(tr, content)
    }
  }

  toJSON() { return {type: "all"} }

  static fromJSON(doc) { return new AllSelection(doc) }

  map(doc) { return new AllSelection(doc) }

  eq(other) { return other instanceof AllSelection }

  getBookmark() { return AllBookmark }
}

Selection.jsonID("all", AllSelection)

const AllBookmark = {
  map() { return this },
  resolve(doc) { return new AllSelection(doc) }
}

// FIXME we'll need some awareness of text direction when scanning for selections

// Try to find a selection inside the given node. `pos` points at the
// position where the search starts. When `text` is true, only return
// text selections.
function findSelectionIn(doc, node, pos, index, dir, text) {
  if (node.inlineContent) return TextSelection.create(doc, pos)
  for (let i = index - (dir > 0 ? 0 : 1); dir > 0 ? i < node.childCount : i >= 0; i += dir) {
    let child = node.child(i)
    if (!child.isAtom) {
      let inner = findSelectionIn(doc, child, pos + dir, dir < 0 ? child.childCount : 0, dir, text)
      if (inner) return inner
    } else if (!text && NodeSelection.isSelectable(child)) {
      return NodeSelection.create(doc, pos - (dir < 0 ? child.nodeSize : 0))
    }
    pos += child.nodeSize * dir
  }
}

function selectionToInsertionEnd(tr, startLen, bias) {
  let last = tr.steps.length - 1
  if (last < startLen) return
  let step = tr.steps[last]
  if (!(step instanceof ReplaceStep || step instanceof ReplaceAroundStep)) return
  let map = tr.mapping.maps[last], end
  map.forEach((_from, _to, _newFrom, newTo) => { if (end == null) end = newTo })
  tr.setSelection(Selection.near(tr.doc.resolve(end), bias))
}
