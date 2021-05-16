import {Fragment} from "./fragment"
import {Slice} from "./replace"
import {Mark} from "./mark"

// ParseOptions:: interface
// These are the options recognized by the
// [`parse`](#model.DOMParser.parse) and
// [`parseSlice`](#model.DOMParser.parseSlice) methods.
//
// > 这是一个被 [`parse`](#model.DOMParser.parse) 和 [`parseSlice`](#model.DOMParser.parseSlice) 方法用到的参数配置对象。
//
//   preserveWhitespace:: ?union<bool, "full">
//   By default, whitespace is collapsed as per HTML's rules. Pass
//   `true` to preserve whitespace, but normalize newlines to
//   spaces, and `"full"` to preserve whitespace entirely.
//
//   > 默认情况下，根据 HTML 的规则，空白符会被折叠起来不显示。传递 `true` 表示保留空白符，但会将换行符表示为空格。
//   `"full"` 表示完全保留所有的空白符。
//
//   findPositions:: ?[{node: dom.Node, offset: number}]
//   When given, the parser will, beside parsing the content,
//   record the document positions of the given DOM positions. It
//   will do so by writing to the objects, adding a `pos` property
//   that holds the document position. DOM positions that are not
//   in the parsed content will not be written to.
//
//   > 如果设置了该参数，则 parser 除了 parsing 内容外，还将记录指定位置 DOM 在文档中相应的位置。
//   它将通过写入对象，添加一个保存文档位置的 `pos` 属性来实现。不在 parsed 内容中的 DOM 的位置将不会被写入。
//
//   from:: ?number
//   The child node index to start parsing from.
//
//   > 从开始 parsing 位置计算的子节点的索引。
//
//   to:: ?number
//   The child node index to stop parsing at.
//
//   > 从结束 parsing 位置计算的子节点的索引。
//
//   topNode:: ?Node
//   By default, the content is parsed into the schema's default
//   [top node type](#model.Schema.topNodeType). You can pass this
//   option to use the type and attributes from a different node
//   as the top container.
//
//   > 默认情况下，内容会被 parsed 到 schema 的默认 [顶级节点](#model.Schema.topNodeType) 中。
//   你可以传递这个选项和 attributes 以使用一个不同的节点作为顶级容器。
//
//   topMatch:: ?ContentMatch
//   Provide the starting content match that content parsed into the
//   top node is matched against.
//
//   > 提供与 parsed 到顶级节点的内容匹配的起始内容匹配。
//
//   context:: ?ResolvedPos
//   A set of additional nodes to count as
//   [context](#model.ParseRule.context) when parsing, above the
//   given [top node](#model.ParseOptions.topNode).
//
//   > 在 parsing 的时候的一个额外的节点集合，其被算作指定 [top node](#model.ParseOptions.topNode) 之上的 [context](#model.ParseRule.context)。

