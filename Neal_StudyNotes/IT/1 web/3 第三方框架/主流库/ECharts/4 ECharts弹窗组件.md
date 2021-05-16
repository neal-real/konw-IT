## ECharts弹窗组件

## 弹窗组件(tooltip):

- show: 是否显示
- trigger:显示方式, axis X轴显示

## 数据标记

- markLine: 标记线
  - 最大值/最小值/平均值等
- markPoint: 标记点
  - 最大值/最小值/平均值等

~~~HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>05-ECharts弹窗组件</title>
    <!--1.导入ECharts插件-->
    <script src="js/echarts.js"></script>
</head>
<body>
<!--2.为ECharts准备一个容器-->
<div style="width: 600px; height: 400px; border: 1px solid #000;"></div>
<script>
    /*3.拿到准备好的容器*/
    let oDiv = document.querySelector("div");
    /*4.创建一个ECharts对象*/
    let myCharts = echarts.init(oDiv);
    /*5.对ECharts进行一些配置*/
    /*
    弹窗组件(tooltip):
    show: 是否显示
    trigger:显示方式, axis X轴显示

    数据标记
    markLine: 标记线
        最大值/最小值/平均值等
    markPoint: 标记点
        最大值/最小值/平均值等
    * */
    let option = {
        tooltip:{
            show: true,
            trigger: "axis"
        },
        // 设置图表的标题
        title: {
            show: true,
            text: 'ECharts 入门示例',
        },
        // 设置图表的图例
        legend: {
            data:['销量', '产量']
        },
        // 设置X轴上显示的数据
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        // 设置Y轴上显示的数据, 如果没有设置会根据数据自动填充
        yAxis: {},
        // 设置图表的数据
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
            markPoint: {
                data: [
                    {type:"max", name:"最大值"},
                    {type:"min", name:"最小值"},
                ]
            },
            markLine: {
                data: [
                    {type:"max", name:"最大值"},
                    {type:"min", name:"最小值"},
                    {type:"average", name:"平均值"},
                ]
            }
        }]
    };
    /*6.将配置传递给ECharts*/
    myCharts.setOption(option);
</script>
</body>
</html>
~~~

