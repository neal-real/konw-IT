//
//  UIImage+Tools.h
//  涂鸦练习
//
//  Created by chao on 14-8-12.
//  Copyright (c) 2014年 chao. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIImage (Tools)
//将指定的视图（view）抓图生成image (截图工具)
+ (UIImage *)captureImageFromView:(UIView *)view;
@end
