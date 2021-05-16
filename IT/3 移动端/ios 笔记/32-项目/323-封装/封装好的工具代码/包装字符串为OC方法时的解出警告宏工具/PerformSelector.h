
//------------------------------------------------------------------------------
// 执行SEL
#define performSelector(method) if ([self respondsToSelector:method]) { \
_Pragma("clang diagnostic push") \
_Pragma("clang diagnostic ignored \"-Warc-performSelector-leaks\"") \
[self performSelector:method]; \
_Pragma("clang diagnostic pop") \
}

// 执行带参数的SEL
#define performSelectorWith(method, obj) if ([self respondsToSelector:method]) { \
_Pragma("clang diagnostic push") \
_Pragma("clang diagnostic ignored \"-Warc-performSelector-leaks\"") \
[self performSelector:method withObject:obj]; \
_Pragma("clang diagnostic pop") \
}
