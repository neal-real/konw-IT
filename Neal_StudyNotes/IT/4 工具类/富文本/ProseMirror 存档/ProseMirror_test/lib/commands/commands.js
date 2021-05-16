import {joinPoint, canJoin, findWrapping, liftTarget, canSplit, ReplaceAroundStep} from "prosemirror-transform"
import {Slice, Fragment} from "prosemirror-model"
import {Selection, TextSelection, NodeSelection, AllSelection} from "prosemirror-state"

// :: (EditorState, ?(tr: Transaction)) → bool
// Delete the selection, if there is one.
//
// > 删除选区，如果存在的话。
export function deleteSelection(state, dispatch) {
  if (state.selection.empty) return false
  if (dispatch) dispatch(state.tr.deleteSelection().scrollIntoView())
  return true
}

// :: (EditorState, ?(tr: Transaction), ?EditorView) → bool
// If the selection is empty and at the start of a textblock, try to
// reduce the distance between that block and the one before it—if
// there's a block directly before it that can be joined, join them.
// If not, try to move the selected block closer to the next one in
// the document structure by lifting it out of its parent or moving it
// into a parent of the previous block. Will use the view for accurate
// (bidi-aware) start-of-textblock detection if given.
//
// > 如果选区是空（光标）而且在一个文本块的起始位置，则试着减少光标所在的块级节点和该块级节点之前的节点之间的距离。如果存在一个块级节点直接位于
// 光标所在的块级节点之前而且能够被连接的话，则连接他们。如果不存在，则尝试通过将光标所在的块级节点从其父级节点中提升一级或者将其移动到父级节点之前的
// 块级节点中的方式来尝试将选择的块级节点（即光标所在的块级及诶单）移动的更接近文档中的下一个节点。如果指定 view 参数，则将会使用之以获取准确的（用来处理 bidi 的）文本块起始方向。
export function joinBackward(state, dispatch, view) {
  let {$cursor} = state.selection
  if (!$cursor || (view ? !view.endOfTextblock("backward", state)
                        : $cursor.parentOffset > 0))
    return false

  let $cut = findCutBefore($cursor)

  // If there is no node before this, try to lift
  if (!$cut) {
    let range = $cursor.blockRange(), target = range && liftTarget(range)
    if (target == null) return false
    if (dispatch) dispatch(state.tr.lift(range, target).scrollIntoView())
    return true
  }

  let before = $cut.nodeBefore
  // Apply the joining algorithm
  if (!before.type.spec.isolating && deleteBarrier(state, $cut, dispatch))
    return true

  // If the node below has no content and the node above is
  // selectable, delete the node below and select the one above.
  if ($cursor.parent.content.size == 0 &&
      (textblockAt(before, "end") || NodeSelection.isSelectable(before))) {
    if (dispatch) {
      let tr = state.tr.deleteRange($cursor.before(), $cursor.after())
      tr.setSelection(textblockAt(before, "end") ? Selection.findFrom(tr.doc.resolve(tr.mapping.map($cut.pos, -1)), -1)
                      : NodeSelection.create(tr.doc, $cut.pos - before.nodeSize))
      dispatch(tr.scrollIntoView())
    }
    return true
  }

  // If the node before is an atom, delete it
  if (before.isAtom && $cut.depth == $cursor.depth - 1) {
    if (dispatch) dispatch(state.tr.delete($cut.pos - before.nodeSize, $cut.pos).scrollIntoView())
    return true
  }

  return false
}

function textblockAt(node, side) {
  for (; node; node = (side == "start" ? node.firstChild : node.lastChild))
    if (node.isTextblock) return true
  return false
}

// :: (EditorState, ?(tr: Transaction), ?EditorView) → bool
// When the selection is empty and at the start of a textblock, select
// the node before that textblock, if possible. This is intended to be
// bound to keys like backspace, after
// [`joinBackward`](#commands.joinBackward) or other deleting
// commands, as a fall-back behavior when the schema doesn't allow
// deletion at the selected point.
//
// > 当选区是空且在一个文本块的起始位置的时候，如果可以的话，选中位于文本块之前的节点。这个行为通常倾向于在 [`joinBackward`](#commands.joinBackward)
// 之后绑定向后删除键或者其他删除命令，以作为一个回退方案，如果 schema 不允许在选择的点进行删除操作的话。
//
// . 注 向后删除键在 Mac 上是 Ctrl + D，会删除光标右侧的内容。
export function selectNodeBackward(state, dispatch, view) {
  let {$head, empty} = state.selection, $cut = $head
  if (!empty) return false

  if ($head.parent.isTextblock) {
    if (view ? !view.endOfTextblock("backward", state) : $head.parentOffset > 0) return false
    $cut = findCutBefore($head)
  }
  let node = $cut && $cut.nodeBefore
  if (!node || !NodeSelection.isSelectable(node)) return false
  if (dispatch)
    dispatch(state.tr.setSelection(NodeSelection.create(state.doc, $cut.pos - node.nodeSize)).scrollIntoView())
  return true
}

