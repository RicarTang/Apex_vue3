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

.el-container {
    /* height: 100%; */
    padding: 0px;
    margin: 0px;
    height: 100%;
    widows: 100%;
}

.el-header,
.el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
}

/* .el-menu {
    background-color: #d3dce6;
} */
</style>