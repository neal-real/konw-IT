//
//  UIImage+LYcircularImage.m
//  01-百思不得姐
//
//  Created by Mac on 15/8/4.
//  Copyright (c) 2015年 FSK. All rights reserved.
//

#import "UIImage+LYcircularImage.h"

@implementation UIImage (LYcircularImage)
- (UIImage *)circlurImage
{
    // 开启图形上下文
    UIGraphicsBeginImageContextWithOptions(self.size, NO, 0.0);
    
    // 获得当前上下文
    CGContextRef ref = UIGraphicsGetCurrentContext();
    
    // 获得一个矩形框来描述圆的大小
    CGRect rect = CGRectMake(0, 0, self.size.width, self.size.height);
    CGContextAddEllipseInRect(ref, rect);
    
    
    // 裁剪
    CGContextClip(ref);
    
    [self drawInRect:rect];
    
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    
    UIGraphicsEndImageContext();
    
    return image;
}
@end
