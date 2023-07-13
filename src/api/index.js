import axios from './base'

export default {
  // 账号密码登陆
  async fetchLogin (data) {
    return await axios.post('/user/login', data)
  }
}
