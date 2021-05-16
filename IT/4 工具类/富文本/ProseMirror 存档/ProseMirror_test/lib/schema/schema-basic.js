import { Schema } from "prosemirror-model"

const pDOM = ["p", 0],
  blockquoteDOM = ["blockquote", 0],
  hrDOM = ["hr"],
  preDOM = ["pre", ["code", 0]],
  brDOM = ["br"]

// :: Object
// > 定义在该 schema 中节点们的 配置对象(model.NodeSpec)
export const nodes = {
  // > 文档顶级节点的规范。
  doc: {
    content: "block+"
  },
  // > 普通文本内容在 DOM 中表现为一个 <p> 元素。
  paragraph: {
    content: "inline*",
    group: "block",
    parseDOM: [{ tag: "p" }],
    toDOM() { return pDOM }
  },
  // > 一个引用块（`<blockquote>`）包裹一个或者多个块级节点。
  blockquote: {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{ tag: "blockquote" }],
    toDOM() { return blockquoteDOM }
  },
  // > 水平分隔线（`<hr>`）
  horizontal_rule: {
    group: "block",
    parseDOM: [{ tag: "hr" }],
    toDOM() { return hrDOM }
  },
  // > 标题文本块，带有一个 `level` 属性，该属性的值应该在 1 到 6 的范围。会被格式化和序列化为 `<h1>` 到 `<h6>` 元素。
  heading: {
    attrs: { level: { default: 1 } },
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [
      { tag: "h1", attrs: { level: 1 } },
      { tag: "h2", attrs: { level: 2 } },
      { tag: "h3", attrs: { level: 3 } },
      { tag: "h4", attrs: { level: 4 } },
      { tag: "h5", attrs: { level: 5 } },
    ],
    toDOM(node) { return ["h" + node.attrs.level, 0] }
  },
  // > 代码块。默认情况下不允许 标记 和 非文本行内节点。用`<pre>` 元素包含 `<code>` 元素的 。
  code_block: {
    content: "text*",
    marks: "",
    group: "block",
    code: true,
    defining: true,
    parseDOM: [{ tag: "pre", preserveWhitespace: "full" }],
    toDOM() { return preDOM }
  },
  // > 文本节点。
  text: {
    group: "inline"
  },
  // > 行内图片节点。支持 `src`、`alt` 和 `href` 属性。其中`alt` 和 `href` 属性,默认的值是空字符串。
  image: {
    inline: true,
    attrs: {
      src: {},
      alt: { default: null },
      title: { default: null }
    },
    group: "inline",
    draggable: true,
    parseDOM: [{
      tag: "img[src]", getAttrs(dom) {
        return {
          src: dom.getAttribute("src"),
          title: dom.getAttribute("title"),
          alt: dom.getAttribute("alt")
        }
      }
    }],
    toDOM(node) {
      let { src, alt, title } = node.attrs;
      return [
        "img",
        { src, alt, title }
      ]
    }
  },
  // > 强制换行符，在 DOM 中表示为 `<br>` 元素。
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{ tag: "br" }],
    toDOM() { return brDOM }
  }
}

const emDOM = ["em", 0],
  strongDOM = ["strong", 0],
  codeDOM = ["code", 0],
  subDOM = ["sub", 0],
  supDOM = ["sup", 0],
  delDOM = ["del", 0],
  uDOM = ["u", 0],
  spanBorderDOM = ["span", 0]
// >(#model.MarkSpec) 用户结构中的标记的配置
export const marks = {
  textColor: {
    attrs: {
      color: {default: 1}
    },
    parseDOM: [
      // > 渲染为 `<strong>`
      { tag: "span" },
    ],
    toDOM() {
      return textColorDOM
    }
  },
  // textColorBj: {

  // },
  // fontNumber: {

  // },
  // > 加粗
  strong: {
    parseDOM: [
      // > 渲染为 `<strong>`
      { tag: "strong" },
      // 为了适应于谷歌浏览器的不当行为,粘贴的内容将莫名其妙地包装在`<b>`字体粗细正常的标签。
      { 
        tag: "b",
        getAttrs: node => {
          // ? 当 node.style.fontWeight != "normal" 
          // 第一个条件为false时，就不再判断后面的条件
          // 语义是 当 fontWeight 不是 normal 则为空, 是 normal 则什么都不做
          node.style.fontWeight != "normal" && null 
        }
      },
      { 
        style: "font-weight", 
        // 样式值 是bolder 或者 500-900 成立 则不变,否则为 null
        getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null 
      }
    ],
    toDOM() {
      return strongDOM
    }
  },
  // > 斜体
  em: {
    parseDOM: [
      // 渲染为一个 `<i>`or`<em>`
      { tag: "i" },
      { tag: "em" },
      // 格式化规则同样匹配 `<i>` 同时样式为: `font-style: italic`。
      { style: "font-style=italic" }
    ],
    toDOM() {
      return emDOM
    }
  },

  // > 链接
  link: {
    attrs: {
      // > 有 `href` 和 `title` 属性`title` 默认是空字符串
      href: {},
      title: { default: null }
    },
    inclusive: false,
    parseDOM: [
      {
        // > 渲染和格式化为一个 `<a>` 元素
        tag: "a[href]",
        getAttrs(dom) {
          return {
            href: dom.getAttribute("href"), title: dom.getAttribute("title")
          }
        }
      }
    ],
    toDOM(node) {
      let { href, title } = node.attrs;
      return ["a", { href, title }, 0]
    }
  },
  // > 上标
  sub: {
    parseDOM: [
      // > 渲染为 `<sub>`
      { tag: "sub" }
    ],
    toDOM() {
      return subDOM
    }
  },
  // > 下标
  sup: {
    parseDOM: [
      // > 渲染为 `<sub>`
      { tag: "sup" }
    ],
    toDOM() {
      return supDOM
    }
  },
  // > 文字删除线
  del: {
    parseDOM: [
      // > 渲染为 `<sub>`
      { tag: "del" }
    ],
    toDOM() {
      return delDOM
    }
  },
  // > 文字下划线
  u: {
    parseDOM: [
      // > 渲染为 `<sub>`
      { tag: "u" }
    ],
    toDOM() {
      return uDOM
    }
  },
  // > 行内代码
  code: {
    // > 表现为 `<code>` 元素。
    parseDOM: [{ tag: "code" }],
    toDOM() { return codeDOM }
  },
  // > 行内代码
  spanBorder: {
    // > 表现为 `<code>` 元素。
    parseDOM: [
      { tag: "span" },
      { style: "border=1px slateblue solid" }
    ],
    toDOM() { return spanBorderDOM }
  },
}

// :: Schema
// This schema roughly corresponds to the document schema used by
// [CommonMark](http://commonmark.org/), minus the list elements,
// which are defined in the [`prosemirror-schema-list`](#schema-list)
// module.
//
// > 该 schema 大致对应于 [命令标记](http://commonmark.org/) 使用的文档 schema，减去在 [`prosemirror-schema-list`](#schema-list)
// 模块中定义的里列表元素。
//
//
// > 为了能够从该 结构 中重用元素，在此 扩展和读取 `spec.nodes` 和 `spec.marks` [属性](#model.Schema.spec)。
// 描述一个规则包含了哪些节点,以及标记
export const schema = new Schema({ nodes, marks })
