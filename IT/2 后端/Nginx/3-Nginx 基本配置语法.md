## 位置

```shell
# 配置文件
cd /etc/nginx
# 主配置文件
vim nginx.conf
# 其他配置
```



## nginx.conf 基本配置语法

- `nginx.conf`

```sh
# 有关配置的更多信息，请参阅：
#   * 官方英文文档: http://nginx.org/en/docs/
#   * 俄罗斯官方文件: http://nginx.org/ru/docs/

user nginx;  # 设置 nginx 服务的系统使用用户
worker_processes auto; # 工作进程数, 设置和cpu 核数一致即可
error_log /var/log/nginx/error.log; # nginx 的错误日志
pid /run/nginx.pid; # nginx 服务启动时候 pid

# 动态加载模块 /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events { #事件模块
    worker_connections 1024; # 每个进程允许最大连接数 ;6535 , 一般1万左右, 需要优化的参数
#可无    use# 定义使用的内核模型, 
}

http { # http 协议中间件的配置
		#log_format 预置类型
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;  # 客户端和服务端超时时间 /秒
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;  # 配置信息
    default_type        application/octet-stream;  

    # 加载模块化配置文件 /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # 了解更多信息
    include /etc/nginx/conf.d/*.conf; #配置信息

    server { # 站点配置, 一个 server 配置一个站点
        listen       80; #监听端口
        listen       [::]:80;
        server_name  jiudaka.com; # 填写主机名或者对外的域名
				location / { #默认访问配置 location 相当于站点名 www.xxx.com 访问的路径
	        root         /usr/share/nginx/html;  # 返回此目录下的 index.html
	        index inde.html
				}

        # 加载默认服务器块的配置文件
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html; # 错误页面当出现404时访问的页面统一无法访问
        location = /404.html {
        	root /web/knowmap/errorPage/404.html  # 页面位置
        }

        error_page 500 502 503 504 /50x.html; # 错误页面当出现  500 502 503 504  统一返回50x.html 页面
        location = /50x.html {
	        root /web/knowmap/errorPage/50x.html
        }
    }
    server { # 站点配置, 一个 server 配置一个站点
        listen       80; #监听端口
        listen       [::]:80;
        server_name  www.knowmap.com; # 填写主机名或者对外的域名
				location / { #默认访问配置 location 相当于站点名 / =根目录
	        root         /usr/share/nginx/html; 
	        index inde.html
				}

        # 加载默认服务器块的配置文件
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html; # 错误页面当出现404时访问的页面统一无法访问
        location = /404.html {
        	root /web/knowmap/errorPage/404.html  # 页面位置
        }

        error_page 500 502 503 504 /50x.html; # 错误页面当出现  500 502 503 504  统一返回50x.html 页面
        location = /50x.html {
	        root /web/knowmap/errorPage/50x.html
        }
    }

# 启用 TLS 的服务器的设置
#
#    server {
#        listen       443 ssl http2;
#        listen       [::]:443 ssl http2;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers HIGH:!aNULL:!MD5;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        error_page 404 /404.html;
#            location = /40x.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }

}                                                                                                                                       
```



## 逐句解析

1.  nginx 会先读主配置文件 `nginx.conf`
2. 然后因为 在 http 下有一个 include 语句引入 ,所以会吧`/etc/nginx/conf.d/` 下全部的`.conf`配置文件读取
3. 默认 `conf.d` 目录下只有 `default.conf` 文件

```sh
 include /etc/nginx/conf.d/*.conf;
```