function findCutBefore($pos) {
  if (!$pos.parent.type.spec.isolating) for (let i = $pos.depth - 1; i >= 0; i--) {
    if ($pos.index(i) > 0) return $pos.doc.resolve($pos.before(i + 1))
    if ($pos.node(i).type.spec.isolating) break
  }
  return null
}

// :: (EditorState, ?(tr: Transaction), ?EditorView) → bool
// If the selection is empty and the cursor is at the end of a
// textblock, try to reduce or remove the boundary between that block
// and the one after it, either by joining them or by moving the other
// block closer to this one in the tree structure. Will use the view
// for accurate start-of-textblock detection if given.
//
// > 如果选区是空而且光标在一个文本块的结尾处，则尝试减少或者移除当前块级元素和它之后的块级元素之间边界。可以通过连接他们或者在树中移动挨着当前块级元素的
// 其他块级元素。将会使用指定的 view（如果有）以获取准确的文本块起始方向。
export function joinForward(state, dispatch, view) {
  let {$cursor} = state.selection
  if (!$cursor || (view ? !view.endOfTextblock("forward", state)
                        : $cursor.parentOffset < $cursor.parent.content.size))
    return false

  let $cut = findCutAfter($cursor)

  // If there is no node after this, there's nothing to do
  if (!$cut) return false

  let after = $cut.nodeAfter
  // Try the joining algorithm
  if (deleteBarrier(state, $cut, dispatch)) return true

  // If the node above has no content and the node below is
  // selectable, delete the node above and select the one below.
  if ($cursor.parent.content.size == 0 &&
      (textblockAt(after, "start") || NodeSelection.isSelectable(after))) {
    if (dispatch) {
      let tr = state.tr.deleteRange($cursor.before(), $cursor.after())
      tr.setSelection(textblockAt(after, "start") ? Selection.findFrom(tr.doc.resolve(tr.mapping.map($cut.pos)), 1)
                      : NodeSelection.create(tr.doc, tr.mapping.map($cut.pos)))
      dispatch(tr.scrollIntoView())
    }
    return true
  }

  // If the next node is an atom, delete it
  if (after.isAtom && $cut.depth == $cursor.depth - 1) {
    if (dispatch) dispatch(state.tr.delete($cut.pos, $cut.pos + after.nodeSize).scrollIntoView())
    return true
  }

  return false
}

// :: (EditorState, ?(tr: Transaction), ?EditorView) → bool
// When the selection is empty and at the end of a textblock, select
// the node coming after that textblock, if possible. This is intended
// to be bound to keys like delete, after
// [`joinForward`](#commands.joinForward) and similar deleting
// commands, to provide a fall-back behavior when the schema doesn't
// allow deletion at the selected point.
//
// > 当选区是空且在一个文本块的结尾位置的时候，如果可以的话，选中位于文本块之后的节点。这个行为通常倾向于在 [`joinForward`](#commands.joinForward)
// 之后绑定删除键或者其他类似的删除命令，以作为一个回退方案，如果 schema 不允许在选择的点进行删除操作的话。
export function selectNodeForward(state, dispatch, view) {
  let {$head, empty} = state.selection, $cut = $head
  if (!empty) return false
  if ($head.parent.isTextblock) {
    if (view ? !view.endOfTextblock("forward", state) : $head.parentOffset < $head.parent.content.size)
      return false
    $cut = findCutAfter($head)
  }
  let node = $cut && $cut.nodeAfter
  if (!node || !NodeSelection.isSelectable(node)) return false
  if (dispatch)
    dispatch(state.tr.setSelection(NodeSelection.create(state.doc, $cut.pos)).scrollIntoView())
  return true
}

