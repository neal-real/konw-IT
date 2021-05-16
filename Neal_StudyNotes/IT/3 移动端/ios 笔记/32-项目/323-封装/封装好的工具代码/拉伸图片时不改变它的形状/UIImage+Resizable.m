//
//  UIImage+Resizable.m
//  QQ聊天练习
//
//  Created by chao on 14-7-31.
//  Copyright (c) 2014年 chao. All rights reserved.
//

#import "UIImage+Resizable.h"

@implementation UIImage (Resizable)
//设置图片的如何拉伸  定好四个边的内边距  只拉伸里面的外面保持原状（实际是外边不变 内部来个平铺图片）
+ (UIImage *)resizableImage:(NSString *)imageName
{
    UIImage *normal = [UIImage imageNamed:imageName];
    CGFloat w = normal.size.width * 0.5;
    CGFloat h = normal.size.height * 0.5;
    return [normal resizableImageWithCapInsets:UIEdgeInsetsMake(h, w, h, w)];
}
@end
