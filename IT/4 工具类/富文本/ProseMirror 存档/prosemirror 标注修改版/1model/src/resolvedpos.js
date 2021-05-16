import {Mark} from "./mark"

/**
* > 你可以 model.Node.resolve 对象位置以得到该位置的更多信息。
* > 它提供一些上下文信息，以及一些有用的工具函数。
* > 通过这个接口，对于那些接受可选参数 `depth` 的方法来说，
* > 如果没有传入该参数则默认会是 `this.depth`
* > 如果是负数则会是 `this.depth + value`。
*/ 
export class ResolvedPos {
  constructor(pos, path, parentOffset) {
    // > 被 resolve 的位置。
    this.pos = pos
    this.path = path

    // > 从根节点开始算，它的父节点的深度。如果位置直接指向根节点，则是 0。如果它指向一个顶级节点如段落，则是 1，以此类推。
    this.depth = path.length / 3 - 1
    
    // > 该位置相对于父节点的偏移量。
    this.parentOffset = parentOffset
  }

  resolveDepth(val) {
    if (val == null) return this.depth
    if (val < 0) return this.depth + val
    return val
  }

  /**
  * > 该位置指向的父级节点
  * > 假如位置指向的是文本节点，那该节点也不是父级
  * > 因为文本节点在 PM「扁平」的，它没有内容。
  */ 
  get parent() { return this.node(this.depth) }

  // > 解析位置的根节点。
  get doc() { return this.node(0) }

  // > 在指定深度的祖先节点。p.node(p.depth)` 与 `p.parent` 相同。
  node(depth) { return this.path[this.resolveDepth(depth) * 3] }

  /**
   * > 在指定深度获得祖先节点的索引
   * > 例如，如果该位置指向顶级节点的第二个段落的第三个节点，那么 `p.index(0)` 是 1，`p.index(1)` 是 2。
  */ 
  index(depth) { return this.path[this.resolveDepth(depth) * 3 + 1] }

  // > 在指定深度获得祖先节点之后的索引
  indexAfter(depth) {
    depth = this.resolveDepth(depth)
    return this.index(depth) + (depth == this.depth && !this.textOffset ? 0 : 1)
  }

  // > 指定深度的祖先节点的开始位置（绝对位置）。
  // . 注 绝对位置是相对于 doc 根节点的位置，一般都是用它来定位。
  start(depth) {
    depth = this.resolveDepth(depth)
    return depth == 0 ? 0 : this.path[depth * 3 - 1] + 1
  }

  // > 指定深度的祖先节点的结束位置（绝对位置）。
  end(depth) {
    depth = this.resolveDepth(depth)
    return this.start(depth) + this.node(depth).content.size
  }

