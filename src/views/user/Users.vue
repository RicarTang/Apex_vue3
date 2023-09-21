<template>
  <!-- 搜索 -->
  <div class="header">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" :icon="Plus" @click="clickAdd">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" :icon="Delete" @click="selectDelete"
          :disabled="tableSelected.length === 0">删除</el-button>
      </el-form-item>
      <el-form-item label="用户名:">
        <el-input v-model="formInline.username" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="searchUser">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 编辑/新建用户表单抽屉 -->
  <Drawer @dialogState="dialogStateEmit" @updateData="updateFormData" :dialogState="dialogState" :formData="formData"
    :formFields="formFields" :confirmLoading="confirmLoading" :rules="rules" :title="drawerTitle"></Drawer>
  <!-- 用户table -->
  <div class="table-content">
    <CommonTable :tableData="tableData" :tableController="tableController" :tableLoading="tableLoading"
      :selected="selected" @editData="editData" @deleteData="deleteData" @selectDatas="selectDatas">
    </CommonTable>
  </div>
  <!-- 分页器 -->
  <Pagination @pagerFresh="pagerState" :total="total"></Pagination>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import fetch from '@/api/index'
import { ElMessage } from 'element-plus'
import CommonTable from '@/components/table/CommonTable.vue'
import Pagination from '@/components/pagination/Pagination.vue'
import Drawer from '@/components/drawer/Drawer.vue'
import moment from 'moment'
import { boolToStrEnum } from '@/utils/enum'
import { Plus, Delete, Search } from '@element-plus/icons-vue'

// 默认请求参数
const state = ref({ page: 1, limit: 10 })
// 表格数据
const tableData = ref([])
// 数据total
const total = ref(0)
// 表格loading状态
const tableLoading = ref(false)
// button loading状态
const confirmLoading = ref(false)
// 表格多选框状态
const selected = ref(true)
// 抽屉显示状态
const dialogState = ref(false)
// drawer标题
const drawerTitle = ref('')
// 查询表单
const formInline = ref({
  username: ''
})
// drawer表单字段
const formFields = ref([])
// 表格多选数据
const tableSelected = ref([])