// ParseRule:: interface
// A value that describes how to parse a given DOM node or inline
// style as a ProseMirror node or mark.
//
// > 一个描述了如何 parse 指定 DOM 节点及行内样式成 ProseMirror 节点及 mark 的对象。
//
//   tag:: ?string
//   A CSS selector describing the kind of DOM elements to match. A
//   single rule should have _either_ a `tag` or a `style` property.
//
//   > 一个描述了需要匹配那种 DOM 元素的 CSS 选择器。每个 rule 都应该有一个 `tag` 属性 _或者_ `style` 属性。
//
//   namespace:: ?string
//   The namespace to match. This should be used with `tag`.
//   Nodes are only matched when the namespace matches or this property
//   is null.
//
//   > 需要匹配的命名空间。应该和 `tag` 一起使用。只有命名空间匹配之后或者为 null 表示没有命名空间，才会开始匹配节点。
//
//   style:: ?string
//   A CSS property name to match. When given, this rule matches
//   inline styles that list that property. May also have the form
//   `"property=value"`, in which case the rule only matches if the
//   propery's value exactly matches the given value. (For more
//   complicated filters, use [`getAttrs`](#model.ParseRule.getAttrs)
//   and return false to indicate that the match failed.)
//
//   > 需要匹配的 CSS 属性名。如果指定的话，这个 rule 将会匹配包含该属性的行内样式。
//   也可以是 `"property=value"` 的形式，这种情况下 property 的值完全符合指定值时 rule 才会匹配。
//   （对于更复杂的过滤方式，使用 [`getAttrs`](#model.ParseRule.getAttrs)，然后返回 false 表示匹配失败。）
//
//   priority:: ?number
//   Can be used to change the order in which the parse rules in a
//   schema are tried. Those with higher priority come first. Rules
//   without a priority are counted as having priority 50. This
//   property is only meaningful in a schema—when directly
//   constructing a parser, the order of the rule array is used.
//
//   > 可以使用它来提升 schema 中 parse rule 的优先级顺序。更高优先级的更先被 parse。
//   没有优先级设置的 rule 则被默认设置一个 50 的优先级。该属性只在 schema 中才有意义。
//   而在直接构造一个 parser 的时候使用的是 rule 数组的顺序。
//
//   context:: ?string
//   When given, restricts this rule to only match when the current
//   context—the parent nodes into which the content is being
//   parsed—matches this expression. Should contain one or more node
//   names or node group names followed by single or double slashes.
//   For example `"paragraph/"` means the rule only matches when the
//   parent node is a paragraph, `"blockquote/paragraph/"` restricts
//   it to be in a paragraph that is inside a blockquote, and
//   `"section//"` matches any position inside a section—a double
//   slash matches any sequence of ancestor nodes. To allow multiple
//   different contexts, they can be separated by a pipe (`|`)
//   character, as in `"blockquote/|list_item/"`.
//
//   > 如果设置了该属性，则限制 rule 只匹配指定的上下文表达式，该上下文即为被 parsed 的内容所在的父级节点。
//   应该包含一个或者多个节点名或者节点 group 名，用一个或者两个斜杠结尾。例如 `"paragraph/"` 表示只有当父级节点是段落的时候才会被匹配，
//   `"blockquote/paragraph/"` 限制只有在一个 blockquote 中的一个段落中才会被匹配，`"section//"` 表示匹配在一个 section 中的任何位置--一个双斜线表示匹配
//   任何祖先节点序列。为了允许多个不同的上下文，它们可以用 `|` 分隔，比如 `"blockquote/|list_item/"`。
//
//   node:: ?string
//   The name of the node type to create when this rule matches. Only
//   valid for rules with a `tag` property, not for style rules. Each
//   rule should have one of a `node`, `mark`, or `ignore` property
//   (except when it appears in a [node](#model.NodeSpec.parseDOM) or
//   [mark spec](#model.MarkSpec.parseDOM), in which case the `node`
//   or `mark` property will be derived from its position).
//
//   > 当 rule 匹配的时候，将要创建的节点类型的名字。仅对带有 `tag` 属性的 rules 可用，对样式 rule 无效。
//   每个 rule 应该有 `node`、`mark`、`ignore` 属性的其中一个（除非是当 rule 出现在一个 [node](#model.NodeSpec.parseDOM) 或者
//   [mark spec](#model.MarkSpec.parseDOM) 中时，在这种情况下，`node` 或者 `mark` 属性将会从它的位置推断出来）。
//
//   mark:: ?string
//   The name of the mark type to wrap the matched content in.
//
//   > 包裹匹配内容的 mark 类型的名字。
//
//   ignore:: ?bool
//   When true, ignore content that matches this rule.
//
//   > 如果是 true，则当前 rule 的内容会被忽略。
//
//   closeParent:: ?bool
//   When true, finding an element that matches this rule will close
//   the current node.
//
//   > 如果是 true，则会在寻找匹配该 rule 的元素的时候关闭当前节点。
//
//   skip:: ?bool
//   When true, ignore the node that matches this rule, but do parse
//   its content.
//
//   > 如果是 true，则会忽略匹配当前规则的节点，但是会 parse 它的内容。
//
//   attrs:: ?Object
//   Attributes for the node or mark created by this rule. When
//   `getAttrs` is provided, it takes precedence.
//
//   > 由该 rule 创建的节点或者 mark 的 attributes。如果 `getAttrs` 存在的话，`getAttrs` 优先。
//
//   getAttrs:: ?(union<dom.Node, string>) → ?union<Object, false>
//   A function used to compute the attributes for the node or mark
//   created by this rule. Can also be used to describe further
//   conditions the DOM element or style must match. When it returns
//   `false`, the rule won't match. When it returns null or undefined,
//   that is interpreted as an empty/default set of attributes.
//
//   > 用来计算由当前 rule 新建的节点或者 mark 的 attributes。也可以用来描述进一步 DOM 元素或者行内样式匹配的话需要满足的条件。
//   当它返回 `false`，则 rule 不会匹配。当它返回 null 或者 undefined，则被当成是一个空的/默认的 attributes 集合。
//
//   Called with a DOM Element for `tag` rules, and with a string (the
//   style's value) for `style` rules.
//
//   > 对于 `tag` rule 来说该方法参数是一个 DOM 元素，对于 `style` rule 来说参数是一个字符串（即行内样式的值）
//
//   contentElement:: ?union<string, (dom.Node) → dom.Node>
//   For `tag` rules that produce non-leaf nodes or marks, by default
//   the content of the DOM element is parsed as content of the mark
//   or node. If the child nodes are in a descendent node, this may be
//   a CSS selector string that the parser must use to find the actual
//   content element, or a function that returns the actual content
//   element to the parser.
//
//   > 对于 `tag` rule 来说，其产生一个非叶子节点的 node 或者 marks，默认情况下 DOM 元素的内容被 parsed 作为该 mark 或者
//   节点的内容。如果子节点在一个子孙节点中，则这个可能是一个 CSS 选择器字符串， parser 必须使用它以寻找实际的内容元素，或者是一个函数，
//   为 parser 返回实际的内容元素。
//
//   getContent:: ?(dom.Node, schema: Schema) → Fragment
//   Can be used to override the content of a matched node. When
//   present, instead of parsing the node's child nodes, the result of
//   this function is used.
//
//   > 如果设置了该方法，则会使用函数返回的结果来作为匹配节点的内容，而不是 parsing 节点的子节点。
//
//   preserveWhitespace:: ?union<bool, "full">
//   Controls whether whitespace should be preserved when parsing the
//   content inside the matched element. `false` means whitespace may
//   be collapsed, `true` means that whitespace should be preserved
//   but newlines normalized to spaces, and `"full"` means that
//   newlines should also be preserved.
//
//   > 控制当 parsing 匹配元素的内容的时候，空白符是否应该保留。`false` 表示空白符应该不显示，
//   `true` 表示空白符应该不显示但是换行符会被换成空格，`"full"` 表示换行符也应该被保留。

