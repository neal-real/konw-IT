# Cookie

> 设置cookie ,在之后的请求中浏览器默认会带上cookie, 服务器可以通过cookie判断是不同的用户,返回返回不同的数据
>
> 1. 下次请求时,自动带上
> 2. 键值对,可以设置多个
> 3. 用来给服务器设置判断用户信息

## cookie 属性

> **以下都是服务器的设置,返回给你浏览器的**

1. max-age 和 expires 设置 控制 cookie 过期时间
   1. 过期时间不设置的情况下, 浏览器关闭后 cookie就删除了
2. Secure 表示只有https的请求才会带上cookie
3. 设置httpOnly 后 无法通过document.cookie 获取cooklie ,防止攻击将用户凭证信息传递到黑客服务器上csrf 攻击

###  max-age :  expires

1. 设置方法: 在**需要的键值**对后面用分号 ; 后设置即可
2. max-age : 语义是多少秒后过期
3. expires: 语义是到什么时间点为止有效

![image-20201112164850085](images/image-20201112164850085.png)

## 访问域权限设定

1. 不同的网站不能访问彼此的cookie
2. 但同一个网站存在二级域名的情况下,通过(  )的方法,让二级域名访问上级cookie

![image-20201113122407587](images/image-20201113122407587.png)

host= test.com 此时二级域名***.test.com 在发送请求的时候是会携带abc=456这个cookie

