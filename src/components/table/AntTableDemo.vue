<template>
  <div class="table">
    <a-table sticky :data-source="data" :row-selection="rowSelection" :scroll="{ x: 1500 }" bordered>
      <a-table-column
        :align="center"
        :title="t.title"
        :dataIndex="t.dataIndex"
        v-for="(t, index) in columns"
        :key="index"
        :fixed="t.fixed"
      />
    </a-table>
  </div>
</template>
  <script setup>
// const columns = [
//   {
//     name: 'Name',
//     dataIndex: 'name',
//     key: 'name'
//   },
//   {
//     title: 'Age',
//     dataIndex: 'age',
//     key: 'age'
//   },
//   {
//     title: 'Address',
//     dataIndex: 'address',
//     key: 'address'
//   },
//   {
//     title: 'Tags',
//     key: 'tags',
//     dataIndex: 'tags'
//   },
//   {
//     title: 'Action',
//     key: 'action'
//   }
// ]
const columns = [
  { title: 'id', key: 'id', dataIndex: 'id' },
  { title: '创建时间', key: 'created_at', dataIndex: 'created_at' },
  { title: '更新时间', key: 'update_at', dataIndex: 'update_at' },
  { title: '用例编号', key: 'case_no', dataIndex: 'case_no' },
  { title: '用例名称/标题', key: 'case_title', dataIndex: 'case_title' },
  { title: '用例说明', key: 'case_description', dataIndex: 'case_description' },
  { title: '用例模块', key: 'case_module', dataIndex: 'case_module' },
  { title: '用例子模块', key: 'case_sub_module', dataIndex: 'case_sub_module' },
  { title: '是否执行', key: 'case_is_execute', dataIndex: 'case_is_execute' },
  { title: '接口地址path', key: 'api_path', dataIndex: 'api_path' },
  { title: 'api请求方法', key: 'api_method', dataIndex: 'api_method' },
  { title: '请求头', key: 'request_headers', dataIndex: 'request_headers' },
  { title: '请求参数类型', key: 'request_param_type', dataIndex: 'request_param_type' },
  { title: '请求参数', key: 'request_param', dataIndex: 'request_param' },
  { title: '预期状态码', key: 'expect_code', dataIndex: 'expect_code' },
  { title: '预期结果', key: 'expect_result', dataIndex: 'expect_result' },
  { title: '预期返回数据', key: 'expect_data', dataIndex: 'expect_data' },
  { title: '是否保存请求体到redis', key: 'request_to_redis', dataIndex: 'request_to_redis' },
  { title: '是否保存响应体到redis', key: 'response_to_redis', dataIndex: 'response_to_redis' },
  { title: '用例编写者', key: 'case_editor', dataIndex: 'case_editor' },
  { title: '备注', key: 'remark', dataIndex: 'remark' ,fixed:'right'}
]
const data = [
  {
    id: 18,
    created_at: '2023-09-25T10:44:44.410192+08:00',
    update_at: '2023-09-25T10:44:44.410225+08:00',
    case_no: '1003',
    case_title: '密码错误登录',
    case_description: '测试密码错误时的登录场景',
    case_module: '登录',
    case_sub_module: null,
    case_is_execute: 1,
    api_path: '/user/login',
    api_method: 'post',
    request_headers: null,
    request_param_type: 'body',
    request_param: '{"username": "tang", "password": "1234567"}',
    expect_code: 200,
    expect_result: null,
    expect_data: null,
    request_to_redis: 0,
    response_to_redis: 0,
    case_editor: 'thb',
    remark: null
  },
  {
    id: 5,
    created_at: '2023-09-20T16:18:26.957573+08:00',
    update_at: '2023-09-20T16:18:26.957583+08:00',
    case_no: '2002',
    case_title: '登录失败',
    case_description: '登录失败用例',
    case_module: '登录',
    case_sub_module: null,
    case_is_execute: 0,
    api_path: '/user/login',
    api_method: 'post',
    request_headers: null,
    request_param_type: 'body',
    request_param: '{\n  "username": "tang",\n  "password": "1234567"\n}',
    expect_code: 200,
    expect_result: null,
    expect_data: null,
    request_to_redis: 0,
    response_to_redis: 0,
    case_editor: 'thb',
    remark: null
  },
  {
    id: 4,
    created_at: '2023-09-20T16:18:26.957523+08:00',
    update_at: '2023-09-20T16:18:26.957534+08:00',
    case_no: '2001',
    case_title: '登录成功',
    case_description: '登录成功用例',
    case_module: '登录',
    case_sub_module: null,
    case_is_execute: 1,
    api_path: '/user/login',
    api_method: 'post',
    request_headers: null,
    request_param_type: 'body',
    request_param: '{\n  "username": "tang",\n  "password": "123456"\n}',
    expect_code: 200,
    expect_result: null,
    expect_data: null,
    request_to_redis: 1,
    response_to_redis: 1,
    case_editor: 'thb',
    remark: null
  },
  {
    id: 3,
    created_at: '2023-09-20T16:18:26.957471+08:00',
    update_at: '2023-09-20T16:18:26.957483+08:00',
    case_no: '1002',
    case_title: '登录失败',
    case_description: '登录失败用例',
    case_module: '登录',
    case_sub_module: null,
    case_is_execute: 0,
    api_path: '/user/login',
    api_method: 'post',
    request_headers: null,
    request_param_type: 'body',
    request_param: '{\n  "username": "tang",\n  "password": "1234567"\n}',
    expect_code: 200,
    expect_result: null,
    expect_data: null,
    request_to_redis: 0,
    response_to_redis: 0,
    case_editor: 'thb',
    remark: null
  },
  {
    id: 2,
    created_at: '2023-09-20T16:18:26.957397+08:00',
    update_at: '2023-09-20T16:18:26.957423+08:00',
    case_no: '1001',
    case_title: '登录成功',
    case_description: '登录成功用例',
    case_module: '登录',
    case_sub_module: null,
    case_is_execute: 1,
    api_path: '/user/login',
    api_method: 'post',
    request_headers: null,
    request_param_type: 'body',
    request_param: '{\n  "username": "tang",\n  "password": "123456"\n}',
    expect_code: 200,
    expect_result: null,
    expect_data: null,
    request_to_redis: 1,
    response_to_redis: 1,
    case_editor: 'thb',
    remark: null
  }
]
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};
</script>
<style lang="scss" scoped>
.table {
  padding: 40px;

}
// ::v-deep .ant-table-cell {
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }
</style>