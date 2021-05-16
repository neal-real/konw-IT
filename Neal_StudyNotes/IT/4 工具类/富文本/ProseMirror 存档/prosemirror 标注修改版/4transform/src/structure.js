import {Slice, Fragment} from "prosemirror-model"

import {Transform} from "./transform"
import {ReplaceStep, ReplaceAroundStep} from "./replace_step"

function canCut(node, start, end) {
  return (start == 0 || node.canReplace(start, node.childCount)) &&
    (end == node.childCount || node.canReplace(0, end))
}

// :: (NodeRange) → ?number
// Try to find a target depth to which the content in the given range
// can be lifted. Will not go across
// [isolating](#model.NodeSpec.isolating) parent nodes.
//
// > 尝试寻找一个目标深度以让指定的 range 内的内容可以被提升（深度）。不会考虑有属性 [isolating](#model.NodeSpec.isolating)
// 存在的父级节点。
export function liftTarget(range) {
  let parent = range.parent
  let content = parent.content.cutByIndex(range.startIndex, range.endIndex)
  for (let depth = range.depth;; --depth) {
    let node = range.$from.node(depth)
    let index = range.$from.index(depth), endIndex = range.$to.indexAfter(depth)
    if (depth < range.depth && node.canReplace(index, endIndex, content))
      return depth
    if (depth == 0 || node.type.spec.isolating || !canCut(node, index, endIndex)) break
  }
}

// :: (NodeRange, number) → this
// Split the content in the given range off from its parent, if there
// is sibling content before or after it, and move it up the tree to
// the depth specified by `target`. You'll probably want to use
// [`liftTarget`](#transform.liftTarget) to compute `target`, to make
// sure the lift is valid.
//
// > 如果 range 内容前后有同级内容，则会将指定 range 从其父级节点中分割，然后将其沿树移动到由 `target`
// 指定的深度。你可能想要使用 [`liftTarget`](#transform.liftTarget) 来计算 `target`，以保证这个沿着树的提升是有效的。
Transform.prototype.lift = function(range, target) {
  let {$from, $to, depth} = range

  let gapStart = $from.before(depth + 1), gapEnd = $to.after(depth + 1)
  let start = gapStart, end = gapEnd

  let before = Fragment.empty, openStart = 0
  for (let d = depth, splitting = false; d > target; d--)
    if (splitting || $from.index(d) > 0) {
      splitting = true
      before = Fragment.from($from.node(d).copy(before))
      openStart++
    } else {
      start--
    }
  let after = Fragment.empty, openEnd = 0
  for (let d = depth, splitting = false; d > target; d--)
    if (splitting || $to.after(d + 1) < $to.end(d)) {
      splitting = true
      after = Fragment.from($to.node(d).copy(after))
      openEnd++
    } else {
      end++
    }

  return this.step(new ReplaceAroundStep(start, end, gapStart, gapEnd,
                                         new Slice(before.append(after), openStart, openEnd),
                                         before.size - openStart, true))
}

// :: (NodeRange, NodeType, ?Object, ?NodeRange) → ?[{type: NodeType, attrs: ?Object}]
// Try to find a valid way to wrap the content in the given range in a
// node of the given type. May introduce extra nodes around and inside
// the wrapper node, if necessary. Returns null if no valid wrapping
// could be found. When `innerRange` is given, that range's content is
// used as the content to fit into the wrapping, instead of the
// content of `range`.
//
// > 尝试找到一个有效的方式来用指定的节点类型包裹指定 range 的内容。如果必要的话，可能会在包裹节点的内部和周围生成额外的节点。
// 如果没有可用的包裹方式则返回 null。当 `innerRange` 指定的时候，该 range 的内容将会被作为被包裹的内容，而不是 `range` 的内容。
//
// . 注 需要研究一下 range 和 innerRange 的区别，若 range 包含多个同级节点和 range 只含有一个节点是否有区别？
export function findWrapping(range, nodeType, attrs, innerRange = range) {
  let around = findWrappingOutside(range, nodeType)
  let inner = around && findWrappingInside(innerRange, nodeType)
  if (!inner) return null
  return around.map(withAttrs).concat({type: nodeType, attrs}).concat(inner.map(withAttrs))
}

