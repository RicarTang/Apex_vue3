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
            method:'post',
            url:'/user/login',
            data:data
        })
    },
    /**
     * 拉取所有用户数据
     * @param {*} params 请求参数
     * @returns 
     */
    async fetchUsers(params){
        return await axios({
            method:'get',
            url:'/user/users',
            params:params
        })
    }

}
