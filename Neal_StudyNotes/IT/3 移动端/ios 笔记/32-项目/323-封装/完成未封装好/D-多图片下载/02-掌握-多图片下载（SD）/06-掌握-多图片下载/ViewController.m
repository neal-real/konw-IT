//
//  ViewController.m
//  06-掌握-多图片下载
//
//  Created by xiaomage on 15/7/9.
//  Copyright (c) 2015年 小码哥. All rights reserved.
//

#import "ViewController.h"
#import "XMGApp.h"
#import "UIImageView+WebCache.h"

@interface ViewController ()
/** 所有数据 */
@property (nonatomic, strong) NSArray *apps;

/** 内存缓存的图片 */
@property (nonatomic, strong) NSMutableDictionary *images;

/** 所有的操作对象 */
@property (nonatomic, strong) NSMutableDictionary *operations;

/** 队列对象 */
@property (nonatomic, strong) NSOperationQueue *queue;
@end

@implementation ViewController

- (NSOperationQueue *)queue
{
    if (!_queue) {
        _queue = [[NSOperationQueue alloc] init];
        _queue.maxConcurrentOperationCount = 3;
    }
    return _queue;
}

- (NSMutableDictionary *)operations
{
    if (!_operations) {
        _operations = [NSMutableDictionary dictionary];
    }
    return _operations;
}

- (NSMutableDictionary *)images
{
    if (!_images) {
        _images = [NSMutableDictionary dictionary];
    }
    return _images;
}

- (NSArray *)apps
{
    if (!_apps) {
        NSArray *dictArray = [NSArray arrayWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"apps.plist" ofType:nil]];
        
        NSMutableArray *appArray = [NSMutableArray array];
        for (NSDictionary *dict in dictArray) {
            [appArray addObject:[XMGApp appWithDict:dict]];
        }
        _apps = appArray;
    }
    return _apps;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    // 如果以后就想下载一张图片，然后用来做事情。就这个方法就可以
    [[SDWebImageManager sharedManager] downloadImageWithURL:nil options:0 progress:^(NSInteger receivedSize, NSInteger expectedSize) {
        
    } completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished, NSURL *imageURL) {
        //这个方法里就拿到image,想做什么就做就好了
    }];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    
    
}

#pragma mark - 数据源方法
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.apps.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *ID = @"app";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:ID];
    
    XMGApp *app = self.apps[indexPath.row];
    cell.textLabel.text = app.name;
    cell.detailTextLabel.text = app.download;
    
    /** URL网络路径，后面是占位图片*/
    [cell.imageView sd_setImageWithURL:[NSURL URLWithString:app.icon] placeholderImage:[UIImage imageNamed:@"placeholder"]];
    
    [cell.imageView sd_setImageWithURL:[NSURL URLWithString:app.icon] placeholderImage:[UIImage imageNamed:@"placeholder"] options:0 progress:^(NSInteger receivedSize, NSInteger expectedSize) {
        // expectedSize: 图片的总字节数
        // receivedSize: 已经接收的图片字节数
        
        NSLog(@"下载进度：%f", 1.0 * receivedSize / expectedSize);
    } completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
        NSLog(@"下载完图片");
    }];
    
    // SDWebImage的图片缓存周期是多长:1个星期
    return cell;
}

/*
 1.官方框架
 2.自己写的框架
 3.第三方框架
 1> 隐患
 * 怕框架有BUG
 * 怕框架停止更新
 * 怕作者不及时更新
 2> 好处
 * 简单易用
 * 更加稳定
 * 大大提高开发效率
 
 Masonry
 SDWebImage
 
 CocoaPods：第三方框架管理工具
 */
@end
