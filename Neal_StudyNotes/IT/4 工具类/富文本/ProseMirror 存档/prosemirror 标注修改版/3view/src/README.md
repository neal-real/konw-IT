ProseMirror 的 view 模块用来在 DOM 中展示指定的 [编辑器的 state](#state.EditorState)，同时处理用户触发的事件。 

当使用该模块的时候，要首先确认下已经加载了 `style/prosemirror.css` 模块作为样式表。 

@EditorView

### Props

@EditorProps

@DirectEditorProps

@NodeView

### Decorations

装饰器是用来影响文档的展现但是又不实际改变文档内容的一种方式。

（`展现`指的是视图层的东西如对话框等不是用户输入的内容，文档内容是指用户输入的内容--译者注）

@Decoration

@DecorationAttrs

@DecorationSet
