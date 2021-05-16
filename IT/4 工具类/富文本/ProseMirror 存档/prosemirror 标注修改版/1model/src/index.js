/**
*  & 文件说明: 模型 做了一下几件事
1. 处理节点,片段,切割片 ,
2. 读取了规则, 节点类型,标记类型
3. 获取了 内容表达式的状态
4. 处理了 PM 文档 与 DOM 文档的解析,根据上面的 节点 ,规则.
*/ 


export {Node} from "./node"                             // > 节点树, 表示 PM 文档的结构 内部就是对节点的 增删改查,对比,判断等

/**
* ResolvedPos 解析位置信息(详见下面的位置计数一节)返回的对象, 包含了一些位置相关的信息.
* > ResolvedPos给一个 resolve 对象的位置,得到位置相关更多信息
* > NodeRange 节点范围
*/ 
export {ResolvedPos, NodeRange} from "./resolvedpos"
export {Fragment} from "./fragment"                     // > 一个 fragment 表示了节点的子节点集合; 内部就是对片段的 增删改查,对比,判断等
export {Slice, ReplaceError} from "./replace"           // 切割片
export {Mark} from "./mark"                             // > 标记的基础处理

export {Schema, NodeType, MarkType} from "./schema"     // 规则,节点类型,标记类型

// > 表示一个节点类型的 内容表达式 的匹配状态
// > 其可以用来寻找是否此处是否有更进一步的内容能够匹配到，以及判断一个位置是否是该节点的可用的结尾
export {ContentMatch} from "./content"
// DOM 节点树转成 PM 文档 需要进行各种操作的核心思想，因此 DOM 解析 和 序列化 被集成进该模块中。
// DOM 解析: 有一个条件数组,影响 DOM 按照指定规则的解析成 PM 文档
export {DOMParser} from "./from_dom"
export {DOMSerializer} from "./to_dom"                  // PM 文档的序列化解析为 DOM
