//
//  UIImageView+LYExtension.m
//  01-百思不得姐
//
//  Created by Mac on 15/8/4.
//  Copyright (c) 2015年 FSK. All rights reserved.
//

// 这个文件拉入文件就会报错,因为没有导入头文件
#import <UIImageView+WebCache.h>
#import "UIImageView+LYExtension.h"

@implementation UIImageView (LYExtension)

- (void)setIconImage:(NSString *)url withPlaceholder:(NSString *)placeholderImage
{
    [self sd_setImageWithURL:[NSURL URLWithString:url] completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
      
        self.image = image ? [image circlurImage] : [UIImage imageNamed:placeholderImage];
        
    }];
}
@end
