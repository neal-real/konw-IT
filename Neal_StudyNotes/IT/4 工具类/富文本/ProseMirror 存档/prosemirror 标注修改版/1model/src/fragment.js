/**
* & 文件说明:  片段
* > 像 nodes 一样，fragment 也是一个持久化数据结构，
* > 你不应该直接修改他们或者他们的内容，而应该创建一个新的实例。
* > 下面的 API 就是用来试图将这件事变得容易。
*/ 
import {findDiffStart, findDiffEnd} from "./diff"

//> 一个 fragment 表示了节点的子节点集合
export class Fragment {
  constructor(content, size) {
    this.content = content
    // > fragment 的大小，也即它的内容节点大小的总和。
    this.size = size || 0
    if (size == null) for (let i = 0; i < content.length; i++)
      this.size += content[i].nodeSize
  }

  //> 节点之间: 递归遍历节点,直到没有节点返回 false 
  nodesBetween(from, to, f, nodeStart = 0, parent) {
    for (let i = 0, pos = 0; pos < to; i++) {
      let child = this.content[i], end = pos + child.nodeSize
      if (end > from && f(child, nodeStart + pos, parent, i) !== false && child.content.size) {
        let start = pos + 1
        child.nodesBetween(Math.max(0, from - start),
                           Math.min(child.content.size, to - start),
                           f, 
                           nodeStart + start)
      }
      pos = end
    }
  }

  //> descendants: 后代的? 对所有的后代元素递归调用指定的回调。如果某个节点回调返回 `false` 表示阻止再对该节点的子节点调用回调。
  descendants(f) {
    this.nodesBetween(0, this.size, f)
  }

  /**
    * (from: number, to: number, blockSeparator: ?⁠string, leafText: ?⁠string) 返回 string
    * > 获取 from 和 to 之间的所有文本内容。
    * > 当 blockSeparator 指定的时候，它将会插入到每一个新的块级节点开始的地方。 
    * > 当 leafText 指定的时候，它将会插入到遇到的每一个非文本叶子节点后面。
  */ 
  textBetween(from, to, blockSeparator, leafText) {
    let text = "", separated = true
    this.nodesBetween(from, to, (node, pos) => {
      if (node.isText) {
        text += node.text.slice(Math.max(from, pos) - pos, to - pos)
        separated = !blockSeparator
      } else if (node.isLeaf && leafText) {
        text += leafText
        separated = !blockSeparator
      } else if (!separated && node.isBlock) {
        text += blockSeparator
        separated = true
      }
    }, 0)
    return text
  }

  //> 创建一个包含当前 fragment 内容和指定 fragment 内容的新的 fragment。
  append(other) {
    if (!other.size) return this
    if (!this.size) return other
    let last = this.lastChild, first = other.firstChild, content = this.content.slice(), i = 0
    if (last.isText && last.sameMarkup(first)) {
      content[content.length - 1] = last.withText(last.text + first.text)
      i = 1
    }
    for (; i < other.content.length; i++) content.push(other.content[i])
    return new Fragment(content, this.size + other.size)
  }

  //> 从 fragment 剪切出指定范围的一个子 fragment。
  cut(from, to) {
    if (to == null) to = this.size
    if (from == 0 && to == this.size) return this
    let result = [], size = 0
    if (to > from) for (let i = 0, pos = 0; pos < to; i++) {
      let child = this.content[i], end = pos + child.nodeSize
      if (end > from) {
        if (pos < from || end > to) {
          if (child.isText)
            child = child.cut(Math.max(0, from - pos), Math.min(child.text.length, to - pos))
          else
            child = child.cut(Math.max(0, from - pos - 1), Math.min(child.content.size, to - pos - 1))
        }
        result.push(child)
        size += child.nodeSize
      }
      pos = end
    }
    return new Fragment(result, size)
  }

  cutByIndex(from, to) {
    if (from == to) return Fragment.empty
    if (from == 0 && to == this.content.length) return this
    return new Fragment(this.content.slice(from, to))
  }

  //> 将 fragment 中的指定 index 位置的节点用指定节点替换掉后，创建一个新的 fragment。
  replaceChild(index, node) {
    let current = this.content[index]
    if (current == node) return this
    let copy = this.content.slice()
    let size = this.size + node.nodeSize - current.nodeSize
    copy[index] = node
    return new Fragment(copy, size)
  }

  //> 将指定的节点添加到 fragment 起始位置后，返回得到的新的 fragment。
  addToStart(node) {
    return new Fragment([node].concat(this.content), this.size + node.nodeSize)
  }

  //> 将指定的节点添加到 fragment 的末尾位置后，返回得到的新的 fragment。
  addToEnd(node) {
    return new Fragment(this.content.concat(node), this.size + node.nodeSize)
  }

