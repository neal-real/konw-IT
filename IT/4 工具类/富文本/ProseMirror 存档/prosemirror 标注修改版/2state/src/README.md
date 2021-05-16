This module implements the state object of a ProseMirror editor, along
with the representation of the selection and the plugin abstraction.

>本模块实现了 ProseMirror 编辑器的 state 对象，以及关于选区 selection 和 插件 plugin 的抽象。

### Editor State

ProseMirror keeps all editor state (the things, basically, that would
be required to create an editor just like the current one) in a single
[object](#state.EditorState). That object is updated (creating a new
state) by applying [transactions](#state.Transaction) to it.

>ProseMirror 使用一个单独的大 [对象](#state.EditorState) 来保持对编辑器所有 state 的引用（基本上来说，需要创建一个与当前编辑器相同的编辑器）。
这个对象通过应用一个 [transactions](#state.Transaction) 来更新（即创建一个新的 state）。

. 注 transactions 按惯例在写代码的或者看源码的时候被缩写成 `tr`

@EditorState
@Transaction

### Selection

A ProseMirror selection can be one of several types. This module
defines types for classical [text selections](#state.TextSelection)
(of which cursors are a special case) and [_node_
selections](#state.NodeSelection), where a specific document node is
selected. It is possible to extend the editor with custom selection
types.

>一个 ProseMirror selection 可以是多种不同类型的选区。这个模块定义了一个基础文本选区 [text selections](#state.TextSelection)（当然，光标是其中的一个特殊状态，即 selection 的内容为空）
和节点选区 [_node_ selections](#state.NodeSelection) ，表示一个文档节点被选中。可以通过扩展 selection 父类来实现自定义的 selection 类型。

@Selection
@TextSelection
@NodeSelection
@AllSelection

@SelectionRange
@SelectionBookmark

### Plugin System

To make it easy to package and enable extra editor functionality,
ProseMirror has a plugin system.

>为了让打包和扩展编辑器功能变得更容易，ProseMirror 提供了一个 Plugin 系统。

@PluginSpec
@StateField
@Plugin
@PluginKey