  // > 在指定深度的祖先节点之前的（绝对）位置，或者，如果 `depth` 是 `this.depth + 1` 的话，则是原始的位置。
  before(depth) {
    depth = this.resolveDepth(depth)
    if (!depth) throw new RangeError("There is no position before the top-level node")
    return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1]
  }

  // > 在指定深度的祖先节点之后的（绝对）位置，或者如果 `depth` 是 `this.depth + 1` 的话则是原始的位置。
  // . 注 「before 之前」、「start 开始」、「after 之后」、「end 结束」位置的区别：有以下结构 `<p>123</p>`，则（I表示「这个」位置） `I<p>123</p>` 表示 `before`；
  // `<p>I123</p>` 表示 `start`；`<p>123I</p>` 表示 `end`；`<p>123</p>I` 表示 `after`。
  after(depth) {
    depth = this.resolveDepth(depth)
    if (!depth) throw new RangeError("There is no position after the top-level node")
    return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1] + this.path[depth * 3].nodeSize
  }

  // > 当位置指向一个文本节点，该函数返回当前位置到文本节点开始位置的距离。如果指向节点之间则是 0。
  get textOffset() { return this.pos - this.path[this.path.length - 1] }

  // > 获取紧挨着该位置后的节点，如果有的话。如果位置指向一个文本节点，则只有在文本节点中该位置之后的内容会被返回。
  get nodeAfter() {
    let parent = this.parent, index = this.index(this.depth)
    if (index == parent.childCount) return null
    let dOff = this.pos - this.path[this.path.length - 1], child = parent.child(index)
    return dOff ? parent.child(index).cut(dOff) : child
  }

  // > 获取紧挨着该位置前的节点，如果有的话。如果位置指向一个文本节点，则只有在文本节点中该位置之前的内容会被返回。
  get nodeBefore() {
    let index = this.index(this.depth)
    let dOff = this.pos - this.path[this.path.length - 1]
    if (dOff) return this.parent.child(index).cut(0, dOff)
    return index == 0 ? null : this.parent.child(index - 1)
  }

  // > 获取在指定深度的祖先节点的指定 index 的位置（深度默认是 `this.depth`)。
  posAtIndex(index, depth) {
    depth = this.resolveDepth(depth)
    let node = this.path[depth * 3], pos = depth == 0 ? 0 : this.path[depth * 3 - 1] + 1
    for (let i = 0; i < index; i++) pos += node.child(i).nodeSize
    return pos
  }

  // > 充分考虑 marks 们的 [`inclusive`](#model.MarkSpec.inclusive) 属性后，获取当前位置的最终的 marks。如果该位置是在一个非空节点的起始位置，则会返回该位置之后节点的 marks（如果有的话）。
  // . 注 如果位置在一个空元素内，则返回空的数组（即 Mark 的静态属性，Mark.none)。如果是在一个文本节点中，则简单返回文本节点的 marks。
  // 如果在一个非空节点的起始位置（before 为空），则考虑该位置之后节点的 marks。最后（此时只剩一种情况，也即在一个非文本节点的末尾位置）考虑排除那些设置了 `inclusive` 属性为 false 的 marks 们。
  marks() {
    let parent = this.parent, index = this.index()

    // 在空父级中，返回空数组
    if (parent.content.size == 0) return Mark.none

    // 在文本节点内时，只需返回文本节点的标记
    if (this.textOffset) return parent.child(index).marks

    let main = parent.maybeChild(index - 1), other = parent.maybeChild(index)
    // 如果'after'标志为true表示之前没有节点，则将此位置之后的节点作为主引用。
    if (!main) { let tmp = main; main = other; other = tmp }

    // 使用主节点中的所有标记，除了那些将“inclusive”设置为false并且在另一个节点中不存在的标记。
    let marks = main.marks
    for (var i = 0; i < marks.length; i++)
      if (marks[i].type.spec.inclusive === false && (!other || !marks[i].isInSet(other.marks)))
        marks = marks[i--].removeFromSet(marks)

    return marks
  }

  // > 获取在当前位置之后的 marks，如果有的话，会排除那些 inclusive 为 false 以及没有出现在 `$end` 位置的 marks 们。
  // 这个方法最有用的场景是在执行删除操作后获取需要保留的 marks 集合。如果该位置在它的父级节点的结束的地方或者它的父级节点不是一个文本 block，则会返回 null（此时不应该有任何 marks 被保留）。
  marksAcross($end) {
    let after = this.parent.maybeChild(this.index())
    if (!after || !after.isInline) return null

    let marks = after.marks, next = $end.parent.maybeChild($end.index())
    for (var i = 0; i < marks.length; i++)
      if (marks[i].type.spec.inclusive === false && (!next || !marks[i].isInSet(next.marks)))
        marks = marks[i--].removeFromSet(marks)
    return marks
  }

  // > 返回在指定位置和当前位置拥有的相同父级节点所在的最大深度。
  sharedDepth(pos) {
    for (let depth = this.depth; depth > 0; depth--)
      if (this.start(depth) <= pos && this.end(depth) >= pos) return depth
    return 0
  }

  // > 根据当前位置与指定位置围绕块级节点的周围看返回相应的 Range。例如，如果两个位置都指向一个文本 block，则文本 block 的 range 会被返回；
  // 如果它们指向不同的块级节点，则包含这些块级节点的深度最大的共同祖先节点 range 将会被返回。你可以传递一个指示函数，来决定该祖先节点是否可接受。
  blockRange(other = this, pred) {
    if (other.pos < this.pos) return other.blockRange(this)
    for (let d = this.depth - (this.parent.inlineContent || this.pos == other.pos ? 1 : 0); d >= 0; d--)
      if (other.pos <= this.end(d) && (!pred || pred(this.node(d))))
        return new NodeRange(this, other, d)
  }

  // :: (ResolvedPos) → bool
  // Query whether the given position shares the same parent node.
  //
  // > 当前位置和指定位置是否具有相同的父级节点。
  sameParent(other) {
    return this.pos - this.parentOffset == other.pos - other.parentOffset
  }

  // > 返回当前位置和指定位置较大的那个。
  max(other) {
    return other.pos > this.pos ? other : this
  }

  // > 返回当前位置和指定位置较小的那个。
  min(other) {
    return other.pos < this.pos ? other : this
  }

  toString() {
    let str = ""
    for (let i = 1; i <= this.depth; i++)
      str += (str ? "/" : "") + this.node(i).type.name + "_" + this.index(i - 1)
    return str + ":" + this.parentOffset
  }

  static resolve(doc, pos) {
    if (!(pos >= 0 && pos <= doc.content.size)) throw new RangeError("Position " + pos + " out of range")
    let path = []
    let start = 0, parentOffset = pos
    for (let node = doc;;) {
      let {index, offset} = node.content.findIndex(parentOffset)
      let rem = parentOffset - offset
      path.push(node, index, start + offset)
      if (!rem) break
      node = node.child(index)
      if (node.isText) break
      parentOffset = rem - 1
      start += offset + 1
    }
    return new ResolvedPos(pos, path, parentOffset)
  }

  static resolveCached(doc, pos) {
    for (let i = 0; i < resolveCache.length; i++) {
      let cached = resolveCache[i]
      if (cached.pos == pos && cached.doc == doc) return cached
    }
    let result = resolveCache[resolveCachePos] = ResolvedPos.resolve(doc, pos)
    resolveCachePos = (resolveCachePos + 1) % resolveCacheSize
    return result
  }
}

