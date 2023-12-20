<template>
  <!-- 搜索 -->
  <div>
    <Search
      @clickAdd="clickAdd"
      @clickDelete="selectDelete"
      @clickSearch="searchUser"
      :formFields="searchReactive.tableSearchFields"
      :formInline="searchReactive.tableSearchForm"
      :tableSelected="tableReactive.tableSelected"
    >
      <!-- 插槽内容 -->
      <template #default>
        <a-col>
          <a-form-item>
            <a-button type="primary" @click="testRoute"> 路由跳转</a-button>
          </a-form-item>
        </a-col>
      </template>
    </Search>
  </div>
  <!-- 编辑/新建用户表单抽屉 -->
  <Drawer
    @cancelForm="cancelForm"
    @updateData="updateFormData"
    :drawerState="drawerReactive.drawerState"
    :formData="drawerReactive.formData"
    :formFields="drawerReactive.formFields"
    :confirmLoading="drawerReactive.confirmLoading"
    :rules="rules"
    :title="drawerReactive.drawerTitle"
  ></Drawer>
  <!-- 用户table -->
  <div class="table-content">
    <CommonTable
      :tableData="tableReactive.tableData"
      :tableController="tableController"
      :tableLoading="tableReactive.tableLoading"
      :selected="tableReactive.selected"
      @editData="editData"
      @deleteData="deleteData"
      @selectDatas="selectDatas"
    >
    </CommonTable>
  </div>
  <div>
    <!-- 分页器 -->
    <Pagination @pagerFresh="pagerState" :total="pagerReactive.total"></Pagination>
  </div>
</template>

<script setup>
import { onActivated, onBeforeMount, reactive } from 'vue'
import fetchUser from '@/api/user/index'
import { message, Modal } from 'ant-design-vue'
import CommonTable from '@/components/table/CommonTable.vue'
import Pagination from '@/components/pagination/Pagination.vue'
import Drawer from '@/components/drawer/Drawer.vue'
import { formatTableData } from '@/utils/formatUtil'
import { useRouter } from 'vue-router'
const router = useRouter()

// 搜索
const searchReactive = reactive({
  // 查询表单
  tableSearchForm: {
    username: ''
  },
  // 表格搜索字段
  tableSearchFields: [{ label: '用户名', name: 'username', type: 'input' }]
})
// 表格
const tableReactive = reactive({
  // 表格数据
  tableData: [],
  // 表格loading状态

  tableLoading: false,
  // 是否开启多选框
  selected: true,
  // 表格多选数据
  tableSelected: []
})
// 抽屉
const drawerReactive = reactive({
  // button loading状态
  confirmLoading: false,
  // 抽屉显示状态
  drawerState: false,
  // drawer标题
  drawerTitle: '',
  // drawer表单字段
  formFields: [],
  // drawer表单字段值双向绑定
  formData: {}
})
// 翻页
const pagerReactive = reactive({
  // 默认翻页参数
  state: { page: 1, limit: 10 },
  // 数据total
  total: 0
})

// 表头
const tableController = [
  { label: 'id', name: 'id' },
  { label: '创建时间', name: 'created_at' },
  { label: '更新时间', name: 'update_at' },
  { label: '用户名', name: 'username' },
  { label: '简介', name: 'descriptions' },
  { label: '是否活动用户', name: 'is_active' },
  { label: '是否超级管理员', name: 'is_super' },
  { type: 'template', label: '操作', fixed: 'right', width: '205px' }
]
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
  fetchUsersData(pagerReactive.state)
})
/**搜索用户 */
async function searchUser() {
  tableReactive.tableLoading = true
  try {
    if (searchReactive.tableSearchForm.username) {
      // const users = await fetchUser.queryUsers(
      //   searchReactive.tableSearchForm.username ? searchReactive.tableSearchForm : ''
      // )
      const users = await fetchUser.queryUsers(searchReactive.tableSearchForm)
      // 赋值
      tableReactive.tableData = formatTableData(users.data.result.data, ['is_active', 'is_super'])
      pagerReactive.total = users.data.result.total
    } else {
      // 搜索框为空拉取整个列表
      fetchUsersData(pagerReactive.state)
    }
  } finally {
    tableReactive.tableLoading = false
  }
}
/**
 * 新增用户
 * @param {*} data 创建用户请求体
 */
