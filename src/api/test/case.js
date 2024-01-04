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