function withAttrs(type) { return {type, attrs: null} }

function findWrappingOutside(range, type) {
  let {parent, startIndex, endIndex} = range
  let around = parent.contentMatchAt(startIndex).findWrapping(type)
  if (!around) return null
  let outer = around.length ? around[0] : type
  return parent.canReplaceWith(startIndex, endIndex, outer) ? around : null
}

function findWrappingInside(range, type) {
  let {parent, startIndex, endIndex} = range
  let inner = parent.child(startIndex)
  let inside = type.contentMatch.findWrapping(inner.type)
  if (!inside) return null
  let lastType = inside.length ? inside[inside.length - 1] : type
  let innerMatch = lastType.contentMatch
  for (let i = startIndex; innerMatch && i < endIndex; i++)
    innerMatch = innerMatch.matchType(parent.child(i).type)
  if (!innerMatch || !innerMatch.validEnd) return null
  return inside
}

// :: (NodeRange, [{type: NodeType, attrs: ?Object}]) → this
// Wrap the given [range](#model.NodeRange) in the given set of wrappers.
// The wrappers are assumed to be valid in this position, and should
// probably be computed with [`findWrapping`](#transform.findWrapping).
//
// > 用规定的包裹节点集合来包裹指定的 [range](#model.NodeRange)。包裹节点们会被假定是适合当前位置的，其应该被 [`findWrapping`](#transform.findWrapping)
// 方法合适的计算出来。
Transform.prototype.wrap = function(range, wrappers) {
  let content = Fragment.empty
  for (let i = wrappers.length - 1; i >= 0; i--)
    content = Fragment.from(wrappers[i].type.create(wrappers[i].attrs, content))

  let start = range.start, end = range.end
  return this.step(new ReplaceAroundStep(start, end, start, end, new Slice(content, 0, 0), wrappers.length, true))
}

// :: (number, ?number, NodeType, ?Object) → this
// Set the type of all textblocks (partly) between `from` and `to` to
// the given node type with the given attributes.
//
// > 将介于 `from` 和 `to` 之间的所有的文本块（部分地）设置成带有指定 attributes 的指定的节点类型。
//
// . 注 为什么是「部分的」是因为有些文本块或许不能被改变类型。
Transform.prototype.setBlockType = function(from, to = from, type, attrs) {
  if (!type.isTextblock) throw new RangeError("Type given to setBlockType should be a textblock")
  let mapFrom = this.steps.length
  this.doc.nodesBetween(from, to, (node, pos) => {
    if (node.isTextblock && !node.hasMarkup(type, attrs) && canChangeType(this.doc, this.mapping.slice(mapFrom).map(pos), type)) {
      // Ensure all markup that isn't allowed in the new node type is cleared
      this.clearIncompatible(this.mapping.slice(mapFrom).map(pos, 1), type)
      let mapping = this.mapping.slice(mapFrom)
      let startM = mapping.map(pos, 1), endM = mapping.map(pos + node.nodeSize, 1)
      this.step(new ReplaceAroundStep(startM, endM, startM + 1, endM - 1,
                                      new Slice(Fragment.from(type.create(attrs, null, node.marks)), 0, 0), 1, true))
      return false
    }
  })
  return this
}

function canChangeType(doc, pos, type) {
  let $pos = doc.resolve(pos), index = $pos.index()
  return $pos.parent.canReplaceWith(index, index + 1, type)
}

// :: (number, ?NodeType, ?Object, ?[Mark]) → this
// Change the type, attributes, and/or marks of the node at `pos`.
// When `type` isn't given, the existing node type is preserved,
//
// > 在指定的 `pos` 处改变节点的类型、attributes、或者/和 marks。如果 `type` 没有给，则保留当前节点的类型。
Transform.prototype.setNodeMarkup = function(pos, type, attrs, marks) {
  let node = this.doc.nodeAt(pos)
  if (!node) throw new RangeError("No node at given position")
  if (!type) type = node.type
  let newNode = type.create(attrs, null, marks || node.marks)
  if (node.isLeaf)
    return this.replaceWith(pos, pos + node.nodeSize, newNode)

  if (!type.validContent(node.content))
    throw new RangeError("Invalid content for node type " + type.name)

  return this.step(new ReplaceAroundStep(pos, pos + node.nodeSize, pos + 1, pos + node.nodeSize - 1,
                                         new Slice(Fragment.from(newNode), 0, 0), 1, true))
}

