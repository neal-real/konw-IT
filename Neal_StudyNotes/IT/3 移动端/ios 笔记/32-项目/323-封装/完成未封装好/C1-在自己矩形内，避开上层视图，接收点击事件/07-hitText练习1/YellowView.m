//
//  YellowView.m
//  07-hitText练习1
//
//  Created by xiaomage on 15/6/16.
//  Copyright (c) 2015年 xiaomage. All rights reserved.
//

#import "YellowView.h"

@interface YellowView ()

@property (nonatomic, weak) IBOutlet UIButton *btn;

@end

@implementation YellowView

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    // 当前坐标系上的点转换到按钮上的点
    CGPoint btnP = [self convertPoint:point toView:self.btn];
    
    // 判断点在不在按钮上
    if ([self.btn pointInside:btnP withEvent:event]) {
        // 点在按钮上
        return self.btn;
    }else{
        return [super hitTest:point withEvent:event];
    }
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    NSLog(@"%@",self.btn);
    
    NSLog(@"%s",__func__);
}

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

@end
