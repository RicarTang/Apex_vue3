import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/menu/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  const schema = {
    meta: {
      title: data.title,
      icon: data.icon,
      noCache: data.isCache
    },
    ...data
  }
  return request({
    url: '/menu/add',
    method: 'post',
    data: schema
  })
}

// 修改菜单
export function updateMenu(menu_id, data) {
  const schema = {
    ...data,
    meta: {
      title: data.title,
      icon: data.icon,
      noCache: data.isCache
    }

  }
  return request({
    url: `/menu/${menu_id}`,
    method: 'put',
    data: schema
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/menu/' + menuId,
    method: 'delete'
  })
}