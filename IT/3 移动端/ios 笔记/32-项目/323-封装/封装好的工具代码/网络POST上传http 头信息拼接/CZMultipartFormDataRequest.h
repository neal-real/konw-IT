#import <Foundation/Foundation.h>

@interface CZMultipartFormDataRequest : NSMutableURLRequest

/**
 *  返回要上传文件的请求
 *
 *  @param url      上传文件URL
 *  @param fileName 保存在服务器的文件名
 *  @param filePath 本地上传路径
 *
 *  @return POST上传文件请求
 */
+ (instancetype)requestWithUploadURL:(NSURL *)url uploadFileName:(NSString *)fileName localFilePath:(NSString *)filePath;

@end
