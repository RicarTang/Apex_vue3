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
     * 检查token
     */
    // async checkToken() {
    //     try {
    //         const res = await axios.get('/user/me')
    //         if (res.status === 200) {
    //             return true
    //         } else {
    //             return false
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         return false
    //     }
    // }
}
