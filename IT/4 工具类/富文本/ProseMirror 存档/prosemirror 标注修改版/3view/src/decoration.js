function compareObjs(a, b) {
  if (a == b) return true
  for (let p in a) if (a[p] !== b[p]) return false
  for (let p in b) if (!(p in a)) return false
  return true
}

class WidgetType {
  constructor(toDOM, spec) {
    this.spec = spec || noSpec
    this.side = this.spec.side || 0
    this.toDOM = toDOM
  }

  map(mapping, span, offset, oldOffset) {
    let {pos, deleted} = mapping.mapResult(span.from + oldOffset, this.side < 0 ? -1 : 1)
    return deleted ? null : new Decoration(pos - offset, pos - offset, this)
  }

  valid() { return true }

  eq(other) {
    return this == other ||
      (other instanceof WidgetType &&
       (this.spec.key && this.spec.key == other.spec.key ||
        this.toDOM == other.toDOM && compareObjs(this.spec, other.spec)))
  }
}

class InlineType {
  constructor(attrs, spec) {
    this.spec = spec || noSpec
    this.attrs = attrs
  }

  map(mapping, span, offset, oldOffset) {
    let from = mapping.map(span.from + oldOffset, this.spec.inclusiveStart ? -1 : 1) - offset
    let to = mapping.map(span.to + oldOffset, this.spec.inclusiveEnd ? 1 : -1) - offset
    return from >= to ? null : new Decoration(from, to, this)
  }

  valid(_, span) { return span.from < span.to }

  eq(other) {
    return this == other ||
      (other instanceof InlineType && compareObjs(this.attrs, other.attrs) &&
       compareObjs(this.spec, other.spec))
  }

  static is(span) { return span.type instanceof InlineType }
}

class NodeType {
  constructor(attrs, spec) {
    this.spec = spec || noSpec
    this.attrs = attrs
  }

  map(mapping, span, offset, oldOffset) {
    let from = mapping.mapResult(span.from + oldOffset, 1)
    if (from.deleted) return null
    let to = mapping.mapResult(span.to + oldOffset, -1)
    if (to.deleted || to.pos <= from.pos) return null
    return new Decoration(from.pos - offset, to.pos - offset, this)
  }

  valid(node, span) {
    let {index, offset} = node.content.findIndex(span.from)
    return offset == span.from && offset + node.child(index).nodeSize == span.to
  }

  eq(other) {
    return this == other ||
      (other instanceof NodeType && compareObjs(this.attrs, other.attrs) &&
       compareObjs(this.spec, other.spec))
  }
}

// ::- Decoration objects can be provided to the view through the
// [`decorations` prop](#view.EditorProps.decorations). They come in
// several variants—see the static members of this class for details.
//
// > Decoration（装饰器）对象可以通过 [`decoration` 属性](#view.EditorProps.decorations)提供给 view。
// 它们有多个不同的变体，有关的详细信息，参见此类的静态成员。
//
// . 注 Decoration 有三种，widget 挂件装饰器；inline 行内装饰器；node 节点装饰器；
export class Decoration {
  constructor(from, to, type) {
    // :: number
    // The start position of the decoration.
    //
    // > decoration 开始的位置
    this.from = from
    // :: number
    // The end position. Will be the same as `from` for [widget
    // decorations](#view.Decoration^widget).
    //
    // > decoration 结束的位置。如果是 [widget decorations](#view.Decoration^widget) 的话，该值将会和 `from` 一致。
    this.to = to
    this.type = type
  }

  copy(from, to) {
    return new Decoration(from, to, this.type)
  }

  eq(other, offset = 0) {
    return this.type.eq(other.type) && this.from + offset == other.from && this.to + offset == other.to
  }

  map(mapping, offset, oldOffset) {
    return this.type.map(mapping, this, offset, oldOffset)
  }

