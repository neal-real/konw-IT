This module defines ProseMirror's content model, the data structures used to represent and work with documents.

> 这个模块定义了 ProseMirror 的内容模型，它的数据结构被用来表示文档和其内的节点并让它们按预期工作。

### 文件结构
ProseMirror文档是一个树。在每一级，a [node](#model.Node)
描述内容的类型，并保存
[fragment](#model.Fragment) 包含它的子节点

> 一个 ProseMirror 的文档是一个树状结构。在每个层级中，一个 [node](#model.Node)
描述了内容的类型，同时通过 [fragment](#model.Fragment) 来保持对其子节点的引用。

@Node
@Fragment
@Mark
@Slice
@ReplaceError

### 解析位置信息

Positions in a document can be represented as integer
[offsets](/docs/guide/#doc.indexing). But you'll often want to use a
more convenient representation.

> 在文档中的位置可以表示为一个整数的 [offsets](https://xheldon.com/prosemirror-guide-chinese.html#indexing)。不过你经常会想要使用一种更方便表达形式来使用位置信息。

@ResolvedPos
@NodeRange

### rosemirror 的骨架对象, 定义了编辑器的各种规则来约束文档, 有时候你需要手动处理以适应这些规则, 而大部分情况下 Prosemirror 会帮你处理以适应这些规则

Every ProseMirror document conforms to a
[schema](/docs/guide/#schema), which describes the set of nodes and
marks that it is made out of, along with the relations between those,
such as which node may occur as a child node of which other nodes.

> 每个 ProseMirror 文档都符合一个 [schema](https://xheldon.com/prosemirror-guide-chinese.html#schemas) 约束，它描述了节点的集合和 marks，以及它们之间的关系，比如哪些节点可以作为其他节点的子节点等。

@Schema

@SchemaSpec
@NodeSpec
@MarkSpec
@AttributeSpec

@NodeType
@MarkType

@ContentMatch

### DOM 描述 
 
Because representing a document as a tree of DOM nodes is central to
the way ProseMirror operates, DOM [parsing](#model.DOMParser) and
[serializing](#model.DOMSerializer) is integrated with the model.

> 由于用一颗 DOM 节点树来表示一个文档是 ProseMirror 进行各种操作的核心思想，因此 DOM [parsing](#model.DOMParser) 和 [serializing](#model.DOMSerializer) 被集成进该模块中。

(But note that you do _not_ need to have a DOM implementation loaded
to use this module.)

>（不过记住，你 _不需要_ 使用该模块来实现一个 DOM 操作接口。）

@DOMParser
@ParseOptions
@ParseRule

@DOMSerializer
@DOMOutputSpec
