//
//  SLCategoryViewController.h
//  J-级联菜单
//
//  Created by 王世林 on 15/7/7.
//  Copyright (c) 2015年 William. All rights reserved.
//

#import <UIKit/UIKit.h>
@class SLCategoryViewController;

@protocol SLCategoryViewControllerDelegate <NSObject>

@optional
/** 该代理方法传送数据*/
- (void)categoryViewController:(SLCategoryViewController *)categoryViewController didSelectSubcategories:(NSArray *)subcategories;
@end


@interface SLCategoryViewController : UITableViewController
/** 代理属性*/
@property (nonatomic, weak) id<SLCategoryViewControllerDelegate> delegate;

@end
