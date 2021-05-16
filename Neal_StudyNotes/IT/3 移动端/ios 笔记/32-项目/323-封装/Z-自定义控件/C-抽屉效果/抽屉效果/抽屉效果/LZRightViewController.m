//
//  LZRightViewController.m
//  抽屉效果
//
//  Created by 王世林 on 15/8/9.
//  Copyright (c) 2015年 William. All rights reserved.
//


#import "LZRightViewController.h"
#import "LZMainViewController.h"
@implementation LZRightViewController
// 设计原理，如果A控制器的view成为B控制器View是子控件，注意A控制器一定要成为B控制器的子控制器
- (void)viewDidLoad {
    [super viewDidLoad];

    
}

-(void)willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
{
//    Implement viewWillTransitionToSize:withTransitionCoordinator: instead
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    
}
@end
