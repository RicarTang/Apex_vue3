<template>
  <div class="app-container">
    <el-form label-width="100px">
      <div class="operation">
        <el-button
          type="success"
          round
          plain
          icon="Position"
          @click="handleRunSuite"
          >运行套件</el-button
        >
        <el-button
          type="info"
          color="#d35ebe"
          round
          plain
          icon="Reading"
          @click="handleOpenReport"
          v-if="suite.isReport"
          >查看allure报告</el-button
        >
        <el-button type="primary" round @click="submitForm">提交修改</el-button>
        <el-button @click="close" round>返回</el-button>
      </div>
    </el-form>
    <h4 class="form-header h4">套件信息</h4>
    <el-form :model="form" label-width="80px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="套件编号" prop="suiteNo">
            <el-input v-model="form.suiteNo" />
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="套件名称" prop="suiteTitle">
            <el-input v-model="form.suiteTitle" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="套件说明" prop="remark">
            <el-input v-model="form.remark" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4 class="form-header h4">套件用例信息</h4>
    <el-table
      v-loading="loading"
      :row-key="getRowKey"
      @row-click="clickRow"
      ref="caseRef"
      @selection-change="handleSelectionChange"
      :data="testcases.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
    >
      <el-table-column label="序号" width="55" type="index" align="center">
        <template #default="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="55"
      ></el-table-column>
      <el-table-column label="用例编号" align="center" prop="caseNo">
        <template #default="scope">
          <router-link
            :to="{ name: 'CaseInfo', params: { caseId: scope.row.id } }"
            :style="{ color: 'blue', cursor: 'pointer' }"
          >
            {{ scope.row.caseNo }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="用例标题" align="center" prop="caseTitle" />
      <el-table-column label="所属模块" align="center" prop="caseModule" />
      <el-table-column label="api路径" align="center" prop="apiPath" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="pageNum"
      v-model:limit="pageSize"
    />
    <!-- 测试进度弹窗 -->
    <el-dialog
      v-model="suite.sseOpen"
      title="测试详情"
      @close="handleCloseSse"
      :close-on-click-modal="false"
    >
      <!-- <Steps :current="testProcess.currentStep" :items="testProcess.setpItems">
      </Steps> -->
      <Result :title="testProcess.title" style="padding: 0px 0px;">
        <template #icon>
          <smile-outlined
            v-if="testProcess.status === 'success'"
          ></smile-outlined>
          <loading-outlined
            v-else-if="testProcess.status === 'process'"
          ></loading-outlined>
        </template>
       
      </Result>
      <Console :logs="suite.sseMessages"></Console>
    </el-dialog>
  </div>
</template>
 
 <script setup name="SuiteInfo">
import { Result } from "ant-design-vue";
import { LoadingOutlined, SmileOutlined } from "@ant-design/icons-vue";
import Console from "@/components/Console";
import { getSuite, runSuite } from "@/api/test/suite";
import { reactive } from "vue";

const route = useRoute();
const { proxy } = getCurrentInstance();

const loading = ref(true);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
const testcases = ref([]);
const suite = reactive({
  // id
  suiteId: undefined,
  // 是否有报告
  isReport: false,
  // 报告的task id
  taskId: undefined,
  // 测试过程信息
  sseMessages: [],
  // 控制测试过程弹窗开关
  sseOpen: false,
});
const form = ref({
  suiteNo: undefined,
  suiteTitle: undefined,
  remark: undefined,
});
// 测试过程
const testProcess = reactive({
  // result组件title
  title: "测试运行中",
  // result组件status
  status: "process",
});

/** 单击选中行数据 */
function clickRow(row) {
  proxy.$refs["caseRef"].toggleRowSelection(row);
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  roleIds.value = selection.map((item) => item.id);
}
/** 保存选中的数据编号 */
function getRowKey(row) {
  return row.id;
}
/** 关闭按钮 */
function close() {
  const obj = { path: "/test/suite" };
  proxy.$tab.closeOpenPage(obj);
}
/** 提交按钮 */
function submitForm() {
  const userId = form.value.userId;
  const rIds = roleIds.value.join(",");
  updateAuthRole({ userId: userId, roleIds: rIds }).then((response) => {
    proxy.$modal.msgSuccess("授权成功");
    close();
  });
}
/**运行套件测试 */
async function handleRunSuite() {
  const res = await runSuite(suite.suiteId);
  suite.taskId = res.result.task_id;
  handleTestSse(res.result.task_id);
}
/**查看allure报告 */
async function handleOpenReport() {
  // 在新的浏览器标签中打开新的路由
  window.open(
    import.meta.env.VITE_APP_BASE_API + `/report/${suite.taskId}`,
    "_blank"
  );
}

let eventSource;
/**sse测试 */
function handleTestSse(task_id) {
  suite.sseOpen = true;
  // 向SSE端点发起请求
  eventSource = new EventSource(
    `${import.meta.env.VITE_APP_BASE_API}/testsuite/runState?task_id=${task_id}`
  );
  // 监听SSE消息
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    suite.sseMessages.push(data);
    if (data.message.status === 1) {
      // 变更当前status,title
      testProcess.title = "测试完成";
      testProcess.status = "success";
    }
  };
  eventSource.onopen = () => {
    console.log("EventSource connected");
  };

  // 监听错误事件
  eventSource.onerror = (error) => {
    console.error("Error occurred:", error);
    eventSource.close(); // 在出现错误时关闭连接
  };
}
/**关闭sse dialog */
function handleCloseSse() {
  console.log("关闭sse连接");
  eventSource.close();
  // 重置result状态
  testProcess.title = "测试运行中";
  testProcess.status = "process";
}

(() => {
  suite.suiteId = route.params && route.params.suiteId;
  if (suite.suiteId) {
    loading.value = true;
    getSuite(suite.suiteId).then((response) => {
      form.value = response.result;
      suite.taskId = response.result.taskId;
      if (response.result.status !== 0) {
        suite.isReport = true;
      }
      testcases.value = response.result.testcases;
      total.value = testcases.value.length;
      //    nextTick(() => {
      //      roles.value.forEach(row => {
      //        if (row.flag) {
      //          proxy.$refs["roleRef"].toggleRowSelection(row);
      //        }
      //      });
      //    });
      loading.value = false;
    });
  }
})();
</script>
<style lang="scss" scoped>
.operation {
  text-align: right;
}
</style>
 