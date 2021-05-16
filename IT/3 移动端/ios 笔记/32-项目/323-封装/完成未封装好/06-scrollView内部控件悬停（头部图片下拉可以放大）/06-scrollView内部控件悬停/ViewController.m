//
//  ViewController.m
//  06-scrollView内部控件悬停
//
//  Created by xiaomage on 15/7/6.
//  Copyright (c) 2015年 小码哥. All rights reserved.
//

#import "ViewController.h"

@interface ViewController () <UIScrollViewDelegate>
@property (weak, nonatomic) IBOutlet UIView *redView;
@property (weak, nonatomic) IBOutlet UIImageView *imageView;
@property (weak, nonatomic) IBOutlet UIView *blueView;
@property (weak, nonatomic) IBOutlet UIScrollView *scrollView;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.scrollView.contentSize = CGSizeMake(0, CGRectGetMaxY(self.blueView.frame));
}

#pragma mark - <UIScrollViewDelegate>
- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    CGFloat imageH = self.imageView.frame.size.height;
    CGFloat offsetY = scrollView.contentOffset.y;
    if (offsetY >= imageH) {
        // 将红色控件添加到控制器的view中，设置Y值为0
        CGRect redF = self.redView.frame;
        redF.origin.y = 0;
        self.redView.frame = redF;
        [self.view addSubview:self.redView];
    } else {
        // 将红色控件添加到scrollView中，设置Y值为图片的高度
        CGRect redF = self.redView.frame;
        redF.origin.y = 140;
        self.redView.frame = redF;
        [self.scrollView addSubview:self.redView];
    }
    
//    if (offsetY < 0) {
//        CGFloat scale = 1 - (offsetY / 70);
//        self.imageView.transform = CGAffineTransformMakeScale(scale, scale);
//    }
    
    CGFloat scale = 1 - (offsetY / 70);
    scale = (scale >= 1) ? scale : 1;
    self.imageView.transform = CGAffineTransformMakeScale(scale, scale);
}

@end