// ::- A DOM parser represents a strategy for parsing DOM content into
// a ProseMirror document conforming to a given schema. Its behavior
// is defined by an array of [rules](#model.ParseRule).
//
// > 一个为了让 ProseMirror 文档符合指定 schema 的 Parser。它的行为由一个 [rules](#model.ParseRule) 数组定义。
export class DOMParser {
  // :: (Schema, [ParseRule])
  // Create a parser that targets the given schema, using the given
  // parsing rules.
  //
  // > 新建一个针对指定 schema 的 parser，使用指定的 parsing rules。
  constructor(schema, rules) {
    // :: Schema
    // The schema into which the parser parses.
    //
    // > parser 所 parses 的 schema。
    //
    // . 注 解析器所解析的 schema。
    this.schema = schema
    // :: [ParseRule]
    // The set of [parse rules](#model.ParseRule) that the parser
    // uses, in order of precedence.
    //
    // > parser 所使用的 [parse rules](#model.ParseRule)，按顺序优先。
    this.rules = rules
    this.tags = []
    this.styles = []

    rules.forEach(rule => {
      if (rule.tag) this.tags.push(rule)
      else if (rule.style) this.styles.push(rule)
    })

    // Only normalize list elements when lists in the schema can't directly contain themselves
    this.normalizeLists = !this.tags.some(r => {
      if (!/^(ul|ol)\b/.test(r.tag) || !r.node) return false
      let node = schema.nodes[r.node]
      return node.contentMatch.matchType(node)
    })
  }

  // :: (dom.Node, ?ParseOptions) → Node
  // Parse a document from the content of a DOM node.
  //
  // > parse 一个 DOM 节点的内容成一个文档。
  parse(dom, options = {}) {
    let context = new ParseContext(this, options, false)
    context.addAll(dom, null, options.from, options.to)
    return context.finish()
  }

