<template>
    <div id="loyout">
        <el-container>
            <layoutAside></layoutAside>
            <el-container>
                <layoutHeader></layoutHeader>
                <el-main id="elmain">
                    <transition name="main" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </el-main>
                <el-footer>
                    <Bottom></Bottom>
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {

}
</script>

<style></style>