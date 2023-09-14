<template>
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

// 表头
const tableController = [
  { label: 'id', prop: 'id' },
  { label: '创建时间', prop: 'created_at' },
  { label: '更新时间', prop: 'update_at' },
  { label: '用例编号', prop: 'case_no' },
  { label: '用例名称/标题', prop: 'case_title' },
  { label: '用例说明', prop: 'case_description' },
  { label: '用例模块', prop: 'case_module' },
  { label: '用例子模块', prop: 'case_sub_module' },
  { label: '是否执行', prop: 'case_is_execute' },
  { label: '接口地址path', prop: 'api_path' },
  { label: 'api请求方法', prop: 'api_method' },
  { label: '请求头', prop: 'request_headers' },
  { label: '请求参数类型', prop: 'request_param_type' },
  { label: '请求参数', prop: 'request_param' },
  { label: '预期状态码', prop: 'expect_code' },
  { label: '预期结果', prop: 'expect_result' },
  { label: '预期返回数据', prop: 'expect_data' },
  { label: '是否保存请求体到redis', prop: 'request_to_redis' },
  { label: '是否保存响应体到redis', prop: 'response_to_redis' },
  { label: '用例编写者', prop: 'case_editor' },
  { label: '备注', prop: 'remark' },
  { type: 'template', key: '操作' },
]

/**接收emit传过来的page参数 */
async function pagerState(params) {
  state.value = params
  await fetchTestcasesData(params)
}

/**
 * 拉取所有测试拥挤
 * @param {*} params page limit对象
 */
async function fetchTestcasesData(params) {
  loading.value = true;
  try {
    const testcases = await fetch.fetchTestcases(params)
    // 赋值
    tableData.value = testcases.data.result.data
    total.value = testcases.data.result.total
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
  await fetchTestcasesData(state.value)
})


</script>

<style></style>