<template>
  <div>
    <CommonTable @pagerFresh="pagerState" :tableData="tableData" :tableController="tableController" :total="total"
      :loading="loading" :selected="selected">
    </CommonTable>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import fetch from '@/api/index'
import { ElMessage } from 'element-plus'
import CommonTable from '@/components/table/CommonTable.vue'

const state = ref({ page: 1, limit: 20 })
const tableData = ref([])
const total = ref(0)
const loading = ref(false)
const selected = ref(false)

const tableController = [
  { key: 'id', value: 'id' },
  { key: '创建时间', value: 'created_at' },
  { key: '更新时间', value: 'update_at' },
  { key: '用户名', value: 'username' },
  { key: '简介', value: 'descriptions' },
  { key: '是否活动用户', value: 'is_active' },
  { key: '是否超级管理员', value: 'is_super' },
  { type: 'template', key: '操作' },
]

/**接收emit传过来的page参数 */
async function pagerState(params) {
  state.value = params
  await fetchUsersData(params)
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
  // await pagerFresh()
})


</script>

<style></style>