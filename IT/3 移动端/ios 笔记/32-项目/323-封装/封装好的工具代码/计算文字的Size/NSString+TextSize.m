//
//  NSString+TextSize.m
//  QQ聊天练习
//
//  Created by chao on 14-7-31.
//  Copyright (c) 2014年 chao. All rights reserved.
//

#import "NSString+TextSize.h"

@implementation NSString (TextSize)
//计算文本文字的矩形的尺寸
- (CGSize)sizeWithFont:(UIFont *)font MaxSize:(CGSize)maxSize
{
    //传入一个字体（大小号）保存到字典
    NSDictionary *attrs = @{NSFontAttributeName : font};
    //maxSize定义他的最大尺寸   当实际比定义的小会返回实际的尺寸，如果实际比定义的大会返回定义的尺寸超出的会剪掉，所以一般要设一个无限大 MAXFLOAT
    return [self boundingRectWithSize:maxSize options:NSStringDrawingUsesLineFragmentOrigin attributes:attrs context:nil].size;
}
@end
