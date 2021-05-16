//
//  UIImage+MJ.h
//  05-屏幕截图
//
//  Created by apple on 14-4-14.
//  Copyright (c) 2014年 itcast. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIImage (MJ)
/** 传入一个VIew 就把这个View 截图*/
+ (instancetype)captureWithView:(UIView *)view;
@end