function findCutAfter($pos) {
  if (!$pos.parent.type.spec.isolating) for (let i = $pos.depth - 1; i >= 0; i--) {
    let parent = $pos.node(i)
    if ($pos.index(i) + 1 < parent.childCount) return $pos.doc.resolve($pos.after(i + 1))
    if (parent.type.spec.isolating) break
  }
  return null
}

// :: (EditorState, ?(tr: Transaction)) → bool
// Join the selected block or, if there is a text selection, the
// closest ancestor block of the selection that can be joined, with
// the sibling above it.
//
// > 连接选择的块级节点，或者如果有文本选区，则连接与选区最接近的可连接的祖先节点和它之前的同级节点。
export function joinUp(state, dispatch) {
  let sel = state.selection, nodeSel = sel instanceof NodeSelection, point
  if (nodeSel) {
    if (sel.node.isTextblock || !canJoin(state.doc, sel.from)) return false
    point = sel.from
  } else {
    point = joinPoint(state.doc, sel.from, -1)
    if (point == null) return false
  }
  if (dispatch) {
    let tr = state.tr.join(point)
    if (nodeSel) tr.setSelection(NodeSelection.create(tr.doc, point - state.doc.resolve(point).nodeBefore.nodeSize))
    dispatch(tr.scrollIntoView())
  }
  return true
}

// :: (EditorState, ?(tr: Transaction)) → bool
// Join the selected block, or the closest ancestor of the selection
// that can be joined, with the sibling after it.
//
// > 连接选择的块级节点，或者连接与选区最接近的可连接的祖先节点和它之后的同级节点。
export function joinDown(state, dispatch) {
  let sel = state.selection, point
  if (sel instanceof NodeSelection) {
    if (sel.node.isTextblock || !canJoin(state.doc, sel.to)) return false
    point = sel.to
  } else {
    point = joinPoint(state.doc, sel.to, 1)
    if (point == null) return false
  }
  if (dispatch)
    dispatch(state.tr.join(point).scrollIntoView())
  return true
}

// :: (EditorState, ?(tr: Transaction)) → bool
// Lift the selected block, or the closest ancestor block of the
// selection that can be lifted, out of its parent node.
//
// > 从父级节点中提升选择的块级节点，或者提升与选区最接近的可提升的祖先节点。
export function lift(state, dispatch) {
  let {$from, $to} = state.selection
  let range = $from.blockRange($to), target = range && liftTarget(range)
  if (target == null) return false
  if (dispatch) dispatch(state.tr.lift(range, target).scrollIntoView())
  return true
}

// :: (EditorState, ?(tr: Transaction)) → bool
// If the selection is in a node whose type has a truthy
// [`code`](#model.NodeSpec.code) property in its spec, replace the
// selection with a newline character.
//
// > 如果选区在一个配置对象中 [`code`](#model.NodeSpec.code) 属性为真值的节点类型中，则用一个换行符替换选区。
export function newlineInCode(state, dispatch) {
  let {$head, $anchor} = state.selection
  if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) return false
  if (dispatch) dispatch(state.tr.insertText("\n").scrollIntoView())
  return true
}

function defaultBlockAt(match) {
  for (let i = 0; i < match.edgeCount; i++) {
    let {type} = match.edge(i)
    if (type.isTextblock && !type.hasRequiredAttrs()) return type
  }
  return null
}

// :: (EditorState, ?(tr: Transaction)) → bool
// When the selection is in a node with a truthy
// [`code`](#model.NodeSpec.code) property in its spec, create a
// default block after the code block, and move the cursor there.
//
// > 如果选区在一个配置对象中 [`code`](#model.NodeSpec.code) 属性为真值的节点类型中，则在当前代码块之后新建一个默认的块级节点，
// 然后将光标移动到其内。
export function exitCode(state, dispatch) {
  let {$head, $anchor} = state.selection
  if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) return false
  let above = $head.node(-1), after = $head.indexAfter(-1), type = defaultBlockAt(above.contentMatchAt(after))
  if (!above.canReplaceWith(after, after, type)) return false
  if (dispatch) {
    let pos = $head.after(), tr = state.tr.replaceWith(pos, pos, type.createAndFill())
    tr.setSelection(Selection.near(tr.doc.resolve(pos), 1))
    dispatch(tr.scrollIntoView())
  }
  return true
}

