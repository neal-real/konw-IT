/**
 * ^ 提供字符串加密和解密功能
 * # 1.单向文本加密
 * # 2.jwt 加密返回 token
 * # 3.jwt 解密 token 返回 json 对象
 * # 4.aes 加密 
 * # 5.aes 解密
*/

const N_crypto = require('crypto');
const N_jwt = require('jsonwebtoken');

module.exports ={
    /**
     * ^ 单向文本加密
     * # Hmac 加密(这个不能解密)
     * # 密钥固定写好,主要用来进行密码的单向加密
     */
    encryptText(text: string) {
        const hmac = N_crypto.createHmac('sha256', 'www.know-map.com+RealIsBest');
        hmac.update(text);
        return hmac.digest('hex')
    },
    /**
     * ^ jwt 加密返回 token
     * @ JSON: json 类型的对象
     * @ key: 加密字符串
     * # 有效期 7天
     */
    cipherTextByJWT(json: any, key: string) {
        // 生成JWT令牌
        // 第一个参数: 需要保存的数据
        // 第二个参数: 签名使用的密钥
        // 第三个参数: 额外配置      
        return N_jwt.sign(json, key, { expiresIn: '7 days' })
    },
    /**
     * ^ jwt 解密 token 返回 json 对象
     * @ token: 经过 cipherTextByJWT 加密过的密文
     * @ key: 加密字符串
     * # 有效期 7天
     */
    clearTextByJWT(token: any, key: string) {
        // 生成JWT令牌
        // 第一个参数: 需要保存的数据
        // 第二个参数: 签名使用的密钥
        // 第三个参数: 额外配置      
        return N_jwt.verify(token, key);
    },
    /**
     * ^ aes 加密 
     * # aes 加密和解密用的是同一套 key
     */
    cipherTextByAES(text: string, key: string) {
        const cipher = N_crypto.createCipher('aes192', key);
        var encryption = cipher.update(text, 'utf8', 'hex');
        encryption += cipher.final('hex');
        return encryption;
    },
    /**
     * ^ aes 解密 
     * # aes 加密和解密用的是同一套 key
     */
    clearTextByAES(encrypted, key: string) {
        const decipher = N_crypto.createDecipher('aes192', key);
        var decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
