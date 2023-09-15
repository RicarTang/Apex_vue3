<template>
    <div id="echarts">
    </div>
</template>
  
<script setup>
import { inject, onMounted } from "vue";

const echarts = inject("echarts")
console.log("echarts",echarts)
onMounted(() => {
    const myEcharts = echarts.init(document.getElementById("echarts"))  // 只能使用getElementById
    // 指定图表的配置项和数据
    // 指定图表的配置项和数据
    const option = {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data: ['销量']
        },
        xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
            {
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myEcharts.setOption(option);
})

</script>
  
<style lang="scss" scoped>
#echarts{
    width: 100%;
    height: 400px;
}
</style>