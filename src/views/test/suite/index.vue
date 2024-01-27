<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用例数据-->
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryRef"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="套件名称" prop="suiteTitle">
            <el-input
              v-model="queryParams.suiteTitle"
              placeholder="请输入套件名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="套件编号" prop="suiteNo">
            <el-input
              v-model="queryParams.suiteNo"
              placeholder="请输入套件编号"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="创建时间" style="width: 308px">
            <el-date-picker
              v-model="dateRange"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Position"
              :disabled="multiple"
              @click="handleExecuteSuite"
              >执行套件测试</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="default"
              plain
              icon="Position"
              @click="handleTestSse"
              >测试sse</el-button
            >
          </el-col>

          <right-toolbar
            v-model:showSearch="showSearch"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="caseList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="id" align="center" prop="id" />
          <el-table-column
            label="套件编号"
            align="center"
            :key="columns[0].key"
            prop="suiteNo"
            v-if="columns[0].visible"
          />
          <el-table-column
            label="套件名称"
            align="center"
            :key="columns[1].key"
            prop="suiteTitle"
            v-if="columns[1].visible"
            :show-overflow-tooltip="false"
          />
          <el-table-column
            label="套件说明"
            align="center"
            :key="columns[2].key"
            prop="remark"
            v-if="columns[2].visible"
            :show-overflow-tooltip="false"
            :formatter="tableDefaultFormatter"
          />
          <el-table-column
            label="创建时间"
            align="center"
            :key="columns[3].key"
            prop="createdAt"
            v-if="columns[3].visible"
            width="160"
          >
            <template #default="scope">
              <span>{{ parseTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-row>
                <el-col :span="6">
                  <el-tooltip content="运行套件" placement="top">
                    <el-button
                      link
                      type="primary"
                      icon="Position"
                      @click="handleExecuteSuite(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="6">
                  <el-tooltip content="详情" placement="top">
                    <el-button
                      link
                      type="primary"
                      icon="More"
                      @click="handleSuiteInfo(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="6" v-if="scope.row.status !== 0">
                  <el-tooltip content="打开allure报告" placement="top">
                    <el-button
                      link
                      type="primary"
                      icon="Reading"
                      @click="handleOpenReport(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="6">
                  <el-tooltip content="修改" placement="top">
                    <el-button
                      link
                      type="primary"
                      icon="Edit"
                      @click="handleUpdate(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="6">
                  <el-tooltip content="删除" placement="top">
                    <el-button
                      link
                      type="primary"
                      icon="Delete"
                      @click="handleDelete(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
        <el-row>
          <el-col :span="12" :xs="24">
            <el-form-item label="套件编号" prop="suiteNo">
              <el-input v-model="form.suiteNo" placeholder="请输入套件编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="套件名称" prop="suiteTitle">
              <el-input
                v-model="form.suiteTitle"
                placeholder="请输入套件名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :xs="24">
            <el-form-item label="测试用例" prop="testcaseIds">
              <el-select
                v-model="form.testcaseIds"
                multiple
                placeholder="请选择"
              >
                <el-option
                  v-for="item in caseOptions"
                  :key="item.id"
                  :label="item.caseTitle"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="套件说明" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Suite">
import { tableDefaultFormatter } from "@/utils/ruoyi";
import {
  listSuite,
  addSuite,
  deleteSuite,
  updateSuite,
  getSuite,
  runSuite,
} from "@/api/test/suite";
import { listCase } from "@/api/test/case";
import { Steps } from "ant-design-vue";

const router = useRouter();
const { proxy } = getCurrentInstance();

const caseList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const caseOptions = ref([]);

// 列显隐信息
const columns = ref([
  { key: 0, label: `套件编号`, visible: true },
  { key: 1, label: `套件名称`, visible: true },
  { key: 2, label: `套件说明`, visible: true },
  { key: 3, label: `创建时间`, visible: true },
  // { key: 4, label: `id`, visible: true },
]);

const data = reactive({
  form: {},
  queryParams: {
    page: 1,
    limit: 10,
    suiteTitle: undefined,
    suiteNo: undefined,
  },
  rules: {
    suiteNo: [{ required: true, message: "套件编号不能为空", trigger: "blur" }],
    suiteTitle: [
      { required: true, message: "套件名称不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用例列表 */
async function getList() {
  loading.value = true;
  const res = await listSuite(
    proxy.addDateRange(queryParams.value, dateRange.value)
  );
  loading.value = false;
  caseList.value = res.result.data;
  total.value = res.result.total;
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  // queryParams.value.deptId = undefined;
  // proxy.$refs.deptTreeRef.setCurrentKey(null);
  handleQuery();
}
/** 删除按钮操作 */
function handleDelete(row) {
  const caseIds = row.id ? [row.id] : ids.value;
  proxy.$modal
    .confirm('是否确认删除编号为"' + caseIds + '"的数据项？')
    .then(function () {
      return deleteSuite(caseIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}
/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case "handleResetPwd":
      handleResetPwd(row);
      break;
    case "handleAuthRole":
      handleAuthRole(row);
      break;
    default:
      break;
  }
}
/** 跳转套件详情 */
function handleSuiteInfo(row) {
  const suiteId = row.id;
  // router.push("/test/suite-info/" + suiteId);
  router.push({ name: "SuiteInfo", params: { suiteId: suiteId } });
}
/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 重置操作表单 */
function reset() {
  form.value = {
    id: undefined,
    suiteNo: undefined,
    suiteTitle: undefined,
    // status: "0",
    remark: undefined,
    testcaseIds: undefined,
  };
  proxy.resetForm("userRef");
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 新增按钮操作 */
async function handleAdd() {
  reset();
  // 先获取case list
  const caseList = await listCase();
  caseOptions.value = caseList.result.data;
  open.value = true;
  title.value = "添加测试套件";
}
/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  const suiteId = row.id || ids.value;
  const res = await getSuite(suiteId);
  const caseList = await listCase();
  form.value = res.result;
  caseOptions.value = caseList.result.data;
  // options prop
  form.value.testcaseIds = res.result.testcases.map((item) => item.id);
  open.value = true;
  title.value = "修改测试套件";
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["userRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateSuite(form.value.id, form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSuite(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/**运行套件测试 */
async function handleExecuteSuite(row) {
  const suiteId = row.id || ids.value[0];
  try {
    const res = await runSuite(suiteId);
    proxy.$modal.msgSuccess("测试套件后台运行中");
  } catch (error) {
    proxy.$modal.msgError("测试套件执行失败");
  }
}
/**打开allure报告 */
function handleOpenReport(row) {
  // 在新的浏览器标签中打开新的路由
  window.open(
    import.meta.env.VITE_APP_BASE_API + `/report/${row.taskId}`,
    "_blank"
  );
}

getList();
</script>