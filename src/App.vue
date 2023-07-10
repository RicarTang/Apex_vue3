<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <transition name="fade" mode="out-in">
    <RouterView />
  </transition>
</template>

<style lang="scss">
// #app {
//   height: 100vh;
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
// }

// * {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
// }

// .fade-enter-active,
// .fade-leave-active {
//   transition: all .2s ease;
// }

// .fade-enter,
// .fade-leave-active {
//   opacity: 0;
// }
body {
  margin: 0px;
  padding: 0px;
  font-family: Microsoft YaHei, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,  SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  padding: 0px;
}
a{
  color: #56a9ff;
}
.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
#nprogress .bar {
  height: 3px !important;
  background: #56a9ff !important; //自定义颜色
}
</style>
