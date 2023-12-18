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

}