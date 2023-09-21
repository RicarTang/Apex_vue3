<template>
    <Search></Search>
    <div>
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
import Search from '@/components/table/Search.vue'

// 默认请求参数
const state = ref({ page: 1, limit: 10 })
// 表格数据
const tableData = ref([])
// 数据total
const total = ref(0)
// loading状态
const loading = ref(false)
// 表格多选框状态
const selected = ref(true)

// 表头
const tableController = [
    { label: 'id', prop: 'id' },
    { label: '创建时间', prop: 'created_at' },
    { label: '更新时间', prop: 'update_at' },
    { label: '套件编号', prop: 'suite_no' },
    { label: '套件名称/标题', prop: 'suite_title' },
    { type: 'template', label: '操作' },
]

/**接收emit传过来的page参数 */
async function pagerState(params) {
    state.value = params
    await fetchTestsuitesData(params)
}

/**
 * 拉取所有测试套件
 * @param {*} params page limit对象
 */
async function fetchTestsuitesData(params) {
    loading.value = true;
    try {
        const testsuites = await fetch.fetchTestsuites(params)
        // 赋值
        tableData.value = testsuites.data.result.data
        total.value = testsuites.data.result.total
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
    await fetchTestsuitesData(state.value)
})


</script>
  
<style></style>