let resolveCache = [], resolveCachePos = 0, resolveCacheSize = 12

// > 表示一个内容的扁平范围（range），例如，一个开始和结束在相同节点的范围。
export class NodeRange {

  // > 构造一个节点 range。至少深度在 `depth` 及更小的时候 `$from` 和 `$to` 应该始终指向相同的节点，因为一个节点 range 表示具有相同父级节点的相邻节点的集合。
  constructor($from, $to, depth) {

    // > range 的内容开始处 resolve 过的位置。它可能有一个大于该 range 的 `depth` 属性的深度，因为这些位置是用来计算 range 的，其不会直接在 range 的边界再次 resolve。
    this.$from = $from
 
    // > range 的内容结束处 resolve 过的位置。看一下关于 [`$from`](#model.NodeRange.$from) 的警告。
    // . 注 举个例子：有以下结构 `<ul><li><p>abc</p></li><li><p>123</p><p>456</p></li></ul>` 则构造一个 NodeRange 的时候，如果 $from 在 1 后面位置，
    // $to 在 4 后面位置，则 depth 必须是在第二个 li 的开始位置的深度或者更小，因为如果再深的话，$from 和 $to 就没有共同的父级节点，就无法构建一个 NodeRange。
    // 也因此，$from 和 $to 的 depth 属性是有可能大于 NodeRange 的 depth 属性的。
    this.$to = $to
    // > 该 range 指向的节点的深度。
    this.depth = depth
  }
  // > 该 range 开始的位置。
  get start() { return this.$from.before(this.depth + 1) }

  // > 该 range 结束的位置。
  get end() { return this.$to.after(this.depth + 1) }

  // > 该 range 所在的父级节点。
  get parent() { return this.$from.node(this.depth) }

  // > 该 range 在父级节点中的开始处的 index。
  get startIndex() { return this.$from.index(this.depth) }

  // > 该 range 在父级节点中结束处的 index。
  get endIndex() { return this.$to.indexAfter(this.depth) }
}
