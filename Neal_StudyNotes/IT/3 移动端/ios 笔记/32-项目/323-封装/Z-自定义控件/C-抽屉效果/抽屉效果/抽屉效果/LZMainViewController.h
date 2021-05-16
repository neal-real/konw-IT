//
//  LZMainViewController.h
//  抽屉效果
//
//  Created by 王世林 on 15/8/9.
//  Copyright (c) 2015年 William. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface LZMainViewController : UIViewController

// 设计原理：如果需要把控件暴露出去，一定要要写readonly
@property (nonatomic, weak, readonly) UIView *mainV;
@property (nonatomic, weak, readonly) UIView *leftV;
@property (nonatomic, weak, readonly) UIView *rightV;

@end
