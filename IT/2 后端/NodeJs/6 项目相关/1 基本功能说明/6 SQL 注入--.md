## 什么是SQL注入?

- SQL注入是一种古老的攻击方式，
- SQL注入是通过利用一些查询语句的漏洞,
- 让我们的应用程序执行不正确的SQL语句的一种攻击方式



## 如何防止SQL注入?

执行SQL语句之前过滤掉特殊字符

使用 mysql 的 escape 方法, 对信息进行特殊字符串转移层普通字符, 来解决这个问题