async function addUser(data) {
  drawerReactive.confirmLoading = true
  try {
    await fetchUser.addUser(data)
    // 新增成功弹窗
    message.success('新增用户成功')
    // 新增后刷新table
    fetchUsersData()
  } catch (error) {
    // 失败弹窗
    message.error('新增用户失败')
    console.log(error)
  } finally {
    // 新增用户成功返回后关闭drawer，取消按钮loading状态
    drawerReactive.confirmLoading = false
    drawerReactive.drawerState = false
  }
}
/**编辑用户
 *
 * @param {*} user_id 用户id
 * @param {*} data  请求体
 */
async function editUser(user_id, data) {
  drawerReactive.confirmLoading = true
  try {
    await fetchUser.updateUser(user_id, data)
    // 修改成功弹窗
    message.success('编辑用户成功')
    // 编辑后刷新table
    fetchUsersData()
  } catch (error) {
    // 失败弹窗
    message.error('编辑用户失败')
    console.log(error)
  } finally {
    // 编辑用户成功返回后关闭drawer，取消按钮loading状态
    drawerReactive.confirmLoading = false
    drawerReactive.drawerState = false
    // 重置drawer表单数据
    drawerReactive.formData = {}
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
  drawerReactive.formFields = [
    { label: '用户名', name: 'username', type: 'input' },
    { label: '密码', name: 'password', type: 'input' },
    { label: '简介', name: 'descriptions', type: 'textarea' }
  ]
}
/**接收emit传过来的page参数 */
async function pagerState(params) {
  pagerReactive.state = params
  await fetchUsersData(params)
}
/**取消drawer表单(emit) */
function cancelForm(params) {
  // 修改显示状态
  drawerReactive.drawerState = params
  // 重置drawer表单数据
  drawerReactive.formData = {}
}
/**接收drawer组件传递的formData,选择性的请求接口 */
async function updateFormData(params) {
  console.log('接收到的formData', params)
  if (drawerReactive.drawerTitle === '新增') {
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
  tableReactive.tableLoading = true
  try {
    const users = await fetchUser.getAllUser(params)
    // 赋值,formatTableData对接口数据进行格式化
    tableReactive.tableData = formatTableData(users.data.result.data, ['is_active', 'is_super'])
    pagerReactive.total = users.data.result.total
  } catch (error) {
    message.error('数据加载失败')
    console.log(error)
  } finally {
    tableReactive.tableLoading = false
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
  drawerReactive.formFields = [
    { label: '用户名', name: 'username', type: 'input' },
    { label: '密码', name: 'password', type: 'input' },
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
    },
    { label: '简介', name: 'descriptions', type: 'textarea' }
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
    await fetchUser.deleteUser(row.id)
    message.success('成功删除')
    // 删除成功刷新table
    fetchUsersData()
  } catch (error) {
    message.error('删除失败')
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
  tableReactive.tableSelected = val.map((item) => {
    // 返回id
    return item.id
  })
}
/**
 * 多选删除
 */
async function selectDelete() {
  // 弹窗确认
  Modal.confirm({
    title: '警告',
    content: '是否删除选中数据?',
    async onOk() {
      try {
        // 请求删除多条数据接口
        await fetchUser.deleteManyUser({ users_id: tableReactive.tableSelected })
        message.success('删除成功')
        // 刷新table
        fetchUsersData(pagerReactive.state)
      } catch (error) {
        message.error('删除失败')
        console.log(error)
      }
    },
    onCancel() {
      message.info('取消删除')
    }
  })
}
function testRoute() {
  console.log('点击了快点交罚款 ')
  router.push({ name: 'userManagerInfo', params: { id: '1' } })
}
onActivated(()=>{
  console.log("用户组件被激活")
})
</script>

<style lang="scss" scoped></style>