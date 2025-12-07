## UPROPERTY
- `UPROPERTY` 宏支持**任意数量的说明符**，包括**0 个**。
    
- 说明符用于控制属性在**编辑器、蓝图、序列化、网络**等方面的行为。
    
- 除了基本说明符，还可以通过 `meta` 添加**元数据说明符**来扩展功能
```cpp
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Stats", meta=(ClampMin="0", ClampMax="100"))
int32 Health;
```
### UPROPERTY常见说明符（Specifier）分类：

#### ✅ 编辑可见性类

- `EditAnywhere`：可在编辑器中任意位置编辑。
- `EditDefaultsOnly`：只能在蓝图默认值中编辑。
- `EditInstanceOnly`：只能在实例中编辑。
- `VisibleAnywhere`：可见但不可编辑。
- `VisibleDefaultsOnly` / `VisibleInstanceOnly`：限定可见范围。
#### ✅ 蓝图访问类
- `BlueprintReadOnly`：蓝图中只读。
- `BlueprintReadWrite`：蓝图中可读写。
- `BlueprintAssignable`：用于多播委托，可在蓝图中绑定事件。
- `BlueprintCallable`：用于多播委托，可在蓝图中调用。
##### ✅ 分类与元数据
- `Category="Name"`：在编辑器中分类显示。
- `meta=(DisplayName="名字", Tooltip="提示")`：自定义显示名称与提示信息。
#### ✅ 序列化与配置
- `SaveGame`：支持存档系统。
- `Config`：支持从配置文件中读取。
- `Transient`：不序列化，临时变量。
#### ✅ 网络相关
- `Replicated`：支持网络同步。
- `ReplicatedUsing=FunctionName`：同步时调用指定函数。
- `NotReplicated`：不支持同步。