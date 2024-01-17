<template>
  <div class="app-container">
    <!-- 筛选 -->
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="菜单状态"
          clearable
          style="width: 200px"
        >
          <el-option label="启用" value="1" />
          <el-option label="停用" value="0" />
        </el-select>
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
    <!-- 按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Sort" @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <!-- 表格  -->
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :default-expand-all="isExpandAll"
    >
      <el-table-column
        prop="title"
        label="菜单名称"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <span>{{ scope.row.meta.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" align="center">
        <template #default="scope">
          <svg-icon :icon-class="scope.row.meta.icon" />
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="orderNum"
        label="排序"
        width="60"
      ></el-table-column> -->
      <!-- <el-table-column
        prop="perms"
        label="权限标识"
        :show-overflow-tooltip="true"
      ></el-table-column> -->
      <el-table-column
        prop="component"
        label="组件路径"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <!-- <dict-tag :options="sys_normal_disable" :value="scope.row.status" /> -->
          <el-tag
            :type="scope.row.status === 1 ? 'success' : 'warning'"
            class="mx-1"
            effect="light"
            round
          >
            {{ scope.row.status === 1 ? "启用" : "停用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            icon="Plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="open" append-to-body>
      <el-form ref="menuRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12" :xs="24">
            <el-form-item label="上级菜单" prop="parentId">
              <el-tree-select
                v-model="form.parentId"
                :data="menuOptions"
                :props="{
                  value: 'id',
                  label: 'name',
                  children: 'children',
                }"
                value-key="id"
                placeholder="选择上级菜单"
                check-strictly
                :disabled="form.parentId === null ? true : false"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="12" :xs="24">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover placement="bottom-start" :width="540" trigger="click">
                <template #reference>
                  <el-input
                    v-model="form.icon"
                    placeholder="点击选择图标"
                    @blur="showSelectIcon"
                    readonly
                  >
                    <template #prefix>
                      <svg-icon
                        v-if="form.icon"
                        :icon-class="form.icon"
                        class="el-input__icon"
                        style="height: 32px; width: 16px"
                      />
                      <el-icon v-else style="height: 32px; width: 16px"
                        ><search
                      /></el-icon>
                    </template>
                  </el-input>
                </template>
                <icon-select
                  ref="iconSelectRef"
                  @selected="selected"
                  :active-icon="form.icon"
                />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item prop="title">
              <template #label>
                <span>
                  <el-tooltip content="侧边栏菜单名称" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  菜单名称
                </span>
              </template>
              <el-input v-model="form.title" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item prop="name">
              <template #label>
                <span>
                  <el-tooltip content="组件路由名称" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由名称
                </span>
              </template>
              <el-input v-model="form.name" placeholder="请输入菜单标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <template #label>
                <span>
                  <el-tooltip
                    content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由地址
                </span>
              </template>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item prop="component">
              <template #label>
                <span>
                  <el-tooltip
                    content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  组件路径
                </span>
              </template>
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12" :xs="24">
            <el-form-item>
              <el-input
                v-model="form.query"
                placeholder="请输入路由参数"
                maxlength="255"
              />
              <template #label>
                <span>
                  <el-tooltip
                    content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`'
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由参数
                </span>
              </template>
            </el-form-item>
          </el-col> -->
          <el-col :span="12" :xs="24">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip
                    content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  是否缓存
                </span>
              </template>
              <el-radio-group v-model="form.isCache">
                <el-radio :label="0">缓存</el-radio>
                <el-radio :label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip
                    content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  显示状态
                </span>
              </template>
              <el-radio-group v-model="form.hidden">
                <el-radio :label="0">显示</el-radio>
                <el-radio :label="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip
                    content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  菜单状态
                </span>
              </template>
              <el-radio-group v-model="form.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip
                    content="当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  折叠菜单
                </span>
              </template>
              <el-radio-group v-model="form.alwaysShow">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
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

<script setup name="Menu">
import {
  addMenu,
  delMenu,
  getMenu,
  listMenu,
  updateMenu,
} from "@/api/system/menu";
import SvgIcon from "@/components/SvgIcon";
import IconSelect from "@/components/IconSelect";

const { proxy } = getCurrentInstance();

const menuList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const menuOptions = ref([]);
const isExpandAll = ref(false);
const refreshTable = ref(true);
const iconSelectRef = ref(null);
const dateRange = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    menuName: undefined,
  },
  rules: {
    title: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
    name: [{ required: true, message: "菜单标题不能为空", trigger: "blur" }],
    component: [
      { required: true, message: "组件路径不能为空", trigger: "blur" },
    ],
    path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }],
    icon: [{ required: true, message: "菜单图标不能为空", trigger: "blur" }],
    parentId: [
      { required: true, message: "上级菜单不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询菜单列表 */
function getList() {
  loading.value = true;
  listMenu(proxy.addDateRange(queryParams.value, dateRange.value)).then(
    (response) => {
      //  menuList.value = proxy.handleTree(response.data, "menuId");
      menuList.value = response.result.data
      menuOptions.value = response.result.data;
      loading.value = false;
    }
  );
}
/** 查询菜单下拉树结构 */
function getTreeselect() {
  listMenu().then((response) => {
    // const menu = { menuId: 0, menuName: "主类目", children: [] };
    // menu.children = proxy.handleTree(response.data, "menuId");
    // menuOptions.value.push(menu);
    menuOptions.value = response.result.data;
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    parentId: undefined,
    title: undefined,
    icon: undefined,
    isCache: 0,
    hidden: 0,
    status: 1,
    alwaysShow: 0,
  };
  proxy.resetForm("menuRef");
}
/** 展示下拉图标 */
function showSelectIcon() {
  iconSelectRef.value.reset();
}
/** 选择图标 */
function selected(name) {
  form.value.icon = name;
}
/** 搜索按钮操作 */
function handleQuery() {
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 新增按钮操作 */
function handleAdd(row) {
  reset();
  // getTreeselect();
  if (row != null && row.id) {
    form.value.parentId = row.id;
  }
  open.value = true;
  title.value = "添加菜单";
}
/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}
/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  getMenu(row.id).then((response) => {
    form.value = response.result;
    form.value.title = response.result.meta.title;
    form.value.icon = response.result.meta.icon;
    form.value.isCache = response.result.meta.noCache;
    open.value = true;
    title.value = "修改菜单";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["menuRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateMenu(form.value.id, form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addMenu(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  console.log(row);
  proxy.$modal
    .confirm('是否确认删除名称为"' + row.meta.title + '"的数据项?')
    .then(function () {
      return delMenu(row.id);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

getList();
</script>
