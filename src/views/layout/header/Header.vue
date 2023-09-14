<template>
    <div class="header-container">
        <div class="collapse">
            <!-- 折叠图标按钮,使用v-if/v-else控制显示图标组件 -->
            <el-icon @click="changeCollapseState" v-if="!isCollapse" :size="size">
                <IEpFold />
            </el-icon>
            <el-icon v-else @click="changeCollapseState" size="30">
                <IEpExpand />
            </el-icon>
        </div>
        <div class="avatar-col">
            <el-dropdown>
                <el-col :span="24">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </el-col>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logout">
                            <el-icon>
                                <SwitchButton />
                            </el-icon>
                            <span>退出登录</span>

                        </el-dropdown-item>

                    </el-dropdown-menu>
                </template>
            </el-dropdown>

        </div>
    </div>
</template>

<script setup>
// 导入组件通信插件
import emitter from '@/utils/eventBus'
import fetch from '@/api/index'
import { useRouter } from 'vue-router';
import { SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
// 图标按钮状态
const isCollapse = ref(false)
const showPopover = ref(false)

const logout = async () => {
    await fetch.logout()
    ElMessage({
        message: '退出登录',
        type: 'success',
    })
    router.replace('/login')
    localStorage.removeItem('token');
}
// 改变图标按钮状态函数，控制菜单折叠
const changeCollapseState = () => {
    isCollapse.value = !isCollapse.value	//首先把menuL取反
    // isCollapse.value ? head_icon.value = 'Expand' : head_icon.value = 'Fold'	//这里是改变按钮上面的图标式样
    emitter.emit("isCollapse", isCollapse.value)	//通过mitt的emit把menuL传递出去，sayInfo传参名称
}


</script>

<style lang="scss" scoped>
.header-container {
    /*继承父元素所有属性 */
    all: inherit;

    padding: 0px;

    .collapse {
        order: 1;
    }

    .avatar-col {
        order: 2;
        margin-left: auto;
    }
}
</style>