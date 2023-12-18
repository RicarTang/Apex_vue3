import axios from '../base'


export default {
    /**
     * 账号密码登陆
     * @param {*} data 用户名密码对象
     * @returns 
     */
    async login(data) {
        // return await axios.post('/user/login', data)
        return await axios({
            method: 'post',
            url: '/user/login',
            data: data
        })
    },
    /**
     * 获取当前用户
     * @returns 
     */
    async getCurrentUser() {
        return await axios({
            method: 'get',
            url: '/user/me',
        })
    },
    /**
     * 拉取所有用户数据
     * @param {*} params 请求参数
     * @returns 
     */
    async getAllUser(params) {
        return await axios({
            method: 'get',
            url: '/user/users',
            params: params
        })
    },
    /**
     * 查询用户
     * @param {*} params 请求参数
     * @returns 
     */
    async queryUsers(params) {
        return await axios({
            method: 'get',
            url: '/user/query',
            params: params
        })
    },
    /**
     * 删除用户
     * @param {*} user_id 用户id
     * @returns 
     */
    async deleteUser(user_id) {
        return await axios({
            method: 'delete',
            url: `/user/${user_id}`,
        })
    },
    /**
     * 批量删除用户
     * @param {*} body 请求体
     * @returns 
     */
    async deleteManyUser(body) {
        return await axios({
            method: 'delete',
            url: `/user/batchDelete`,
            data: body

        })
    },
    /**
     * 更新用户
     * @param {*} user_id 用户id
     * @param {*} data 请求body
     * @returns 
     */
    async updateUser(user_id, data) {
        return await axios({
            method: 'put',
            url: `/user/${user_id}`,
            data: data
        })
    },
    /**
     * 退出登录
     */
    async logout() {
        await axios({
            method: 'post',
            url: '/user/logout'
        });
    },
    /**
     * 新增用户
     * @param {*} data 请求参数
     */
    async addUser(data) {
        return await axios({
            method: 'post',
            url: '/user/create',
            data: data
        })
    },
}