// :: (EditorState, ?(tr: Transaction)) → bool
// If a block node is selected, create an empty paragraph before (if
// it is its parent's first child) or after it.
//
// > 如果一个块级节点被选中，则在其前面（如果它是其父级节点的第一个子元素）新建一个段落，或者其后面。
export function createParagraphNear(state, dispatch) {
  let {$from, $to} = state.selection
  if ($from.parent.inlineContent || $to.parent.inlineContent) return false
  let type = defaultBlockAt($from.parent.contentMatchAt($to.indexAfter()))
  if (!type || !type.isTextblock) return false
  if (dispatch) {
    let side = (!$from.parentOffset && $to.index() < $to.parent.childCount ? $from : $to).pos
    let tr = state.tr.insert(side, type.createAndFill())
    tr.setSelection(TextSelection.create(tr.doc, side + 1))
    dispatch(tr.scrollIntoView())
  }
  return true
}

// :: (EditorState, ?(tr: Transaction)) → bool
// If the cursor is in an empty textblock that can be lifted, lift the
// block.
//
// > 如果光标在一个空的可以被提升的文本块中，那么提升这个文本块。
export function liftEmptyBlock(state, dispatch) {
  let {$cursor} = state.selection
  if (!$cursor || $cursor.parent.content.size) return false
  if ($cursor.depth > 1 && $cursor.after() != $cursor.end(-1)) {
    let before = $cursor.before()
    if (canSplit(state.doc, before)) {
      if (dispatch) dispatch(state.tr.split(before).scrollIntoView())
      return true
    }
  }
  let range = $cursor.blockRange(), target = range && liftTarget(range)
  if (target == null) return false
  if (dispatch) dispatch(state.tr.lift(range, target).scrollIntoView())
  return true
}

// :: (EditorState, ?(tr: Transaction)) → bool
// Split the parent block of the selection. If the selection is a text
// selection, also delete its content.
//
// > 分割选区的父级节点。如果选区是一个文本选区，还会同时删除选区内容。
export function splitBlock(state, dispatch) {
  let {$from, $to} = state.selection
  if (state.selection instanceof NodeSelection && state.selection.node.isBlock) {
    if (!$from.parentOffset || !canSplit(state.doc, $from.pos)) return false
    if (dispatch) dispatch(state.tr.split($from.pos).scrollIntoView())
    return true
  }

  if (!$from.parent.isBlock) return false

  if (dispatch) {
    let atEnd = $to.parentOffset == $to.parent.content.size
    let tr = state.tr
    if (state.selection instanceof TextSelection) tr.deleteSelection()
    let deflt = $from.depth == 0 ? null : defaultBlockAt($from.node(-1).contentMatchAt($from.indexAfter(-1)))
    let types = atEnd && deflt ? [{type: deflt}] : null
    let can = canSplit(tr.doc, tr.mapping.map($from.pos), 1, types)
    if (!types && !can && canSplit(tr.doc, tr.mapping.map($from.pos), 1, deflt && [{type: deflt}])) {
      types = [{type: deflt}]
      can = true
    }
    if (can) {
      tr.split(tr.mapping.map($from.pos), 1, types)
      if (!atEnd && !$from.parentOffset && $from.parent.type != deflt &&
          $from.node(-1).canReplace($from.index(-1), $from.indexAfter(-1), Fragment.from(deflt.create(), $from.parent)))
        tr.setNodeMarkup(tr.mapping.map($from.before()), deflt)
    }
    dispatch(tr.scrollIntoView())
  }
  return true
}

// :: (EditorState, ?(tr: Transaction)) → bool
// Acts like [`splitBlock`](#commands.splitBlock), but without
// resetting the set of active marks at the cursor.
//
// > 行为和 [`splitBlock`](#commands.splitBlock) 类似，不过不会重置光标处已经激活的 marks 集合。
export function splitBlockKeepMarks(state, dispatch) {
  return splitBlock(state, dispatch && (tr => {
    let marks = state.storedMarks || (state.selection.$to.parentOffset && state.selection.$from.marks())
    if (marks) tr.ensureMarks(marks)
    dispatch(tr)
  }))
}

// :: (EditorState, ?(tr: Transaction)) → bool
// Move the selection to the node wrapping the current selection, if
// any. (Will not select the document node.)
//
// > 移动选区到包裹当前选区的节点中（如果有的话，不会选择文档根节点）。
export function selectParentNode(state, dispatch) {
  let {$from, to} = state.selection, pos
  let same = $from.sharedDepth(to)
  if (same == 0) return false
  pos = $from.before(same)
  if (dispatch) dispatch(state.tr.setSelection(NodeSelection.create(state.doc, pos)))
  return true
}

