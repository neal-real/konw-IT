## 标题组件库

- 标题组件(title):
      show: 是否显示
      text: 标题文字
      subtext: 子标题文字
      left/top/right/bottom: 标题位置
      borderColor: 边框颜色
      borderWidth: 边框宽度

更多查看和设置 ,可以查看 api :  https://echarts.apache.org/v4/zh/option.html#title

~~~HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>03-ECharts标题组件</title>
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
    
    * */
    let option = {
        // 设置图表的标题
        title: {
            show: true,                 //false ,不显示
            text: 'ECharts 入门示例',
            subtext: "学习echarts",      // 子标题文字
            // left: 50,                // 设置标题的偏移量
            // top: 50
            borderWidth: 5,             // 边框宽度
            borderColor: "red"          // 边框颜色
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
            data: [5, 20, 36, 10, 10, 20]
        },{
            name: '产量',
            type: 'bar',
            data: [50, 120, 136, 60, 40, 80]
        }]
    };
    /*6.将配置传递给ECharts*/
    myCharts.setOption(option);
</script>
</body>
</html>
~~~