  //> 将当前 fragment 与另一个 fragment 比较，看是否相等。。
  //>comment 先比较 fragment 的内容大小，再逐个对内容节点调用节点的 eq 方法进行比较，一旦发现不一样的则返回 false，否则返回 true。
  eq(other) {
    if (this.content.length != other.content.length) return false
    for (let i = 0; i < this.content.length; i++)
      if (!this.content[i].eq(other.content[i])) return false
    return true
  }

  //> 返回当前 fragment 的第一个子节点，如果是空则为 `null`。
  get firstChild() { return this.content.length ? this.content[0] : null }

  //> 返回当前 fragment 的最后一个节点，如果是空则为 `null`。
  get lastChild() { return this.content.length ? this.content[this.content.length - 1] : null }

  //> 当前 fragment 的子节点数量。
  get childCount() { return this.content.length }

  //> 获取 fragment 在指定 index 的子节点。如果 index 超出范围则抛出一个错误。
  child(index) {
    let found = this.content[index]
    if (!found) throw new RangeError("Index " + index + " out of range for " + this)
    return found
  }

  //> 获取指定 index 的子节点，如果存在的话。
  maybeChild(index) {
    return this.content[index]
  }

  //> 为每一个子节点调用 `f` 函数，参数是子节点、子节点相对于当前节点的偏移、以及子节点的 index。
  forEach(f) {
    for (let i = 0, p = 0; i < this.content.length; i++) {
      let child = this.content[i]
      f(child, p, i)
      p += child.nodeSize
    }
  }

  //> 寻找当前 fragment 和指定 fragment 的第一个不同的位置，如果它们相同的话返回 `null`。
  findDiffStart(other, pos = 0) {
    return findDiffStart(this, other, pos)
  }

  //> 从后往前搜索，寻找当前 fragment 和指定 fragment 的第一个不同的位置，如果相同则返回 `null`。
  // 因为该位置在两个节点中可能是不同的，因此该函数返回的是一个对象，带有两个不同的位置。
  //>comment 对象是 {a: number, b: number}。
  findDiffEnd(other, pos = this.size, otherPos = other.size) {
    return findDiffEnd(this, other, pos, otherPos)
  }

  findIndex(pos, round = -1) {
    if (pos == 0) return retIndex(0, pos)
    if (pos == this.size) return retIndex(this.content.length, pos)
    if (pos > this.size || pos < 0) throw new RangeError(`Position ${pos} outside of fragment (${this})`)
    for (let i = 0, curPos = 0;; i++) {
      let cur = this.child(i), end = curPos + cur.nodeSize
      if (end >= pos) {
        if (end == pos || round > 0) return retIndex(i + 1, end)
        return retIndex(i, curPos)
      }
      curPos = end
    }
  }

  //> 返回一个用来 debug 的 string 以描述该 fragment。
  toString() { return "<" + this.toStringInner() + ">" }

  toStringInner() { return this.content.join(", ") }

  //> 返回该 fragment 序列化后的 JSON 表示。
  toJSON() {
    return this.content.length ? this.content.map(n => n.toJSON()) : null
  }

  // 从该 fragment 的 JSON 表示中反序列化（parse）一个 fragment。
  static fromJSON(schema, value) {
    if (!value) return Fragment.empty
    if (!Array.isArray(value)) throw new RangeError("Invalid input for Fragment.fromJSON")
    return new Fragment(value.map(schema.nodeFromJSON))
  }

  //> 用一个节点数组构建一个 fragment。带有相同 marks 的相邻文本节点会被合并到一起。
  static fromArray(array) {
    if (!array.length) return Fragment.empty
    let joined, size = 0
    for (let i = 0; i < array.length; i++) {
      let node = array[i]
      size += node.nodeSize
      if (i && node.isText && array[i - 1].sameMarkup(node)) {
        if (!joined) joined = array.slice(0, i)
        joined[joined.length - 1] = node.withText(joined[joined.length - 1].text + node.text)
      } else if (joined) {
        joined.push(node)
      }
    }
    return new Fragment(joined || array, size)
  }

  //> 用指定的类节点集合的对象中创建一个 fragment。如果是 `null` 则返回空 fragment。
  // 如果是 fragment 则返回该 fragment 自身。如果是一个节点或者一个节点数组，则返回一个包含这些节点的 fragment。
  static from(nodes) {
    if (!nodes) return Fragment.empty
    if (nodes instanceof Fragment) return nodes
    if (Array.isArray(nodes)) return this.fromArray(nodes)
    if (nodes.attrs) return new Fragment([nodes], nodes.nodeSize)
    throw new RangeError("Can not convert " + nodes + " to a Fragment" +
                         (nodes.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""))
  }
}

const found = {index: 0, offset: 0}
function retIndex(index, offset) {
  found.index = index
  found.offset = offset
  return found
}

//> 一个空的 fragment。没有包含任何节点的 fragment 都指向该对象（而不是为每个 fragment 都创建一个空的 fragment）。
Fragment.empty = new Fragment([], 0)
