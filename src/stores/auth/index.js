import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => { //管理俩个状态 一个是是否登录成功即token是否存在，二是解析的token里面所包含的数据
        return { isAuthenticated: false, user: {} }
    },
    // 也可以定义为
    // state: () => ({ count: 0 })
    // getters: { //通过getters对状态state进行获取
    //     getAuthenticated: (state) => state.isAuthenticated,
    //     getUser: (state) => state.user
    // },
    actions: {
        setAuth(isAuth) {//修改当前登录的状态
            if (isAuth) {
                this.isAuthenticated = isAuth; //在pinia中this指代state
            } else {
                this.isAuthenticated = false;
            }
        },
        setUser(user) { //解析的用户
            if (user) {
                this.user = user;
            } else {
                this.user = {};
            }
        }
    },
})
