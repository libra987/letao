$(function () {
    checkLogIn();
    $('.main .bar .toggle').click(function () {
        $('.main, .main .left').toggleClass('active')
    })

    // 基于准备好的dom，初始化echarts实例
    var bar = echarts.init(document.querySelector('.charts .bar'));
    option = {
        xAxis: {
            type: 'category',
            data: ['一月', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
        }]
    };
    

     // 使用刚指定的配置项和数据显示图表。
     bar.setOption(option);    

     var pie = echarts.init(document.querySelector('.charts .pie'));
     option = {
        title : {
            text: '热门品牌销售',
            subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['阿迪','椰子','vans','offsetWhite','nike']
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'阿迪'},
                    {value:310, name:'椰子'},
                    {value:234, name:'vans'},
                    {value:135, name:'offsetWhite'},
                    {value:1548, name:'nike'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    
     pie.setOption(option);    

})