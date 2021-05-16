
// 记录
export {Transform, TransformError} from "./transform"
// 操作
export {Step, StepResult} from "./step"
// 链接,是否可以加入,分割,插入点,提升目标,发现包装
export {joinPoint, canJoin, canSplit, insertPoint, dropPoint, liftTarget, findWrapping} from "./structure"
// 设置 映射
export {StepMap, MapResult, Mapping} from "./map"
// 标记的添加,删除 操作
export {AddMarkStep, RemoveMarkStep} from "./mark_step"

export {ReplaceStep, ReplaceAroundStep} from "./replace_step"

import "./mark"
// 替换
export {replaceStep} from "./replace"
