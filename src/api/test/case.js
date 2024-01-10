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
  const data = {
    caseIds
  }
  return request({
    url: `/testcase/delete`,
    method: 'delete',
    data: data
  })
}