  // :: (number, union<(view: EditorView, getPos: () → number) → dom.Node, dom.Node>, ?Object) → Decoration
  // Creates a widget decoration, which is a DOM node that's shown in
  // the document at the given position. It is recommended that you
  // delay rendering the widget by passing a function that will be
  // called when the widget is actually drawn in a view, but you can
  // also directly pass a DOM node. `getPos` can be used to find the
  // widget's current document position.
  //
  // > 创建一个 widget decorations，它是一个显示在指定位置的 DOM 节点。推荐的方式是通过传递一个函数来返回 decoration，以实现当该 decoration
  // 绘制在 view 的时候延迟渲染的目的，不过你也可以直接传递一个 DOM 节点。`getPos` 方法用来获取 widget 在当前文档的位置。
  //
  //   spec::- These options are supported:
  //
  //   > 支持以下可选参数：
  //
  //     side:: ?number
  //     Controls which side of the document position this widget is
  //     associated with. When negative, it is drawn before a cursor
  //     at its position, and content inserted at that position ends
  //     up after the widget. When zero (the default) or positive, the
  //     widget is drawn after the cursor and content inserted there
  //     ends up before the widget.
  //
  //     > 控制该 widget 与文档位置的哪一侧相关。当是负数的时候，它绘制在指定位置光标的之前，
  //     并且在该位置插入的内容在 widget 之后。当非负（默认）的时候，widget 绘制在指定位置光标之后，用户输入的内容会插入到该位置之前。
  //
  //     When there are multiple widgets at a given position, their
  //     `side` values determine the order in which they appear. Those
  //     with lower values appear first. The ordering of widgets with
  //     the same `side` value is unspecified.
  //
  //     > 当在同一个位置有多个 widget 的时候，他们的 `side` 决定了它们出现的顺序。较小的值出现在前面。
  //     相同 `side` 值的话先后位置不确定。
  //
  //     . 注 相同 `side` 值 widget 出现的先后位置不确定，原因跟某些算法排序的 `稳定` 概念类似。
  //
  //     When `marks` is null, `side` also determines the marks that
  //     the widget is wrapped in—those of the node before when
  //     negative, those of the node after when positive.
  //
  //     > 当 `marks` 是 null 的时候，`side` 同样决定 widget 包裹的 marks。节点之前的是负的，节点之后的是正的。
  //
  //     marks:: ?[Mark]
  //     The precise set of marks to draw around the widget.
  //
  //     > 绘制在 widget 周围的 marks。
  //
  //     stopEvent:: ?(event: dom.Event) → bool
  //     Can be used to control which DOM events, when they bubble out
  //     of this widget, the editor view should ignore.
  //
  //     > 可以用来控制编辑器应该忽略从 widget 冒泡出来的哪些 DOM 事件。
  //
  //     ignoreSelection:: ?bool
  //     When set (defaults to false), selection changes inside the
  //     widget are ignored, and don't cause ProseMirror to try and
  //     re-sync the selection with its selection state.
  //
  //     > 当设置的时候（默认是 false），在 widget 内的选区变化将被忽略，
  //     这样的话该变化就不会让 ProseMirror 尝试重新同步该选区和 state 的选区。
  //
  //     key:: ?string
  //     When comparing decorations of this type (in order to decide
  //     whether it needs to be redrawn), ProseMirror will by default
  //     compare the widget DOM node by identity. If you pass a key,
  //     that key will be compared instead, which can be useful when
  //     you generate decorations on the fly and don't want to store
  //     and reuse DOM nodes. Make sure that any widgets with the same
  //     key are interchangeable—if widgets differ in, for example,
  //     the behavior of some event handler, they should get
  //     different keys.
  //     
  //     > 当比较此种类型的 decorations 的时候（以决定它是否应该被重绘），ProseMirror
  //     将会默认通过 widget DOM 节点来识别。如果你传递了一个 key，那它就会用 key 来对比。
  //     这对于你仅仅想在内存中创建 decorations 而不真正绘制 DOM 结构很有用。确保任何具有相同 key 的 widget
  //     是可互换的--比如，如果 widget 的一些事件处理函数不一样，即使 DOM 结构相同，也应该有不同的 key。
  static widget(pos, toDOM, spec) {
    return new Decoration(pos, pos, new WidgetType(toDOM, spec))
  }

