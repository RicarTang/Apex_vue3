<template>
    <div>
        <el-aside id="asideNav">
            <div class="logo-name">
                <p v-if="layoutState.layoutData.logoShow">XU</p>
                <p v-else>vue-xuAdmin后台模板</p>
            </div>
            <el-menu :default-active="$route.path" class="el-menu-vertical" :collapse="isCollapse"
                background-color="#03152A" text-color="rgba(255,255,255,.7)" active-text-color="#ffffff"
                :router="layoutState.layoutData.uniquerouter" :unique-opened="layoutState.layoutData.uniquerouter"
                :collapse-transition="true" @select="selectMenu">
                <!-- <template v-for="(item, index) in routerDataState.routers">
                    <template v-if="!item.hidden">
                        <el-sub-menu v-if="!item.alone && item.children.length > 0" :key="index" :index="index + ''">
                            <template #title>
                                <i :class="item.iconCls ? item.iconCls : ['fa', 'fa-server']"></i>
                                <span>{{ $t(`routeName.${item.name}`) }}</span>
                            </template>

                            <menu-tree :menu-data="item.children"></menu-tree>

                        </el-sub-menu>
                        <el-menu-item v-else :key="item.path" :index="item.path">
                            <i :class="item.iconCls ? item.iconCls : ['fa', 'fa-file']" />
                            <span>{{ $t(`routeName.${item.name}`) }}</span>
                        </el-menu-item>
                    </template>
                </template> -->

            </el-menu>
        </el-aside>
    </div>
</template>

<script setup>
let isCollapse = false
</script>

<style></style>