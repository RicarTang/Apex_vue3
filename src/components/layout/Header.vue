<template>
    <div>
        <!-- 折叠图标按钮 -->
        <el-icon @click="changeCollapseState" >
            <IEpFold />
        </el-icon>
        <!-- <el-icon>
            <Expand />
        </el-icon> -->
    </div>
</template>

<script setup>
// 导入组件通信插件
import emitter from '@/utils/eventBus'
// 图标按钮状态
const isCollapse = ref(false)
// 改变图标按钮状态函数，控制菜单折叠
const changeCollapseState = () => {	
    isCollapse.value = !isCollapse.value	//首先把menuL取反
    // isCollapse.value ? head_icon.value = 'Expand' : head_icon.value = 'Fold'	//这里是改变按钮上面的图标式样
    emitter.emit("isCollapse", isCollapse.value)	//通过mitt的emit把menuL传递出去，sayInfo传参名称
}


</script>

<style></style>