  // :: (dom.Node, ?ParseOptions) → Slice
  // Parses the content of the given DOM node, like
  // [`parse`](#model.DOMParser.parse), and takes the same set of
  // options. But unlike that method, which produces a whole node,
  // this one returns a slice that is open at the sides, meaning that
  // the schema constraints aren't applied to the start of nodes to
  // the left of the input and the end of nodes at the end.
  //
  // > parses 指定的 DOM 节点，与 [`parse`](#model.DOMParser.parse) 类似，接受与之相同的参数。
  // 不过与 parse 方法产生一整个节点不同的是，这个方法返回一个在节点两侧打开的 slice，这意味着 schema
  // 的约束不适用于输入节点左侧节点的开始位置和末尾节点的结束位置。
  //
  // . 注 这表示该方法可能产生一个不受 schema 约束的 node，只是该 node 由于 openStart 和 openEnd 的存在而适合 schema
  // （被 open 剪切掉以适合 schema，但是整体不适合 schema）。
  parseSlice(dom, options = {}) {
    let context = new ParseContext(this, options, true)
    context.addAll(dom, null, options.from, options.to)
    return Slice.maxOpen(context.finish())
  }

  matchTag(dom, context) {
    for (let i = 0; i < this.tags.length; i++) {
      let rule = this.tags[i]
      if (matches(dom, rule.tag) &&
          (rule.namespace === undefined || dom.namespaceURI == rule.namespace) &&
          (!rule.context || context.matchesContext(rule.context))) {
        if (rule.getAttrs) {
          let result = rule.getAttrs(dom)
          if (result === false) continue
          rule.attrs = result
        }
        return rule
      }
    }
  }

  matchStyle(prop, value, context) {
    for (let i = 0; i < this.styles.length; i++) {
      let rule = this.styles[i]
      if (rule.style.indexOf(prop) != 0 ||
          rule.context && !context.matchesContext(rule.context) ||
          // Test that the style string either precisely matches the prop,
          // or has an '=' sign after the prop, followed by the given
          // value.
          rule.style.length > prop.length &&
          (rule.style.charCodeAt(prop.length) != 61 || rule.style.slice(prop.length + 1) != value))
        continue
      if (rule.getAttrs) {
        let result = rule.getAttrs(value)
        if (result === false) continue
        rule.attrs = result
      }
      return rule
    }
  }

  // : (Schema) → [ParseRule]
  static schemaRules(schema) {
    let result = []
    function insert(rule) {
      let priority = rule.priority == null ? 50 : rule.priority, i = 0
      for (; i < result.length; i++) {
        let next = result[i], nextPriority = next.priority == null ? 50 : next.priority
        if (nextPriority < priority) break
      }
      result.splice(i, 0, rule)
    }

    for (let name in schema.marks) {
      let rules = schema.marks[name].spec.parseDOM
      if (rules) rules.forEach(rule => {
        insert(rule = copy(rule))
        rule.mark = name
      })
    }
    for (let name in schema.nodes) {
      let rules = schema.nodes[name].spec.parseDOM
      if (rules) rules.forEach(rule => {
        insert(rule = copy(rule))
        rule.node = name
      })
    }
    return result
  }

  // :: (Schema) → DOMParser
  // Construct a DOM parser using the parsing rules listed in a
  // schema's [node specs](#model.NodeSpec.parseDOM), reordered by
  // [priority](#model.ParseRule.priority).
  //
  // > 用指定的 schema 中的 [node 配置对象](#model.NodeSpec.parseDOM) 中的 parsing rule 来构造一个 DOM parser，
  // 被按 [优先级](#model.ParseRule.priority) 重新排序。
  static fromSchema(schema) {
    return schema.cached.domParser ||
      (schema.cached.domParser = new DOMParser(schema, DOMParser.schemaRules(schema)))
  }
}

// : Object<bool> The block-level tags in HTML5
const blockTags = {
  address: true, article: true, aside: true, blockquote: true, canvas: true,
  dd: true, div: true, dl: true, fieldset: true, figcaption: true, figure: true,
  footer: true, form: true, h1: true, h2: true, h3: true, h4: true, h5: true,
  h6: true, header: true, hgroup: true, hr: true, li: true, noscript: true, ol: true,
  output: true, p: true, pre: true, section: true, table: true, tfoot: true, ul: true
}

// : Object<bool> The tags that we normally ignore.
const ignoreTags = {
  head: true, noscript: true, object: true, script: true, style: true, title: true
}

// : Object<bool> List tags.
const listTags = {ol: true, ul: true}

// Using a bitfield for node context options
const OPT_PRESERVE_WS = 1, OPT_PRESERVE_WS_FULL = 2, OPT_OPEN_LEFT = 4

