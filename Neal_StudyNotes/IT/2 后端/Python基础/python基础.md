# Python基础

## 内置函数

##### range() 函数可创建一个整数列表

~~~python
range(10)        # 从 0 开始到 10		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
range(1, 11)     # 从 1 开始到 11
range(0, 30, 5)  # 步长为 5		[0, 5, 10, 15, 20, 25]
>>> range(0, -10, -1) # 负数	[0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
>>> range(0)			# []
>>> range(1, 0)		# []
~~~



> ​	python 有很多预置方法, 使用的时候需要import 方法名实现
>
> 输出方法: print(.end('设置结尾'))

## 预置模块

1. 数据模块:  **math 模块**：Python 中数学运算常用的函数基本都在 math 模块


```python
import math
print(math.ceil(4.1))   #返回数字的上入整数
print(math.floor(4.9))  #返回数字的下舍整数
print(math.fabs(-10))   #返回数字的绝对值
print(math.sqrt(9))     #返回数字的平方根
print(math.exp(1))      #返回e的x次幂
```

**2 Python随机数**

```python
import random   #随机模块
ran = random.random()  #使用random()方法即可随机生成一个[0,1)范围内的实数
# randint()生成一个随机整数
ran = random.randint(1,20)
```

## 字符串

#### 字符串形式: 四种

~~~python
# 各种引号包起来的任何内容
单引号: 'string'
双引号: "string"
三单引号:'''string'''  # 三引号,即使Vue中的pre ,所见即所得
三双引号: """string"""
~~~

#### 字符串使用技巧


```python
0. 
字符串长度  len(字符串变量) 

1. 连接：+
a = "Hello "
b = "World "
print(a + b)
# Hello World 

2. 重复输出字符串：*
print(a * 3)  
# Hello Hello Hello 

3. 通过索引获取字符串中字符[]
print(a[0])
# H

4. 字符串截取[:]  牢记：左闭右开(下标1字符不包含,下标4字符串包含)
print(a[1:4])
# ell

5. 判断字符串中是否包含给定的字符: in, not in
print('e' in a)
# True
print('e' not in a)
# False

6. join():指定分隔符，将字符串中所有的字符以分隔符合并为一个新的字符串
new_str = '-'.join('Hello')
print(new_str)
# H-e-l-l-o

7. 转义字符 \
\t : 一个tab位置的间距
\' : 例如print('I\'m going') #I'm going
```



## 列表(数组)

#### 数组的下标或索引获取元素(有反向下标)

