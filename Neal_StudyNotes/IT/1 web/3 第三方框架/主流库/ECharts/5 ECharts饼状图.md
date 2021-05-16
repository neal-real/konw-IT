## ECharts饼状图



> type: 'pie'

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>06-ECharts饼状图</title>
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
    let option = {
        // 设置图表的标题
        title: {
            show: true,
            text: 'ECharts 入门示例',
        },
        // 设置图表的图例
        legend: {
            data:['销量', '产量', '容量']
        },
        // 设置图表的数据
        series: [{
            // 饼状图的半径
            radius: "30%",
            // x 和 y 轴的位置
            center: ["10%", "50%"],
            // 饼状图
            type: 'pie',
            data: [
                {value: 123, name: "销量"},
                {value: 456, name: "产量"},
                {value: 789, name: "容量"},
            ],
        }]
    };
    /*6.将配置传递给ECharts*/
    myCharts.setOption(option);
</script>
</body>
</html>
~~~

