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


