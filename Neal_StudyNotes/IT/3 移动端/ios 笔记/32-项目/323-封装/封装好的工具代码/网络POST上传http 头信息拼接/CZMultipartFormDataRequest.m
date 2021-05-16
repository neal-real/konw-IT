#import "CZMultipartFormDataRequest.h"

#define kTimeOut        30.0f

@implementation CZMultipartFormDataRequest

/** 分隔字符串 */
static NSString *boundaryStr = @"--";
/** 本次上传标示字符串 */
static NSString *randomIDStr = @"itcastupload";
/** 上传(php)脚本中，接收文件字段 */
static NSString *uploadID = @"uploadFile";

+ (instancetype)requestWithUploadURL:(NSURL *)url uploadFileName:(NSString *)fileName localFilePath:(NSString *)filePath
{
    CZMultipartFormDataRequest *r = [CZMultipartFormDataRequest requestWithURL:url cachePolicy:0 timeoutInterval:kTimeOut];
    
    [r setupForUploadFileName:fileName localFilePath:filePath];
    
    return r;
}

#pragma mark - 私有方法
/** 拼接顶部字符串 */
- (NSString *)topStringWithMimeType:(NSString *)mimeType uploadFile:(NSString *)uploadFile
{
    NSMutableString *strM = [NSMutableString string];
    
    [strM appendFormat:@"%@%@\n", boundaryStr, randomIDStr];
    [strM appendFormat:@"Content-Disposition: form-data; name=\"%@\"; filename=\"%@\"\n", uploadID, uploadFile];
    [strM appendFormat:@"Content-Type: %@\n\n", mimeType];
    
    return [strM copy];
}

/** 拼接底部字符串 */
- (NSString *)bottomString
{
    NSMutableString *strM = [NSMutableString string];
    
    [strM appendFormat:@"%@%@\n", boundaryStr, randomIDStr];
    [strM appendString:@"Content-Disposition: form-data; name=\"submit\"\n\n"];
    [strM appendString:@"Submit\n"];
    [strM appendFormat:@"%@%@--\n", boundaryStr, randomIDStr];
    
    return [strM copy];
}

/** 指定全路径文件的mimeType */
- (NSString *)mimeTypeWithFilePath:(NSString *)filePath
{
    // 1. 判断文件是否存在
    if (![[NSFileManager defaultManager] fileExistsAtPath:filePath]) {
        return nil;
    }
    
    // 2. 使用HTTP HEAD方法获取上传文件信息
    NSURL *url = [NSURL fileURLWithPath:filePath];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    
    // 3. 调用同步方法获取文件的MimeType
    NSURLResponse *response = nil;
    [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:NULL];
    
    return response.MIMEType;
}

/** 上传文件网络请求 */
- (void)setupForUploadFileName:(NSString *)fileName localFilePath:(NSString *)filePath
{
    // 0. 获取上传文件的mimeType
    NSString *mimeType = [self mimeTypeWithFilePath:filePath];
    if (!mimeType) return;
    
    // 1. 拼接要上传的数据体
    NSMutableData *dataM = [NSMutableData data];
    [dataM appendData:[[self topStringWithMimeType:mimeType uploadFile:fileName] dataUsingEncoding:NSUTF8StringEncoding]];
    [dataM appendData:[NSData dataWithContentsOfFile:filePath]];
    [dataM appendData:[[self bottomString] dataUsingEncoding:NSUTF8StringEncoding]];
    
    // 2. 设置请求
    // 1> 设定HTTP请求方式
    self.HTTPMethod = @"POST";
    // 2> 设置数据体
    self.HTTPBody = dataM;
    // 3> 指定Content-Type
    NSString *typeStr = [NSString stringWithFormat:@"multipart/form-data; boundary=%@", randomIDStr];
    [self setValue:typeStr forHTTPHeaderField:@"Content-Type"];
    // 4> 指定数据长度
    NSString *lengthStr = [NSString stringWithFormat:@"%@", @([dataM length])];
    [self setValue:lengthStr forHTTPHeaderField:@"Content-Length"];
}

@end