  // :: (number, number, DecorationAttrs, ?Object) → Decoration
  // Creates an inline decoration, which adds the given attributes to
  // each inline node between `from` and `to`.
  //
  // > 创建一个内联的 decoration，它会在 `from` 和 `to` 之间的每一个内联节点上添加指定的 attributes。
  //
  //   spec::- These options are recognized:
  //
  //   > 支持一下可选参数：
  //
  //     inclusiveStart:: ?bool
  //     Determines how the left side of the decoration is
  //     [mapped](#transform.Position_Mapping) when content is
  //     inserted directly at that position. By default, the decoration
  //     won't include the new content, but you can set this to `true`
  //     to make it inclusive.
  //
  //     > 决定如果内容直接插入在这个位置的时候，decoration 的左侧如何 [mapped](#transform.Position_Mapping)。
  //     默认情况下，decoration 不会包括新的内容，不过你可以设置为 `true` 来让它影响新内容。
  //
  //     inclusiveEnd:: ?bool
  //     Determines how the right side of the decoration is mapped.
  //     See
  //     [`inclusiveStart`](#view.Decoration^inline^spec.inclusiveStart).
  //     
  //     > 决定 decoration 的右侧如何被 mapped。具体看 [`inclusiveStart`](#view.Decoration^inline^spec.inclusiveStart)。
  static inline(from, to, attrs, spec) {
    return new Decoration(from, to, new InlineType(attrs, spec))
  }

  // :: (number, number, DecorationAttrs, ?Object) → Decoration
  // Creates a node decoration. `from` and `to` should point precisely
  // before and after a node in the document. That node, and only that
  // node, will receive the given attributes.
  //  
  // > 创建一个 node decoration。`from` 和 `to` 应该精确的指向在文档中的某个节点的前面和后面。该节点，也只有该节点，会受到指定的 attributes。  
  //
  //   spec::-
  //
  //   Optional information to store with the decoration. It
  //   is also used when comparing decorators for equality.
  //   
  //   > decoration 存储的可选的信息。也用来比较 decorators（装饰器们）是否相等。
  static node(from, to, attrs, spec) {
    return new Decoration(from, to, new NodeType(attrs, spec))
  }

  // :: Object
  // The spec provided when creating this decoration. Can be useful
  // if you've stored extra information in that object.
  //
  // > 当创建 decoration 的时候提供的配置。用来存储一些额外的信息非常有用。
  get spec() { return this.type.spec }

  get inline() { return this.type instanceof InlineType }
}

// DecorationAttrs:: interface
// A set of attributes to add to a decorated node. Most properties
// simply directly correspond to DOM attributes of the same name,
// which will be set to the property's value. These are exceptions:
//
// > 一个被用来添加到被装饰的节点附近的 attributes 集合。大多数 properties
// 的名字与同名的 DOM attributes 一样，以用来被设置为属性值。下面几个是特例：
//
//   class:: ?string
//   A CSS class name or a space-separated set of class names to be
//   _added_ to the classes that the node already had.
//    
//   > 会被 _添加_ 到节点已有的类名上的 CSS 的类名，或者用空格分隔的 css 类名集合。
//
//   style:: ?string
//   A string of CSS to be _added_ to the node's existing `style` property.
//
//   > 会被 _添加_ 到节点已有的 `style` 属性上的 CSS 字符串。
//
//   nodeName:: ?string
//   When non-null, the target node is wrapped in a DOM element of
//   this type (and the other attributes are applied to this element).
//
//   > 如果该值为非 null，则目标节点将会用该类型的节点包裹住（同时其他的属性会被应用到该元素上）。
const none = [], noSpec = {}

// ::- A collection of [decorations](#view.Decoration), organized in
// such a way that the drawing algorithm can efficiently use and
// compare them. This is a persistent data structure—it is not
// modified, updates create a new value.
//
// > 一个 [decorations](#view.Decoration) 集合，用这种数据结构组织它们可以让绘制算法高效的对比和渲染它们。
// 它是一个不可突变的数据结构，它不改变，更新会产生新的值。
export class DecorationSet {
  constructor(local, children) {
    this.local = local && local.length ? local : none
    this.children = children && children.length ? children : none
  }

  // :: (Node, [Decoration]) → DecorationSet
  // Create a set of decorations, using the structure of the given
  // document.
  //
  // > 用指定文档的结构，创建一个 decorations 集合。
  static create(doc, decorations) {
    return decorations.length ? buildTree(decorations, doc, 0, noSpec) : empty
  }

