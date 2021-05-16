# 简述

prosemirror不是一个大而全的框架,  它是由无数个小的模块组成，它就像乐高一样是一个堆叠出来的编辑器

它的核心库有:

- `prosemirror-model`: 定义编辑器的文档模型，用来描述编辑器**内容的数据结构**
- `prosemirror-state`: 提供描述编辑器**整个状态的数据结构**，包括**`selection`(选择)**，以及从一个状态到下一个状态的`transaction`(事务)
- `prosemirror-view`: 实现在浏览器中将指定**编辑器状态**显示为**可编辑元素**，并且处理**用户交互**的界面组件
- `prosemirror-transform`: 包括以记录和重放的方式修改文档的功能，这是`state`模块中`transaction`(事务)的基础，并且它使得撤销和协作编辑成为可能。

~~~js
`prosemirror`还提供了许多的模块，
`prosemirror-commands`基本编辑命令，
`prosemirror-keymap`键绑定，
`prosemirror-history`历史记录，
`prosemirror-inputrules`输入宏，
`prosemirror-collab`协作编辑，
`prosemirror-schema-basic`简单文档模式。
~~~



## 简单的 Demo

~~~js
// 从prosemirror-schema-basic引入了一个基本的规则， 在prosemirror结构与HTML的Dom结构之间，需要一次解析与转化，这两者间相互转化的桥梁，就是我们的schema
import {schema} from "prosemirror-schema-basic"
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
// prosemirror要求指定一个文档符合的规则
let state = EditorState.create({ schema })
let view = new EditorView(document.body, { state })


~~~

##  文档结构

> 框架的文档是一个节点树 结构，但是在内联内容上存储方式和传统方式不一样。使用的平面序列

~~~js
<p>This is <strong>strong text with <em>emphasis</em></strong></p>

`HTML`
p //"this is "
 strong //"strong text with "
     em //"emphasis"
`在框架中`
"paragraph(Node)"// "this is "    | "strong text with" | "emphasis"
                   "strong(Mark)"       "strong(Mark)", "em(Mark)"
~~~

### prosemirror的文档的对象结构如下

~~~js
Node:
    type: NodeType //包含了Node的名字与属性等
    content: Fragment //包含多个Node
    attrs: Object //自定义属性，image可以用来存储src等。
    marks: [Mark, Mark...] // 包含一组Mark实例的数组，例如em和strong
Mark:
    type: MarkType //包含Mark的名字与属性等
    attrs: Object //自定义属性
~~~



### prosemirror提供了两种类型的索引

1. 树类型，这个和dom结构相似，你可以利用child或者childCount等方法直接访问到子节点

2. 平坦的标记序列，它将标记序列中的索引作为文档的位置，它们是一种计数约定

~~~html
1. 在整个文档开头，索引位置为0
2. 进入或离开一个不是叶节点的节点记为一个标记
3. 文本节点中的每个节点都算一个标记
4. 没有内容的叶节点(例如image)也算一个标记

例如有一个HTML片段为
0    1  2  3   4     5 
	<p>  O  n  e   </p>
5							 6    7   8   9  10      11     12              13
  <blockquote>   <p>  T   w   o   <img>   </p>   </blockquote>
~~~

































































