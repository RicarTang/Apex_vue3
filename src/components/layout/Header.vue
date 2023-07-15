<template>
        <!-- 折叠图标按钮,使用v-if/v-else控制显示图标组件 -->
        <el-icon @click="changeCollapseState" v-if="!isCollapse" :size="size">
            <IEpFold />
        </el-icon>
        <el-icon v-else @click="changeCollapseState" :size="size">
            <IEpExpand />
        </el-icon>
</template>

<script setup>
// 导入组件通信插件
import emitter from '@/utils/eventBus'
// 图标按钮状态
const isCollapse = ref(false)
// 图标大小
const size = 30
// 改变图标按钮状态函数，控制菜单折叠
const changeCollapseState = () => {	
    isCollapse.value = !isCollapse.value	//首先把menuL取反
    // isCollapse.value ? head_icon.value = 'Expand' : head_icon.value = 'Fold'	//这里是改变按钮上面的图标式样
    emitter.emit("isCollapse", isCollapse.value)	//通过mitt的emit把menuL传递出去，sayInfo传参名称
}


</script>

<style>
</style>