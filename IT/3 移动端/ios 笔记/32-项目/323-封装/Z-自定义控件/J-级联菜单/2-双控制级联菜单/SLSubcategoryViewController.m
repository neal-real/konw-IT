//
//  SLSubcategoryViewController.m
//  J-级联菜单
//
//  Created by 王世林 on 15/7/7.
//  Copyright (c) 2015年 William. All rights reserved.
//

#import "SLSubcategoryViewController.h"

@interface SLSubcategoryViewController ()
/** 子类别数据 */
@property (nonatomic, strong) NSArray *subcategories;

@end

@implementation SLSubcategoryViewController

static NSString *subcategoryID = @"subcategory";//添加cell的唯一标示


#pragma mark - 系统自动调用方法
- (void)viewDidLoad {
    [super viewDidLoad];
    // 注册cell 唯一标识
    [self.tableView registerClass:[UITableViewCell class] forCellReuseIdentifier:subcategoryID];

}


#pragma mark - <SLCategoryViewControllerDelegate> 实现代理方法获得数据
- (void)categoryViewController:(SLCategoryViewController *)categoryViewController didSelectSubcategories:(NSArray *)subcategories
{
    self.subcategories = subcategories;//向数据数组中添加数据
    
    [self.tableView reloadData];// 刷新全部列表
}
#pragma mark - TableView 数据源方法
#pragma mark 返回有多少行
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.subcategories.count;
}
#pragma mark 每行的cell
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:subcategoryID];//取出标示的cell
    cell.textLabel.text = self.subcategories[indexPath.row]; //添加数据
    return cell;
}

@end
