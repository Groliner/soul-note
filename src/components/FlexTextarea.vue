<!--
 * @Author: Gro lin
 * @Date: 2024-04-10 07:09:02
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-04-10 07:15:17
-->
<script setup>
import { gsap } from 'gsap'
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const mirror = ref(null)
const inputRef = ref(null)
const isInput = ref(false)
const props = defineProps({
  anime: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'click to edit'
  }
})
onMounted(() => {
  if (mirror.value) {
    // 创建一个ResizeObserver来监听尺寸变化
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width)
          if (!props.anime)
            inputRef.value.style.width = entry.contentRect.width + 8 + 'px'
          else
            gsap.to(inputRef.value, {
              width: entry.contentRect.width + 8,
              ease: 'power4.Out',
              duration: 0.3
            })
      }
    })

    // 开始观察<span>元素
    observer.observe(mirror.value)

    // 记得在组件卸载时停止观察
    onUnmounted(() => {
      observer.disconnect()
    })
  }
})
const handleEdit = (m) => {
  isInput.value = m
  if (!isInput.value) return
  inputRef.value.style.width = mirror.value.offsetWidth + 8 + 'px'
  nextTick(() => {
    inputRef.value.focus()
  })
}
const text = defineModel('text', {
  type: String,
  default: ''
})
</script>
<template>
  <div @mouseenter="handleEdit(true)">
    <input
      ref="inputRef"
      v-model="text"
      @blur="handleEdit(false)"
      :class="{ hidden: !isInput }"
      :placeholder="placeholder"
    />
    <span ref="mirror" :class="{ hidden: isInput }">{{
      text || 'placeholder'
    }}</span>
  </div>
</template>
<style>
input {
  background-color: transparent;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  padding: 0%;
}
span {
  width: inherit;
  white-space: pre;
}
.hidden {
  visibility: hidden;
  position: fixed;
}
</style>
