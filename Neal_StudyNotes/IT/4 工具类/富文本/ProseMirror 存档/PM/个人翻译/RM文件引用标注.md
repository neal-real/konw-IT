# ProseMirror 理解表述

> 作者希望有人可以提供一个开箱即用的框架 ，ProseMirror 作为一个乐高积木是非常的好的存在方式。

## 核心

 ProseMirror 是由 4 个核心模块支撑的，任何功能都无法离开这个四个模块。

1. [prosemirror-model](http://prosemirror.net/docs/ref/#model) 定义了编辑器的**文档模型** ，它用来描述编辑器的内容.
2. [prosemirror-transform](http://prosemirror.net/docs/ref/#transform) 包含了一种可以被重做和撤销的修改文档的功能, 它是 prosemirror-state 库的 transaction 功能的基础, 这使得撤销操作历史记录和协同编辑成为可能.
3. [prosemirror-state](http://prosemirror.net/docs/ref/#state) .提供了一个描述编辑器完整状态的单一数据结构, 包括编辑器的选区操作, 和一个用来处理从当前 state(状态))到下一个 state（状态） 的 transaction（事务） 的系统
4. [prosemirror-view](http://prosemirror.net/docs/ref/#view) 用来将给定的 state 展示成相对应的可编辑元素显示在编辑器中, 同时处理用户交互.

>  [基本编辑命令](http://prosemirror.net/docs/ref/#commands), [快捷键绑定](http://prosemirror.net/docs/ref/#keymap), [操作历史记录及回滚](http://prosemirror.net/docs/ref/#history), [宏命令](http://prosemirror.net/docs/ref/#inputrules), [协同编辑](http://prosemirror.net/docs/ref/#collab), 和一个简单的文档 [Schema](http://prosemirror.net/docs/ref/#schema-basic) 等等. 更多模块可以在 Github 上的 Prosemirror [组织](https://github.com/prosemirror/)中发现.

### 1 .prosemirror-model

> 最初的基础框架，仅外部依赖一个作者自己的框架(orderedmap)，用于处理有序映射关系。

~~~js
# 下周 1 从 node.js 中开始
index.js
--- node.js					// 节点文件
    -- {Fragment} from "./fragment"-> {findDiffStart, findDiffEnd} from "./diff"
    -- {Mark} from "./mark" -> {compareDeep} from "./comparedeep"
    -- {Slice, replace} from "./replace" -> {Fragment} from "./fragment"
    -- {ResolvedPos} from "./resolvedpos" -> {Mark} from "./mark"
    -- {compareDeep} from "./comparedeep" -|
--- resolvedpos.js  //解析位置的文件
			-- {Mark} from "./mark"
--- fragment.js			// 处理片段中的节点的位置，追加，比较，替换
			-- {findDiffStart, findDiffEnd} from "./diff"
--- replace.js			//
		-> {Fragment} from "./fragment"
--- mark.js					//
		{compareDeep} from "./comparedeep"
--- schema.js				//
		-- OrderedMap from "orderedmap" // 处理映射关系
		-- {Node, TextNode} from "./node"
		-- {Fragment} from "./fragment"
		-- {Mark} from "./mark"
		-- {ContentMatch} from "./content"
--- content.js			//
		-- {Fragment} from "./fragment"
--- from_dom.js			//
		-- {Fragment} from "./fragment"
		-- {Slice} from "./replace"
		-- {Mark} from "./mark"

--- to_dom.js			; //
		-- 无

/index.js 中没有导出的两个文件

comparedeep.js// 深度比较: 两个对象完全一致返回真，否则返回假
diff.js				// 对比两个对象的差异值，2 个方法，1.从开头，2 从结尾处 最终返回差异的一个数值。没有差异返回 null





~~~















