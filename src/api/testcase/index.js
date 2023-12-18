import axios from '../base'


export default {
    /**
     * 拉取所有测试用例
     * @param {*} params 请求参数
     */
    async getAllTestcase(params) {
        return await axios({
            method: 'get',
            url: '/testcase/getAll',
            params: params
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