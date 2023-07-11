<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px">
                aside
            </el-aside>
            <el-container>
                <el-header>Header</el-header>
                <el-main>Main</el-main>
                <el-footer>Footer</el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import Menu from '@/components/layout/Menu.vue'
</script>

<style scoped>
/* .common-layout {
} */


/* .el-menu {
    background-color: #d3dce6;
} */
</style>