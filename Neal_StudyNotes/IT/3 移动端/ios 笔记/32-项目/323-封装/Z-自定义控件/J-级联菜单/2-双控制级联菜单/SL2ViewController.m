//
//  SL2ViewController.m
//  J-级联菜单
//
//  Created by 王世林 on 15/7/7.
//  Copyright (c) 2015年 William. All rights reserved.
//

#import "SL2ViewController.h"
#import "SLCategoryViewController.h"
#import "SLSubcategoryViewController.h"
@interface SL2ViewController ()

@end

@implementation SL2ViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    CGFloat width = self.view.frame.size.width * 0.5;
    CGFloat height = self.view.frame.size.height;
    
    SLSubcategoryViewController *subcategoryVc = [[SLSubcategoryViewController alloc] init];
    subcategoryVc.view.frame = CGRectMake(width, 0, width, height);
    [self addChildViewController:subcategoryVc];
    [self.view addSubview:subcategoryVc.view];
    
    SLCategoryViewController *categoryVc = [[SLCategoryViewController alloc] init];
    categoryVc.delegate = subcategoryVc;
    categoryVc.view.frame = CGRectMake(0, 0, width, height);
    [self addChildViewController:categoryVc];
    [self.view addSubview:categoryVc.view];
}

@end
