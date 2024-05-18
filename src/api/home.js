import request from '@/utils/request'

// 获取首页数据
export function home() {
    return request({
        url: '/statistics',
        method: 'get',
    })
}