  // :: (?number, ?number, ?(spec: Object) → bool) → [Decoration]
  // Find all decorations in this set which touch the given range
  // (including decorations that start or end directly at the
  // boundaries) and match the given predicate on their spec. When
  // `start` and `end` are omitted, all decorations in the set are
  // considered. When `predicate` isn't given, all decorations are
  // assumed to match.
  //
  // > 找到指定范围涉及到的所有的 decoration 集合（包括开始或结束位置在边界的 decorations），
  // 然后用指定的 predicate 函数来检测是否匹配，该函数参数是 decoration 的配置对象。
  // 若 `start` 和 `end` 省略，则集合中所有的 decoration 将会被检测。如果 `predicate` 没有给出，则所有的 decorations 将会 match。
  find(start, end, predicate) {
    let result = []
    this.findInner(start == null ? 0 : start, end == null ? 1e9 : end, result, 0, predicate)
    return result
  }

  findInner(start, end, result, offset, predicate) {
    for (let i = 0; i < this.local.length; i++) {
      let span = this.local[i]
      if (span.from <= end && span.to >= start && (!predicate || predicate(span.spec)))
        result.push(span.copy(span.from + offset, span.to + offset))
    }
    for (let i = 0; i < this.children.length; i += 3) {
      if (this.children[i] < end && this.children[i + 1] > start) {
        let childOff = this.children[i] + 1
        this.children[i + 2].findInner(start - childOff, end - childOff, result, offset + childOff, predicate)
      }
    }
  }

  // :: (Mapping, Node, ?Object) → DecorationSet
  // Map the set of decorations in response to a change in the
  // document.
  //
  // > Map decorations 的集合以响应文档修改。
  //
  //   options::- An optional set of options.
  //
  //   > 有如下参数可选：
  //
  //     onRemove:: ?(decorationSpec: Object)
  //     When given, this function will be called for each decoration
  //     that gets dropped as a result of the mapping, passing the
  //     spec of that decoration.
  //
  //     > 当设置该函数的时候，该函数会对在 mapping 过程中被移除的 decoration 调用该函数，传递 decoration 的配置对象。
  map(mapping, doc, options) {
    if (this == empty || mapping.maps.length == 0) return this
    return this.mapInner(mapping, doc, 0, 0, options || noSpec)
  }

  mapInner(mapping, node, offset, oldOffset, options) {
    let newLocal
    for (let i = 0; i < this.local.length; i++) {
      let mapped = this.local[i].map(mapping, offset, oldOffset)
      if (mapped && mapped.type.valid(node, mapped)) (newLocal || (newLocal = [])).push(mapped)
      else if (options.onRemove) options.onRemove(this.local[i].spec)
    }

    if (this.children.length)
      return mapChildren(this.children, newLocal, mapping, node, offset, oldOffset, options)
    else
      return newLocal ? new DecorationSet(newLocal.sort(byPos)) : empty
  }

  // :: (Node, [Decoration]) → DecorationSet
  // Add the given array of decorations to the ones in the set,
  // producing a new set. Needs access to the current document to
  // create the appropriate tree structure.
  //
  // > 在当前 decorations 集合中增加指定数组中的 decorations，以产生一个新的集合。
  // 需要传递当前文档 doc 以创建合适的树状结构。
  add(doc, decorations) {
    if (!decorations.length) return this
    if (this == empty) return DecorationSet.create(doc, decorations)
    return this.addInner(doc, decorations, 0)
  }

  addInner(doc, decorations, offset) {
    let children, childIndex = 0
    doc.forEach((childNode, childOffset) => {
      let baseOffset = childOffset + offset, found
      if (!(found = takeSpansForNode(decorations, childNode, baseOffset))) return

      if (!children) children = this.children.slice()
      while (childIndex < children.length && children[childIndex] < childOffset) childIndex += 3
      if (children[childIndex] == childOffset)
        children[childIndex + 2] = children[childIndex + 2].addInner(childNode, found, baseOffset + 1)
      else
        children.splice(childIndex, 0, childOffset, childOffset + childNode.nodeSize, buildTree(found, childNode, baseOffset + 1, noSpec))
      childIndex += 3
    })

    let local = moveSpans(childIndex ? withoutNulls(decorations) : decorations, -offset)
    return new DecorationSet(local.length ? this.local.concat(local).sort(byPos) : this.local,
                             children || this.children)
  }

