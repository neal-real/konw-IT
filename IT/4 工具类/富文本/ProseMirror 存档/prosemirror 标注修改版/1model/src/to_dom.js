// DOMOutputSpec:: interface
// A description of a DOM structure. Can be either a string, which is
// interpreted as a text node, a DOM node, which is interpreted as
// itself, or an array.
//
// > 一个 DOM 结构的描述。既可以是一个字符串，用来表示一个文本节点，也可以是一个 DOM 节点，表示它自身，亦或者是一个数组。
//
// An array describes a DOM element. The first value in the array
// should be a string—the name of the DOM element, optionally prefixed
// by a namespace URL and a space. If the second element is plain
// object, it is interpreted as a set of attributes for the element.
// Any elements after that (including the 2nd if it's not an attribute
// object) are interpreted as children of the DOM elements, and must
// either be valid `DOMOutputSpec` values, or the number zero.
//
// > 这个数组描述了一个 DOM 元素。数组中的第一个值应该是这个 DOM 元素名字字符串，可以允许带上命名空间 URL 的前缀或者空格。
// 如果数组第二个值是一个普通对象，则被当做是 DOM 元素的 attributes。在数组第二个值之后的任何值（包括第二个值，如果它不是一个普通属性对象的话）
// 都被认为是该 DOM 元素的子元素，因此这些后面的值必须是有一个有效的 `DOMOutputSpec` 值，或者是数字 0。
//
// The number zero (pronounced “hole”) is used to indicate the place
// where a node's child nodes should be inserted. If it occurs in an
// output spec, it should be the only child element in its parent
// node.
//
// > 数字 0（念做「洞」）被用来指示子元素应该被放置的位置。如果子元素是一个会被放置内容的节点，那么 0 应该是它唯一子元素。
//
// . 注 举个例子：
// `['div', {style:'color:red'}, 0]`，表示的是 `<div style="color:red">子元素<div>`;
// `['div', {style:'color:red'}, ['p', 0]]`，表示的是 `<div style="color:red"><p>子元素</p><div>`;
// `['div', {style:'color:red'}, ['p'], 0]` 非法，因为 0 作为一个放置子元素的容器，其并不是父节点 `div` 的唯一子元素，父节点还有个子元素是 `p`。

// ::- A DOM serializer knows how to convert ProseMirror nodes and
// marks of various types to DOM nodes.
//
// > 一个 DOM serializer 知道如何将不同类型的 ProseMirror 节点和 marks 转换成 DOM 节点。
export class DOMSerializer {
  // :: (Object<(node: Node) → DOMOutputSpec>, Object<?(mark: Mark, inline: bool) → DOMOutputSpec>)
  // Create a serializer. `nodes` should map node names to functions
  // that take a node and return a description of the corresponding
  // DOM. `marks` does the same for mark names, but also gets an
  // argument that tells it whether the mark's content is block or
  // inline content (for typical use, it'll always be inline). A mark
  // serializer may be `null` to indicate that marks of that type
  // should not be serialized.
  //
  // > 新建一个 serializer。`nodes` 应该是一个对象，键是节点名，值是一个函数，函数接受一个节点作为参数，返回相应的 DOM 描述。
  // `marks` 类似，键值 marks 名，值是一个函数，只不过函数参数表示的是 marks 的内容是否是 block 的或者是 inline 的（一般情况下应该是 inline 的）。
  // 一个 mark serializer 可能是 `null`，表示这种类型的 mark 不应该被 serialized（序列化）。
  constructor(nodes, marks) {
    // :: Object<(node: Node) → DOMOutputSpec>
    // The node serialization functions.
    //
    // > 节点的 serialization 函数们。
    this.nodes = nodes || {}
    // :: Object<?(mark: Mark, inline: bool) → DOMOutputSpec>
    // The mark serialization functions.
    //
    // > mark 的 serialization 函数们。
    this.marks = marks || {}
  }

  // :: (Fragment, ?Object) → dom.DocumentFragment
  // Serialize the content of this fragment to a DOM fragment. When
  // not in the browser, the `document` option, containing a DOM
  // document, should be passed so that the serializer can create
  // nodes.
  //
  // > 将指定的 fragment serialize 成 DOM fragment。如果该操作不是在浏览器中完成，
  // 那么应该传递一个 `document` 参数，以让 serializer 能够新建 nodes 们。
  //
  // . 注 即 `option.document`，如果没有传，默认使用的是 `window.document`。
  serializeFragment(fragment, options = {}, target) {
    if (!target) target = doc(options).createDocumentFragment()

    let top = target, active = null
    fragment.forEach(node => {
      if (active || node.marks.length) {
        if (!active) active = []
        let keep = 0, rendered = 0
        while (keep < active.length && rendered < node.marks.length) {
          let next = node.marks[rendered]
          if (!this.marks[next.type.name]) { rendered++; continue }
          if (!next.eq(active[keep]) || next.type.spec.spanning === false) break
          keep += 2; rendered++
        }
        while (keep < active.length) {
          top = active.pop()
          active.pop()
        }
        while (rendered < node.marks.length) {
          let add = node.marks[rendered++]
          let markDOM = this.serializeMark(add, node.isInline, options)
          if (markDOM) {
            active.push(add, top)
            top.appendChild(markDOM.dom)
            top = markDOM.contentDOM || markDOM.dom
          }
        }
      }
      top.appendChild(this.serializeNode(node, options))
    })

    return target
  }

