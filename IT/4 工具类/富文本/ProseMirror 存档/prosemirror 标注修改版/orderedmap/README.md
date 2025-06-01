# OrderedMap

持久性数据结构，表示从字符串到值的有序映射，并带有一些方便的更新方法。

对于大型地图来说，这不是一个有效的数据结构，而只是一种清晰的创建和管理小型地图的最小助手，这种方式可以使它们的关键顺序明确且易于考虑。

## 参考

从该模块导出的值是class `OrderedMap`，其实例表示从字符串到任意值的映射。

**`OrderedMap.from`**`(value: ?Object | OrderedMap) → OrderedMap`
返回具有指定内容的地图。如果为null，则创建一个空的地图。如果给出了有序地图，则返回该地图本身。如果提供了一个对象，请从该对象的属性创建一个映射。

### 方法

的实例`OrderedMap`具有以下方法和属性：

**`get`**`(key: string) → ?any`
检索存储在下的值`key`，或者当不存在这样的键时返回undefined。

**`update`**`(key: string, value: any, newKey: ?string) → OrderedMap`
通过用`key`新值替换的值或在地图末尾添加绑定来创建新地图。如果`newKey`给出，则绑定的键将替换为该键。

**`remove`**`(key: string) → OrderedMap`
返回移除了指定键的地图（如果存在）。

**`addToStart`**`(key: string, value: any) → OrderedMap`
将新密钥添加到地图的开始。

**`addToEnd`**`(key: string, value: any) → OrderedMap`
将新密钥添加到地图的末尾。

**`addBefore`**`(place: string, key: value: string, value: any) → OrderedMap`
在指定密钥之后添加密钥。如果`place`未找到，则将新密钥添加到末尾。

**`forEach`**`(f: (key: string, value: any))`
按顺序为映射中的每个键/值对调用指定的函数。

**`prepend`**`(map: Object | OrderedMap) → OrderedMap`
通过在地图中添加未出现在`map`其中的键之前的键来创建新地图`map`。

**`append`**`(map: Object | OrderedMap) → OrderedMap`
通过在此地图中附加键`map`后未出现的键来创建新地图`map`。

**`subtract`**`(map: Object | OrderedMap) → OrderedMap`
创建一个地图，其中包含该地图中所有未出现的键`map`。

**`size`**`: number`
此映射中的键数。