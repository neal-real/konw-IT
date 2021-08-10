/*
 ? 使用腾讯云保存图片功能具体实现
*/
// 腾讯云对象存储和 配置信息
const COS = require('cos-nodejs-sdk-v5');
const config = require('../config/TXConfig')
const cos = new COS({
  SecretId: config.secret.secretId,
  SecretKey: config.secret.secretKey
})
// 解析图片
const { IncomingForm } = require('formidable');
// 随机字符粗
const stringRandom = require('string-random')
const pathRoot = require("path");
const fs = require("fs");

/**
 * ^ 腾讯存储对象配置信息
 * @image_cosPath:string : 图片存放指定的路径, 对象存储中指定
 * @timeStr:string: 图片名称
 * @localFilesPath: 本地图片的读取地址 
 * #
 */
function TXCosInfo(image_cosPath: string, timeStr: string, localFilesPath: any) {
  return {
    Bucket: config.cos.BucketName,                     /* 桶名*/
    Region: config.cos.Region,                            /* 地区:固定写法 */
    Key: image_cosPath + timeStr,          /* 路径+文件名 */
    StorageClass: config.cos.StorageClass,     //存储类型
    Body: fs.createReadStream(localFilesPath),     // 上传文件对象
    onProgress: function () {
      // console.log(JSON.stringify(progressData));   // 打印解析信息
    }
  }
}
/**
 * ^ 解析图片的对象
 * @image_cosPath:string : 图片存放指定的路径, 对象存储中指定
 * @timeStr:string: 图片名称
 * @localFilesPath: 本地图片的读取地址 
 * #
 */
function IncomingFormObj(imageSize: number) {
  const form = new IncomingForm;
  // 从网站临时保存目录获取图片文件
  form.uploadDir = pathRoot.join(config.cos.cos_imageDir);   // 图片临时存放目录
  form.keepExtensions = true;                                //保留文件名后缀
  form.maxFieldsSize = imageSize;           // 最大 5M  限制
  return form
}

export default {

  /**
   * > 1. 保存用户头像
   * # 给我图片,返回一个 url
   * @返回: url:string
   */
  saveUserAvatar(req: any) {
    return new Promise((resolve, reject) => {
      try {
        // 处理数据,网站发来的图片
        const form = IncomingFormObj(config.cos.max_ImageSize1M)
        // 解析发送的图片数据
        form.parse(req, async (error, fields, files) => {
          if (fields) { }  // 无用,防 ts 报错
          if (!files.avatar) {
            return reject('头像数据解析异常, 请查看资源是否是图片')
          }
          if (error) { return reject(error); }
          // 获取图片类型和本地存放的临时路径
          const { type, path } = files.avatar
          // 创建一个随机图片名称
          let timeStr = config.cos.picturePrefix + new Date().getTime() + stringRandom(16) + '.' + type.split('/').pop()
          // 存储桶的配置信息
          const cosInfo = TXCosInfo(config.cos.avatar_path, timeStr, path)
          // 发送到腾讯对象存储中
          cos.putObject(cosInfo, async (error, data) => {
            // 获得返回信息,将访问路径返回
            if (data) { return resolve({ "url": 'https://' + data.Location }) }
            else { return reject(error); }
          })
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}