  // :: ([Decoration]) → DecorationSet
  // Create a new set that contains the decorations in this set, minus
  // the ones in the given array.
  //
  // > 用当前的 decorations 集合减去指定数组中的 decorations，得到一个新的 decorations 集合。
  remove(decorations) {
    if (decorations.length == 0 || this == empty) return this
    return this.removeInner(decorations, 0)
  }

  removeInner(decorations, offset) {
    let children = this.children, local = this.local
    for (let i = 0; i < children.length; i += 3) {
      let found, from = children[i] + offset, to = children[i + 1] + offset
      for (let j = 0, span; j < decorations.length; j++) if (span = decorations[j]) {
        if (span.from > from && span.to < to) {
          decorations[j] = null
          ;(found || (found = [])).push(span)
        }
      }
      if (!found) continue
      if (children == this.children) children = this.children.slice()
      let removed = children[i + 2].removeInner(found, from + 1)
      if (removed != empty) {
        children[i + 2] = removed
      } else {
        children.splice(i, 3)
        i -= 3
      }
    }
    if (local.length) for (let i = 0, span; i < decorations.length; i++) if (span = decorations[i]) {
      for (let j = 0; j < local.length; j++) if (local[j].eq(span, offset)) {
        if (local == this.local) local = this.local.slice()
        local.splice(j--, 1)
      }
    }
    if (children == this.children && local == this.local) return this
    return local.length || children.length ? new DecorationSet(local, children) : empty
  }

  forChild(offset, node) {
    if (this == empty) return this
    if (node.isLeaf) return DecorationSet.empty

    let child, local
    for (let i = 0; i < this.children.length; i += 3) if (this.children[i] >= offset) {
      if (this.children[i] == offset) child = this.children[i + 2]
      break
    }
    let start = offset + 1, end = start + node.content.size
    for (let i = 0; i < this.local.length; i++) {
      let dec = this.local[i]
      if (dec.from < end && dec.to > start && (dec.type instanceof InlineType)) {
        let from = Math.max(start, dec.from) - start, to = Math.min(end, dec.to) - start
        if (from < to) (local || (local = [])).push(dec.copy(from, to))
      }
    }
    if (local) {
      let localSet = new DecorationSet(local.sort(byPos))
      return child ? new DecorationGroup([localSet, child]) : localSet
    }
    return child || empty
  }

  eq(other) {
    if (this == other) return true
    if (!(other instanceof DecorationSet) ||
        this.local.length != other.local.length ||
        this.children.length != other.children.length) return false
    for (let i = 0; i < this.local.length; i++)
      if (!this.local[i].eq(other.local[i])) return false
    for (let i = 0; i < this.children.length; i += 3)
      if (this.children[i] != other.children[i] ||
          this.children[i + 1] != other.children[i + 1] ||
          !this.children[i + 2].eq(other.children[i + 2])) return false
    return true
  }

  locals(node) {
    return removeOverlap(this.localsInner(node))
  }

  localsInner(node) {
    if (this == empty) return none
    if (node.inlineContent || !this.local.some(InlineType.is)) return this.local
    let result = []
    for (let i = 0; i < this.local.length; i++) {
      if (!(this.local[i].type instanceof InlineType))
        result.push(this.local[i])
    }
    return result
  }
}

const empty = new DecorationSet()

// :: DecorationSet
// The empty set of decorations.
//
// > decorations 的空集合。
DecorationSet.empty = empty

DecorationSet.removeOverlap = removeOverlap

// :- An abstraction that allows the code dealing with decorations to
// treat multiple DecorationSet objects as if it were a single object
// with (a subset of) the same interface.
class DecorationGroup {
  constructor(members) {
    this.members = members
  }

  forChild(offset, child) {
    if (child.isLeaf) return DecorationSet.empty
    let found = []
    for (let i = 0; i < this.members.length; i++) {
      let result = this.members[i].forChild(offset, child)
      if (result == empty) continue
      if (result instanceof DecorationGroup) found = found.concat(result.members)
      else found.push(result)
    }
    return DecorationGroup.from(found)
  }

