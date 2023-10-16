<template>
  <div style="background: #ececec; padding: 30px">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="昨日用例编写比例"
            :value="11.28"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#3f8600' }"
            style="margin-right: 50px"
          >
            <template #prefix>
              <arrow-up-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="昨日用例成功率"
            :value="9.3"
            :precision="2"
            suffix="%"
            class="demo-class"
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix>
              <arrow-down-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <div class="graph">
    <div id="echarts"></div>
    <div id="echarts2"></div>
    <div id="echarts3"></div>
  </div>
</template>
  
<script setup>
import { inject, onMounted } from 'vue'

// 插件依赖注入
const echarts = inject('echarts')
// 渲染柱状图
function initBar() {
  const myEcharts = echarts.init(document.getElementById('echarts')) // 只能使用getElementById
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
  }
  myEcharts.setOption(option)
}
// 渲染饼状图
function initPie() {
  const myEcharts2 = echarts.init(document.getElementById('echarts2')) // 只能使用getElementById
  // 指定图表的配置项和数据

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
  }
  // 使用刚指定的配置项和数据显示图表。

  myEcharts2.setOption(option2)
}
// 渲染环形饼状图
function initPie2() {
  const myEcharts3 = echarts.init(document.getElementById('echarts3')) // 只能使用getElementById

  const option = {
    title: {
      text: '圆环图的例子',
      left: 'center',
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        data: [
          {
            value: 335,
            name: 'A'
          },
          {
            value: 234,
            name: 'B'
          },
          {
            value: 1548,
            name: 'C'
          }
        ],
        radius: ['40%', '70%']
      }
    ]
  }
  myEcharts3.setOption(option)
}

onMounted(() => {
  // 页面渲染
  initBar()
  initPie()
  initPie2()
})
</script>
  
<style lang="scss" scoped>
.graph {
  display: flex;
  width: 100%;
  height: 400px;

  #echarts {
    flex: 1;
  }

  #echarts2 {
    flex: 1;
  }
  #echarts3 {
    flex: 1;
  }
}
</style>