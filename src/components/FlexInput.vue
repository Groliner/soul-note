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
    type: [String, Number],
    default: 'click to edit'
  },
  offsetWidth: {
    type: Number,
    default: 8
  },
  hover: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'text'
  },
  status: {
    type: Boolean,
    default: true
  }
})
onMounted(() => {
  if (mirror.value) {
    // 创建一个ResizeObserver来监听尺寸变化
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width)
          if (!props.anime)
            inputRef.value.style.width =
              entry.contentRect.width + props.offsetWidth + 'px'
          else
            gsap.to(inputRef.value, {
              width: entry.contentRect.width + props.offsetWidth,
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
  if (!props.status) return
  isInput.value = m
  if (!isInput.value || !inputRef.value) return
  inputRef.value.style.width =
    mirror.value.offsetWidth + props.offsetWidth + 'px'
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
  <div @mouseenter="handleEdit(props.hover)">
    <input
      :type="props.type || 'text'"
      ref="inputRef"
      v-model="text"
      @blur="handleEdit(false)"
      :class="{ hidden: !isInput }"
      :placeholder="placeholder"
      :disabled="!props.status"
    />
    <span ref="mirror" :class="{ hidden: isInput }" @click="handleEdit(true)">{{
      text || placeholder
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
  transition: width 0.3s ease;
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
