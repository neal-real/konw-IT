/**
* & 文件说明: Mark 处理行内元素的各种样式
* > 它有一个可选的属性集合以提供更多样式添加
* 比如链接的 target 信息等）。
* Marks 通过 `Schema` 创建，它控制哪些 marks 存在于哪些节点以及拥有哪些 attributes。
*/ 
import {compareDeep} from "./comparedeep"


export class Mark {
  constructor(type, attrs) {
    // > 当前 mark 的 type。
    this.type = type
    // > 与此 mark 相关的 属性
    this.attrs = attrs
  }

  /**
  * > 将当前 标记 添加到指定标记的后面,返回新的标记集合
  * > 当前标记存在,则返回自身.
  * > 假设指定集合中的标记配置对象 (model.MarkSpec.excludes)的属性中有当前标记,那么会用当前标记替换
  */ 
  addToSet(set) {
    let copy, placed = false
    for (let i = 0; i < set.length; i++) {
      let other = set[i]
      if (this.eq(other)) return set
      if (this.type.excludes(other.type)) {
        if (!copy) copy = set.slice(0, i)
      } else if (other.type.excludes(this.type)) {
        return set
      } else {
        if (!placed && other.type.rank > this.type.rank) {
          if (!copy) copy = set.slice(0, i)
          copy.push(this)
          placed = true
        }
        if (copy) copy.push(other)
      }
    }
    if (!copy) copy = set.slice()
    if (!placed) copy.push(this)
    return copy
  }

  // > 从指定的 marks 集合中移除当前 mark。如果当前 mark 不在集合中，那么指定集合本身会被返回。
  removeFromSet(set) {
    for (let i = 0; i < set.length; i++)
      if (this.eq(set[i]))
        return set.slice(0, i).concat(set.slice(i + 1))
    return set
  }

  // > 测试是否当前 标记 是否在指定 标记 集合中。
  isInSet(set) {
    for (let i = 0; i < set.length; i++)
      if (this.eq(set[i])) return true
    return false
  }

  // > 测试当前 标记 与指定 标记 是否有相同的类型和 属性
  eq(other) {
    return this == other ||
      (this.type == other.type && compareDeep(this.attrs, other.attrs))
  }

  // > 返回当前 标记 的 JSON 序列化的表示。
  toJSON() {
    let obj = {type: this.type.name}
    for (let _ in this.attrs) {
      obj.attrs = this.attrs
      break
    }
    return obj
  }

  // > 从 JSON 转为 (Schema, Object) 返回标记
  static fromJSON(schema, json) {
    if (!json) throw new RangeError("Invalid input for Mark.fromJSON")
    let type = schema.marks[json.type]
    if (!type) throw new RangeError(`There is no mark type ${json.type} in this schema`)
    return type.create(json.attrs)
  }

  // > 测试两个 标记 集合是否一样。
  // .备注 标记 集合是否相同的比较是是对比 标记 集合中的 标记 数量，然后逐个调用 mark 的 eq 进行比较。
  static sameSet(a, b) {
    if (a == b) return true
    if (a.length != b.length) return false
    for (let i = 0; i < a.length; i++)
      if (!a[i].eq(b[i])) return false
    return true
  }

  // > 用指定的参数，新建一个 stored marks 集合，该参数可能是 null、单独一个标记或者一个未排序的 标记 数组。
  static setFrom(marks) {
    if (!marks || marks.length == 0) return Mark.none
    if (marks instanceof Mark) return [marks]
    let copy = marks.slice()
    copy.sort((a, b) => a.type.rank - b.type.rank)
    return copy
  }
}

// > 标记 的空集合。
Mark.none = []
