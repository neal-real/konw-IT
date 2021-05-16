//
//  SLCategoryViewController.m
//  J-级联菜单
//
//  Created by 王世林 on 15/7/7.
//  Copyright (c) 2015年 William. All rights reserved.
//

#import "SLCategoryViewController.h"
#import "SLCategory.h"
@interface SLCategoryViewController ()
/** 所有的类别数据 */
@property (nonatomic, strong) NSArray *categories;

@end

@implementation SLCategoryViewController
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

static NSString *categoryID = @"category";
#pragma mark - 系统自动调用方法
- (void)viewDidLoad {
    [super viewDidLoad];
    // 注册cell 唯一标识
    [self.tableView registerClass:[UITableViewCell class] forCellReuseIdentifier:categoryID];

    
}


#pragma mark - TableView 数据源方法
#pragma mark 返回多少行
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.categories.count;
}
#pragma mark 每行返回的内容
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:categoryID];
    
    SLCategory *c = self.categories[indexPath.row];
    
    
    cell.imageView.image = [UIImage imageNamed:c.icon];// 设置普通图片
    // 设置高亮图片（cell选中 -> cell.imageView.highlighted = YES -> cell.imageView显示highlightedImage这个图片）
    cell.imageView.highlightedImage = [UIImage imageNamed:c.highlighted_icon];

    
    cell.textLabel.highlightedTextColor = [UIColor redColor];// 设置label高亮时的文字颜色
    cell.textLabel.text = c.name;// 设置label高亮时的文字内容
    cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;//设置右侧图标右线型箭头
    
    return cell;
}

#pragma mark - <代理方法>
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    // 告诉代理
    if ([self.delegate respondsToSelector:@selector(categoryViewController:didSelectSubcategories:)]) {//判断代理实现了代理方法
        SLCategory *c = self.categories[indexPath.row];//添加数据
        [self.delegate categoryViewController:self didSelectSubcategories:c.subcategories];//告诉代理监听信息，并且传递数据
    }
}

// 当一个cell被选中的时候，cell内部的子控件都会达到highlighted状态
@end