![](https://ai-studio-static-online.cdn.bcebos.com/41840090b1c14c4daa704f9565fd5ba663d08a7d383444fa98c5c3d31f7e4c1d)



```python
#声明一个列表
names = ['jack','tom','tonney','superman','jay']
#声明一个空列表
girls = []


#通过下标或索引获取元素
print(names[0])

#获取最后一个元素
print(names[-1])
print(names[len(names)-1])

#获取第一个元素
print(names[-5])

#向数组中添加一个内容: append(),末尾追加
girls.append('杨超越')

#一次添加多个。extend() 列表合并。
models = ['刘雯','奚梦瑶']
girls.extend(models)

# 添加多个的简易写法
#girls = girls + models
print(girls)

#insert():指定位置添加
girls.insert(1,'虞书欣')
print(girls)

#遍历列表，获取元素
for name in names:
    print(name)
    

#查询names里面有没有superman
for name in names:
    if name == 'superman':
        print('有超人')
        break
else:
    print('无超人')
    
#更简单的方法,来查询names里有没有superman
if 'superman' in names:
    print('有超人')
else:
    print('无超人')


```



#### 数组的 改/删

##### 列表元素修改,通过下标找到元素，然后用=赋值

```python
fruits = ['apple','pear','香蕉','pineapple','草莓']
print(fruits)

fruits[-1] = 'strawberry'
print(fruits)

```

    ['apple', 'pear', '香蕉', 'pineapple', '草莓']
    ['apple', 'pear', '香蕉', 'pineapple', 'strawberry']

##### 列表元素的替换

```python

'''
将fruits列表中的‘香蕉’替换为‘banana’
'''
for fruit in fruits:
    if '香蕉' in fruit:
        fruit = 'banana'
print(fruits)

for i in range(len(fruits)):
    if '香蕉' in fruits[i]:
        fruits[i] = 'banana'
        break
print(fruits)
```

    ['apple', 'pear', '香蕉', 'pineapple', 'strawberry']
    ['apple', 'pear', 'banana', 'pineapple', 'strawberry']

##### 列表元素删除

```python
1. 关键字删除
words = ['cat','hello','pen','pencil','ruler']
del words[0]
print(words)
# ['hello', 'pen', 'pencil', 'ruler']

2. 方法删除指定内容
words = ['cat','hello','pen','pencil','ruler']
words.remove('cat')
print(words)
# ['hello', 'pen', 'pencil', 'ruler']

3. 方法删除指定内容
words = ['cat','hello','pen','pencil','ruler']
words.pop(0)
print(words)

# ['hello', 'pen', 'pencil', 'ruler']
```

##### 截取数组: (列表切片)

![](https://ai-studio-static-online.cdn.bcebos.com/3e1286d72f144f378afd29d8fc720e1430919c5b0c0d413b9ca1539f3ae087a0)



```python
animals = ['cat','dog','tiger','snake','mouse','bird']
print(animals[2:5])
print(animals[-1:])
print(animals[-3:-1])
print(animals[-5:-1:2])
print(animals[::2])
```

    ['tiger', 'snake', 'mouse']
    ['bird']
    ['snake', 'mouse']
    ['dog', 'snake']
    ['cat', 'tiger', 'mouse']



##### 列表排序


```python
#默认升序
new_list = sorted(random_list)
print(new_list)

#降序
new_list = sorted(random_list,reverse =True)
print(new_list)
```

## 元组 ( )

> 1. 与列表类似，元组中的内容不可修改
> 2. 函数可以返回多个值,实际上就是元祖


```python
1. 声明元组
tuple1 = ()
print(type(tuple1))
# <class 'tuple'>

2. 仅一个元素时,后面必须加逗号
tuple2 = ('hello',)
print(type(tuple2))
# <class 'tuple'>

3. 那作为容器的元组，如何存放元素？
random_list = [14, 4, 2, 14, 13, 4, 12, 3, 7, 9]
random_tuple = tuple(random_list)
print(random_tuple)
# (14, 4, 2, 14, 13, 4, 12, 3, 7, 9)

4. 元组的访问 1,变量. 2,下标 . 3,分片
print(random_tuple)
print(random_tuple[0])
print(random_tuple[-1])
print(random_tuple[1:-3])
print(random_tuple[::-1])

5. 元组的修改 :  拼接
t1 = (1,2,3)+(4,5)
print(t1)

6. 元组的一些函数
print(max(random_tuple))
print(min(random_tuple))
print(sum(random_tuple))
print(len(random_tuple))
```








## 字典


```python
#定义一个空字典

dict1 = {}

dict2 = {'name':'杨超越','weight':45,'age':25}
print(dict2['name'])

```

    杨超越



```python
#list可以转成字典，但前提是列表中元素都要成对出现
dict3 = dict([('name','杨超越'),('weight',45)])
print(dict3)
```


```python
dict4 = {}
dict4['name'] = '虞书欣'
dict4['weight'] = 43
print(dict4)
```

    {'name': '虞书欣', 'weight': 43}



```python
dict4['weight'] = 44
print(dict4)
```

    {'name': '虞书欣', 'weight': 44}



```python
#字典里的函数 items()  keys() values()

dict5 = {'杨超越':165,'虞书欣':166,'上官喜爱':164}
print(dict5.items())
for key,value in dict5.items():
    if value > 165:
        print(key)
```

    dict_items([('杨超越', 165), ('虞书欣', 166), ('上官喜爱', 164)])
    虞书欣



```python
#values() 取出字典中所有的值,保存到列表中

results = dict5.values()
print(results)
```

    dict_values([165, 166, 164])



```python
#求小姐姐的平均身高
heights = dict5.values()
print(heights)
total = sum(heights)
avg = total/len(heights)
print(avg)

```

    dict_values([165, 166, 164])
    165.0



```python
names = dict5.keys()
print(names)
```

    dict_keys(['杨超越', '虞书欣', '上官喜爱'])



```python

#print(dict5['赵小棠'])      #若不存在“赵小棠”，会报错KeyError   

print(dict5.get('赵小棠'))

print(dict5.get('赵小棠',170)) #如果能够取到值，则返回字典中的值，否则返回默认值170

```

    None
    170



```python
dict6 = {'杨超越':165,'虞书欣':166,'上官喜爱':164}
del dict6['杨超越']
print(dict6)
```

    {'虞书欣': 166, '上官喜爱': 164}



```python
result = dict6.pop('虞书欣')
print(result)
print(dict6)
```

    166
    {'上官喜爱': 164}


# Python面向对象

定义一个类Animals:

(1)__init__()定义构造函数，与其他面向对象语言不同的是，Python语言中，会明确地把代表自身实例的self作为第一个参数传入

(2)创建一个实例化对象 cat，__init__()方法接收参数

(3)使用点号 . 来访问对象的属性。


```python
class Animal:

    def __init__(self,name):
        self.name = name
        print('动物名称实例化')
    def eat(self):
        print(self.name +'要吃东西啦！')
    def drink(self):
        print(self.name +'要喝水啦！')

cat =  Animal('miaomiao')
print(cat.name)
cat.eat()
cat.drink()
```


```python
class Person:        
    def __init__(self,name):
        self.name = name
        print ('调用父类构造函数')

    def eat(self):
        print('调用父类方法')
 
class Student(Person):  # 定义子类
   def __init__(self):
      print ('调用子类构造方法')
 
   def study(self):
      print('调用子类方法')

s = Student()          # 实例化子类
s.study()              # 调用子类的方法
s.eat()                # 调用父类方法

```

# Python JSON

JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式，易于人阅读和编写。

json.dumps 用于将 Python 对象编码成 JSON 字符串。


```python
import json
data = [ { 'b' : 2, 'd' : 4, 'a' : 1, 'c' : 3, 'e' : 5 } ]
json = json.dumps(data)
print(json)
```

    [{"b": 2, "d": 4, "a": 1, "c": 3, "e": 5}]


为了提高可读性，dumps方法提供了一些可选的参数。

sort_keys=True表示按照字典排序(a到z)输出。

indent参数，代表缩进的位数

separators参数的作用是去掉,和:后面的空格，传输过程中数据越精简越好


```python
import json
data = [ { 'b' : 2, 'd' : 4, 'a' : 1, 'c' : 3, 'e' : 5 } ]
json = json.dumps(data, sort_keys=True, indent=4,separators=(',', ':'))
print(json)
```

    [
        {
            "a":1,
            "b":2,
            "c":3,
            "d":4,
            "e":5
        }
    ]


json.loads 用于解码 JSON 数据。该函数返回 Python 字段的数据类型。


```python
import json
jsonData = '{"a":1,"b":2,"c":3,"d":4,"e":5}'
text = json.loads(jsonData)  #将string转换为dict
print(text)

```

    {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}


# Python异常处理

当Python脚本发生异常时我们需要捕获处理它，否则程序会终止执行。

捕捉异常可以使用try/except语句。

try/except语句用来检测try语句块中的错误，从而让except语句捕获异常信息并处理。


```python
try:
    fh = open("/home/aistudio1/data/testfile01.txt", "w")
    fh.write("这是一个测试文件，用于测试异常!!")
except IOError:
    print('Error: 没有找到文件或读取文件失败')
else:
    print ('内容写入文件成功')
    fh.close()
```

    Error: 没有找到文件或读取文件失败


finally中的内容，退出try时总会执行


```python
try:
    f = open("/home/aistudio/data/testfile02.txt", "w")
    f.write("这是一个测试文件，用于测试异常!!")
finally:
    print('关闭文件')
    f.close()

```

    关闭文件


# Python文件操作


在 Python 中，读写文件有 3 个步骤：

（1）调用 open()函数，返回一个 File 对象。

（2）调用 File 对象的 read()或 write()方法。

（3）调用 File 对象的 close()方法，关闭该文件。



```python
f = open("work/test.txt",'w')  #变量名=open（文件路径和文件名，打开模式） 模式：w:写，r:只写；a:追加写
f.write("hello")
f.write("\npython")
f.close()
```


```python
f = open("work/test.txt",'r')  #变量名=open（文件路径和文件名，打开模式） 模式：w:写，r:只写；a:追加写
# print(f.read())     #f.read():从文件中读入整个文件内容，结果为字符串
# print(f.readline()) #f.readline():从文件中读入一行内容，结果为字符串 
print(f.readlines()) #f.readlines():从文件中读取所有行，以每行元素形成一个列表
f.close()
```

    ['hello\n', 'python']


使用open()函数打开的文件对象，必须手动进行关闭，Python 垃圾回收机制无法自动回收打开文件所占用的资源。

因此，推荐以下写法：


```python
with open("work/test.txt",'a') as  f:
    f.write("PadddlePaddle")
    f.write("\nokokok")

```

# 常见Linux命令


```python
!ls /home
```

    aistudio



```python
!ls ./
```


```python
ls  -l
```


```python
!pwd
```

cp ：复制文件或目录


```python
!cp test.txt ./test_copy.txt
```

mv:移动文件与目录，或修改文件与目录的名称


```python
!mv /home/aistudio/work/test_copy.txt /home/aistudio/data/
```

rm :移除文件或目录


```python
!rm /home/aistudio/data/test_copy.txt
```

很多大型文件或者数据从服务器上传或者下载的时候都需要打包和压缩解压，这时候知道压缩和解压的各种命令是很有必要的。

常见的压缩文件后缀名有.tar.gz，.gz，和.zip，下面来看看在Linux上它们分别的解压和压缩命令。

## gzip:

linux压缩文件中最常见的后缀名即为.gz，gzip是用来压缩和解压.gz文件的命令。

常用参数:

    -d或--decompress或--uncompress：解压文件；
    -r或--recursive：递归压缩指定文件夹下的文件（该文件夹下的所有文件被压缩成单独的.gz文件）；
    -v或--verbose：显示指令执行过程。
    注：gzip命令只能压缩单个文件，而不能把一个文件夹压缩成一个文件（与打包命令的区别）。


```python
#会将文件压缩为文件 test.txt.gz，原来的文件则没有了，解压缩也一样
!gzip /home/aistudio/work/test.txt
```


```python
!gzip -d /home/aistudio/test.gz
```

## tar:

tar本身是一个打包命令，用来打包或者解包后缀名为.tar。配合参数可同时实现打包和压缩。

常用参数:

    -c或--create：建立新的备份文件；
    -x或--extract或--get：从备份文件中还原文件；
    -v：显示指令执行过程；
    -f或--file：指定备份文件；
    -C：指定目的目录；
    -z：通过gzip指令处理备份文件；
    -j：通过bzip2指令处理备份文件。

最常用的是将tar命令与gzip命令组合起来，直接对文件夹先打包后压缩：


```python
!tar -zcvf /home/aistudio/work/test.tar.gz /home/aistudio/work/test.txt
```


```python
!tar -zxvf /home/aistudio/work/test.tar.gz
```

## zip和unzip

zip命令和unzip命令用在在Linux上处理.zip的压缩文件。

常用参数
    
zip:
    
    -v：显示指令执行过程；
    -m：不保留原文件；
    -r：递归处理。

unzip:
    
    -v：显示指令执行过程；
    -d：解压到指定目录。


```python
!zip -r /home/aistudio/work/test.zip /home/aistudio/work/test.txt
```


```python
!unzip  /home/aistudio/work/test.zip 
```