// :: (EditorState, ?(tr: Transaction)) → bool
// Select the whole document.
//
// > 选择整个文档。
export function selectAll(state, dispatch) {
  if (dispatch) dispatch(state.tr.setSelection(new AllSelection(state.doc)))
  return true
}

function joinMaybeClear(state, $pos, dispatch) {
  let before = $pos.nodeBefore, after = $pos.nodeAfter, index = $pos.index()
  if (!before || !after || !before.type.compatibleContent(after.type)) return false
  if (!before.content.size && $pos.parent.canReplace(index - 1, index)) {
    if (dispatch) dispatch(state.tr.delete($pos.pos - before.nodeSize, $pos.pos).scrollIntoView())
    return true
  }
  if (!$pos.parent.canReplace(index, index + 1) || !(after.isTextblock || canJoin(state.doc, $pos.pos)))
    return false
  if (dispatch)
    dispatch(state.tr
             .clearIncompatible($pos.pos, before.type, before.contentMatchAt(before.childCount))
             .join($pos.pos)
             .scrollIntoView())
  return true
}

function deleteBarrier(state, $cut, dispatch) {
  let before = $cut.nodeBefore, after = $cut.nodeAfter, conn, match
  if (before.type.spec.isolating || after.type.spec.isolating) return false
  if (joinMaybeClear(state, $cut, dispatch)) return true

  if ($cut.parent.canReplace($cut.index(), $cut.index() + 1) &&
      (conn = (match = before.contentMatchAt(before.childCount)).findWrapping(after.type)) &&
      match.matchType(conn[0] || after.type).validEnd) {
    if (dispatch) {
      let end = $cut.pos + after.nodeSize, wrap = Fragment.empty
      for (let i = conn.length - 1; i >= 0; i--)
        wrap = Fragment.from(conn[i].create(null, wrap))
      wrap = Fragment.from(before.copy(wrap))
      let tr = state.tr.step(new ReplaceAroundStep($cut.pos - 1, end, $cut.pos, end, new Slice(wrap, 1, 0), conn.length, true))
      let joinAt = end + 2 * conn.length
      if (canJoin(tr.doc, joinAt)) tr.join(joinAt)
      dispatch(tr.scrollIntoView())
    }
    return true
  }

  let selAfter = Selection.findFrom($cut, 1)
  let range = selAfter && selAfter.$from.blockRange(selAfter.$to), target = range && liftTarget(range)
  if (target != null && target >= $cut.depth) {
    if (dispatch) dispatch(state.tr.lift(range, target).scrollIntoView())
    return true
  }

  return false
}

// Parameterized commands

// :: (NodeType, ?Object) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
// Wrap the selection in a node of the given type with the given
// attributes.
//
// > 用带有指定 attributes 的指定类型的节点来包裹选区。
export function wrapIn(nodeType, attrs) {
  return function(state, dispatch) {
    let {$from, $to} = state.selection
    let range = $from.blockRange($to), wrapping = range && findWrapping(range, nodeType, attrs)
    if (!wrapping) return false
    if (dispatch) dispatch(state.tr.wrap(range, wrapping).scrollIntoView())
    return true
  }
}

// :: (NodeType, ?Object) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
// Returns a command that tries to set the selected textblocks to the
// given node type with the given attributes.
//
// > 返回一个尝试将选中的文本块设置为带有指定 attributes 的指定节点类型的命令。
export function setBlockType(nodeType, attrs) {
  return function(state, dispatch) {
    let {from, to} = state.selection
    let applicable = false
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (applicable) return false
      if (!node.isTextblock || node.hasMarkup(nodeType, attrs)) return
      if (node.type == nodeType) {
        applicable = true
      } else {
        let $pos = state.doc.resolve(pos), index = $pos.index()
        applicable = $pos.parent.canReplaceWith(index, index + 1, nodeType)
      }
    })
    if (!applicable) return false
    if (dispatch) dispatch(state.tr.setBlockType(from, to, nodeType, attrs).scrollIntoView())
    return true
  }
}

function markApplies(doc, ranges, type) {
  for (let i = 0; i < ranges.length; i++) {
    let {$from, $to} = ranges[i]
    let can = $from.depth == 0 ? doc.type.allowsMarkType(type) : false
    doc.nodesBetween($from.pos, $to.pos, node => {
      if (can) return false
      can = node.inlineContent && node.type.allowsMarkType(type)
    })
    if (can) return true
  }
  return false
}