// :: (Node, number, number, ?[?{type: NodeType, attrs: ?Object}]) → bool
// Check whether splitting at the given position is allowed.
//
// > 检查指定的位置是否允许分割。
export function canSplit(doc, pos, depth = 1, typesAfter) {
  let $pos = doc.resolve(pos), base = $pos.depth - depth
  let innerType = (typesAfter && typesAfter[typesAfter.length - 1]) || $pos.parent
  if (base < 0 || $pos.parent.type.spec.isolating ||
      !$pos.parent.canReplace($pos.index(), $pos.parent.childCount) ||
      !innerType.type.validContent($pos.parent.content.cutByIndex($pos.index(), $pos.parent.childCount)))
    return false
  for (let d = $pos.depth - 1, i = depth - 2; d > base; d--, i--) {
    let node = $pos.node(d), index = $pos.index(d)
    if (node.type.spec.isolating) return false
    let rest = node.content.cutByIndex(index, node.childCount)
    let after = (typesAfter && typesAfter[i]) || node
    if (after != node) rest = rest.replaceChild(0, after.type.create(after.attrs))
    if (!node.canReplace(index + 1, node.childCount) || !after.type.validContent(rest))
      return false
  }
  let index = $pos.indexAfter(base)
  let baseType = typesAfter && typesAfter[0]
  return $pos.node(base).canReplaceWith(index, index, baseType ? baseType.type : $pos.node(base + 1).type)
}

// :: (number, ?number, ?[?{type: NodeType, attrs: ?Object}]) → this
// Split the node at the given position, and optionally, if `depth` is
// greater than one, any number of nodes above that. By default, the
// parts split off will inherit the node type of the original node.
// This can be changed by passing an array of types and attributes to
// use after the split.
//
// > 分割指定位置的节点，如果传入了 `depth` 参数，且其大于 1，则任何数量的节点在它之上（？？？）。
// 默认情况下，被分割部分的节点类型将会继承原始的节点类型，但是也可以通过传入一个类型数组和 attributes 来在分割后设置其上。
//
// . 注 这句英文原文也不通顺。
Transform.prototype.split = function(pos, depth = 1, typesAfter) {
  let $pos = this.doc.resolve(pos), before = Fragment.empty, after = Fragment.empty
  for (let d = $pos.depth, e = $pos.depth - depth, i = depth - 1; d > e; d--, i--) {
    before = Fragment.from($pos.node(d).copy(before))
    let typeAfter = typesAfter && typesAfter[i]
    after = Fragment.from(typeAfter ? typeAfter.type.create(typeAfter.attrs, after) : $pos.node(d).copy(after))
  }
  return this.step(new ReplaceStep(pos, pos, new Slice(before.append(after), depth, depth), true))
}

// :: (Node, number) → bool
// Test whether the blocks before and after a given position can be
// joined.
//
// > 测试在指定位置之前或者之后的块级节点是否可以被连接起来。
export function canJoin(doc, pos) {
  let $pos = doc.resolve(pos), index = $pos.index()
  return joinable($pos.nodeBefore, $pos.nodeAfter) &&
    $pos.parent.canReplace(index, index + 1)
}

function joinable(a, b) {
  return a && b && !a.isLeaf && a.canAppend(b)
}

