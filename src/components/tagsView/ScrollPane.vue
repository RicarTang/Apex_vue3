<template>
  <el-scrollbar
    ref="scrollbarRef"
    :vertical="false"
    class="scroll-container"
    @wheel.stop="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const left = ref(0)
const scrollbarRef = ref(null)

const emit = defineEmits(['scroll'])

const tagAndTagSpacing = 4 // tagAndTagSpacing
/**
 * 滚动控制
 */
function handleScroll(e) {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  scrollbarRef.value.wrapRef.scrollLeft = scrollbarRef.value.wrapRef.scrollLeft + eventDelta / 4
}
/**
 * 传递emit
 */
function emitScroll() {
  emit('scroll')
}
/**
 *移动tag
 */

function moveToTarget(currentTag) {
  const container = scrollbarRef.value.$el
  const containerWidth = container.offsetWidth
  const scrollWrapper = scrollbarRef.value.wrapRef
  const tagList = scrollbarRef.value.$parent.$refs.tag

  let firstTag = null
  let lastTag = null

  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }

  if (firstTag === currentTag) {
    scrollWrapper.scrollLeft = 0
  } else if (lastTag === currentTag) {
    scrollWrapper.scrollLeft = scrollWrapper.scrollWidth - containerWidth
  } else {
    // find preTag and nextTag
    const currentIndex = tagList.findIndex((item) => item === currentTag)
    const prevTag = tagList[currentIndex - 1]
    const nextTag = tagList[currentIndex + 1]

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft =
      nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

    if (afterNextTagOffsetLeft > scrollWrapper.scrollLeft + containerWidth) {
      scrollWrapper.scrollLeft = afterNextTagOffsetLeft - containerWidth
    } else if (beforePrevTagOffsetLeft < scrollWrapper.scrollLeft) {
      scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
    }
  }
}

onMounted(() => {
  scrollbarRef.value.wrapRef.addEventListener('scroll', emitScroll, true)
})

onBeforeUnmount(() => {
  scrollbarRef.value.wrapRef.removeEventListener('scroll', this.emitScroll)
})
</script>
  
<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>