  // :: (Node, ?Object) → dom.Node
  // Serialize this node to a DOM node. This can be useful when you
  // need to serialize a part of a document, as opposed to the whole
  // document. To serialize a whole document, use
  // [`serializeFragment`](#model.DOMSerializer.serializeFragment) on
  // its [content](#model.Node.content).
  //
  // > 将节点 serialize 成一个 DOM 节点。这对于当想要 serialize 文档的一部分而不是整个文档的时候很有用。
  // 若要 serialize 整个文档，在它的 [content](#model.Node.content) 属性上调用 [`serializeFragment`](#model.DOMSerializer.serializeFragment) 来完成。
  serializeNode(node, options = {}) {
    let {dom, contentDOM} =
        DOMSerializer.renderSpec(doc(options), this.nodes[node.type.name](node))
    if (contentDOM) {
      if (node.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec")
      if (options.onContent)
        options.onContent(node, contentDOM, options)
      else
        this.serializeFragment(node.content, options, contentDOM)
    }
    return dom
  }

  serializeNodeAndMarks(node, options = {}) {
    let dom = this.serializeNode(node, options)
    for (let i = node.marks.length - 1; i >= 0; i--) {
      let wrap = this.serializeMark(node.marks[i], node.isInline, options)
      if (wrap) {
        ;(wrap.contentDOM || wrap.dom).appendChild(dom)
        dom = wrap.dom
      }
    }
    return dom
  }

  serializeMark(mark, inline, options = {}) {
    let toDOM = this.marks[mark.type.name]
    return toDOM && DOMSerializer.renderSpec(doc(options), toDOM(mark, inline))
  }

  // :: (dom.Document, DOMOutputSpec) → {dom: dom.Node, contentDOM: ?dom.Node}
  // Render an [output spec](#model.DOMOutputSpec) to a DOM node. If
  // the spec has a hole (zero) in it, `contentDOM` will point at the
  // node with the hole.
  //
  // > 渲染一个 [output 配置对象](#model.DOMOutputSpec) 到一个 DOM 节点。如果配置对象有一个洞（数字0），
  // 则 `contentDOM` 将会指向该洞所代表的节点。
  static renderSpec(doc, structure, xmlNS = null) {
    if (typeof structure == "string")
      return {dom: doc.createTextNode(structure)}
    if (structure.nodeType != null)
      return {dom: structure}
    let tagName = structure[0], space = tagName.indexOf(" ")
    if (space > 0) {
      xmlNS = tagName.slice(0, space)
      tagName = tagName.slice(space + 1)
    }
    let contentDOM = null, dom = xmlNS ? doc.createElementNS(xmlNS, tagName) : doc.createElement(tagName)
    let attrs = structure[1], start = 1
    if (attrs && typeof attrs == "object" && attrs.nodeType == null && !Array.isArray(attrs)) {
      start = 2
      for (let name in attrs) if (attrs[name] != null) {
        let space = name.indexOf(" ")
        if (space > 0) dom.setAttributeNS(name.slice(0, space), name.slice(space + 1), attrs[name])
        else dom.setAttribute(name, attrs[name])
      }
    }
    for (let i = start; i < structure.length; i++) {
      let child = structure[i]
      if (child === 0) {
        if (i < structure.length - 1 || i > start)
          throw new RangeError("Content hole must be the only child of its parent node")
        return {dom, contentDOM: dom}
      } else {
        let {dom: inner, contentDOM: innerContent} = DOMSerializer.renderSpec(doc, child, xmlNS)
        dom.appendChild(inner)
        if (innerContent) {
          if (contentDOM) throw new RangeError("Multiple content holes")
          contentDOM = innerContent
        }
      }
    }
    return {dom, contentDOM}
  }

  // :: (Schema) → DOMSerializer
  // Build a serializer using the [`toDOM`](#model.NodeSpec.toDOM)
  // properties in a schema's node and mark specs.
  //
  // > 使用 schema 中节点和 mark 配置对象的 [`toDOM`](#model.NodeSpec.toDOM) 方法来构建一个 serializer。
  static fromSchema(schema) {
    return schema.cached.domSerializer ||
      (schema.cached.domSerializer = new DOMSerializer(this.nodesFromSchema(schema), this.marksFromSchema(schema)))
  }

  // : (Schema) → Object<(node: Node) → DOMOutputSpec>
  // Gather the serializers in a schema's node specs into an object.
  // This can be useful as a base to build a custom serializer from.
  //
  // > 将 schema 中节点配置对象中的 serializer 都集中到一个对象中。
  // 对用来以此构建自己的 serializer 很有用。
  static nodesFromSchema(schema) {
    let result = gatherToDOM(schema.nodes)
    if (!result.text) result.text = node => node.text
    return result
  }

  // : (Schema) → Object<(mark: Mark) → DOMOutputSpec>
  // Gather the serializers in a schema's mark specs into an object.
  //
  // > 将 schema 中节点配置对象中的 serializer 都集中到一个对象中。
  static marksFromSchema(schema) {
    return gatherToDOM(schema.marks)
  }
}

function gatherToDOM(obj) {
  let result = {}
  for (let name in obj) {
    let toDOM = obj[name].spec.toDOM
    if (toDOM) result[name] = toDOM
  }
  return result
}

function doc(options) {
  // declare global: window
  return options.document || window.document
}
