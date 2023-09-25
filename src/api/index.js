import axios from './base'


export default {
    /**
     * 账号密码登陆
     * @param {*} data 用户名密码对象
     * @returns 
     */
    async fetchLogin(data) {
        // return await axios.post('/user/login', data)
        return await axios({
            method: 'post',
            url: '/user/login',
            data: data
        })
    },
    /**
     * 拉取所有用户数据
     * @param {*} params 请求参数
     * @returns 
     */
    async fetchUsers(params) {
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
    async deleteUsers(body) {
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
     * 拉取所有测试用例
     * @param {*} params 请求参数
     */
    async fetchTestcases(params) {
        return await axios({
            method: 'get',
            url: '/testcase/getAll',
            params: params
        })
    },
    /**
     * 拉取所有测试套件
     * @param {*} params 请求参数
     */
    async fetchTestsuites(params) {
        return await axios({
            method: 'get',
            url: '/testsuite/getAll',
            params: params
        })
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
    /**
     * 下载测试用例模板
     */
    async downloadTestTemplate() {
        return await axios({
            method: 'get',
            url: '/testcase/template/download',
            responseType: 'blob', // 指定响应类型为blob
        }).then((response) => {
            // 获取文件数据和MIME类型
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            // 创建Blob URL
            const url = window.URL.createObjectURL(blob);
            // 创建<a>标签并设置属性
            const a = document.createElement('a');
            a.href = url;
            a.download = "测试用例模板";
            // 模拟点击<a>标签以触发下载
            a.click();
            // 释放Blob URL资源
            window.URL.revokeObjectURL(url);
        })
            .catch((error) => {
                console.error('下载文件时出错：', error);
            });
    },
    /**
     * 导入测试用例模板
     * @param {*} data 请求参数
     */
    async importTestTemplate(data) {
        return await axios({
            method: 'post',
            url: '/testcase/import',
            data: data
        })
    },
    /**
     * 新增测试用例
     * @param {*} data  请求body
     * @returns 
     */
    async addTestcase(data) {
        return await axios({
            method: 'post',
            url: '/testcase/add',
            data: data
        })
    },
    /**
     * 更新测试用例
     * @param {*} case_id 测试用例id
     * @param {*} data 请求body
     * @returns 
     */
    async updateTestcase(case_id, data) {
        return await axios({
            method: 'put',
            url: `/testcase/${case_id}`,
            data: data
        })
    },
    /**
     * 删除测试用例
     * @param {*} case_id 测试用例id
     * @returns 
     */
    async deleteTestcase(case_id) {
        return await axios({
            method: 'delete',
            url: `/testcase/${case_id}`,
        })
    },
    /**
     * 查询测试用例
     * @param {*} params 请求参数
     * @returns 
     */
    async queryTestcases(params) {
        return await axios({
            method: 'get',
            url: '/testcase/query',
            params: params
        })
    },


}
