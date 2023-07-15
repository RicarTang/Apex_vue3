import axios from './base'

export default {
    /**
     * 账号密码登陆
     * @param {*} data 用户名密码对象
     * @returns 
     */
    async fetchLogin(data) {
        return await axios.post('/user/login', data)
    },
    /**
     * 拉取所有用户数据
     * @returns 
     */
    async fetchUsers(){
        return await axios.get('/user/users')
    }

}
