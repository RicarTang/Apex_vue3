<template>
  <div class="app-container home">
    <!-- 统计 -->
    <div class="app-container-top">
      <el-row :gutter="20">
        <!-- 左侧用户展示 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="16">
          <el-row>
            <el-col :span="2">
              <el-avatar shape="circle" :size="40" :src="userStore.avatar" />
            </el-col>
            <el-col :span="22">
              <h3>欢迎使用接口测试平台！{{ userStore.name }}</h3>
            </el-col>
          </el-row>
        </el-col>
        <!-- 右侧统计组件 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="8">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-statistic :value="15">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    参与项目
                    <el-tooltip
                      effect="dark"
                      content="参与编写用例项目"
                      placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
            </el-col>
            <el-col :span="8">
              <el-statistic :value="98500">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    用例数量
                    <el-tooltip
                      effect="dark"
                      content="编写用例数量"
                      placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
            </el-col>
            <el-col :span="8">
              <el-statistic :value="8">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    定时任务
                    <el-tooltip
                      effect="dark"
                      content="总定时任务"
                      placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <hr />
    <!-- 图表展示 -->
    <div class="app-container-bottom">
      <el-row :gutter="20">
        <!-- 左侧测试统计 -->
        <el-col :xs="24" :sm="24" :md="16" :lg="18">
          <el-card>
            <template #header>
              <h3 style="vertical-align: middle">
                <b>关注中的测试计划 (2个)</b>
              </h3></template
            >
            <Card hoverable title="test">
              <el-row :gutter="18">
                <el-col :span="8">
                  <Card hoverable>
                    <template #title>
                      <h5 style="vertical-align: middle">
                        最近一次测试情况
                      </h5></template
                    >
                    <template #extra>
                      <el-tooltip
                        effect="dark"
                        content="最近一次测试情况"
                        placement="top"
                      >
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-progress
                      type="circle"
                      :percentage="100"
                      status="success"
                    >
                      <el-button type="success" circle>
                        <template #icon>
                          <Check />
                        </template>
                      </el-button>
                    </el-progress>
                  </Card>
                </el-col>
                <el-col :span="8">
                  <Card hoverable>
                    <template #title>
                      <h5 style="vertical-align: middle">时间</h5></template
                    >
                    <template #extra>
                      <el-tooltip
                        effect="dark"
                        content="最近一次执行通过率"
                        placement="top"
                      >
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-progress
                      type="circle"
                      :percentage="100"
                      status="success"
                    >
                      <el-button type="success" circle>
                        <template #icon>
                          <Check />
                        </template>
                      </el-button>
                    </el-progress>
                  </Card>
                </el-col>
                <el-col :span="8">
                  <Card hoverable>
                    <template #title>
                      <h5 style="vertical-align: middle">
                        近七次通过率(%)
                      </h5></template
                    >
                    <template #extra>
                      <el-tooltip
                        effect="dark"
                        content="最近7次通过率"
                        placement="top"
                      >
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </template>
                    <el-progress
                      type="circle"
                      :percentage="100"
                      status="success"
                    >
                      <el-button type="success" circle>
                        <template #icon>
                          <Check />
                        </template>
                      </el-button>
                    </el-progress>
                  </Card>
                </el-col>
              </el-row>
            </Card>
          </el-card>
        </el-col>
        <!-- 右侧用例统计 -->
        <el-col :xs="24" :sm="24" :md="8" :lg="6">
          <el-card>
            <template #header
              ><PieChart
                style="width: 1em; height: 1em; vertical-align: middle"
              />
              <span style="vertical-align: middle">
                <b>最近7天编写测试用例数量</b>
              </span></template
            >
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <div ref="caseTotalRef" style="height: 420px" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup name="Index">
import * as echarts from "echarts";
import { onMounted } from "vue";
import useUserStore from "@/store/modules/user";
import { Card } from "ant-design-vue";

const userStore = useUserStore();

const testTotalRef = ref(null);

// onMounted(() => {
//   console.log(testTotalRef.value);
//   const testTotalIntance = echarts.init(testTotalRef.value);
//   testTotalIntance.setOption({
//     tooltip: {
//       trigger: "item",
//     },
//     legend: {
//       top: "5%",
//       left: "center",
//     },
//     series: [
//       {
//         name: "Access From",
//         type: "pie",
//         radius: ["40%", "70%"],
//         avoidLabelOverlap: false,
//         itemStyle: {
//           borderRadius: 10,
//           borderColor: "#fff",
//           borderWidth: 2,
//         },
//         label: {
//           show: false,
//           position: "center",
//         },
//         emphasis: {
//           label: {
//             show: true,
//             fontSize: 40,
//             fontWeight: "bold",
//           },
//         },
//         labelLine: {
//           show: false,
//         },
//         data: [
//           { value: 1048, name: "Search Engine" },
//           { value: 735, name: "Direct" },
//           { value: 580, name: "Email" },
//           { value: 484, name: "Union Ads" },
//           { value: 300, name: "Video Ads" },
//         ],
//       },
//     ],
//   });
//   // 响应式变更实例大小
//   window.addEventListener("resize", () => {
//     testTotalIntance.resize();
//   });
// });

function goTarget(url) {
  window.open(url, "__blank");
}
</script>

<style scoped lang="scss">
.home {
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

