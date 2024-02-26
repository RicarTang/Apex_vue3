import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询套件列表
export function listSuite(query) {
  return request({
    url: '/testsuite/list',
    method: 'get',
    params: query
  })
}
// 添加套件
export function addSuite(data) {
  return request({
    url: '/testsuite/add',
    method: 'post',
    data: data
  })
}
// 删除套件
export function deleteSuite(suiteIds) {
  return request({
    url: `/testsuite/${suiteIds}`,
    method: 'delete',
  })
}
// 修改套件
export function updateSuite(suiteId, data) {
  return request({
    url: `/testsuite/${suiteId}`,
    method: 'put',
    data: data
  })
}
// 查询套件
export function getSuite(suiteId) {
  return request({
    url: `/testsuite/${suiteId}`,
    method: 'get'
  })
}
// 运行套件测试
export function runSuite(suiteId) {
  return request({
    url: `/testsuite/run`,
    method: 'post',
    data: { suiteId }
  })
}


