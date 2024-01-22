<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--环境变量数据-->
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryRef"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="环境名称" prop="envName">
            <el-input
              v-model="queryParams.envName"
              placeholder="请输入环境名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="环境地址" prop="envUrl">
            <el-input
              v-model="queryParams.envUrl"
              placeholder="请输入环境地址"
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
          <right-toolbar
            v-model:showSearch="showSearch"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="envList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="id"
            align="center"
            :key="columns[0].key"
            prop="id"
            v-if="columns[0].visible"
          />
          <el-table-column
            label="环境名称"
            align="center"
            :key="columns[1].key"
            prop="envName"
            v-if="columns[1].visible"
            :show-overflow-tooltip="false"
          />
          <el-table-column
            label="环境地址"
            align="center"
            :key="columns[2].key"
            prop="envUrl"
            v-if="columns[2].visible"
            :show-overflow-tooltip="false"
          >
            <template #default="scope">
              <span>
                <i class="current-env">{{ scope.row.envUrl }}</i>
                <el-tag type="success" v-if="scope.row.envUrl === currentEnv">
                  current
                </el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            align="center"
            :key="columns[3].key"
            prop="remark"
            v-if="columns[3].visible"
            :show-overflow-tooltip="false"
            :formatter="tableDefaultFormatter"
          />
          <el-table-column
            label="创建时间"
            align="center"
            :key="columns[4].key"
            v-if="columns[4].visible"
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
              <el-tooltip content="设置为当前环境变量" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Refresh"
                  @click="handleChangeEnv(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="修改" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                ></el-button>
              </el-tooltip>
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

    <!-- 添加或修改环境变量对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="envRef" label-width="80px">
        <el-row>
          <el-col :span="12" :xs="24">
            <el-form-item label="环境名称" prop="envName">
              <el-input
                v-model="form.envName"
                placeholder="请输入环境变量名称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="环境地址" prop="envUrl">
              <el-input
                v-model="form.envUrl"
                placeholder="请输入环境变量地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
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

<script setup name="Env">
import { tableDefaultFormatter } from "@/utils/ruoyi";
import {
  listEnv,
  addEnv,
  getEnv,
  updateEnv,
  deleteEnv,
  getCurrentEnv,
  setCurrentEnv,
} from "@/api/test/env";

const router = useRouter();
const { proxy } = getCurrentInstance();

const envList = ref([]);
const currentEnv = ref("");
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
// 列显隐信息
const columns = ref([
  { key: 0, label: `id`, visible: true },
  { key: 1, label: `环境名称`, visible: true },
  { key: 2, label: `环境地址`, visible: true },
  { key: 3, label: `备注`, visible: true },
  { key: 4, label: `创建时间`, visible: true },
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
    envName: [
      { required: true, message: "环境变量名称不能为空", trigger: "blur" },
      {
        min: 2,
        max: 30,
        message: "环境变量名称长度必须介于 2 和 30 之间",
        trigger: "blur",
      },
    ],
    envUrl: [
      { required: true, message: "环境变量地址不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询环境列表 */
async function getList() {
  loading.value = true;
  const res = await listEnv(
    proxy.addDateRange(queryParams.value, dateRange.value)
  );
  await queryCurrentEnv();
  console.log(currentEnv.value);
  loading.value = false;
  envList.value = res.result.data;
  total.value = res.result.total;
}
/**获取当前环境变量 */
async function queryCurrentEnv() {
  const env = await getCurrentEnv();
  currentEnv.value = env.result;
}
/**设置当前环境变量 */
async function handleChangeEnv(row) {
  const envId = row.id ? row.id : ids.value[0];
  const res = await setCurrentEnv(envId);
  proxy.$modal.msgSuccess("设置成功");
  currentEnv.value = res.result;
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
  handleQuery();
}
/** 删除按钮操作 */
function handleDelete(row) {
  const envIds = row.id ? [row.id] : ids.value;
  console.log(envIds);
  proxy.$modal
    .confirm('是否确认删除编号为"' + envIds + '"的数据项？')
    .then(function () {
      return deleteEnv(envIds);
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
    envName: undefined,
    envUrl: undefined,
    remark: undefined,
  };
  proxy.resetForm("envRef");
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加环境变量";
}
/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  const envId = row.id || ids.value;
  const res = await getEnv(envId);
  form.value = res.result;
  open.value = true;
  title.value = "修改环境变量";
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["envRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateEnv(form.value.id, form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEnv(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

// getDeptTree();
getList();
</script>
<style lang="scss">
.current-env {
  margin-right: 2px;
  font-style: normal;
}
</style>