// 表头
const tableController = [
  { label: 'id', prop: 'id' },
  { label: '创建时间', prop: 'created_at' },
  { label: '更新时间', prop: 'update_at' },
  { label: '用户名', prop: 'username' },
  { label: '简介', prop: 'descriptions' },
  { label: '是否活动用户', prop: 'is_active' },
  { label: '是否超级管理员', prop: 'is_super' },
  { type: 'template', label: '操作', fixed: 'right', width: '205px' }
]
// drawer表单字段值双向绑定
const formData = ref({
  username: '',
  password: '',
  descriptions: ''
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
onBeforeMount(async () => {
  // 页面渲染后展示表格数据
  await fetchUsersData(state.value)
})
/**搜索用户 */
async function searchUser() {
  tableLoading.value = true
  try {
    let users = await fetch.queryUsers(formInline.value)
    // 赋值
    tableData.value = formatTableData(users.data.result.data)
    total.value = users.data.result.total
  } finally {
    tableLoading.value = false
  }
}
/**
 * 新增用户
 * @param {*} data 创建用户请求体
 */
async function addUser(data) {
  confirmLoading.value = true
  try {
    await fetch.addUser(data)
    // 新增成功弹窗
    ElMessage({
      message: '新增用户成功',
      type: 'success'
    })
    // 新增后刷新table
    await fetchUsersData()
  } catch (error) {
    // 失败弹窗
    ElMessage({
      message: '新增用户失败',
      type: 'error'
    })
    console.log(error)
  } finally {
    // 新增用户成功返回后关闭drawer，取消按钮loading状态
    confirmLoading.value = false
    dialogState.value = false
  }
}
/**编辑用户
 *
 * @param {*} user_id 用户id
 * @param {*} data  请求体
 */
async function editUser(user_id, data) {
  confirmLoading.value = true
  try {
    await fetch.updateUser(user_id, data)
    // 修改成功弹窗
    ElMessage({
      message: '编辑用户成功',
      type: 'success'
    })
    // 编辑后刷新table
    await fetchUsersData()
  } catch (error) {
    // 失败弹窗
    ElMessage({
      message: '编辑用户失败',
      type: 'error'
    })
    console.log(error)
  } finally {
    // 编辑用户成功返回后关闭drawer，取消按钮loading状态
    confirmLoading.value = false
    dialogState.value = false
  }
}

/**
 * 更改抽屉显示状态
 */
function changeDialogState() {
  dialogState.value = !dialogState.value
}

/**点击新增按钮 */
function clickAdd() {
  // 修改drawer标题
  drawerTitle.value = '新增'
  // 更改状态
  changeDialogState()
  // drawer表单显示字段
  formFields.value = [
    { label: '用户名', name: 'username', type: 'input' },
    { label: '密码', name: 'password', type: 'input' },
    { label: '简介', name: 'descriptions', type: 'input' }
  ]
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
/**接收drawer组件传递的formData,选择性的请求接口 */
async function updateFormData(params) {
  console.log('接收到的formData', params)
  if (drawerTitle.value === '新增') {
    // 接收到数据意味着用户输入结束并且点击了提交按钮,新增用户
    await addUser(params)
  } else {
    // 编辑
    await editUser(params.id, params)
  }
}

/**
 * 拉取所有用户用户数据
 * @param {*} params page limit对象
 */
async function fetchUsersData(params) {
  tableLoading.value = true
  try {
    const users = await fetch.fetchUsers(params)
    // 赋值,formatTableData对接口数据进行格式化
    tableData.value = formatTableData(users.data.result.data)
    total.value = users.data.result.total
  } catch (error) {
    ElMessage({
      message: '数据加载失败',
      type: 'error'
    })
    console.log(error)
  } finally {
    tableLoading.value = false
  }
}

/**格式化tableData */
function formatTableData(data) {
  const formatData = data.map((item) => {
    // 格式化日期时间
    item.created_at = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
    item.update_at = moment(item.update_at).format('YYYY-MM-DD HH:mm:ss')
    // 格式化枚举
    item.is_active = boolToStrEnum[item.is_active] || '未知'
    item.is_super = boolToStrEnum[item.is_super] || '未知'
    // 为每条item添加自己的loading
    item.loading = false;
    // 返回每条item组成新的数组
    return item
  })
  return formatData
}
/**
 * 接收修改表格数据时的emit
 * @param {*} index
 * @param {*} row
 */
function editData(index, row) {
  // drawer title
  drawerTitle.value = '编辑'
  // 打开drawer组件
  changeDialogState()
  // drawer组件表单字段
  formFields.value = [
    { label: '用户名', name: 'username', type: 'input' },
    { label: '密码', name: 'password', type: 'input' },
    { label: '简介', name: 'descriptions', type: 'input' },
    {
      label: '是否活动用户',
      name: 'is_active',
      type: 'select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      default: row.is_active
    },
    {
      label: '是否超级管理员',
      name: 'is_super',
      type: 'select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      default: row.is_super
    }
  ]
  // 传递字段值
  formData.value = JSON.parse(JSON.stringify(row))  // 代理对象转为普通对象，解决修改时表格数据变动
}
/**
 * 接收删除表格数据时的emit并删除数据
 * @param {*} index
 * @param {*} row
 */
async function deleteData(index, row) {
  // 修改row.loading的状态（每行数据的loading）
  row.loading = true
  // 调用delete接口,传入user_id
  try {
    await fetch.deleteUser(row.id)
    ElMessage({
      message: '成功删除',
      type: 'success'
    })
  } catch (error) {
    ElMessage({
      message: '删除失败',
      type: 'error'
    })
    console.log(error)
  } finally {
    row.loading = false
  }
}
/**
 * 接收emit传递的选中的数据
 * @param {*} val 
 */
function selectDatas(val) {
  // 拿到每行数据的id，赋值给tableSelected
  tableSelected.value = val.map((item) => {
    // 返回id
    return item.id
  })
}
/**
 * 多选删除
 */
async function selectDelete() {
  // 弹窗确认
  ElMessageBox.confirm(
    '是否删除选中数据?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        // 请求删除多条数据接口
        await fetch.deleteUsers({ users_id: tableSelected.value })
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        // 刷新table
        await fetchUsersData(state.value)
      } catch (error) {
        ElMessage({
          message: '删除失败',
          type: 'error'
        })
        console.log(error)
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  margin: 6px 0;
  padding: 6px 0;
}
</style>