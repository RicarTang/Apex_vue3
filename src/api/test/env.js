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