function wsOptionsFor(preserveWhitespace) {
  return (preserveWhitespace ? OPT_PRESERVE_WS : 0) | (preserveWhitespace === "full" ? OPT_PRESERVE_WS_FULL : 0)
}

class NodeContext {
  constructor(type, attrs, marks, pendingMarks, solid, match, options) {
    this.type = type
    this.attrs = attrs
    this.solid = solid
    this.match = match || (options & OPT_OPEN_LEFT ? null : type.contentMatch)
    this.options = options
    this.content = []
    // Marks applied to this node itself
    this.marks = marks
    // Marks applied to its children
    this.activeMarks = Mark.none
    // Marks that can't apply here, but will be used in children if possible
    this.pendingMarks = pendingMarks
  }

  findWrapping(node) {
    if (!this.match) {
      if (!this.type) return []
      let fill = this.type.contentMatch.fillBefore(Fragment.from(node))
      if (fill) {
        this.match = this.type.contentMatch.matchFragment(fill)
      } else {
        let start = this.type.contentMatch, wrap
        if (wrap = start.findWrapping(node.type)) {
          this.match = start
          return wrap
        } else {
          return null
        }
      }
    }
    return this.match.findWrapping(node.type)
  }

  finish(openEnd) {
    if (!(this.options & OPT_PRESERVE_WS)) { // Strip trailing whitespace
      let last = this.content[this.content.length - 1], m
      if (last && last.isText && (m = /[ \t\r\n\u000c]+$/.exec(last.text))) {
        if (last.text.length == m[0].length) this.content.pop()
        else this.content[this.content.length - 1] = last.withText(last.text.slice(0, last.text.length - m[0].length))
      }
    }
    let content = Fragment.from(this.content)
    if (!openEnd && this.match)
      content = content.append(this.match.fillBefore(Fragment.empty, true))
    return this.type ? this.type.create(this.attrs, content, this.marks) : content
  }

  applyPending(nextType) {
    for (let i = 0, pending = this.pendingMarks; i < pending.length; i++) {
      let mark = pending[i]
      if ((this.type ? this.type.allowsMarkType(mark.type) : markMayApply(mark.type, nextType)) &&
          !mark.isInSet(this.activeMarks)) {
        this.activeMarks = mark.addToSet(this.activeMarks)
        this.pendingMarks = mark.removeFromSet(this.pendingMarks)
      }
    }
  }
}

// TODO: 这一块的代码主要做 DOM parser 的，感觉非常核心，可以重点研究下，另外官方暂时没有暴露出来该对象和方法（用了「:」做注释）

class ParseContext {
  // : (DOMParser, Object)
  constructor(parser, options, open) {
    // : DOMParser The parser we are using.
    this.parser = parser
    // : Object The options passed to this parse.
    this.options = options
    this.isOpen = open
    let topNode = options.topNode, topContext
    let topOptions = wsOptionsFor(options.preserveWhitespace) | (open ? OPT_OPEN_LEFT : 0)
    if (topNode)
      topContext = new NodeContext(topNode.type, topNode.attrs, Mark.none, Mark.none, true,
                                   options.topMatch || topNode.type.contentMatch, topOptions)
    else if (open)
      topContext = new NodeContext(null, null, Mark.none, Mark.none, true, null, topOptions)
    else
      topContext = new NodeContext(parser.schema.topNodeType, null, Mark.none, Mark.none, true, null, topOptions)
    this.nodes = [topContext]
    // : [Mark] The current set of marks
    this.open = 0
    this.find = options.findPositions
    this.needsBlock = false
  }

  get top() {
    return this.nodes[this.open]
  }

  // : (dom.Node)
  // Add a DOM node to the content. Text is inserted as text node,
  // otherwise, the node is passed to `addElement` or, if it has a
  // `style` attribute, `addElementWithStyles`.
  addDOM(dom) {
    if (dom.nodeType == 3) {
      this.addTextNode(dom)
    } else if (dom.nodeType == 1) {
      let style = dom.getAttribute("style")
      let marks = style ? this.readStyles(parseStyles(style)) : null, top = this.top
      if (marks != null) for (let i = 0; i < marks.length; i++) this.addPendingMark(marks[i])
      this.addElement(dom)
      if (marks != null) for (let i = 0; i < marks.length; i++) this.removePendingMark(marks[i], top)
    }
  }