// :: (MarkType, ?Object) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
// Create a command function that toggles the given mark with the
// given attributes. Will return `false` when the current selection
// doesn't support that mark. This will remove the mark if any marks
// of that type exist in the selection, or add it otherwise. If the
// selection is empty, this applies to the [stored
// marks](#state.EditorState.storedMarks) instead of a range of the
// document.
//
// > 新建一个命令函数，控制带有指定 attributes 的指定 mark 的开关。如果当前选区不支持这个的 mark 将会返回 `false`。
// 这个过程将会移除在选区中存在的任何该种类型的 mark，或者如果没有的话则添加之。如果选区是空，则这将会应用到 stored
// marks](#state.EditorState.storedMarks) 中，而不是文档的某个范围。
export function toggleMark(markType, attrs) {
  return function(state, dispatch) {
    let {empty, $cursor, ranges} = state.selection
    if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType)) return false
    if (dispatch) {
      if ($cursor) {
        if (markType.isInSet(state.storedMarks || $cursor.marks()))
          dispatch(state.tr.removeStoredMark(markType))
        else
          dispatch(state.tr.addStoredMark(markType.create(attrs)))
      } else {
        let has = false, tr = state.tr
        for (let i = 0; !has && i < ranges.length; i++) {
          let {$from, $to} = ranges[i]
          has = state.doc.rangeHasMark($from.pos, $to.pos, markType)
        }
        for (let i = 0; i < ranges.length; i++) {
          let {$from, $to} = ranges[i]
          if (has) tr.removeMark($from.pos, $to.pos, markType)
          else tr.addMark($from.pos, $to.pos, markType.create(attrs))
        }
        dispatch(tr.scrollIntoView())
      }
    }
    return true
  }
}

function wrapDispatchForJoin(dispatch, isJoinable) {
  return tr => {
    if (!tr.isGeneric) return dispatch(tr)

    let ranges = []
    for (let i = 0; i < tr.mapping.maps.length; i++) {
      let map = tr.mapping.maps[i]
      for (let j = 0; j < ranges.length; j++)
        ranges[j] = map.map(ranges[j])
      map.forEach((_s, _e, from, to) => ranges.push(from, to))
    }

    // Figure out which joinable points exist inside those ranges,
    // by checking all node boundaries in their parent nodes.
    let joinable = []
    for (let i = 0; i < ranges.length; i += 2) {
      let from = ranges[i], to = ranges[i + 1]
      let $from = tr.doc.resolve(from), depth = $from.sharedDepth(to), parent = $from.node(depth)
      for (let index = $from.indexAfter(depth), pos = $from.after(depth + 1); pos <= to; ++index) {
        let after = parent.maybeChild(index)
        if (!after) break
        if (index && joinable.indexOf(pos) == -1) {
          let before = parent.child(index - 1)
          if (before.type == after.type && isJoinable(before, after))
            joinable.push(pos)
        }
        pos += after.nodeSize
      }
    }
    // Join the joinable points
    joinable.sort((a, b) => a - b)
    for (let i = joinable.length - 1; i >= 0; i--) {
      if (canJoin(tr.doc, joinable[i])) tr.join(joinable[i])
    }
    dispatch(tr)
  }
}

// :: ((state: EditorState, ?(tr: Transaction)) → bool, union<(before: Node, after: Node) → bool, [string]>) → (state: EditorState, ?(tr: Transaction)) → bool
// Wrap a command so that, when it produces a transform that causes
// two joinable nodes to end up next to each other, those are joined.
// Nodes are considered joinable when they are of the same type and
// when the `isJoinable` predicate returns true for them or, if an
// array of strings was passed, if their node type name is in that
// array.
//
// > 封装一个命令，以便当它产生一个 transform 以引起两个可连接的节点彼此相邻时能够被连接。
// 当节点具有相同类型并且当 `isJoinable` 参数是函数时返回 true 或者参数是一个字符串数组而这些节点名在这个数组中时，节点将会被认为是可连接的。
export function autoJoin(command, isJoinable) {
  if (Array.isArray(isJoinable)) {
    let types = isJoinable
    isJoinable = node => types.indexOf(node.type.name) > -1
  }
  return (state, dispatch) => command(state, dispatch && wrapDispatchForJoin(dispatch, isJoinable))
}

