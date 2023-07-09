<script setup>
import { RouterLink, RouterView } from 'vue-router'
import LoginView from './views/LoginView.vue'

</script>

<template>
  <div id="app">
    <LoginView />
  </div>

  <RouterView />
</template>

<style>
#app {
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
