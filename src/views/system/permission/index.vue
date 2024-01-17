<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--查询数据-->
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryRef"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="权限名称" prop="permissionName">
            <el-input
              v-model="queryParams.permissionName"
              placeholder="请输入权限名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="权限模块" prop="permissionModule">
            <el-input
              v-model="queryParams.permissionModule"
              placeholder="请输入权限模块"
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
        <!-- 工具栏 -->
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
        <!-- 表格数据 -->
        <el-table
          v-loading="loading"
          :data="permissionList"
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
            label="权限名称"
            align="center"
            :key="columns[1].key"
            prop="permissionName"
            v-if="columns[1].visible"
            :show-overflow-tooltip="false"
          />
          <el-table-column
            label="权限模块"
            align="center"
            :key="columns[2].key"
            prop="permissionModule"
            v-if="columns[2].visible"
            :show-overflow-tooltip="false"
          />
          <el-table-column
            label="权限行为"
            align="center"
            :key="columns[3].key"
            prop="permissionAction"
            v-if="columns[3].visible"
            :show-overflow-tooltip="false"
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

    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="permRef" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12" :xs="24">
            <el-form-item label="权限名称" prop="permissionName">
              <el-input
                v-model="form.permissionName"
                placeholder="请输入权限名称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="权限模块" prop="permissionModule">
              <el-select
                v-model="form.permissionModule"
                placeholder="请选择权限模块"
              >
                <el-option label="user" value="user"></el-option>
                <el-option label="admin" value="admin"></el-option>
                <el-option label="apitest" value="apitest"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="权限行为" prop="permissionAction">
              <!-- <el-input
                v-model="form.permissionAction"
                placeholder="请输入权限行为"
              /> -->
              <el-select
                v-model="form.permissionAction"
                placeholder="请选择权限行为"
              >
                <el-option label="新增" value="add"></el-option>
                <el-option label="删除" value="delete"></el-option>
                <el-option label="修改" value="update"></el-option>
                <el-option label="查询" value="query"></el-option>
              </el-select>
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
import { getToken } from "@/utils/auth";
import { tableDefaultFormatter } from "@/utils/ruoyi";
import {
  listPermission,
  getPermission,
  addPermission,
  updatePermission,
  deletePermission,
} from "@/api/system/permission";

const router = useRouter();
const { proxy } = getCurrentInstance();

const permissionList = ref([]);
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
  { key: 1, label: `权限名称`, visible: true },
  { key: 2, label: `权限模块`, visible: true },
  { key: 3, label: `权限行为`, visible: true },
  { key: 4, label: `创建时间`, visible: true },
]);

const data = reactive({
  form: {},
  queryParams: {
    page: 1,
    limit: 10,
    permissionName: undefined,
    permissionModule: undefined,
  },
  rules: {
    permissionName: [
      { required: true, message: "权限名称不能为空", trigger: "blur" },
      {
        min: 2,
        max: 30,
        message: "权限名称长度必须介于 2 和 30 之间",
        trigger: "blur",
      },
    ],
    permissionModule: [
      { required: true, message: "权限模块不能为空", trigger: "blur" },
    ],
    permissionAction: [
      { required: true, message: "权限行为不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询权限列表 */
async function getList() {
  loading.value = true;
  const res = await listPermission(
    proxy.addDateRange(queryParams.value, dateRange.value)
  );
  loading.value = false;
  permissionList.value = res.result.data;
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
  const permissionIds = row.id ? [row.id] : ids.value;
  proxy.$modal
    .confirm('是否确认删除编号为"' + permissionIds + '"的数据项？')
    .then(function () {
      return deletePermission(permissionIds);
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
    permissionName: undefined,
    permissionModule: undefined,
    permissionAction: undefined,
  };
  proxy.resetForm("permRef");
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
  title.value = "添加权限";
}
/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  const permissionId = row.id || ids.value;
  const res = await getPermission(permissionId);
  form.value = res.result;
  open.value = true;
  title.value = "修改权限";
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["permRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updatePermission(form.value.id, form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPermission(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

getList();
</script>