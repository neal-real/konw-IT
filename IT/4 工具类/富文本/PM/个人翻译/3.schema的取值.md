# 规则取值

## 节点规则取值



#### 节点类型：

| 类型            | 作用                                                         | 值            |
| --------------- | ------------------------------------------------------------ | ------------- |
| doc             | 文档顶级节点                                                 | NodeSpec 对象 |
| paragraph       | 普通段落文本块。在 DOM 中表现为一个 <p> 元素。               | NodeSpec 对象 |
| blockquote      | 一个引用块（<blockquote>）包裹一个或者多个块级节点           | NodeSpec 对象 |
| horizontal_rule | 水平分隔线（<hr>）                                           | NodeSpec 对象 |
| heading         | 标题文本块，带有一个 level 属性，该属性的值应该在 1 到 6 的范围。会被格式化和序列化为 <h1> 到 <h6> 元素 | NodeSpec 对象 |
| code_block      | 代码块。默认情况下不允许 marks 和非文本行内节点。表现为一个包裹着 <code> 元素的 <pre> 元素 | NodeSpec 对象 |
| text            | 文本节点                                                     | NodeSpec 对象 |
| image           | 行内图片节点。支持 src、alt 和 href 属性。后两者默认的值是空字符串 | NodeSpec 对象 |
| hard_break      | 强制换行符，在 DOM 中表示为 <br/> 元素                       | NodeSpec 对象 |





#### NodeSpec 对象



| 参数：参数值类型                       | 作用                                                         | 备注                                                         |
| -------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| content:string                         | 当前节点的内容表达式,指定子节点可以使用哪些类型的节点。      | 值为 null ，则该节点不允许任何内容                           |
| marks:string                           | 当前节点允许的**标记**类型。值是**标记**的名字或者 **group** 名。 "_"：允许所有的标记， "" 禁止所有的标记 | 没有设置该字段，则节点的**内联内容**，默认允许所有的**标记**， 其他不含内联内容的节点将默认不允许所有的**标记** |
| group:string                           | 当前节点所属的 group，可以多个，用空格分隔，可以指向当前**规则**的内容表达式 |                                                              |
| inline: bool                           | 对于内联节点，应该被设置为 true                              | 文本节点隐式的被设置为 true                                  |
| atom: bool                             | 可以被设置为 true，以表示即使当前节点不是一个叶节点，但是其也没有直接可编辑内容， 因此在 view 中应该被当成是一个独立的单位对待。 | 注: 「独立单位对待」指的是，如在计数上，应该是 1；在事件上，内部元素触发的事件应该被视作是该节点触发的，等。 |
| attrs: AttributeSpec                   | 当前节点拿到的 attributes(属性)                              | AttributeSpec 是属性配置对象, 用来定义节点或者标记属性       |
| selectable: ⁠bool                       | 控制当前类型的节点是否能够被作为 **[节点选区][node selection]** 所选中。 对于非文本节点来说，默认是 true。 |                                                              |
| draggable: bool                        | 决定在未选中的情况下，当前类型的节点能否被拖拽。             | 默认是 false                                                 |
| code: bool                             | 指示当前节点包含 code，其会引起一些命令有特别的行为。        | 注: 「特别的行为」如，在 code 节点中的内容如果是 li 和 文档中的 li 是两个处理逻辑，前者针对 code 块处理；后者针对 li 进行处理。 |
| defining: ⁠bool                         | 决定当前节点是否在替换操作中被认为是一个重要的父级节点（如粘贴操作）。当节点的内容被整个替换掉的时候， 若该节点的 defining 为 false（默认），则其会被移除，但是 defining 为 true 的节点会保留，然后包裹住替换进来的内容。 同样地，对于 插入的 内容，那些有着 defining 为 true 的父级节点会被尽可能的保留。一般来说，非默认段落的文本块节点类型及 li 元素，defining 应该是 true。 | 注: 最后一句话讲的是，例如，默认的 paragraph 中，文本块节点，粘贴的时候应该直接替换掉它的父节点，也即另一个文本块。 但是对非默认 paragraph（即你自己定制的 paragraph）的话，在替换内容的时候，就需要保留该 非默认 paragraph 的一些属性，不能直接替换。同理 li 元素， 因为首先选中 li 元素内容，然后粘贴内容是一个很常见的操作，用户的预期是将粘贴内容作为 li 的内容，而不是直接替换掉 li 而粘贴成 paragraph（或其他 block）。 |
| isolating: ⁠bool                        | 当该属性设置为 true 时（默认是 false），当前类型的节点的两侧将会计算作为边界，于是对于正常的编辑操作如删除、或者提升，将不会被跨越过去。 举个例子，对于 table 的 cell 节点，该属性应该被设置为 true。 | 注: 「提升」操作指的是，如在一个二级 li 中，一般用户习惯下，按 shift + tab 会将该二级 li 提升到一级 li。<br/>注: 「跨越」指的是，操作会跨过当前节点到达下一个（或者上一个）节点。如删除操作，在段落起始位置继续按删除键，光标会跑到上一个节点的尾部； 在 li 起始位置按删除键，光标会跑到上一个 li 结尾处或者直接删除整个 ul/ol；但是在 table 的 td 中，在 td 起始位置按删除键跑到上一个 td 结尾， 显然不是预期。 |
| toDOM: ⁠fn(node: Node) → DOMOutputSpec  | 定义当前节点的默认序列化成 DOM/HTML 的方式（被DOMSerializer.fromSchema使用）。 应该返回一个 DOM 节点或者一个描述 ODM 节点的 array structure，它带有可选的数字 0 （就是「洞」）， 表示节点的内容应该被插在哪个位置。 | 对于文本节点，默认是创建一个文本 DOM 节点。虽然创建序列化器以将文本节点特殊渲染是可能的，但是当前编辑器并不支持这样做，因此你不应该覆盖文本节点中的该方法。 |
| parseDOM: ⁠ParseRule                    | 当前节点相关的 DOM parser 信息，会被 DOMParser.fromSchema 使用以自动的衍生出一个 parser。Rule 中的 node 字段是隐式的（节点的名字会自动填充）。如果你在此处提供了自己的 parser，那你就不需要再在 schema 配置的时候提供 parser 了 | 注: 配置 Editor view 的时候可以配置一个 Parser 和 Serializer，如果提供，则此处就不用写 parseDOM 了。<br />Parser： 解析器<br />Serializer : 序列化程序 |
| toDebugString: ⁠fn(node: Node) → string | 定义一个该类型节点被序列化成一个字符串形式的默认方法，以做 debugging 用途 | debugging: 调试                                              |









