## 无序列表 

> ul : unordered list ;
>
> - 作用: 给一堆内容添加无序列表语义(一个没有先后顺序整体), 列表中的条目是`不分先后`
>
> li : list item;

ul 应用场景：

- 导航条
- 商品列表等
- 新闻列表

~~~HTML
<ul type="circle">
  <li></li>
</ul>
~~~

### type 属性

~~~js
`HTML5 中已经废弃，建议使用 css`
type="disc" ; //默认实心圆
type="circle" ; //空心圆
type="square" ; //实心方块
~~~





## 有序列表

> ordered list
>
> - 作用: 给一堆内容添加有序列表语义(一个有顺序整体), 列表中的条目`有先后之分`

ol应用场景:

- xxx排行榜
- 其实ol应用场景并不多, 因为能用ol做的用ul都能做

~~~HTML
<ol type="1" start="5" reversed>
  <li></li>
</ol>
~~~



### type 属性

~~~js
type="1" ; //默认数字编号
type="a" ; //小写英文字母
type="A" ; //大写英文字母
type="i" ; //小写罗马数字
type="I" ; //大写罗马数字
~~~

### start 属性

1. 必须是一个**阿拉伯数字**的整数，制定启示编号

### reversed 属性

> 1. 列表条目是否倒叙排列
> 2. HTML5 的新特性





## 定义列表

> dl = definition list ；定义列表
>
> dt = data term ; 数据标题
>
> dd = data definition ; 数据定义
>
> - 作用: 给一堆内容添加列表语义, 通过`dt`罗列出列表的条目, 然后再通过`dd`给每个条目进行相应的描述

~~~HTML
<dl>
  <dt>北京</dt>
  <dd>首都</dd>
  <dt>上海</dt>
  <dd>国际经济</dd>
</dl>
<!-- 另外一个写法可以给 css 样式提供更多空间-->
<dl>
  <dt>北京</dt>
  <dd>首都</dd>
</dl>
<dl>
  <dt>上海</dt>
  <dd>国际经济</dd>
</dl>
~~~