  eq(other) {
    if (!(other instanceof DecorationGroup) ||
        other.members.length != this.members.length) return false
    for (let i = 0; i < this.members.length; i++)
      if (!this.members[i].eq(other.members[i])) return false
    return true
  }

  locals(node) {
    let result, sorted = true
    for (let i = 0; i < this.members.length; i++) {
      let locals = this.members[i].localsInner(node)
      if (!locals.length) continue
      if (!result) {
        result = locals
      } else {
        if (sorted) {
          result = result.slice()
          sorted = false
        }
        for (let j = 0; j < locals.length; j++) result.push(locals[j])
      }
    }
    return result ? removeOverlap(sorted ? result : result.sort(byPos)) : none
  }

  // : ([DecorationSet]) → union<DecorationSet, DecorationGroup>
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(members) {
    switch (members.length) {
      case 0: return empty
      case 1: return members[0]
      default: return new DecorationGroup(members)
    }
  }
}

function mapChildren(oldChildren, newLocal, mapping, node, offset, oldOffset, options) {
  let children = oldChildren.slice()

  // Mark the children that are directly touched by changes, and
  // move those that are after the changes.
  let shift = (oldStart, oldEnd, newStart, newEnd) => {
    for (let i = 0; i < children.length; i += 3) {
      let end = children[i + 1], dSize
      if (end == -1 || oldStart > end + oldOffset) continue
      if (oldEnd >= children[i] + oldOffset) {
        children[i + 1] = -1
      } else if (newStart >= offset && (dSize = (newEnd - newStart) - (oldEnd - oldStart))) {
        children[i] += dSize
        children[i + 1] += dSize
      }
    }
  }
  for (let i = 0; i < mapping.maps.length; i++) mapping.maps[i].forEach(shift)

  // Find the child nodes that still correspond to a single node,
  // recursively call mapInner on them and update their positions.
  let mustRebuild = false
  for (let i = 0; i < children.length; i += 3) if (children[i + 1] == -1) { // Touched nodes
    let from = mapping.map(children[i] + oldOffset), fromLocal = from - offset
    if (fromLocal < 0 || fromLocal >= node.content.size) {
      mustRebuild = true
      continue
    }
    // Must read oldChildren because children was tagged with -1
    let to = mapping.map(oldChildren[i + 1] + oldOffset, -1), toLocal = to - offset
    let {index, offset: childOffset} = node.content.findIndex(fromLocal)
    let childNode = node.maybeChild(index)
    if (childNode && childOffset == fromLocal && childOffset + childNode.nodeSize == toLocal) {
      let mapped = children[i + 2].mapInner(mapping, childNode, from + 1, children[i] + oldOffset + 1, options)
      if (mapped != empty) {
        children[i] = fromLocal
        children[i + 1] = toLocal
        children[i + 2] = mapped
      } else {
        children[i + 1] = -2
        mustRebuild = true
      }
    } else {
      mustRebuild = true
    }
  }

  // Remaining children must be collected and rebuilt into the appropriate structure
  if (mustRebuild) {
    let decorations = mapAndGatherRemainingDecorations(children, oldChildren, newLocal || [], mapping,
                                                       offset, oldOffset, options)
    let built = buildTree(decorations, node, 0, options)
    newLocal = built.local
    for (let i = 0; i < children.length; i += 3) if (children[i + 1] < 0) {
      children.splice(i, 3)
      i -= 3
    }
    for (let i = 0, j = 0; i < built.children.length; i += 3) {
      let from = built.children[i]
      while (j < children.length && children[j] < from) j += 3
      children.splice(j, 0, built.children[i], built.children[i + 1], built.children[i + 2])
    }
  }

  return new DecorationSet(newLocal && newLocal.sort(byPos), children)
}

function moveSpans(spans, offset) {
  if (!offset || !spans.length) return spans
  let result = []
  for (let i = 0; i < spans.length; i++) {
    let span = spans[i]
    result.push(new Decoration(span.from + offset, span.to + offset, span.type))
  }
  return result
}