##### DOM 输出规范：DOMOutputSpec

###### 作用：

一个 DOM 结构的描述。既可以是一个字符串，用来表示一个文本节点，也可以是一个 DOM 节点，表示它自身，亦或者是一个数组。

这个数组描述了一个 DOM 元素。数组中的第一个值应该是这个 DOM 元素名字字符串，可以允许带上命名空间 URL 的前缀或者空格。 如果数组第二个值是一个普通对象，则被当做是 DOM 元素的 attributes。在数组第二个值之后的任何值（包括第二个值，如果它不是一个普通属性对象的话） 都被认为是该 DOM 元素的子元素，因此这些后面的值必须是有一个有效的 DOMOutputSpec 值，或者是数字 0。

数字 0（念做「洞」）被用来指示子元素应该被放置的位置。如果子元素是一个会被放置内容的节点，那么 0 应该是它唯一子元素。

> 注: 举个例子： ['div', {style:'color:red'}, 0]，表示的是 <div style="color:red">子元素<div>; 
>
> ['div', {style:'color:red'}, ['p', 0]]，表示的是 <div style="color:red"><p>子元素</p><div>;
>
> ['div', {style:'color:red'}, ['p'], 0] 非法，因为 0 作为一个放置子元素的容器，其并不是父节点 div 的唯一子元素，父节点还有个子元素是 p。









## 标记规则

| 类型             | 作用                                                         | 备注                                                         |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| link: MarkSpec   | 链接。有 href 和 title 属性。title 默认是空字符串。会被渲染和格式化为一个 <a> 元素。 |                                                              |
| em: MarkSpec     | 强调。渲染为一个 <em> 元素，格式化规则同样匹配 <i> 和 font-style: italic | 注: 这里可能是 em 加粗，或者 i/font-style: italic 斜体。<br/><br/>注: 「font-style: italic」写法中，样式名的冒号后面的空格要保持统一，要么都有，要么都无。 |
| strong: MarkSpec | 加粗。渲染为 <strong>，格式化规则同样匹配 <b> 和 font-weight: bold。 |                                                              |
| code: MarkSpec   | 行内代码。表现为 <code> 元素。                               |                                                              |

MarkSpec interface
attrs: ?⁠Object<AttributeSpec>
当前 mark 类型拿到的 attributes。

inclusive: ?⁠bool
当光标放到该 mark 的结尾处（或者如果该 mark 开始处同样是父级节点的开始处时，放到 mark 的开始处）时，该 marks 是否应该被激活。默认是 true/

注: 「被激活」的意思是，可以通过 API 获取光标所在的 resolvedPos 信息以查到相关的 marks，对用户来说被激活意味着在该地方输入内容会带上相应的 marks。

excludes: ?⁠string
决定当前 mark 是否能和其他 marks 共存。应该是由其他 marks 名或者 marks group 组成的以空格分隔的字符串。 当一个 marks 被 added 到一个集合中时，所有的与此 marks 排斥（excludes）的 marks 将会被在添加过程中移除。 如果当前集合包含任何排斥当前的新 mark 的 mark，但是该新 mark 却不排斥它，则当前新的 mark 不会被添加到集合中。你可以使用 "_" 来表明当前 marks 排斥所有的 schema 中的其他 marks。

注: 该段的主要意思是，第一：假设 A 、B 互斥，则 无论 A 添加到包含 B 的集合，还是 B 添加到 包含 A 的集合，已经在集合中的一方会被移除以添加新的 mark； 第二：若假设 A 排斥 B，B 却不排斥 A，则将 B 添加到包含 A 的集合中去的时候，将不会被添加进去。

默认是相同类型的 marks 会互斥。你可以将其设置为一个空的字符串（或者任何不包含 mark 自身名字的字符串） 以允许给定相同类型的多个 marks 共存（之哟啊他们有不同的 attributes）。

group: ?⁠string
当前 mark 所属的 一个 group 或者空格分隔的多个 groups。

spanning: ?⁠bool
决定当序列化为 DOM/HTML 的时候，当前类型的 marks 能否应用到相邻的多个节点上去。默认是 true。

toDOM: ?⁠fn(mark: Mark, inline: bool) → DOMOutputSpec
定义当前类型的 marks 序列化为 DOM/HTML 的默认方式。如果结果配置对象包含一个「洞」，则洞的位置就是 mark 内容所在的位置。否则，它会被附加到顶级节点之后。

注: 「否则，它会被附加到顶级节点之后」字面意思吗？有待实验，本人貌似没有印象了。

parseDOM: ?⁠[ParseRule]
当前 mark 的相关的 DOM parser 信息（具体请查看相应的 node spec field）。 在 Rules 中的 mark 字段是隐式的。