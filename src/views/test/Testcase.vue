<template>
  <!-- 搜索 -->
  <div>
    <Search :formFields="tableSearchFields" :formInline="tableSearchForm" :tableSelected="tableSelected">
      <template #default>
        <!-- 启动测试按钮 -->
        <el-form-item>
          <el-button type="success" @click="clickTestButton" :disabled="tableSelected.length === 0">执行测试</el-button>
        </el-form-item>
        <!-- 下载模板按钮 -->
        <el-form-item>
          <el-badge is-dot>
            <el-tooltip content="只有模板才能支持导入测试用例！" placement="top" effect="light">
              <el-button type="info" @click="clickDownloadButton">下载模版</el-button>
            </el-tooltip>
          </el-badge>
        </el-form-item>
        <!-- 导入按钮 -->
        <el-form-item>
          <el-badge is-dot>
            <el-tooltip content="请导入正确格式的测试用例模板！" placement="top" effect="light">
              <el-upload ref="upload" :limit="1" :http-request="uploadTemplate" name="excel" :show-file-list="false">
                <el-button type="primary" @click="clickImportButton" :loading="uploadLoading">导入用例</el-button>
              </el-upload>
            </el-tooltip>
          </el-badge>
        </el-form-item>
      </template>
    </Search>
  </div>
  <!-- 编辑/新建用户表单抽屉 -->
  <!-- <Drawer @dialogState="dialogStateEmit" @updateData="updateFormData" :dialogState="dialogState" :formData="formData"
    :formFields="formFields" :loading="buttonLoading" :rules="rules" :title="drawerTitle"></Drawer> -->
  <div class="table-testcase-context">
    <CommonTable :tableData="tableData" :tableController="tableController" :tableLoading="tableLoading"
      :selected="selected" @selectDatas="selectDatas" @editData="editData" @deleteData="deleteData">
    </CommonTable>
  </div>
  <div>
    <!-- 分页器 -->
    <Pagination @pagerFresh="pagerState" :total="total"></Pagination>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import fetch from '@/api/index'
import { ElMessage } from 'element-plus'
import CommonTable from '@/components/table/CommonTable.vue'
import { formatTableData } from '@/utils/formatUtil'

// 默认请求参数
const state = ref({ page: 1, limit: 10 })
// 表格数据
const tableData = ref([])
// pager total
const total = ref(0)
// 表格loading状态
const tableLoading = ref(false)
// 上传按钮loading
const uploadLoading = ref(false)
// 表格多选框状态
const selected = ref(true)
// 表格多选数据数组
// 查询表单
const tableSelected = ref([])
const tableSearchForm = ref({
  case_title: ''
})
// 表格搜索字段
const tableSearchFields = ref([
  { label: '用例标题', name: 'case_title', type: 'input' },
])
// drawer标题
const drawerTitle = ref('')
// 抽屉显示状态
const dialogState = ref(false)

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
  { type: 'template', label: '操作', fixed: 'right', width: '205px' },
]

onBeforeMount(async () => {
  // 页面渲染后展示数据
  await fetchTestcasesData(state.value)
})
/**接收emit传过来的page参数 */
async function pagerState(params) {
  state.value = params
  await fetchTestcasesData(params)
}

/**
 * 拉取所有测试用例
 * @param {*} params page limit对象
 */
async function fetchTestcasesData(params) {
  tableLoading.value = true;
  try {
    const testcases = await fetch.fetchTestcases(params)
    // 赋值
    tableData.value = formatTableData(testcases.data.result.data, ['case_is_execute', 'request_to_redis', 'response_to_redis'])
    total.value = testcases.data.result.total
  } catch (error) {
    console.log("加载失败", error)
    ElMessage({
      message: '数据加载失败',
      type: 'error',
    })
  } finally {
    tableLoading.value = false;
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
/**点击开始测试按钮 */
function clickTestButton() {
  // 请求测试接口
}
/**点击下载按钮 */
async function clickDownloadButton() {
  // 请求下载接口
  await fetch.downloadTestTemplate()
}
/**点击导入按钮 */
function clickImportButton() {
  // 请求导入接口
}
/**上传文件请求 */
async function uploadTemplate(param) {
  const uploadFormData = new FormData()
  uploadFormData.append('excel', param.file)
  try {
    uploadLoading.value = true;
    await fetch.importTestTemplate(uploadFormData)
    ElMessage({
      message: '上传成功',
      type: 'success'
    })
  } catch (error) {
    ElMessage({
      message: '上传失败',
      type: 'error'
    })
  } finally {
    uploadLoading.value = false;
  }
}
</script>

<style></style>