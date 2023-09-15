<template>
    <div class="graph">
        <div id="echarts">
        </div>
        <div id="echarts2">
        </div>
    </div>
</template>
  
<script setup>
import { inject, onMounted } from "vue";

const echarts = inject("echarts")
console.log("echarts", echarts)
onMounted(() => {
    const myEcharts = echarts.init(document.getElementById("echarts"))  // 只能使用getElementById
    const myEcharts2 = echarts.init(document.getElementById("echarts2"))  // 只能使用getElementById
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
    const option2 = {
        series: [
            {
                type: 'pie',
                data: [
                    {
                        value: 335,
                        name: '直接访问'
                    },
                    {
                        value: 234,
                        name: '联盟广告'
                    },
                    {
                        value: 1548,
                        name: '搜索引擎'
                    }
                ]
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myEcharts.setOption(option);
    myEcharts2.setOption(option2);
})

</script>
  
<style lang="scss" scoped>
.graph {
    display: flex;
    width: 100%;
    height: 400px;
    // height: 100%;
    flex: 1;

    #echarts {
        flex: 1;
        flex-basis: 0;
    }

    #echarts2 {
        flex: 1;
        flex-basis: 0;
    }
}
</style>