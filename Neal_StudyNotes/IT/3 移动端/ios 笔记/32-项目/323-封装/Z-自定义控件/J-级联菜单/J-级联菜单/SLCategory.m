//
//  SLCategory.m
//  J-级联菜单
//
//  Created by 王世林 on 15/7/7.
//  Copyright (c) 2015年 William. All rights reserved.
//

#import "SLCategory.h"

@implementation SLCategory


+ (instancetype)categoryWithDict:(NSDictionary *)dict
{
    SLCategory *c = [[self alloc] init];
    [c setValuesForKeysWithDictionary:dict];
    return c;
}
@end