  addTextNode(dom) {
    let value = dom.nodeValue
    let top = this.top
    if ((top.type ? top.type.inlineContent : top.content.length && top.content[0].isInline) || /[^ \t\r\n\u000c]/.test(value)) {
      if (!(top.options & OPT_PRESERVE_WS)) {
        value = value.replace(/[ \t\r\n\u000c]+/g, " ")
        // If this starts with whitespace, and there is no node before it, or
        // a hard break, or a text node that ends with whitespace, strip the
        // leading space.
        if (/^[ \t\r\n\u000c]/.test(value) && this.open == this.nodes.length - 1) {
          let nodeBefore = top.content[top.content.length - 1]
          let domNodeBefore = dom.previousSibling
          if (!nodeBefore ||
              (domNodeBefore && domNodeBefore.nodeName == 'BR') ||
              (nodeBefore.isText && /[ \t\r\n\u000c]$/.test(nodeBefore.text)))
            value = value.slice(1)
        }
      } else if (!(top.options & OPT_PRESERVE_WS_FULL)) {
        value = value.replace(/\r?\n|\r/g, " ")
      }
      if (value) this.insertNode(this.parser.schema.text(value))
      this.findInText(dom)
    } else {
      this.findInside(dom)
    }
  }

  // : (dom.Element)
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(dom) {
    let name = dom.nodeName.toLowerCase()
    if (listTags.hasOwnProperty(name) && this.parser.normalizeLists) normalizeList(dom)
    let rule = (this.options.ruleFromNode && this.options.ruleFromNode(dom)) || this.parser.matchTag(dom, this)
    if (rule ? rule.ignore : ignoreTags.hasOwnProperty(name)) {
      this.findInside(dom)
    } else if (!rule || rule.skip || rule.closeParent) {
      if (rule && rule.closeParent) this.open = Math.max(0, this.open - 1)
      else if (rule && rule.skip.nodeType) dom = rule.skip
      let sync, top = this.top, oldNeedsBlock = this.needsBlock
      if (blockTags.hasOwnProperty(name)) {
        sync = true
        if (!top.type) this.needsBlock = true
      } else if (!dom.firstChild) {
        this.leafFallback(dom)
        return
      }
      this.addAll(dom)
      if (sync) this.sync(top)
      this.needsBlock = oldNeedsBlock
    } else {
      this.addElementByRule(dom, rule)
    }
  }

  // Called for leaf DOM nodes that would otherwise be ignored
  leafFallback(dom) {
    if (dom.nodeName == "BR" && this.top.type && this.top.type.inlineContent)
      this.addTextNode(dom.ownerDocument.createTextNode("\n"))
  }

  // Run any style parser associated with the node's styles. Either
  // return an array of marks, or null to indicate some of the styles
  // had a rule with `ignore` set.
  readStyles(styles) {
    let marks = Mark.none
    for (let i = 0; i < styles.length; i += 2) {
      let rule = this.parser.matchStyle(styles[i], styles[i + 1], this)
      if (!rule) continue
      if (rule.ignore) return null
      marks = this.parser.schema.marks[rule.mark].create(rule.attrs).addToSet(marks)
    }
    return marks
  }

  // : (dom.Element, ParseRule) → bool
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(dom, rule) {
    let sync, nodeType, markType, mark
    if (rule.node) {
      nodeType = this.parser.schema.nodes[rule.node]
      if (!nodeType.isLeaf) {
        sync = this.enter(nodeType, rule.attrs, rule.preserveWhitespace)
      } else if (!this.insertNode(nodeType.create(rule.attrs))) {
        this.leafFallback(dom)
      }
    } else {
      markType = this.parser.schema.marks[rule.mark]
      mark = markType.create(rule.attrs)
      this.addPendingMark(mark)
    }
    let startIn = this.top

    if (nodeType && nodeType.isLeaf) {
      this.findInside(dom)
    } else if (rule.getContent) {
      this.findInside(dom)
      rule.getContent(dom, this.parser.schema).forEach(node => this.insertNode(node))
    } else {
      let contentDOM = rule.contentElement
      if (typeof contentDOM == "string") contentDOM = dom.querySelector(contentDOM)
      else if (typeof contentDOM == "function") contentDOM = contentDOM(dom)
      if (!contentDOM) contentDOM = dom
      this.findAround(dom, contentDOM, true)
      this.addAll(contentDOM, sync)
    }
    if (sync) { this.sync(startIn); this.open-- }
    if (mark) this.removePendingMark(mark, startIn)
  }

