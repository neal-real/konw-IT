//
//  NSString+TextSize.h
//  QQ聊天练习
//
//  Created by chao on 14-7-31.
//  Copyright (c) 2014年 chao. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSString (TextSize)
- (CGSize)sizeWithFont:(UIFont *)font MaxSize:(CGSize)maxSize;
@end
