ProseMirror表模块
该模块定义了一个 schema 扩展，以支持具有rowspan / colspan支持的表

1. 用于在表中自定义选择类
2. 用于管理此类,
3. 在此类表上强制执行不变量的插件
4. 以及许多用于处理表的命令。

## 使用

> 顶级目录包含demo.js和index.html，可以使用和构建该目录
>
> npm run build  以显示有关如何使用模块的简单演示。

## 文档

模块的主文件可您需要所有内容。

第一件事 创建一个 schema 用来启动表格。

那tableNodes是为了：

- tableNodes ( options: Object ) → Object
  该函数将创建表格节点配置对象，table_row，和table_cell 的节点类型通过这个模块使用。在创建 schema 时将这个对象添加到节点集合。

- options: Object
  了解以下选项：

  - tableGroup: ?string
    将一个组名添加到 表格类型节点，类似“block”
  - cellContent: string
    表单元格的内容表达式。
  - cellAttributes: ?Object
    添加额外的属性到单元格中。属性名称的键值对，和以下属性添加到对象中
  - default: any
    属性的默认值。
  - getFromDOM: ?fn(dom.Node) → any
    从DOM节点读取属性值。
  - setDOMAttr: ?fn(value: any, attrs: Object)
    通过一个函数，将值和属性设置到单元格用来渲染 DOM

- tableEditing() → Plugin
  创建一个插件并添加到编辑器，处理基于单元格的复制/粘贴，并确保格式正确（每行宽度相同，并且单元格不重叠）

  您应该将此插件放置在插件数组的末尾，因为它可以广泛地处理表中的鼠标和箭头键事件.

CellSelection类 扩展 Selection类
Selection 表示表的小区选择跨越部分子类。启用插件后，这些将在用户跨单元格选择时创建，并通过为所选单元格提供selectedCellCSS类进行绘制 。

new CellSelection($anchorCell: ResolvedPos, $headCell: ?ResolvedPos = $anchorCell)
表的选择由其锚点和头部单元格标识。赋予此构造函数的位置应指向同一表中的两个单元格之前。他们可能是相同的，以选择单个单元格。

$anchorCell: ResolvedPos
指向锚点单元格前面的解析位置（扩展选择范围时不会移动的位置）。

$headCell: ResolvedPos
指向顶部单元格前面的解析位置（扩展选择范围时，该位置会移动）。

content() → Slice
返回包含所选单元格的表行的矩形切片。

isColSelection() → bool
如果此选择从表的顶部一直到底部，则为true。

isRowSelection() → bool
如果此选择从表的左侧一直到右侧，则为True。

static colSelection($anchorCell: ResolvedPos, $headCell: ?ResolvedPos = $anchorCell) → CellSelection
返回覆盖给定锚点和头单元格的最小列选择。

static rowSelection($anchorCell: ResolvedPos, $headCell: ?ResolvedPos = $anchorCell) → CellSelection
返回覆盖给定锚点和头单元格的最小行选择。

static create(doc: Node, anchorCell: number, headCell: ?number = anchorCell) → CellSelection

指令
以下命令可用于使用户可以使用表编辑功能。

addColumnBefore(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool
在具有所选内容的列之前添加一列的命令。

addColumnAfter(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool
在具有所选内容的列之后添加一列的命令。

deleteColumn(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool
命令功能，用于从表中删除选定的列。

addRowBefore(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool
在选择之前添加表格行。

addRowAfter(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool
选择后添加表格行。

deleteRow(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool
从表中删除选定的行。

mergeCells(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool
将选定的单元格合并为一个单元格。仅在选定单元格的轮廓形成矩形时可用。

splitCell(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool
将选定单元格的行距或列跨度大于1拆分为较小的单元格。将第一个单元格类型用于新单元格。

splitCellWithType(getType: fn({row: number, col: number, node: Node}) → NodeType) → fn(EditorState, dispatch: ?fn(tr: Transaction)) → bool
将选定的单元格（行距或列跨度大于1）拆分为较小的单元格，这些单元格具有由getType函数返回的单元格类型（th，td）。

setCellAttr(name: string, value: any) → fn(EditorState, dispatch: ?fn(tr: Transaction)) → bool
返回一个将给定属性设置为给定值的命令，该命令仅在当前选定的单元格尚未将该属性设置为该值时可用。

toggleHeaderRow(EditorState, dispatch: ?fn(tr: Transaction)) → bool
切换所选行是否包含标题单元格。

toggleHeaderColumn(EditorState, dispatch: ?fn(tr: Transaction)) → bool
切换所选列是否包含标题单元格。

toggleHeaderCell(EditorState, dispatch: ?fn(tr: Transaction)) → bool
切换所选单元格是否为标题单元格。

toggleHeader(type: string, options: ?{useDeprecatedLogic: bool}) → fn(EditorState, dispatch: ?fn(tr: Transaction)) → bool
在行/列标题和普通单元格之间切换（仅适用于第一行/列）。对于不赞成的行为useDeprecatedLogic，请使用true传递选项。

goToNextCell(direction: number) → fn(EditorState, dispatch: ?fn(tr: Transaction)) → bool
返回一个命令，用于选择表中的下一个（方向= 1）或上一个（方向= -1）单元。

deleteTable(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool
删除所选内容周围的表（如果有）。

实用工具
fixTables(state: EditorState, oldState: ?EditorState) → ?Transaction
检查给定状态文档中的所有表，并在必要时返回对其进行修复的事务。如果oldState提供了该属性，则假定该属性保持先前的已知良好状态，该状态将用于避免重新扫描文档的未更改部分。
TableMap类
表映射描述了给定表的结构。为了避免始终重新计算它们，它们将按表节点缓存。为了做到这一点，地图中保存的位置是相对于表格的开始而不是文档的开始。

width: number
表格的宽度

height: number
表格的高度

map: [number]
一个宽度*高度数组，其中单元格的开始位置覆盖每个插槽中表格的该部分

findCell(pos: number) → Rect
在给定位置找到单元的尺寸。

colCount(pos: number) → number
在给定位置找到单元格的左侧。

nextCell(pos: number, axis: string, dir: number) → ?number
从处的单元格开始，按给定方向查找下一个单元格pos。

rectBetween(a: number, b: number) → Rect
获取跨越两个给定单元格的矩形。

cellsInRect(rect: Rect) → [number]
返回给定矩形中具有左上角的所有单元格的位置。

positionAt(row: number, col: number, table: Node) → number
返回给定行和列中的单元格开始的位置，或者如果单元格从那里开始的位置，则将开始的位置。

static get(table: Node) → TableMap
查找给定表节点的表映射。