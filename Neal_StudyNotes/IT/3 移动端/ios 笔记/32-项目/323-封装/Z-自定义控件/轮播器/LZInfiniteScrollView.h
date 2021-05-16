//
//  LZInfiniteScrollView.h
//  好帮手
//
//  Created by Equal on 16/2/22.
//  Copyright © 2016年 wangshilin. All rights reserved.
//  轮播器

#import <UIKit/UIKit.h>

@interface LZInfiniteScrollView : UIView
/* 轮播的图片数组：接收一个存放图片名的数组 */
@property (strong, nonatomic) NSArray *images;
/* 设置当前页颜色 */
@property (weak, nonatomic, readonly) UIPageControl *pageControl;
/* 设置滚动方向 YES 是垂直方向，默认是NO水平方向 */
@property (assign, nonatomic, getter=isScrollDirectionPortrait) BOOL scrollDirectionPortrait;
@end