  // : (dom.Node, ?NodeBuilder, ?number, ?number)
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(parent, sync, startIndex, endIndex) {
    let index = startIndex || 0
    for (let dom = startIndex ? parent.childNodes[startIndex] : parent.firstChild,
             end = endIndex == null ? null : parent.childNodes[endIndex];
         dom != end; dom = dom.nextSibling, ++index) {
      this.findAtPoint(parent, index)
      this.addDOM(dom)
      if (sync && blockTags.hasOwnProperty(dom.nodeName.toLowerCase()))
        this.sync(sync)
    }
    this.findAtPoint(parent, index)
  }

  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(node) {
    let route, sync
    for (let depth = this.open; depth >= 0; depth--) {
      let cx = this.nodes[depth]
      let found = cx.findWrapping(node)
      if (found && (!route || route.length > found.length)) {
        route = found
        sync = cx
        if (!found.length) break
      }
      if (cx.solid) break
    }
    if (!route) return false
    this.sync(sync)
    for (let i = 0; i < route.length; i++)
      this.enterInner(route[i], null, false)
    return true
  }

  // : (Node) → ?Node
  // Try to insert the given node, adjusting the context when needed.
  insertNode(node) {
    if (node.isInline && this.needsBlock && !this.top.type) {
      let block = this.textblockFromContext()
      if (block) this.enterInner(block)
    }
    if (this.findPlace(node)) {
      this.closeExtra()
      let top = this.top
      top.applyPending(node.type)
      if (top.match) top.match = top.match.matchType(node.type)
      let marks = top.activeMarks
      for (let i = 0; i < node.marks.length; i++)
        if (!top.type || top.type.allowsMarkType(node.marks[i].type))
          marks = node.marks[i].addToSet(marks)
      top.content.push(node.mark(marks))
      return true
    }
    return false
  }

  // : (NodeType, ?Object) → bool
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(type, attrs, preserveWS) {
    let ok = this.findPlace(type.create(attrs))
    if (ok) this.enterInner(type, attrs, true, preserveWS)
    return ok
  }

  // Open a node of the given type
  enterInner(type, attrs, solid, preserveWS) {
    this.closeExtra()
    let top = this.top
    top.applyPending(type)
    top.match = top.match && top.match.matchType(type, attrs)
    let options = preserveWS == null ? top.options & ~OPT_OPEN_LEFT : wsOptionsFor(preserveWS)
    if ((top.options & OPT_OPEN_LEFT) && top.content.length == 0) options |= OPT_OPEN_LEFT
    this.nodes.push(new NodeContext(type, attrs, top.activeMarks, top.pendingMarks, solid, null, options))
    this.open++
  }

  // Make sure all nodes above this.open are finished and added to
  // their parents
  closeExtra(openEnd) {
    let i = this.nodes.length - 1
    if (i > this.open) {
      for (; i > this.open; i--) this.nodes[i - 1].content.push(this.nodes[i].finish(openEnd))
      this.nodes.length = this.open + 1
    }
  }

  finish() {
    this.open = 0
    this.closeExtra(this.isOpen)
    return this.nodes[0].finish(this.isOpen || this.options.topOpen)
  }

  sync(to) {
    for (let i = this.open; i >= 0; i--) if (this.nodes[i] == to) {
      this.open = i
      return
    }
  }

  get currentPos() {
    this.closeExtra()
    let pos = 0
    for (let i = this.open; i >= 0; i--) {
      let content = this.nodes[i].content
      for (let j = content.length - 1; j >= 0; j--)
        pos += content[j].nodeSize
      if (i) pos++
    }
    return pos
  }

  findAtPoint(parent, offset) {
    if (this.find) for (let i = 0; i < this.find.length; i++) {
      if (this.find[i].node == parent && this.find[i].offset == offset)
        this.find[i].pos = this.currentPos
    }
  }

  findInside(parent) {
    if (this.find) for (let i = 0; i < this.find.length; i++) {
      if (this.find[i].pos == null && parent.nodeType == 1 && parent.contains(this.find[i].node))
        this.find[i].pos = this.currentPos
    }
  }

  findAround(parent, content, before) {
    if (parent != content && this.find) for (let i = 0; i < this.find.length; i++) {
      if (this.find[i].pos == null && parent.nodeType == 1 && parent.contains(this.find[i].node)) {
        let pos = content.compareDocumentPosition(this.find[i].node)
        if (pos & (before ? 2 : 4))
          this.find[i].pos = this.currentPos
      }
    }
  }

