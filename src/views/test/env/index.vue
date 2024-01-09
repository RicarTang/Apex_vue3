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
          />
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
    <el-dialog :title="title" v-model="open"  append-to-body>
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

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox
                v-model="upload.updateSupport"
              />是否更新已经存在的用户数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link
              type="primary"
              :underline="false"
              style="font-size: 12px; vertical-align: baseline"
              @click="importTemplate"
              >下载模板</el-link
            >
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Env">
import { getToken } from "@/utils/auth";
import { tableDefaultFormatter } from "@/utils/ruoyi";
import { listEnv, addEnv, getEnv, updateEnv, deleteEnv } from "@/api/test/env";

const router = useRouter();
const { proxy } = getCurrentInstance();

const envList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData",
});
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
  loading.value = false;
  envList.value = res.result.data;
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
/** 执行状态修改  */
function handleStatusChange(row) {
  console.log(row);
  let text = row.case_is_execute === 1 ? "启用" : "停用";
  proxy.$modal
    .confirm('确认要"' + text + '""' + row.case_title + '"用例吗?')
    .then(function () {
      // return changeUserStatus(row.id, row.status);
    })
    .then(() => {
      proxy.$modal.msgSuccess(text + "成功");
    })
    .catch(function () {
      row.case_is_execute = row.case_is_execute === 0 ? 1 : 0;
    });
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
/** 导入按钮操作 */
function handleImport() {
  upload.title = "用户导入";
  upload.open = true;
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "system/user/importTemplate",
    {},
    `user_template_${new Date().getTime()}.xlsx`
  );
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
      response.msg +
      "</div>",
    "导入结果",
    { dangerouslyUseHTMLString: true }
  );
  getList();
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
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