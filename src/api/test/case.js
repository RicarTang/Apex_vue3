import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用例列表
export function listCase(query) {
  return request({
    url: '/testcase/list',
    method: 'get',
    params: query
  })
}
// 添加测试用例
export function addCase(data) {
  return request({
    url: '/testcase/add',
    method: 'post',
    data: data
  })
}
// 获取测试用例
export function getCase(caseId) {
  return request({
    url: `/testcase/${caseId}`,
    method: 'get'
  })
}
// 删除测试用例
export function deleteCase(caseIds) {
  return request({
    url: `/testcase/${caseIds}`,
    method: 'delete',
  })
}
// 更新测试用例
export function updateCase(caseIds, data) {
  return request({
    url: `/testcase/${caseIds}`,
    method: 'put',
    data: data
  })
}
// 执行测试用例
export function executeCase(caseId) {
  const data = {
    caseId
  }
  return request({
    url: `/testcase/executeOne`,
    method: 'post',
    data: data
  })
}


