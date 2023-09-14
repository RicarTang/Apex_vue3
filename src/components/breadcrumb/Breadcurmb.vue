<template>
    <!-- 面包屑 -->
    <div class="crumb">
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
            <el-breadcrumb-item>promotion management</el-breadcrumb-item>
            <el-breadcrumb-item>promotion list</el-breadcrumb-item>
            <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.crumb {
    display: flex;
    height: 3rem;
    // margin-bottom: 20px;
    // padding-left: 12px;
    /* 垂直居中 */
    align-items: center;
    // background-color: #ffffff;
    border-radius: 4px;
}
</style>