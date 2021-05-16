# 表格

> table table: 表格
>
> 作用:以表格形式将数据显示出来, 当数据量非常大的时候, 表格这种展现形式被认为是最为清晰的一种展现形式
>
> 表格结构的意义主要是用于SEO, 便于搜索引擎指定哪部分的内容是需要抓取的重要内容, 一般情况下搜索引擎会优先抓取tbody中的内容
>
> 由于有一部分浏览器对talbe的这种结构支持不是很好, 所以在企业开发中一般都不用严格的按照这种结构来编写

## 表格的基本使用

~~~html
<table border="1" width = "600" cellspacing="0" cellpadding="10" >
  <caption>表格标题</caption>
  <!-- tr: table row: 表格中的一行 -->
  <tr>
    <!-- th标签: 给每一列设置标题, 单元格中的内容会自动加粗，居中 -->
     <th>字母</th>
     <th>字母</th>
  </tr>
  <tr>
    <!-- td : table data: 表格一个单元格 -->
    <td>A</td>
    <td>B</td>
  </tr>
  <tr>
    <td>C</td>
    <td>D</td>
  </tr>
</table>
~~~

## 表格中的其他属性

- border:
  -  默认情况下表格的边框宽度为0看不到, 通过border属性给表格指定边框宽度
- width:
  -  默认情况下表格的宽度是由内容自动计算出来的, 可以通过width属性指定表格的宽度
- height:
  - 默认情况下表格的高度是由内容自动计算出来的, 可以通过height属性指定表格的高度
- cellspacing: 
  - 外边距. 默认情况下单元格之间有2个像素的间隙, 可以通过cellpadding指定表格之间的间隙
- cellpadding:
  -  内边距. 默认情况下单元格边缘距离内容有1个像素的内边距, 可以通过cellpadding属性指定单元格边缘和内容之间的内边距
- align:
  -  规定表格相对周围元素的对齐方式, 它的取值有center、left、right
  - 给table设置align属性, 是让表格在`浏览器`中居左/居右/居中
  - 给tr设置align属性, 是让当前行中`所有内容`居左/居右/居中
  - 给td设置align属性,是让当前单元格中`所有内容`居左/居右/居中
  - 该属性仅仅作为了解, 企业开发中用css代替, 因为HTML仅仅用于说明语义
  - 如果td中设置了align属性, tr中也设置了align属性, 那么单元格中的内容会按照td中设置的来对齐
- valign: 
  - 规定表格相对周围元素的对齐方式, 它的取值有center、left、right
  - 给table设置valign属性, 无效
  - 给tr设置valign属性, 是让当前行中`所有内容`居上/居中/居下
  - 给td设置valign属性,是让当前单元格中`所有内容`居上/居中/居下
  - 如果td中设置了valign属性, tr中也设置了valign属性, 那么单元格中的内容会按照td中设置的来对齐
- bgcolor:
  - 规定表格的背景颜色
  - 给table设置bgcolor属性, 是给整个表格设置背景颜色
  - 给tr设置bgcolor属性, 是给当前行设置背景颜色
  - 给td设置bgcolor属性, 是给当前单元格设置背景颜色
  - 该属性仅仅作为了解, 企业开发中用css代替, 因为HTML仅仅用于说明语义

## 表格中的其他标签

表单中有两种类型的单元格, 一种是标准单元格td, 一种是表头单元格th

<caption>表格标题</caption>

th: 表格内第一行作为表格的列标题

th标签: 给每一列设置标题,  单元格中的内容会自动加粗，居中

caption标签:给整个表格设置标题

- 一定要嵌套在talbe标签内部才有效



## 复杂表格

### 单元格合并

> colspan 属性用来设置 td 或 th 的列跨度
>
> rowspan属性用来设置 td 或 th 的行跨度

~~~html
<table border="1" width = "300">
  <caption>表格标题</caption>
  <tr>
    <th>字母</th>
    <th>字母</th>
    <th>字母</th>
  </tr>
  <tr>
    <td colspan="2">A</td>
    <td rowspan="3">A</td>
  </tr>
  <tr>
    <td>B</td>
    <td rowspan="2">B</td>
  </tr>
  <tr>
    <td>D</td>
  </tr>
</table>
~~~



![表格](images/表格.png)



### 表格其他特性

> <thead> 标签:用来存放当前列的表头, 如果没有加css页面默认将表头中的高度设置变小
>
> <tbody> 标签:一般用来存放页面中的主体数据, 如果不写会自动加上
>
> <tfoot> 标签:用来存放表格的页脚（脚注或表注), 如果没有加css页面默认将表头中的高度设置变小, `一般不会出现` 通常是汇总行

~~~html
<table border="1" width = "300">
  <thead>
    <tr>
      <th></th>
      <th colspan="2">第一季度</th>
      <th colspan="2">第一季度</th>
      <th colspan="2">第一季度</th>
      <th colspan="2">第一季度</th>f
    </tr>
    <tr>
      <th></th>
      <th>国内</th>
      <th>国外</th>
      <th>国内</th>
      <th>国外</th>
      <th>国内</th>
      <th>国外</th>
      <th>国内</th>
      <th>国外</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>手机</th>
      <td>数据</td>
      <td>数据</td>
      <td>数据</td>
      <td>数据</td>
      <td>数据</td>
      <td>数据</td>
      <td>数据</td>
      <td>数据</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th>汇总</th>
      <td>数据</td>
      <td>数据</td>
      <td>数据</td>
      <td>数据</td>
      <td>数据</td>
      <td>数据</td>
      <td>数据</td>
      <td>数据</td>
    </tr>
  </tfoot>
</table>
~~~



