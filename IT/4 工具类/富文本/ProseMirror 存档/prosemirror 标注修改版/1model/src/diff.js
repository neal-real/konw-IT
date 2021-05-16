/**
* & 从开头处,递归查找 a 和 b 的 差异数字
* ? pos 应该是数字
*/ 
export function findDiffStart(a, b, pos) {
  // > 死循环开启
  for (let i = 0;; i++) {
    // > 当 i 等于 a 或 b 的子元素的总数
    if (i == a.childCount || i == b.childCount)
    // > 判断 a 和 b 子元素总数值是否相等; 一样返回 null 否则返回 pos 差异数??
      return a.childCount == b.childCount ? null : pos
    // > 取出 当前 i 的 a 和 b 的子元素
    let childA = a.child(i), childB = b.child(i)
    // > 判断是否 值相等
    if (childA == childB) { 
      // > pos += a 子元素的节点 size
      pos += childA.nodeSize; 
      // 终止本次循环
      continue 
    }
    // > 对比 childA 和 childB 的标记是否相同 , 不同 返回 pos
    if (!childA.sameMarkup(childB)) return pos
    // >  childA.isText 有值 且与 childB 的isText不一样
    if (childA.isText && childA.text != childB.text) {
      // 只能判断 hildA.text[0] == childB.text[0] 是否一样, 一样 pos =1 返回 pos, 否则不循环
      for (let j = 0; childA.text[j] == childB.text[j]; j++)
      pos++
      return pos
    }
    // childA 或 childA 的内容 size 有值 递归 findDiffStart,并让 pos + 1
    if (childA.content.size || childB.content.size) {
      let inner = findDiffStart(childA.content, childB.content, pos + 1)
      // 返回值 不为 null  则 返回  pos
      if (inner != null) return inner
    }
    // pos += childA的节点大小
    pos += childA.nodeSize
  }
}

/**
* & 从结尾处,递归查找 a 和 b 的 差异数字
* ? pos 应该是数字
*/ 
export function findDiffEnd(a, b, posA, posB) {
  /**
  * & 死循环开启
  * > iA = a 的子元素个数, iB 是 b 的子元素个数
  */ 
  for (let iA = a.childCount, iB = b.childCount;;) {
    if (iA == 0 || iB == 0)
      return iA == iB ? null : {a: posA, b: posB}

    let childA = a.child(--iA), childB = b.child(--iB), size = childA.nodeSize
    if (childA == childB) {
      posA -= size; posB -= size
      continue
    }

    if (!childA.sameMarkup(childB)) return {a: posA, b: posB}

    if (childA.isText && childA.text != childB.text) {
      let same = 0, minSize = Math.min(childA.text.length, childB.text.length)
      while (same < minSize && childA.text[childA.text.length - same - 1] == childB.text[childB.text.length - same - 1]) {
        same++; posA--; posB--
      }
      return {a: posA, b: posB}
    }
    if (childA.content.size || childB.content.size) {
      let inner = findDiffEnd(childA.content, childB.content, posA - 1, posB - 1)
      if (inner) return inner
    }
    posA -= size; posB -= size
  }
}
