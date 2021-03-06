//
//  SLCategory.h
//  J-级联菜单
//
//  Created by 王世林 on 15/7/7.
//  Copyright (c) 2015年 William. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface SLCategory : NSObject
/** 子类别 */
@property (nonatomic, strong) NSArray *subcategories;
/** 姓名 */
@property (nonatomic, strong) NSString *name;
/** 图标 */
@property (nonatomic, strong) NSString *icon;
/** 高亮图标 */
@property (nonatomic, strong) NSString *highlighted_icon;

+ (instancetype)categoryWithDict:(NSDictionary *)dict;
@end
