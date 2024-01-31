<template>
  <div class="app-container">
    <!-- 操作按钮 -->
    <el-form label-width="100px">
      <div class="operation">
        <el-button
          type="success"
          round
          plain
          icon="Position"
          @click="handleRunCase"
          >运行用例</el-button
        >
        <el-button
          type="primary"
          round
          @click="submitForm"
          :disabled="isFormDirty"
          >提交修改</el-button
        >
        <el-button @click="close" round>返回</el-button>
      </div>
    </el-form>
    <h4 class="form-header h4">用例信息</h4>
    <!-- 用例信息 -->
    <el-form
      :model="form"
      :rules="testCase.rules"
      label-width="80px"
      label-position="top"
      size="large"
      style="padding: 0 30px"
    >
      <el-row :gutter="100">
        <el-col :span="12" :xs="24">
          <el-form-item label="用例编号" prop="caseNo">
            <el-input v-model="form.caseNo" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="用例标题" prop="caseTitle">
            <el-input v-model="form.caseTitle" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="所属模块" prop="caseModule">
            <el-input v-model="form.caseModule" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="所属子模块" prop="caseSubModule">
            <el-input v-model="form.caseSubModule" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="请求方法" prop="apiMethod">
            <el-input v-model="form.apiMethod" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="请求路径" prop="apiPath">
            <el-input v-model="form.apiPath" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用例说明" prop="caseDescription">
            <el-input v-model="form.caseDescription" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 测试结果展示框 -->
    <el-dialog :title="execute.title" v-model="execute.open" append-to-body>
      <el-result :icon="execute.resultIcon" :sub-title="execute.resultSubTitle">
        <template #extra>
          <el-descriptions direction="vertical" :column="2" border>
            <el-descriptions-item label="响应状态码">
              <el-tag
                :type="execute.resultStatusCode === 200 ? 'success' : 'danger'"
                >{{
                  execute.resultStatusCode ? execute.resultStatusCode : "-"
                }}</el-tag
              >
            </el-descriptions-item>
            <el-descriptions-item label="响应时间">
              <i>{{
                execute.resultResponseTime ? execute.resultResponseTime : "-"
              }}</i>
              ms
            </el-descriptions-item>
            <el-descriptions-item label="响应头" :span="2">
              <vue-json-pretty :data="execute.resultHeaders" showLineNumber />
            </el-descriptions-item>
            <el-descriptions-item label="响应体" :span="2">
              <vue-json-pretty :data="execute.resultContent" showLineNumber />
            </el-descriptions-item>
          </el-descriptions>
        </template>
        <template #title>
          <p :style="execute.resultTitleStyle">{{ execute.resultTitle }}</p>
        </template>
      </el-result>
    </el-dialog>
  </div>
</template>
 
 <script setup name="CaseInfo">
import { getCase, executeCase } from "@/api/test/case";
import { onMounted, reactive } from "vue";

const route = useRoute();
const { proxy } = getCurrentInstance();

const loading = ref(true);
const isFormDirty = ref(true);
const form = ref({});
// 测试用例相关
const testCase = reactive({
  caseId: undefined,
  // 表单规则
  rules: {
    caseNo: [
      { required: true, message: "用例编号不能为空", trigger: "blur" },
      {
        max: 10,
        message: "用例编号长度必须小于10",
        trigger: "blur",
      },
    ],
    caseTitle: [
      { required: true, message: "用例标题不能为空", trigger: "blur" },
      {
        max: 50,
        message: "用例标题长度必须小于50",
        trigger: "blur",
      },
    ],
    caseModule: [
      { required: true, message: "用例所属模块不能为空", trigger: "blur" },
      {
        max: 20,
        message: "用例所属模块长度必须小于20",
        trigger: "blur",
      },
    ],
    apiPath: [
      { required: true, message: "用例接口地址不能为空", trigger: "blur" },
    ],
    requestParam: [
      { required: true, message: "用例接口请求参数不能为空", trigger: "blur" },
    ],
    expectCode: [
      {
        required: true,
        message: "用例预期网络状态码不能为空",
        trigger: "blur",
      },
    ],
    apiMethod: [
      {
        required: true,
        message: "api方法不能为空",
        trigger: "blur",
      },
    ],
    requestParamType: [
      {
        required: true,
        message: "请求参数类型不能为空",
        trigger: "blur",
      },
    ],
  },
});
/**执行用例参数 */
const execute = reactive({
  // 是否显示执行结果弹出框
  open: false,
  // 弹出层标题
  title: "测试结果",
  // 测试结果icon
  resultIcon: undefined,
  // 测试结果标题
  resultTitle: undefined,
  // 标题样式
  resultTitleStyle: {},
  // 测试结果子标题
  resultSubTitle: undefined,
  // 测试结果响应状态码
  resultStatusCode: undefined,
  // 响应时间
  resultResponseTime: undefined,
  // 测试结果响应头
  resultHeaders: undefined,
  // 测试结果响应体
  resultContent: undefined,
});

/** 关闭按钮 */
function close() {
  const obj = { path: "/test/case" };
  proxy.$tab.closeOpenPage(obj);
}
/** 提交按钮 */
function submitForm() {
  const userId = form.value.userId;
  const rIds = suiteIds.value.join(",");
  updateAuthRole({ userId: userId, suiteIds: rIds }).then((response) => {
    proxy.$modal.msgSuccess("授权成功");
    close();
  });
}
/**运行用例 */
async function handleRunCase() {}

/**请求，初始化 */
async function fetchData() {
  testCase.caseId = route.params && route.params.caseId;
  if (testCase.caseId) {
    loading.value = true;
    const response = await getCase(testCase.caseId);
    form.value = response.result;
    loading.value = false;
  }
}
onMounted(async () => {
  await fetchData();
  /**监听整个表单控制按钮状态 */
  watch(
    form,
    (newValue, oldValue) => {
      isFormDirty.value = false;
    },
    { deep: true }
  );
});
</script>
<style lang="scss" scoped>
.operation {
  text-align: right;
}
</style>
 