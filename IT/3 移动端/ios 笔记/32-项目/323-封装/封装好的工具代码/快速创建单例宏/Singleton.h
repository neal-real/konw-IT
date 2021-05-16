
/**
 MRC版本请粘贴以下代码
 
 #if !__has_feature(objc_arc)
 - (oneway void)release {}
 - (id)retain { return _instance; }
 - (id)autorelease { return _instance; }
 - (NSUInteger)retainCount { return UINT_MAX; }
 #endif
 */
// 接口定义
#define singletonInterface(className)          + (instancetype)shared##className;

// 实现定义
// 在定义宏时 \ 可以用来拼接字符串
#define singletonImplementation(className) \
static className *_instance; \
+ (id)allocWithZone:(struct _NSZone *)zone \
{ \
    static dispatch_once_t onceToken; \
    dispatch_once(&onceToken, ^{ \
        _instance = [super allocWithZone:zone]; \
    }); \
    return _instance; \
} \
+ (instancetype)shared##className \
{ \
    static dispatch_once_t onceToken; \
    dispatch_once(&onceToken, ^{ \
        _instance = [[self alloc] init]; \
    }); \
    return _instance; \
} \
- (id)copyWithZone:(NSZone *)zone \
{ \
    return _instance; \
}

// 提示最末尾不要使用反斜线
