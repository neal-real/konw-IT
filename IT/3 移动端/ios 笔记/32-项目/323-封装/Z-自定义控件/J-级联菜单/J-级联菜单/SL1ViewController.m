//
//  SL1ViewController.m
//  J-级联菜单
//
//  Created by 王世林 on 15/7/7.
//  Copyright (c) 2015年 William. All rights reserved.
//

#import "SL1ViewController.h"
#import "SLCategory.h"
@interface SL1ViewController ()<UITableViewDataSource, UITableViewDelegate>
/** 左边表格 */
@property (weak, nonatomic) IBOutlet UITableView *categoryTableView;
/** 右边表格 */
@property (weak, nonatomic) IBOutlet UITableView *subcategoryTableView;
/** 所有的类别数据 */
@property (nonatomic, strong) NSArray *categories;
@end

@implementation SL1ViewController
#pragma mark - 懒加载
- (NSArray *)categories
{
    if (_categories == nil) {
        NSArray *dictArray = [NSArray arrayWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"categories" ofType:@"plist"]];
        
        NSMutableArray *categoryArray = [NSMutableArray array];
        for (NSDictionary *dict in dictArray) {
            [categoryArray addObject:[SLCategory categoryWithDict:dict]];
        }
        _categories = categoryArray;
    }
    return _categories;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // 默认选中左边表格的第0行
    [self.categoryTableView selectRowAtIndexPath:[NSIndexPath indexPathForRow:0 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionTop];
    self.automaticallyAdjustsScrollViewInsets = NO;
   

}

#pragma mark - TableView 数据源方法
#pragma mark 显示多少行
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    // 左边表格
    if (tableView == self.categoryTableView) return self.categories.count;
    
    //右边表格
    SLCategory *c = self.categories[self.categoryTableView.indexPathForSelectedRow.row];
    return c.subcategories.count;
}
#pragma mark 每行显示的内容
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    // 左边表格
    if (tableView == self.categoryTableView) {
        static NSString *ID = @"category";
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:ID];
        
        SLCategory *c = self.categories[indexPath.row];
        
        // 设置普通图片
        cell.imageView.image = [UIImage imageNamed:c.icon];
        // 设置高亮图片（cell选中 -> cell.imageView.highlighted = YES -> cell.imageView显示highlightedImage这个图片）
        cell.imageView.highlightedImage = [UIImage imageNamed:c.highlighted_icon];
        
        cell.textLabel.highlightedTextColor = [UIColor redColor];   // 设置label高亮时的文字颜色
        cell.textLabel.text = c.name;                               //每行显示的文字
        cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;//右边的小图标
        
        return cell;
    } else {
        // 右边表格
        static NSString *ID = @"subcategory";
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:ID];
        
        // 获得左边表格被选中的模型
        SLCategory *c = self.categories[self.categoryTableView.indexPathForSelectedRow.row];
        cell.textLabel.text = c.subcategories[indexPath.row];//显示的文字内容
        
        return cell;
    }
}

#pragma mark - <UITableViewDelegate>
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (tableView == self.categoryTableView) {
        [self.subcategoryTableView reloadData];//刷新整个表格
    }
}
@end
