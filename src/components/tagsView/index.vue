<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in tagStore.visitedViews"
        ref="tagRef"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        :class="isActive(tag) ? 'active' : ''"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
    <ul v-show="visible.value" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import ScrollPane from './ScrollPane.vue'
import path from 'path-browserify-esm'
import { tagsStore } from '@/stores/tagView/index'
import { useRoute, useRouter } from 'vue-router'

// route
const route = useRoute()
const router = useRouter()
// tag store
const tagStore = tagsStore()
// el ref
const tagRef = ref(null)
const scrollPane = ref(null)
// var
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref({})
const affixTags = ref([])

onMounted(() => {
  initTags()
  addTags()
})
watch(
  () => route.path, //确保在每次触发监视器时，都能获取到 route.path 的最新值。
  () => {
    addTags()
    // moveToCurrentTag()
    console.log("store views：",tagStore.cachedViews);
  },
  { immediate: true }
)
/**
 * 判断是否活动tag
 */
function isActive(router) {
  return router.path === route.path
}
/**
 * 判断是否附加tag
 */
function isAffix(tag) {
  return tag.meta && tag.meta.affix
}
/**
 * 筛选 meta里面affix标签
 */
function filterAffixTags(routes, basePath = '/') {
  let tags = []
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      // const tagPath = path.resolve(basePath, route.path)
      // console.log('tagPath', tagPath)
      // tags.push({
      //   fullPath: tagPath,
      //   path: tagPath,
      //   name: route.name,
      //   meta: { ...route.meta }
      // })
      tags.push(route)
    }
    // if (route.children) {
    //   const tempTags = filterAffixTags(route.children, route.path)
    //   if (tempTags.length >= 1) {
    //     tags = [...tags, ...tempTags]
    //   }
    // }
  })
  return tags
}
/**
 * 初始化标签
 */
function initTags() {
  const routers = router.getRoutes()
  affixTags.value = filterAffixTags(routers)
  for (const tag of affixTags.value) {
    // Must have tag name
    if (tag.name) {
      tagStore.add_visited_view(tag)
    }
  }
}
/**
 * 添加标签
 */
function addTags() {
  const { name } = route
  if (name) {
    tagStore.add_visited_view(route)
    tagStore.add_cached_view(route)
  }
  return false
}
/**
 * 移除当前标签
 */
function moveToCurrentTag() {
  const tags = tagRef.value
  console.log(tags)
  nextTick(() => {
    for (const tag of tags) {
      if (tag.to.path === route.path) {
        scrollPane.value.moveToTarget(tag)
        // when query is different then update
        if (tag.to.fullPath !== route.fullPath) {
          tagStore.update_visited_view(route)
        }
        break
      }
    }
  })
}
/**
 * 刷新选择的tag
 */
function refreshSelectedTag(view) {
  tagStore.del_cached_view(view)
  const { fullPath } = view
  nextTick(() => {
    router.replace({
      path: fullPath
    })
  })
}
/**
 * 关闭选中tag
 */
function closeSelectedTag(view) {
  tagStore.del_visited_view(view)
  tagStore.del_cached_view(view)
  if (isActive(view)) {
    toLastView(tagStore.visitedViews, view)
  }
}
/**
 * 关闭其他标签
 */
function closeOthersTags() {
  router.push(selectedTag.value)
  tagStore.del_others_visited_views(selectedTag.value)
  tagStore.del_others_cached_views(selectedTag.value)
  moveToCurrentTag()
}
/**
 * 关闭所有标签
 */
function closeAllTags(view) {
  tagStore.del_all_visited_views()
  tagStore.del_all_cached_views()

  if (affixTags.value.some((tag) => tag.path === view.path)) {
    return
  }
  toLastView(tagStore.visitedViews, view)
}
/**
 * 选中最后tag
 */
function toLastView(visitedViews, view) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    // 没有就重定向默认tag
    if (view.name === 'workspaceRoute') {
      // to reload home page
      router.replace({ path: view.fullPath })
    } else {
      router.push('/')
    }
  }
}
/**
 * 打开右键菜单
 */
function openMenu(tag, e) {
  console.log('右键', e.clientY)
  const menuMinWidth = 105
  const offsetLeft = e.currentTarget.getBoundingClientRect().left // container margin left
  const offsetWidth = e.currentTarget.offsetWidth // container width
  const maxLeft = offsetWidth - menuMinWidth // left boundary
  const computedLeft = e.clientX - offsetLeft + 15 // 15: margin right

  left.value = computedLeft > maxLeft ? maxLeft : computedLeft
  top.value = e.clientY
  visible.value = true
  selectedTag.value = 'your logic here' // Update this line with your logic for selectedTag
}
/**
 * 关闭右键菜单
 */
function closeMenu() {
  visible.value = false
}
/**
 *操作滚动条
 */
function handleScroll() {
  closeMenu()
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  margin-top: -20px;
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
    .el-icon-close {
      position: relative;
      display: inline-block;
      width: 10px;
      height: 10px;
      // vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        content: 'x';
        display: inline-block;
        // vertical-align: -3px;
        position: absolute;
        transform: scale(0.8) translate(-50%, -50%); /* 使元素在中心，缩放0.8倍 */
        // 微调元素位置
        top: 5%;
        right: 5%;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
<!-- <style lang="scss">
//reset element css of el-icon-close
.tags-view-container {
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;
        &:before {
          content: '';
          transform: scale(0.6);
          display: inline-block;
          vertical-align: -3px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
}
</style> -->