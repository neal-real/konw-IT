//
//  UIImage+Tools.m
//  涂鸦练习
//
//  Created by chao on 14-8-12.
//  Copyright (c) 2014年 chao. All rights reserved.
//

#import "UIImage+Tools.h"

@implementation UIImage (Tools)
//将指定的视图（view）抓图生成image (截图工具)
+ (UIImage *)captureImageFromView:(UIView *)view
{
    //创建图像上下文
    UIGraphicsBeginImageContextWithOptions(view.bounds.size, NO, 0.0);
    //获得上下文
    CGContextRef ctx = UIGraphicsGetCurrentContext();
    //将视图的内容渲染到上下文中
    [view.layer renderInContext:ctx];
    //从上下文中取出图片
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    //结束上下文
    UIGraphicsEndImageContext();
    return image;
}
@end
