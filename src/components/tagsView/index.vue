<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import ScrollPane from './ScrollPane.vue'
import path from 'path'
import { tagsStore } from '@/stores/tagView/index'
import { useRouter } from 'vue-router'

// router
const router = useRouter()
// tag store
const tagStore = tagsStore()

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
  () => router.fullPath, //确保在每次触发监视器时，都能获取到 route.fullPath 的最新值。
  () => {
    addTags()
    moveToCurrentTag()
  },
  { immediate: true }
)
/**
 * 筛选
 */
function filterAffixTags(routes, basePath = '/') {
  let tags = []
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const tempTags = this.filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
/**
 * 初始化标签
 */
function initTags() {
  const affixTags = (affixTags.value = filterAffixTags(this.routes))
  for (const tag of affixTags) {
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
  const { name } = router
  if (name) {
    tagStore.add_visited_view(router)
    tagStore.add_cached_view(router)
  }
  return false
}
/**
 * 移除当前标签
 */
function moveToCurrentTag() {
  const tags = this.$refs.tag
  this.$nextTick(() => {
    for (const tag of tags) {
      if (tag.to.path === this.$route.path) {
        this.$refs.scrollPane.moveToTarget(tag)
        // when query is different then update
        if (tag.to.fullPath !== this.$route.fullPath) {
          this.$store.dispatch('tagsView/updateVisitedView', this.$route)
        }
        break
      }
    }
  })
}
</script>

<style>
</style>