  findInText(textNode) {
    if (this.find) for (let i = 0; i < this.find.length; i++) {
      if (this.find[i].node == textNode)
        this.find[i].pos = this.currentPos - (textNode.nodeValue.length - this.find[i].offset)
    }
  }

  // : (string) → bool
  // Determines whether the given [context
  // string](#ParseRule.context) matches this context.
  matchesContext(context) {
    if (context.indexOf("|") > -1)
      return context.split(/\s*\|\s*/).some(this.matchesContext, this)

    let parts = context.split("/")
    let option = this.options.context
    let useRoot = !this.isOpen && (!option || option.parent.type == this.nodes[0].type)
    let minDepth = -(option ? option.depth + 1 : 0) + (useRoot ? 0 : 1)
    let match = (i, depth) => {
      for (; i >= 0; i--) {
        let part = parts[i]
        if (part == "") {
          if (i == parts.length - 1 || i == 0) continue
          for (; depth >= minDepth; depth--)
            if (match(i - 1, depth)) return true
          return false
        } else {
          let next = depth > 0 || (depth == 0 && useRoot) ? this.nodes[depth].type
              : option && depth >= minDepth ? option.node(depth - minDepth).type
              : null
          if (!next || (next.name != part && next.groups.indexOf(part) == -1))
            return false
          depth--
        }
      }
      return true
    }
    return match(parts.length - 1, this.open)
  }

  textblockFromContext() {
    let $context = this.options.context
    if ($context) for (let d = $context.depth; d >= 0; d--) {
      let deflt = $context.node(d).contentMatchAt($context.indexAfter(d)).defaultType
      if (deflt && deflt.isTextblock && deflt.defaultAttrs) return deflt
    }
    for (let name in this.parser.schema.nodes) {
      let type = this.parser.schema.nodes[name]
      if (type.isTextblock && type.defaultAttrs) return type
    }
  }

  addPendingMark(mark) {
    this.top.pendingMarks = mark.addToSet(this.top.pendingMarks)
  }

  removePendingMark(mark, upto) {
    for (let depth = this.open; depth >= 0; depth--) {
      let level = this.nodes[depth]
      let found = level.pendingMarks.lastIndexOf(mark)
      if (found > -1) level.pendingMarks = mark.removeFromSet(level.pendingMarks)
      else level.activeMarks = mark.removeFromSet(level.activeMarks)
      if (level == upto) break
    }
  }
}

// Kludge to work around directly nested list nodes produced by some
// tools and allowed by browsers to mean that the nested list is
// actually part of the list item above it.
function normalizeList(dom) {
  for (let child = dom.firstChild, prevItem = null; child; child = child.nextSibling) {
    let name = child.nodeType == 1 ? child.nodeName.toLowerCase() : null
    if (name && listTags.hasOwnProperty(name) && prevItem) {
      prevItem.appendChild(child)
      child = prevItem
    } else if (name == "li") {
      prevItem = child
    } else if (name) {
      prevItem = null
    }
  }
}

// Apply a CSS selector.
function matches(dom, selector) {
  return (dom.matches || dom.msMatchesSelector || dom.webkitMatchesSelector || dom.mozMatchesSelector).call(dom, selector)
}

// : (string) → [string]
// Tokenize a style attribute into property/value pairs.
function parseStyles(style) {
  let re = /\s*([\w-]+)\s*:\s*([^;]+)/g, m, result = []
  while (m = re.exec(style)) result.push(m[1], m[2].trim())
  return result
}

function copy(obj) {
  let copy = {}
  for (let prop in obj) copy[prop] = obj[prop]
  return copy
}

// Used when finding a mark at the top level of a fragment parse.
// Checks whether it would be reasonable to apply a given mark type to
// a given node, by looking at the way the mark occurs in the schema.
function markMayApply(markType, nodeType) {
  let nodes = nodeType.schema.nodes
  for (let name in nodes) {
    let parent = nodes[name]
    if (!parent.allowsMarkType(markType)) continue
    let seen = [], scan = match => {
      seen.push(match)
      for (let i = 0; i < match.edgeCount; i++) {
        let {type, next} = match.edge(i)
        if (type == nodeType) return true
        if (seen.indexOf(next) < 0 && scan(next)) return true
      }
    }
    if (scan(parent.contentMatch)) return true
  }
}
