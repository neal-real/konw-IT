# 描述模块的 API

> 本模块实现了
>
> 1. 编辑器的 state 对象
> 2. 选区对象 selection 的抽象
> 3. 插件对象 plugin 的抽象

## 编辑器描述

### Editor State 对象解释


框架使用 **Editor State 对象** 保持对编辑器所有 **state** 的引用。 

**Editor State 对象**通过 **transactions 类** 来创建新的 **state** 实现更新。

>  注: **transactions** 按惯例在写代码的或者看源码的时候被**缩写成 tr**

### EditorState 类

>  编辑器状态由此对象表示。旧的 state 通过 apply 方法产生新的 state
>
> 一个 state  = 一个持久化的数据结构--它本身并不更新，
>
> state 有很多内建的字段，通过 **plugins（插件）** 来 定义 额外的字段。

### EditorState API

| API 接口：对象                                               | 作用                                                         | 备注                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| doc: Node                                                    | 表示：当前文档                                               |                                                              |
| selection: Selection(此对象在下面)                           | 当前选区                                                     |                                                              |
| storedMarks: Mark                                            | 下一次输入内容要应用的 标记。未赋值，则为 null               |                                                              |
| schema: Schema                                               | 本次描述 需要符合的规则                                      |                                                              |
| plugins:  Plugin                                             | 在当前 描述 中激活的 插件                                    |                                                              |
| **apply**(tr: Transaction) 返回 EditorState                  | 通过把旧描述给予 transaction 生成一个新描述                  |                                                              |
| **applyTransaction**(rootTr: Transaction) <br />返回 {state: EditorState, transactions: [Transaction]} | 应用记录（apply 的复杂版）。返回更加详细的新记录和新的描述   |                                                              |
| tr: Transaction                                              | 从当前 描述 生成一个新的 记录 以对当前 描述 进行修改         | 注: 该 transaction 是一个 getter 函数，每次调用都会 new 一个新的 transaction。 |
| **reconfigure**(config: Object) → EditorState                | 创建新描述，新描述的字段由传入的插件配置。新旧插件中的描述字段重复的部分不变。 旧插件中没有字段将会被丢弃，新字段将会使用插件中描述对象 对象的 init 方法进行初始化后作为新的 描述字段 | 注: 插件配置对象描述接口，其有两个方法，1. init 用来初始化描述；2. apply 决定如何更新 state。此 create 方法对于新增的 plugin 会调用其 state 的 init 方法进行初始化，以生成编辑器的 state |
|                                                              | config: Object                                               | 配置选项                                                     |
|                                                              |                                                              | schema: Schema  ]<br/>新描述使用新规则                       |
|                                                              |                                                              | plugins: ?⁠[Plugin]<br/>新的激活的插件集合。<br />注: plugins 上的 state 构成新的编辑器的 state。 |
| toJSON<br />(pluginFields: ?⁠Object<Plugin> \| string \| number) 返回 对象 | 将 描述 对象序列化成 JSON 对象。<br />想序列化 插件 的 描述的话，则需传包含**属性名-插件的映射关系的对象**<br />该对象的属性名会在返回值结果的对象中。<br />参数也可以是字符串或者数字，这种情况下参数会被忽略，以支持以 JSON.stringify 的方式调用 toString 方法 | 注: 如果想序列化 插件 的 描述，需要 插件 的 描述 对象有提供 toJSON 方法<br />该方法的参数是 plugin 的 key。doc 和 selection 是保留字段，不能作为参数对象的属性名 |
| static create(config: Object) 返回 EditorState               | 创建一个新的 state                                           |                                                              |
|                                                              | config: Object<br/>state 配置选项。必须包含 schema 和 doc （或者两者都有）。<br/> |                                                              |
|                                                              |                                                              | schema: ?⁠Schema<br/>当前编辑器所使用的 schema。<br/><br/>doc: ?⁠Node<br/>初始文档。<br/><br/>selection: ?⁠Selection<br/>文档中可用的选区。<br/><br/>storedMarks: ?⁠[Mark]<br/>stored marks 的初始集合。<br/><br/>plugins: ?⁠[Plugin]<br/>state 中激活的 plugins。 |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |
|                                                              |                                                              |                                                              |










