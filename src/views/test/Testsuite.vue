<template>
  <!-- 搜索 -->
  <div>
    <Search
      :formFields="searchReactive.tableSearchFields"
      :formInline="searchReactive.tableSearchForm"
      :tableSelected="tableReactive.tableSelected"
      @clickAdd="clickAdd"
      @clickDelete="selectDelete"
      @clickSearch="searchTestsuite"
    >
      <!-- 插槽内容 -->
      <template #default>
        <!-- 启动测试按钮 -->
        <el-form-item>
          <el-button
            type="success"
            @click="clickTestButton"
            :disabled="tableReactive.tableSelected.length === 0"
            >执行测试</el-button
          >
        </el-form-item>
      </template>
    </Search>
  </div>
  <!-- 编辑/新建用户表单抽屉 -->
  <Drawer
    @cancelForm="cancelForm"
    @updateData="updateFormData"
    :drawerState="drawerReactive.drawerState"
    :formData="drawerReactive.formData"
    :formFields="drawerReactive.drawerFormFields"
    :confirmLoading="drawerReactive.confirmLoading"
    :rules="rules"
    :title="drawerReactive.drawerTitle"
  ></Drawer>
  <div class="table-content">
    <CommonTable
      :tableData="tableReactive.tableData"
      :tableController="tableReactive.tableController"
      :tableLoading="tableReactive.tableLoading"
      :selected="tableReactive.selected"
      :showContent="tableReactive.showContent"
      @editData="editData"
      @deleteData="deleteData"
      @selectDatas="selectDatas"
    >
      <!-- 自定义作用域插槽，新增执行按钮;slotProps接收作用域插槽传递的数据 -->
      <template #controls="slotProps">
        <el-button
          size="small"
          :icon="CaretRightOutlined"
          type="success"
          @click="clickTestButton(slotProps.row)"
        />
      </template>
      <!-- 展开行内容，使用标签展示套件包含的测试用例标题 -->
      <template #content="slotProps">
        <a-space :size="8" style="padding: 0 0 10px 30px" wrap>
          <el-tag
            v-for="tag in slotProps.row.data"
            :key="tag.id"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="handleCaseClose(tag)"
          >
            {{ tag.case_title }}
          </el-tag>
          <el-button class="button-new-tag ml-1" size="small" @click="handleAddCase">
            + 新增测试用例
          </el-button>
        </a-space>
      </template>
    </CommonTable>
  </div>
  <!-- 分页器 -->
  <div>
    <Pagination @pagerFresh="pagerState" :total="pagerReactive.total"></Pagination>
  </div>
</template>
  
<script setup>
import { onBeforeMount, reactive } from 'vue'
import fetch from '@/api/index'
import { ElMessage } from 'element-plus'
import CommonTable from '@/components/table/CommonTable.vue'
import Search from '@/components/table/Search.vue'
import { formatTableData } from '@/utils/formatUtil'
import { CaretRightOutlined } from '@ant-design/icons-vue'

// 搜索
const searchReactive = reactive({
  // 表格搜索字段
  tableSearchFields: [{ label: '套件名称', name: 'suite_title', type: 'input' }],
  // 表格搜索 model
  tableSearchForm: {
    suite_title: ''
  }
})
// 表格
const tableReactive = reactive({
  // 表格数据
  tableData: [],
  // table loading状态
  tableLoading: false,
  // 表格是否启用多选框
  selected: true,
  // 表格显示展开行
  showContent: true,
  // 表格多选数据数组
  tableSelected: [],
  // 表头
  tableController: [
    { label: 'id', name: 'id' },
    { label: '创建时间', name: 'created_at' },
    { label: '更新时间', name: 'update_at' },
    { label: '套件编号', name: 'suite_no' },
    { label: '套件名称/标题', name: 'suite_title' },
    { type: 'template', label: '操作', width: '205px' }
  ]
})
// 抽屉
const drawerReactive = reactive({
  // 抽屉标题
  drawerTitle: '',
  // 抽屉显示状态
  drawerState: false,
  // 抽屉按钮loading状态
  confirmLoading: false,
  // 抽屉表单字段label
  drawerFormFields: [],
  // 抽屉表单数据
  formData: {}
})
// 翻页器
const pagerReactive = reactive({
  // 默认翻页参数
  state: { page: 1, limit: 10 },
  // 数据total
  total: 0
})

onBeforeMount(async () => {
  // 页面渲染后展示数据
  await fetchTestsuitesData(pagerReactive.state)
})
/**接收emit传过来的page参数 */
async function pagerState(params) {
  pagerReactive.state = params
  await fetchTestsuitesData(params)
}

/**
 * 拉取所有测试套件
 * @param {*} params page limit对象
 */
async function fetchTestsuitesData(params) {
  tableReactive.tableLoading = true
  try {
    const testsuites = await fetch.fetchTestsuites(params)
    // 赋值
    tableReactive.tableData = formatTableData(testsuites.data.result.data)
    pagerReactive.total = testsuites.data.result.total
  } catch (error) {
    console.log('加载失败')
    ElMessage({
      message: '加载失败',
      type: 'error'
    })
  } finally {
    tableReactive.tableLoading = false
  }
}
/**
 * 更改抽屉显示状态
 */
function changeDrawerState() {
  drawerReactive.drawerState = !drawerReactive.drawerState
}
/**点击新增按钮 */
function clickAdd() {
  // 修改drawer标题
  drawerReactive.drawerTitle = '新增'
  // 更改状态
  changeDrawerState()
  // drawer表单显示字段
  drawerReactive.drawerFormFields = [
    { label: '套件编号', name: 'suite_no', type: 'input' },
    { label: '套件名称/标题', name: 'suite_title', type: 'input' }
  ]
}
/**
 * 接收emit传递的选中的数据
 * @param {*} val
 */
function selectDatas(val) {
  // 拿到每行数据的id，赋值给tableSelected
  tableReactive.tableSelected = val.map((item) => {
    // 返回id
    return item.id
  })
}
/**取消drawer表单修改(emit) */
function cancelForm(params) {
  // 修改显示状态
  drawerReactive.drawerState = params
  // 重置drawer表单
  drawerReactive.formData = {}
}
/**
 * 多选删除
 */
async function selectDelete() {
  // 弹窗确认
  ElMessageBox.confirm('是否删除选中数据?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        // 请求删除多条数据接口
        await fetch.deleteTestsuites({ users_id: tableReactive.tableSelected })
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        // 刷新table
        fetchTestsuitesData(pagerReactive.state)
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
        message: '取消删除'
      })
    })
}
/**运行测试套件回调函数 */
function clickTestButton(row) {
  ElMessage({
    type: 'warning',
    message: '还没实现后端接口'
  })
  console.log(row)
}
/**测试套件添加用例 */
function handleAddCase() {
  ElMessage({
    type: 'warning',
    message: '还没实现后端接口'
  })
}
/**删除测试套件用例 */
function handleCaseClose(tag) {
  ElMessage({
    type: 'warning',
    message: '还没实现后端接口'
  })
  console.log(tag);
}
</script>
  
<style></style>