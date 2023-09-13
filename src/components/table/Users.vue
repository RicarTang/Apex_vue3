<template>
  <el-row class="table-nav">
    <el-col :span="22">
      <!-- <span>搜索</span> -->
      <el-input v-model="input" placeholder="Please input" size="small" />
      <el-button type="primary">搜索</el-button>

    </el-col>
    <!-- <el-col :span="2">
      <el-button type="primary" @click="changeDialogState">编辑</el-button>
    </el-col> -->
    <el-col :span="2">
      <el-button type="success" @click="clickAdd">新增</el-button>
    </el-col>
  </el-row>

  <Drawer @dialogState="dialogStateEmit" @updateData="updateFormData" :dialogState="dialogState" :formData="formData"
    :formFields="formFields" :loading="loading" :rules="rules" :title="drawerTitle"></Drawer>
  <div class="table-content">
    <CommonTable @pagerFresh="pagerState" :tableData="tableData" :tableController="tableController" :total="total"
      :loading="loading" :selected="selected">
    </CommonTable>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive, ref } from 'vue'
import fetch from '@/api/index'
import { ElMessage } from 'element-plus'
import CommonTable from '@/components/table/CommonTable.vue'
import Drawer from '@/components/drawer/Drawer.vue'
import moment from 'moment';

// 默认请求参数
const state = ref({ page: 1, limit: 10 })
// 表格数据
const tableData = ref([])
// 数据total
const total = ref(0)
// loading状态
const loading = ref(false)
// 表格多选框状态
const selected = ref(false)
// 抽屉显示状态
const dialogState = ref(false)
// drawer标题
const drawerTitle = "新增"
// 表头
const tableController = [
  { label: 'id', prop: 'id' },
  { label: '创建时间', prop: 'created_at' },
  { label: '更新时间', prop: 'update_at' },
  { label: '用户名', prop: 'username' },
  { label: '简介', prop: 'descriptions' },
  { label: '是否活动用户', prop: 'is_active' },
  { label: '是否超级管理员', prop: 'is_super' },
  { type: 'template', label: '操作' },
]
// drawer表单字段值双向绑定
const formData = ref({
  username: "",
  password: "",
  descriptions: "",
  is_active: "",
  is_super: ""
})
// drawer表单规则
const rules = {
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 18,
      message: '密码长度需要在6-18位之间',
      trigger: 'change'
    }
  ]
}
// drawer表单显示字段
const formFields = [
  { label: "用户名", name: "username", type: "input" },
  { label: "密码", name: "password", type: "input" },
  { label: "简介", name: "descriptions", type: "input" },
  { label: "是否活动用户", name: "is_active", type: "select", options: [{ label: "是", value: 1 }, { label: "否", value: 0 }], default: "是" },
  { label: "是否超级管理员", name: "is_super", type: "select", options: [{ label: "是", value: 1 }, { label: "否", value: 0 }], default: "否" },
]




/**新增用户 */
async function addUser(params) {
  loading.value = true;
  try {
    await fetch.addUser(params)
  } catch (error) {
    ElMessage({
      message: '创建失败',
      type: 'error',
    })
  } finally {
    loading.value = false;
  }
}


/**
 * 更改抽屉显示状态
 */
function changeDialogState() {
  dialogState.value = !dialogState.value
  console.log(dialogState.value)
}

/**点击新增按钮 */
function clickAdd() {
  changeDialogState()
}
/**接收emit传过来的page参数 */
async function pagerState(params) {
  state.value = params
  await fetchUsersData(params)
}
/**接收drawer组件传递的状态值 */
function dialogStateEmit(params) {
  // 修改显示状态
  dialogState.value = params
}
/**接收drawer组件传递的formData */
async function updateFormData(params) {
  console.log(params)
  // 新增用户
  await addUser(params)
}

/**
 * 拉取所有用户用户数据
 * @param {*} params page limit对象
 */
async function fetchUsersData(params) {
  loading.value = true;
  try {
    const users = await fetch.fetchUsers(params)
    // 赋值
    tableData.value = formatTableData(users.data.result.data);
    total.value = users.data.result.total
  } catch (error) {
    console.log("加载失败")
    ElMessage({
      message: '加载失败',
      type: 'error',
    })
  } finally {
    loading.value = false;
  }
}
/**枚举对象 */
const enumMapping = {
  1: '是',
  0: '否',
};

/**格式化tableData */
function formatTableData(data) {
  const formatData = data.map((item) => {
    // 格式化日期时间
    item.created_at = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss');
    item.update_at = moment(item.update_at).format('YYYY-MM-DD HH:mm:ss');
    // 格式化枚举
    item.is_active = enumMapping[item.is_active] || '未知';
    item.is_super = enumMapping[item.is_super] || '未知';
    // 返回每条item组成新的数组
    return item;
  });
  return formatData
}
onBeforeMount(async () => {
  // 页面渲染后展示数据
  await fetchUsersData(state.value)
})


</script>

<style lang="scss" scoped>
.table-nav {
  display: flex;
  height: 5rem;

  align-items: center;

  .el-col {
    display: flex;
    justify-content: center;

    .el-input__wrapper {
      padding: 1px 15px;
    }
  }
}
</style>