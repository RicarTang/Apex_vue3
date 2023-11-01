<template>
  <!-- 搜索 -->
  <div>
    <Search
      :formFields="searchReactive.tableSearchFields"
      :formInline="searchReactive.tableSearchForm"
      :tableSelected="tableReactive.tableSelected"
      @clickAdd="clickAdd"
      @clickDelete="selectDelete"
      @clickSearch="searchTestcase"
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
              <el-upload
                ref="upload"
                :limit="1"
                :http-request="uploadTemplate"
                name="excel"
                :show-file-list="false"
              >
                <el-button type="primary" :loading="searchReactive.uploadLoading"
                  >导入用例</el-button
                >
              </el-upload>
            </el-tooltip>
          </el-badge>
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
  <div class="table-testcase-context">
    <CommonTable
      :tableData="tableReactive.tableData"
      :tableController="tableController"
      :tableLoading="tableReactive.tableLoading"
      :selected="tableReactive.selected"
      @selectDatas="selectDatas"
      @editData="editData"
      @deleteData="deleteData"
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
    </CommonTable>
  </div>
  <!-- 分页器 -->
  <div>
    <Pagination @pagerFresh="pagerState" :total="pagerReactive.total" />
  </div>
  <!-- 模态框 -->
  <div>
    <modal-box
      @handleFinish="cancelModal"
      :open="modalReactive.open"
      :title="modalReactive.title"
      :items="modalReactive.items"
      :events="modalReactive.events"
    />
  </div>
</template>

<script setup>
import { onBeforeMount, reactive, ref } from 'vue'
import fetch from '@/api/index'
import { ElMessage } from 'element-plus'
import CommonTable from '@/components/table/CommonTable.vue'
import ModalBox from '@/components/dialog/ModalBox.vue'
import { formatTableData } from '@/utils/formatUtil'
import { CaretRightOutlined } from '@ant-design/icons-vue'