// :: (Node, number, ?number) → ?number
// Find an ancestor of the given position that can be joined to the
// block before (or after if `dir` is positive). Returns the joinable
// point, if any.
//
// > 寻找一个指定位置的祖先节点，该节点可以被连接到块级节点之前（或者之后，如果 `dir` 是正的话）。
// 如果找到，返回这个可加入的位置。
export function joinPoint(doc, pos, dir = -1) {
  let $pos = doc.resolve(pos)
  for (let d = $pos.depth;; d--) {
    let before, after, index = $pos.index(d)
    if (d == $pos.depth) {
      before = $pos.nodeBefore
      after = $pos.nodeAfter
    } else if (dir > 0) {
      before = $pos.node(d + 1)
      index++
      after = $pos.node(d).maybeChild(index)
    } else {
      before = $pos.node(d).maybeChild(index - 1)
      after = $pos.node(d + 1)
    }
    if (before && !before.isTextblock && joinable(before, after) &&
        $pos.node(d).canReplace(index, index + 1)) return pos
    if (d == 0) break
    pos = dir < 0 ? $pos.before(d) : $pos.after(d)
  }
}

// :: (number, ?number) → this
// Join the blocks around the given position. If depth is 2, their
// last and first siblings are also joined, and so on.
//
// > 将指定位置周围的块级元素连接起来。如果深度是 2，它们最后和第一个同级节点也会被连接，以此类推。
Transform.prototype.join = function(pos, depth = 1) {
  let step = new ReplaceStep(pos - depth, pos + depth, Slice.empty, true)
  return this.step(step)
}

// :: (Node, number, NodeType) → ?number
// Try to find a point where a node of the given type can be inserted
// near `pos`, by searching up the node hierarchy when `pos` itself
// isn't a valid place but is at the start or end of a node. Return
// null if no position was found.
//
// > 当 `pos` 本身不是有效的位置但位于节点的起始或结尾处时，通过搜索节点的层级结构，尝试找到一个可以在指定位置的节点附近插入指定节点类型的点。
// 如果找不到位置，则返回 null。
export function insertPoint(doc, pos, nodeType) {
  let $pos = doc.resolve(pos)
  if ($pos.parent.canReplaceWith($pos.index(), $pos.index(), nodeType)) return pos

  if ($pos.parentOffset == 0)
    for (let d = $pos.depth - 1; d >= 0; d--) {
      let index = $pos.index(d)
      if ($pos.node(d).canReplaceWith(index, index, nodeType)) return $pos.before(d + 1)
      if (index > 0) return null
    }
  if ($pos.parentOffset == $pos.parent.content.size)
    for (let d = $pos.depth - 1; d >= 0; d--) {
      let index = $pos.indexAfter(d)
      if ($pos.node(d).canReplaceWith(index, index, nodeType)) return $pos.after(d + 1)
      if (index < $pos.node(d).childCount) return null
    }
}

// :: (Node, number, Slice) → ?number
// Finds a position at or around the given position where the given
// slice can be inserted. Will look at parent nodes' nearest boundary
// and try there, even if the original position wasn't directly at the
// start or end of that node. Returns null when no position was found.
//
// > 寻找一个位置在指定的位置或者附近，以让指定的 slice能够插入。即使原始的位置并不直接在父级节点的起始或者结束位置，
// 也会尝试查看父级节点最近的边界然后尝试插入。如果找不到位置，则返回 null。
export function dropPoint(doc, pos, slice) {
  let $pos = doc.resolve(pos)
  if (!slice.content.size) return pos
  let content = slice.content
  for (let i = 0; i < slice.openStart; i++) content = content.firstChild.content
  for (let pass = 1; pass <= (slice.openStart == 0 && slice.size ? 2 : 1); pass++) {
    for (let d = $pos.depth; d >= 0; d--) {
      let bias = d == $pos.depth ? 0 : $pos.pos <= ($pos.start(d + 1) + $pos.end(d + 1)) / 2 ? -1 : 1
      let insertPos = $pos.index(d) + (bias > 0 ? 1 : 0)
      if (pass == 1
          ? $pos.node(d).canReplace(insertPos, insertPos, content)
          : $pos.node(d).contentMatchAt(insertPos).findWrapping(content.firstChild.type))
        return bias == 0 ? $pos.pos : bias < 0 ? $pos.before(d + 1) : $pos.after(d + 1)
    }
  }
  return null
}
