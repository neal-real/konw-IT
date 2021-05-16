//
//  PopBtn.m
//  08-hitText练习2
//
//  Created by xiaomage on 15/6/16.
//  Copyright (c) 2015年 xiaomage. All rights reserved.
//

#import "PopBtn.h"

@implementation PopBtn

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    
    // 当前控件上的点转换到chatView上
    CGPoint chatP = [self convertPoint:point toView:self.chatView];
    
    // 判断下点在不在chatView上
    if ([self.chatView pointInside:chatP withEvent:event]) {
        return self.chatView;
    }else{
        return [super hitTest:point withEvent:event];
    }
    
    
    
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event
{
    // 获取UITouch
    UITouch *touch = [touches anyObject];
    
    // 获取当前的点
    CGPoint curP = [touch locationInView:self];
    
    // 获取上一个的点
    CGPoint preP = [touch previousLocationInView:self];
    
    // 获取偏移量
    CGFloat offsetX = curP.x - preP.x;
    CGFloat OffsetY = curP.y - preP.y;
    
    // 修改控件的位置
    CGPoint center = self.center;
    center.x += offsetX;
    center.y += OffsetY;
    
    self.center = center;
    
}
@end