// 表格
const tableReactive = reactive({
  // 表格数据
  tableData: [],
  // 表格loading状态
  tableLoading: false,
  // 表格多选框状态
  selected: true,
  // 表格多选数据数组
  tableSelected: []
})
// 翻页
const pagerReactive = reactive({
  // pager total
  total: 0,
  // 默认请求参数
  state: { page: 1, limit: 10 }
})
// 搜索
const searchReactive = reactive({
  // 查询表单
  tableSearchForm: {
    case_title: ''
  },
  // 表格搜索字段
  tableSearchFields: [{ label: '用例标题', name: 'case_title', type: 'input' }],
  // 上传按钮loading
  uploadLoading: false
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
// 模态框
const modalReactive = reactive({
  // 是否打开
  open: false,
  // 模态框标题
  title: '',
  // 步骤条item
  items: [],
  // 时间轴事件
  events: []
})

// 表头
const tableController = [
  { label: 'id', name: 'id' },
  { label: '创建时间', name: 'created_at' },
  { label: '更新时间', name: 'update_at' },
  { label: '用例编号', name: 'case_no' },
  { label: '用例名称/标题', name: 'case_title' },
  { label: '用例说明', name: 'case_description' },
  { label: '用例模块', name: 'case_module' },
  { label: '用例子模块', name: 'case_sub_module' },
  { label: '是否执行', name: 'case_is_execute' },
  { label: '接口地址path', name: 'api_path' },
  { label: 'api请求方法', name: 'api_method' },
  { label: '请求头', name: 'request_headers' },
  { label: '请求参数类型', name: 'request_param_type' },
  { label: '请求参数', name: 'request_param' },
  { label: '预期状态码', name: 'expect_code' },
  { label: '预期结果', name: 'expect_result' },
  { label: '预期返回数据', name: 'expect_data' },
  { label: '是否保存请求体到redis', name: 'request_to_redis' },
  { label: '是否保存响应体到redis', name: 'response_to_redis' },
  { label: '用例编写者', name: 'case_editor' },
  { label: '备注', name: 'remark' },
  { type: 'template', label: '操作', fixed: 'right', width: '205px' }
]
// drawer表单规则
const rules = {
  case_no: [
    {
      required: true,
      message: '用例编号不能为空',
      trigger: 'blur'
    },
    {
      max: 10,
      message: '用例编号不能大于10位字符',
      trigger: 'change'
    }
  ],
  case_title: [
    {
      required: true,
      message: '用例标题不能为空',
      trigger: 'blur'
    },
    {
      max: 50,
      message: '用例标题不能大于50位字符',
      trigger: 'change'
    }
  ],
  case_module: [
    {
      required: true,
      message: '用例所属模块不能为空',
      trigger: 'blur'
    },
    {
      max: 20,
      message: '用例所属模块不能大于20位字符',
      trigger: 'change'
    }
  ],
  api_path: [
    {
      required: true,
      message: '用例接口地址不能为空',
      trigger: 'blur'
    },
    {
      max: 50,
      message: '用例所属模块不能大于50位字符',
      trigger: 'change'
    }
  ],
  request_param: [
    {
      required: true,
      message: '用例接口请求参数不能为空',
      trigger: 'blur'
    },
    {
      max: 50,
      message: '用例接口请求参数不能大于50位字符',
      trigger: 'change'
    }
  ],
  expect_code: [
    {
      required: true,
      message: '用例预期网络状态码不能为空',
      trigger: 'blur'
    }
    // {
    //   max: 10,
    //   message: '用例预期网络状态码不能大于10位字符',
    //   trigger: 'change'
    // }
  ]
}

onBeforeMount(async () => {
  // 页面渲染后展示数据
  fetchTestcasesData(pagerReactive.state)
})
/**接收emit传过来的page参数 */
async function pagerState(params) {
  pagerReactive.state = params
  await fetchTestcasesData(params)
}

/**
 * 拉取所有测试用例
 * @param {*} params page limit对象
 */
async function fetchTestcasesData(params) {
  tableReactive.tableLoading = true
  try {
    const testcases = await fetch.fetchTestcases(params)
    // 格式化后赋值
    tableReactive.tableData = formatTableData(testcases.data.result.data, [
      'case_is_execute',
      'request_to_redis',
      'response_to_redis'
    ])
    pagerReactive.total = testcases.data.result.total
  } catch (error) {
    console.log('加载失败', error)
    ElMessage({
      message: '数据加载失败',
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
    { label: '用例编号', name: 'case_no', type: 'input' },
    { label: '用例名称/标题', name: 'case_title', type: 'input' },
    { label: '用例说明', name: 'case_description', type: 'input' },
    { label: '用例模块', name: 'case_module', type: 'input' },
    { label: '用例子模块', name: 'case_sub_module', type: 'input' },
    {
      label: '是否执行',
      name: 'case_is_execute',
      type: 'select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      default: 1
    },
    { label: '接口地址path', name: 'api_path', type: 'input' },
    { label: 'api请求方法', name: 'api_method', type: 'input' },
    { label: '请求头', name: 'request_headers', type: 'input' },
    { label: '请求参数类型', name: 'request_param_type', type: 'input' },
    { label: '请求参数', name: 'request_param', type: 'input' },
    { label: '预期状态码', name: 'expect_code', type: 'input' },
    { label: '预期结果', name: 'expect_result', type: 'input' },
    { label: '预期返回数据', name: 'expect_data', type: 'input' },
    {
      label: '是否保存请求体到redis',
      name: 'request_to_redis',
      type: 'select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      default: 0
    },
    {
      label: '是否保存响应体到redis',
      name: 'response_to_redis',
      type: 'select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      default: 0
    },
    { label: '用例编写者', name: 'case_editor', type: 'input' },
    { label: '备注', name: 'remark', type: 'input' }
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
/**点击开始测试按钮 */
function clickTestButton(row) {
  // 请求测试接口
  /**运行测试套件回调函数 */
  ElMessage({
    type: 'warning',
    message: '还没实现后端接口'
  })
  console.log(row)
  modalReactive.open = true
  modalReactive.items = [
    {
      title: '',
      description:'接口请求中'
    },
    {
      title: '',
      description:'生成报告中',
    },
    {
      title: '',
      description:'测试结束'
    }
  ]
  modalReactive.events = [
    { content: '事件 1', color: 'green' },
    { content: '事件 2', color: 'red' },
    { content: '事件 3', color: 'blue' },
    { content: '事件 4', color: 'gray' },
    { content: '事件 2', color: 'red' },
    { content: '事件 3', color: 'blue' },
    { content: '事件 4', color: 'gray' }
  ]
}
/**点击下载按钮 */
async function clickDownloadButton() {
  // 请求下载接口
  await fetch.downloadTestTemplate()
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
        await fetch.deleteTestcases({ users_id: tableReactive.tableSelected })
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        // 刷新table
        fetchTestcasesData(pagerReactive.state)
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
/**搜索测试用例 */
async function searchTestcase() {
  tableReactive.tableLoading = true
  try {
    let testcases = await fetch.queryTestcases(
      searchReactive.tableSearchForm.case_title ? searchReactive.tableSearchForm : ''
    )
    // let testcases = await fetch.queryTestcases(searchReactive.tableSearchForm)
    // 赋值
    tableReactive.tableData = formatTableData(testcases.data.result.data, [
      'case_is_execute',
      'request_to_redis',
      'response_to_redis'
    ])
    pagerReactive.total = testcases.data.result.total
  } finally {
    tableReactive.tableLoading = false
  }
}
/**上传文件请求 */
async function uploadTemplate(param) {
  const uploadFormData = new FormData()
  uploadFormData.append('excel', param.file)
  try {
    searchReactive.uploadLoading = true
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
    searchReactive.uploadLoading = false
  }
}
/**取消drawer表单修改(emit) */
function cancelForm(params) {
  // 修改显示状态
  drawerReactive.drawerState = params
  // 重置drawer表单
  drawerReactive.formData = {}
}

/**
 * 新增测试用例
 * @param {*} data 创建用户请求体
 */
async function addTestcase(data) {
  drawerReactive.confirmLoading = true
  try {
    await fetch.addTestcase(data)
    // 新增成功弹窗
    ElMessage({
      message: '新增成功',
      type: 'success'
    })
    // 新增后刷新table
    fetchTestcasesData()
  } catch (error) {
    // 失败弹窗
    ElMessage({
      message: '新增失败',
      type: 'error'
    })
    console.log(error)
  } finally {
    // 无论是否新增成功返回后关闭drawer，取消按钮loading状态
    drawerReactive.confirmLoading = false
    drawerReactive.drawerState = false
  }
}

/**编辑测试用例
 *
 * @param {*} case_id 用例id
 * @param {*} data  请求体
 */
async function editTestcase(case_id, data) {
  drawerReactive.confirmLoading = true
  try {
    await fetch.updateTestcase(case_id, data)
    // 修改成功弹窗
    ElMessage({
      message: '编辑成功',
      type: 'success'
    })
    // 编辑后刷新table
    fetchTestcasesData()
  } catch (error) {
    // 失败弹窗
    ElMessage({
      message: '编辑失败',
      type: 'error'
    })
    console.log(error)
  } finally {
    // 无论是否编辑成功返回后关闭drawer，取消按钮loading状态
    drawerReactive.confirmLoading = false
    drawerReactive.drawerState = false
    // 重置drawer表单数据
    drawerReactive.formData = {}
  }
}

/**接收drawer组件传递的formData,选择性的请求接口 */
async function updateFormData(params) {
  console.log('接收到的formData', params)
  if (drawerReactive.drawerTitle === '新增') {
    // 接收到数据意味着用户输入结束并且点击了提交按钮,新增测试用例
    await addTestcase(params)
  } else {
    // 编辑
    await editTestcase(params.id, params)
  }
}
/**
 * 接收修改表格数据时的emit
 * @param {*} index
 * @param {*} row
 */
function editData(index, row) {
  // drawer title
  drawerReactive.drawerTitle = '编辑'
  // 打开drawer组件
  changeDrawerState()
  // drawer组件表单字段
  drawerReactive.drawerFormFields = [
    { label: '用例编号', name: 'case_no', type: 'input' },
    { label: '用例名称/标题', name: 'case_title', type: 'input' },
    { label: '用例说明', name: 'case_description', type: 'input' },
    { label: '用例模块', name: 'case_module', type: 'input' },
    { label: '用例子模块', name: 'case_sub_module', type: 'input' },
    {
      label: '是否执行',
      name: 'case_is_execute',
      type: 'select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      default: row.case_is_execute
    },
    { label: '接口地址path', name: 'api_path', type: 'input' },
    { label: 'api请求方法', name: 'api_method', type: 'input' },
    { label: '请求头', name: 'request_headers', type: 'input' },
    { label: '请求参数类型', name: 'request_param_type', type: 'input' },
    { label: '请求参数', name: 'request_param', type: 'input' },
    { label: '预期状态码', name: 'expect_code', type: 'input' },
    { label: '预期结果', name: 'expect_result', type: 'input' },
    { label: '预期返回数据', name: 'expect_data', type: 'input' },
    {
      label: '是否保存请求体到redis',
      name: 'request_to_redis',
      type: 'select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      default: row.request_to_redis
    },
    {
      label: '是否保存响应体到redis',
      name: 'response_to_redis',
      type: 'select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      default: row.response_to_redis
    },
    { label: '用例编写者', name: 'case_editor', type: 'input' },
    { label: '备注', name: 'remark', type: 'input' }
  ]
  // 传递字段值
  drawerReactive.formData = JSON.parse(JSON.stringify(row)) // 代理对象转为普通对象，解决修改时表格数据变动
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
    await fetch.deleteTestcase(row.id)
    ElMessage({
      message: '成功删除',
      type: 'success'
    })
    // 删除成功刷新table
    fetchTestcasesData()
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
 * 点击modal cancel或者右上角关闭按钮回调
 */
function cancelModal(status) {
  modalReactive.open = status
}
</script>

<style></style>