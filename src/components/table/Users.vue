<template>
  <el-row class="table-nav">
    <el-col :span="20">
      <!-- <span>搜索</span> -->
      <el-input v-model="input"  placeholder="Please input" size="small"/>
      <el-button type="primary" @click="changeDialogState">搜索</el-button>

    </el-col>
    <el-col :span="2">
      <el-button type="primary" @click="changeDialogState">编辑</el-button>
    </el-col>
    <el-col :span="2">
      <el-button type="success" @click="changeDialogState">新增</el-button>
    </el-col>
  </el-row>

  <Drawer @dialogState="dialogStateEmit" :dialogState="dialogState"></Drawer>
  <div class="table-content">
    <CommonTable @pagerFresh="pagerState" :tableData="tableData" :tableController="tableController" :total="total"
      :loading="loading" :selected="selected">
    </CommonTable>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import fetch from '@/api/index'
import { ElMessage } from 'element-plus'
import CommonTable from '@/components/table/CommonTable.vue'
import Drawer from '@/components/drawer/Drawer.vue'

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

// 表头
const tableController = [
  { label: 'id', prop: 'id' },
  { label: '创建时间', prop: 'created_at' },
  { label: '更新时间', prop: 'update_at' },
  { label: '用户名', prop: 'username' },
  { label: '简介', prop: 'descriptions' },
  { label: '是否活动用户', prop: 'is_active' },
  { label: '是否超级管理员', prop: 'is_super' },
  { type: 'template', key: '操作' },
]
/**
 * 更改抽屉显示状态
 */
function changeDialogState() {
  dialogState.value = !dialogState.value
  console.log(dialogState.value)
}

/**接收emit传过来的page参数 */
async function pagerState(params) {
  state.value = params
  await fetchUsersData(params)
}
/**接收drawer组件传递的状态值 */
function dialogStateEmit(params) {
  dialogState.value = params
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
    tableData.value = users.data.result.data
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