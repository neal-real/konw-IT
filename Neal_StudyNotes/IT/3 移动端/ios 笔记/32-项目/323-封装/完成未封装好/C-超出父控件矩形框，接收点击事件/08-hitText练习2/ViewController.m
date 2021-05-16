//
//  ViewController.m
//  08-hitText练习2
//
//  Created by xiaomage on 15/6/16.
//  Copyright (c) 2015年 xiaomage. All rights reserved.
/*
    创建一个PopBtn按钮，点击这个按钮，在创建一个chatView按钮
    但是因为chatView按钮超出了父控件的范围，所以可以显示但是监听不了点击。
    所以在Popbth按钮的坐标，转换到chatView上的坐标。
    在判断触摸点是否在chatView的矩形框内。如果在就让chatView接收点击事件
    如果不在则依然按照父控件的样式操作。
    换句话说，这里可以设置任何控件为接收事件点击的对象。(无论用户点击那里，只要点击就可以让固定某个视图接收点击事件)
 
 */

#import "ViewController.h"
#import "PopBtn.h"

@interface ViewController ()

@end

@implementation ViewController
- (IBAction)popChatView:(PopBtn *)sender {
    // 弹出对话框
    UIButton *chatView = [UIButton buttonWithType:UIButtonTypeCustom];
    
    chatView.bounds = CGRectMake(0, 0, 200, 200);
    chatView.center = CGPointMake(100, -100);
    
    [chatView setBackgroundImage:[UIImage imageNamed:@"对话框"] forState:UIControlStateNormal];
    [chatView setBackgroundImage:[UIImage imageNamed:@"小孩"] forState:UIControlStateHighlighted];
    sender.chatView = chatView;
    [sender addSubview:chatView];
    
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
