<template>
  <el-table :data="tableData">
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
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import fetch from '@/api/index'
import { ElMessage } from 'element-plus'

// tableDate,供el-table数据
const tableData = ref([])

// 拉取所有用户用户数据
const fetchUsersData = async () => {
  const users = await fetch.fetchUsers()
  // 赋值
  tableData.value = users.data.result
}

onMounted(async () => {
  // 页面渲染后展示数据
  await fetchUsersData()
})
</script>

<style>
.el-table{
  width: 100%;
  height: 100%;
}
</style>