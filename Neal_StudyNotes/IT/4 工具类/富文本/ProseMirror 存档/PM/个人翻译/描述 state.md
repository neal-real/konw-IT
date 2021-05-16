

## 描述 state

doc（文档）, selection（选区） 和 storeMarks（标记管理处）. 是组成 描述的必要部分 。

其中插件也保存在描述中，插件可以定义插槽存储自己的描述

### 选区 selection

> 1. 本框架支持多种类型的 selection，并且允许第三方代码定义新的 selection 类型. 扩展选区 以 **Selection** 子类的形式出现.
> 2. 选区对象是不可修改的，改变一个选区就需要一个新的选区对象和一个新的描述
> 3. 选区对象有一些描述位置信息的 api，指向文档
> 4. 选区有不同的选区类型，常见有文本类型，就是起始点和锚点都一样或在同一个节点中时
> 5. 本框架核心库也支持 node selection, 该 selectin 表示一个单独的 node 被选择的时候. 比如, 当你在一个 node 按 ctrl/cmd + click 的时候. 这个类型的 selection range 是该 node 的前面到节点之后的位置.

记录（Transactions）

两种方式

1. 初始化 一个新的描述
2. 根据之前的描述生成一个新的描述