// :: (...[(EditorState, ?(tr: Transaction), ?EditorView) → bool]) → (EditorState, ?(tr: Transaction), ?EditorView) → bool
// Combine a number of command functions into a single function (which
// calls them one by one until one returns true).
//
// > 组合多个命令函数到一个单独的函数（一个一个的调用这些命令，直到其中一个返回 true）。
export function chainCommands(...commands) {
  return function(state, dispatch, view) {
    for (let i = 0; i < commands.length; i++)
      if (commands[i](state, dispatch, view)) return true
    return false
  }
}

let backspace = chainCommands(deleteSelection, joinBackward, selectNodeBackward)
let del = chainCommands(deleteSelection, joinForward, selectNodeForward)

// :: Object
// A basic keymap containing bindings not specific to any schema.
// Binds the following keys (when multiple commands are listed, they
// are chained with [`chainCommands`](#commands.chainCommands)):
//
// > 一个基本的按键映射，包含不特定于任何 schema 的按键绑定。绑定包含下列按键（当多个命令被列出来的时候，它们被 [`chainCommands`](#commands.chainCommands)
// 所链接起来）。
//
// * **Enter** to `newlineInCode`, `createParagraphNear`, `liftEmptyBlock`, `splitBlock`
// * > **Enter** 绑定到 `newlineInCode`, `createParagraphNear`, `liftEmptyBlock`, `splitBlock`
// * **Mod-Enter** to `exitCode`
// * > **Mod-Enter** 绑定到 `exitCode`
// * **Backspace** and **Mod-Backspace** to `deleteSelection`, `joinBackward`, `selectNodeBackward`
// * > **Backspace** 及 **Mod-Backspace** 绑定到 `deleteSelection`, `joinBackward`, `selectNodeBackward`
// * **Delete** and **Mod-Delete** to `deleteSelection`, `joinForward`, `selectNodeForward`
// * > **Delete** 及 **Mod-Delete** 绑定到 `deleteSelection`, `joinForward`, `selectNodeForward`
// * **Mod-Delete** to `deleteSelection`, `joinForward`, `selectNodeForward`
// * > **Mod-Delete** 绑定到 `deleteSelection`, `joinForward`, `selectNodeForward`
// * **Mod-a** to `selectAll`
// * > **Mod-a** 绑定到 `selectAll`
export let pcBaseKeymap = {
  "Enter": chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock),
  "Mod-Enter": exitCode,
  "Backspace": backspace,
  "Mod-Backspace": backspace,
  "Delete": del,
  "Mod-Delete": del,
  "Mod-a": selectAll
}

// :: Object
// A copy of `pcBaseKeymap` that also binds **Ctrl-h** like Backspace,
// **Ctrl-d** like Delete, **Alt-Backspace** like Ctrl-Backspace, and
// **Ctrl-Alt-Backspace**, **Alt-Delete**, and **Alt-d** like
// Ctrl-Delete.
//
// > `pcBaseKeymap` 的复制版，和 Backspace 一样绑定了 **Ctrl-h**，和 Delete 一样绑定了 **Ctrl-d**，
// 和 Ctrl-Backspace 一样绑定了 **Alt-Backspace**，和 Ctrl-Delete 一样绑定了 **Ctrl-Alt-Backspace**, **Alt-Delete**, 和 **Alt-d**
export let macBaseKeymap = {
  "Ctrl-h": pcBaseKeymap["Backspace"],
  "Alt-Backspace": pcBaseKeymap["Mod-Backspace"],
  "Ctrl-d": pcBaseKeymap["Delete"],
  "Ctrl-Alt-Backspace": pcBaseKeymap["Mod-Delete"],
  "Alt-Delete": pcBaseKeymap["Mod-Delete"],
  "Alt-d": pcBaseKeymap["Mod-Delete"]
}
for (let key in pcBaseKeymap) macBaseKeymap[key] = pcBaseKeymap[key]

// declare global: os, navigator
const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform)
          : typeof os != "undefined" ? os.platform() == "darwin" : false

// :: Object
// Depending on the detected platform, this will hold
// [`pcBasekeymap`](#commands.pcBaseKeymap) or
// [`macBaseKeymap`](#commands.macBaseKeymap).
//
// > 取决于删除操作的平台，该值将指向 [`pcBasekeymap`](#commands.pcBaseKeymap) 或者 [`macBaseKeymap`](#commands.macBaseKeymap)。
export let baseKeymap = mac ? macBaseKeymap : pcBaseKeymap
