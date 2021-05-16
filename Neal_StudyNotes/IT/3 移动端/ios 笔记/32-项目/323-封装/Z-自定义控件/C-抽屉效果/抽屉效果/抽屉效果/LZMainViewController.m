//
//  LZMainViewController.m
//  抽屉效果
//
//  Created by 王世林 on 15/8/9.
//  Copyright (c) 2015年 William. All rights reserved.
//
// 宏里面的#，会自动把后面的参数变成C语言的字符串
#define keyPath(objc,keyPath) @(((void)objc.keyPath,#keyPath))


// 获取屏幕的宽度
#define screenW  [UIScreen mainScreen].bounds.size.width

// 宏的操作原理，每输入一个字母就会直接把宏右边的拷贝，并且会自动补齐前面的内容。

#import "LZMainViewController.h"
#import "LZLeftViewController.h"
#import "LZRightViewController.h"
@implementation LZMainViewController


- (void)viewDidLoad {
    [super viewDidLoad];
    // 添加子控件
    [self setUpChildView];
    
    /** 添加手势识别器 */
    // 添加点按手势，并加入控制器的View
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tap)];
    [self.view addGestureRecognizer:tap];
    
    // 添加拖拽手势，并加入控制器的View
    UIPanGestureRecognizer *pan = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(pan:)];
    [self.view addGestureRecognizer:pan];

    /** 添加左右控制器*/
    LZLeftViewController *lcv = [[LZLeftViewController alloc]init];
    lcv.view.frame = self.view.bounds;
    [self addChildViewController:lcv];
    [_leftV addSubview:lcv.view];
    
    LZRightViewController *rcv = [[LZRightViewController alloc]init];
    rcv.view.frame = self.view.bounds;
    [self addChildViewController:rcv];
    [_rightV addSubview:rcv.view];
    
}

#pragma mark - 添加子控件
- (void)setUpChildView
{
    // left
    UIView *leftV = [[UIView alloc] initWithFrame:self.view.bounds];
    leftV.backgroundColor = [UIColor clearColor];
    [self.view addSubview:leftV];
    _leftV = leftV;

    // right
    UIView *rightV = [[UIView alloc] initWithFrame:self.view.bounds];
    rightV.backgroundColor = [UIColor blueColor];
    [self.view addSubview:rightV];
    _rightV = rightV;

    // main
    UIView *mainV = [[UIView alloc] initWithFrame:self.view.bounds];
    mainV.backgroundColor = [UIColor redColor];
    [self.view addSubview:mainV];
    _mainV = mainV;
}

#pragma mark - 手势识别且
#pragma mark  点按手势，还原中间View的Frame
- (void)tap
{
    // 还原中间View的Frame
    if (_mainV.frame.origin.x != 0) {
        [UIView animateWithDuration:0.25 animations:^{
            _mainV.frame = self.view.bounds;
        }];
    }
}

#define kTargetR 275
#define kTargetL -250

#pragma mark - pan的方法
- (void)pan:(UIPanGestureRecognizer *)pan
{
    // 获取手势的移动的位置
    CGPoint transP = [pan translationInView:self.view];
    // 获取X轴的偏移量
    CGFloat offsetX = transP.x;
    // 修改mainV的Frame
    _mainV.frame = [self frameWithOffsetX:offsetX];
    // 判断下mainV的x是否大于0
    [self observeValueForKeyPath:nil ofObject:nil change:nil context:nil];
    // 复位
    [pan setTranslation:CGPointZero inView:self.view];
    
    // 判断下当手势结束的时候，定位
    if (pan.state == UIGestureRecognizerStateEnded) {
        // 定位
        CGFloat target = 0;
        // 1.判断下main.x > screenW * 0.5,定位到右边 x=275
        if (_mainV.frame.origin.x > screenW * 0.5) {
            target = kTargetR;// 定位到右边
        }else if (CGRectGetMaxX(_mainV.frame) < screenW * 0.5){
            target = kTargetL;// 2.判断下max(main.x) < screenW * 0.5
        }
        // 获取x轴偏移量
        CGFloat offsetX = target - _mainV.frame.origin.x;
        [UIView animateWithDuration:0.25 animations:^{
            _mainV.frame = target == 0?self.view.bounds:[self frameWithOffsetX:offsetX];
        }];
    }
}

// 手指往右移动，视图X轴也要往右移动（x++），y轴往下移动（y增加），尺寸缩放（按比例）。
#define kMaxY 80
#pragma mark - 根据offsetX计算mainV的Frame
- (CGRect)frameWithOffsetX:(CGFloat)offsetX
{
    // 获取上一次的frame
    CGRect frame = _mainV.frame;
    // 获取屏幕的高度
    CGFloat screenH = [UIScreen mainScreen].bounds.size.height;
    // X轴每平移一点，Y轴需要移动
    CGFloat offsetY = offsetX * kMaxY / screenW;
    // 获取上一次的高度
    CGFloat preH = frame.size.height;
    // 获取上一次的宽度
    CGFloat preW = frame.size.width;
    // 获取当前的高度
    CGFloat curH = preH - 2 * offsetY;
    
    if (frame.origin.x < 0) { // 往左移动
        curH = preH + 2 * offsetY;
    }
    
    // 获取尺寸的缩放比例
    CGFloat scale = curH / preH;
    
    // 获取当前的宽度
    CGFloat curW = preW * scale;
    // 获取当前X
    frame.origin.x += offsetX;
    // 获取当前Y
    CGFloat y = (screenH - curH) / 2;
    frame.origin.y = y;
    frame.size.height = curH;
    frame.size.width = curW;
    return frame;
}

#pragma mark - KVO 监听结果
// 只要监听的属性一改变，就会调用观察者的这个方法，通知你有新值
- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    if (_mainV.frame.origin.x > 0) { // 往右边移动，隐藏右边的view
        _rightV.hidden = YES;
    }else if (_mainV.frame.origin.x < 0){ // 往左边移动，显示右边的view
        _rightV.hidden = NO;
    }
}


@end
