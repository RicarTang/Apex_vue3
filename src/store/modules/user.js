import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      id: '',
      name: '',
      avatar: '',
      roles: [],
      permissions: []
    }),
    actions: {
      // 登录
      async login(userInfo) {
        try {
          const username = userInfo.username.trim()
          const password = userInfo.password
          const res = await login(username, password)
          setToken(res.result.access_token)
          this.token = res.result.access_token
        } catch (error) {
          console.log(`登录失败:${error}`);
        }
      },
      // 获取用户信息
      async getInfo() {
        try {
          const res = await getInfo();
          const user = res.result
          const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;

          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            this.roles = res.roles
            this.permissions = res.permissions
          } else {
            this.roles = ['ROLE_DEFAULT']
          }
          this.id = user.id
          this.name = user.username
          this.avatar = avatar
        } catch (error) {
          console.log(error);
        }
        console.log(this.roles);
      },
      // 退出系统
      async logOut() {
        try {
          // await logout();
          this.token = ''
          this.roles = []
          this.permissions = []
          removeToken()
        } catch (error) {
          console.log(error);
        }
      }
    }
  })

export default useUserStore
