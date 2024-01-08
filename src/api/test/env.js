import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询环境列表
export function listEnv(query) {
  return request({
    url: '/testenv/list',
    method: 'get',
    params: query
  })
}


// 新增环境变量
export function addEnv(data) {
  return request({
    url: '/testenv/add',
    method: 'post',
    data: data
  })
}
// 获取环境变量
export function getEnv(envId) {
  return request({
    url: `/testenv/${envId}`,
    method: 'get'
  })
}
// 修改环境变量
export function updateEnv(envId, data) {
  return request({
    url: `/testenv/${envId}`,
    method: 'put',
    data: data
  })
}
// 删除环境变量
export function deleteEnv(data) {
  const ids = {
    envIds: data
  }
  return request({
    url: `/testenv`,
    method: 'delete',
    data: ids
  })
}

