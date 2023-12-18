import axios from '../base'


export default {
    /**
     * 拉取所有测试套件
     * @param {*} params 请求参数
     */
    async getAllTestsuite(params) {
        return await axios({
            method: 'get',
            url: '/testsuite/getAll',
            params: params
        })
    },
    /**
     * 执行单个测试套件
     * @param {*} data 请求body
     */
    async executeOneSuite(data) {
        return await axios({
            method: 'post',
            url: '/testsuite/run',
            data: data
        })
    },

}