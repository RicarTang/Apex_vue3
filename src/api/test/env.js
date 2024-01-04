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


