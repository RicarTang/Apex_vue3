import request from '@/utils/request'

// 查询权限列表
export function listPermission(query) {
    return request({
        url: '/admin/permission/list',
        method: 'get',
        params: query
    })
}
// 查询权限
export function getPermission(permissionId) {
    return request({
        url: `/admin/permission/${permissionId}`,
        method: 'get'
    })
}
// 添加权限
export function addPermission(data) {
    return request({
        url: `/admin/permission/add`,
        method: 'post',
        data: data
    })
}
// 更新权限
export function updatePermission(permissionId, data) {
    return request({
        url: `/admin/permission/${permissionId}`,
        method: 'put',
        data: data
    })
}
// 删除权限
export function deletePermission(permissionIds) {
    return request({
        url: `/admin/permission/${permissionIds}`,
        method: 'delete',
    })
}