function mapAndGatherRemainingDecorations(children, oldChildren, decorations, mapping, offset, oldOffset, options) {
  // Gather all decorations from the remaining marked children
  function gather(set, oldOffset) {
    for (let i = 0; i < set.local.length; i++) {
      let mapped = set.local[i].map(mapping, offset, oldOffset)
      if (mapped) decorations.push(mapped)
      else if (options.onRemove) options.onRemove(set.local[i].spec)
    }
    for (let i = 0; i < set.children.length; i += 3)
      gather(set.children[i + 2], set.children[i] + oldOffset + 1)
  }
  for (let i = 0; i < children.length; i += 3) if (children[i + 1] == -1)
    gather(children[i + 2], oldChildren[i] + oldOffset + 1)

  return decorations
}

function takeSpansForNode(spans, node, offset) {
  if (node.isLeaf) return null
  let end = offset + node.nodeSize, found = null
  for (let i = 0, span; i < spans.length; i++) {
    if ((span = spans[i]) && span.from > offset && span.to < end) {
      ;(found || (found = [])).push(span)
      spans[i] = null
    }
  }
  return found
}

function withoutNulls(array) {
  let result = []
  for (let i = 0; i < array.length; i++)
    if (array[i] != null) result.push(array[i])
  return result
}

// : ([Decoration], Node, number) → DecorationSet
// Build up a tree that corresponds to a set of decorations. `offset`
// is a base offset that should be subtractet from the `from` and `to`
// positions in the spans (so that we don't have to allocate new spans
// for recursive calls).
function buildTree(spans, node, offset, options) {
  let children = [], hasNulls = false
  node.forEach((childNode, localStart) => {
    let found = takeSpansForNode(spans, childNode, localStart + offset)
    if (found) {
      hasNulls = true
      let subtree = buildTree(found, childNode, offset + localStart + 1, options)
      if (subtree != empty)
        children.push(localStart, localStart + childNode.nodeSize, subtree)
    }
  })
  let locals = moveSpans(hasNulls ? withoutNulls(spans) : spans, -offset).sort(byPos)
  for (let i = 0; i < locals.length; i++) if (!locals[i].type.valid(node, locals[i])) {
    if (options.onRemove) options.onRemove(locals[i].spec)
    locals.splice(i--, 1)
  }
  return locals.length || children.length ? new DecorationSet(locals, children) : empty
}

// : (Decoration, Decoration) → number
// Used to sort decorations so that ones with a low start position
// come first, and within a set with the same start position, those
// with an smaller end position come first.
function byPos(a, b) {
  return a.from - b.from || a.to - b.to
}

// : ([Decoration]) → [Decoration]
// Scan a sorted array of decorations for partially overlapping spans,
// and split those so that only fully overlapping spans are left (to
// make subsequent rendering easier). Will return the input array if
// no partially overlapping spans are found (the common case).
function removeOverlap(spans) {
  let working = spans
  for (let i = 0; i < working.length - 1; i++) {
    let span = working[i]
    if (span.from != span.to) for (let j = i + 1; j < working.length; j++) {
      let next = working[j]
      if (next.from == span.from) {
        if (next.to != span.to) {
          if (working == spans) working = spans.slice()
          // Followed by a partially overlapping larger span. Split that
          // span.
          working[j] = next.copy(next.from, span.to)
          insertAhead(working, j + 1, next.copy(span.to, next.to))
        }
        continue
      } else {
        if (next.from < span.to) {
          if (working == spans) working = spans.slice()
          // The end of this one overlaps with a subsequent span. Split
          // this one.
          working[i] = span.copy(span.from, next.from)
          insertAhead(working, j, span.copy(next.from, span.to))
        }
        break
      }
    }
  }
  return working
}

function insertAhead(array, i, deco) {
  while (i < array.length && byPos(deco, array[i]) > 0) i++
  array.splice(i, 0, deco)
}

// : (EditorView) → union<DecorationSet, DecorationGroup>
// Get the decorations associated with the current props of a view.
export function viewDecorations(view) {
  let found = []
  view.someProp("decorations", f => {
    let result = f(view.state)
    if (result && result != empty) found.push(result)
  })
  if (view.cursorWrapper)
    found.push(DecorationSet.create(view.state.doc, [view.cursorWrapper.deco]))
  return DecorationGroup.from(found)
}
