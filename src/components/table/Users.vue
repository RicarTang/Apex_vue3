<template>
  <el-table :data="tableData" v-loading="loading">
    <el-table-column prop="id" label="id" width="100" />
    <el-table-column prop="created_at" label="创建时间" width="200" />
    <el-table-column prop="update_at" label="更新时间" width="200" />
    <el-table-column prop="username" label="用户名" width="100" />
    <el-table-column prop="descriptions" label="简介" width="300" />
    <el-table-column prop="is_active" label="是否活动用户" width="200" />
    <el-table-column prop="is_super" label="是否超级管理员" width="200" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default>
        <el-button link type="primary" size="small" @click="handleClick">Detail</el-button>
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination background layout="prev, pager, next ,total,sizes" :total="total" @current-change="handleCurrentChange"
      @size-change="handleSizeChange" />
  <!-- <Pagination page="1" size="20" layout="total, prev, pager, next, jumper" total="500" @pagChange="fetchUsersData" /> -->
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
// import Pagination from '@/components/pagination/Pagination.vue'
import fetch from '@/api/index'
import { ElMessage } from 'element-plus'

// tableDate,供el-table数据
const tableData = ref([])
const loading = ref(false)

/**翻页相关 */
const state = reactive({
  page: 1,
  limit: 10
})
const total = ref(0)
//改变page,调用接口
const handleCurrentChange = async (val) => {
  state.page = val;
  await fetchUsersData(state)
};
//改变limit,调用接口
const handleSizeChange = async (val) => {
  state.limit = val;
  await fetchUsersData(state)
};

// 拉取所有用户用户数据
const fetchUsersData = async (params) => {
  loading.value = true;
  try {
    const users = await fetch.fetchUsers(params)
    // 赋值
    tableData.value = users.data.result.data
    total.value = users.data.result.total
  } catch (error) {
    console.log("加载失败")
  } finally {
    loading.value = false;
  }

}
onBeforeMount(async () => {
  // 页面渲染后展示数据
  await fetchUsersData(state)
})


</script>

<style>
.el-table {
  width: 100%;
  height: 80%;
}
.el-pagination{
  height: 20%;
  justify-content:center;
}
</style>