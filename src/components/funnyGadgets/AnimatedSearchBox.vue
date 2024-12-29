<!--
 * @Author: Gro lin
 * @Date: 2024-09-14 17:11:24
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-09-28 17:35:37
-->
<script setup>
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import { useUserStore, useChatStore } from '@/stores'
import { ref, onMounted, onUnmounted } from 'vue'
// const userStore = useUserStore()
// userStore.selectLanguage === 'en-US' ? 'Search Group or User' : '搜索'
const isActive = ref(false)
const searchWrapperRef = ref(null)
const searchContent = ref('')
const emit = defineEmits(['search'])
const props = defineProps({
  searchPlaceholder: {
    type: String,
    default: ''
  }
})
const searchToggle = () => {
  if (isActive.value && searchContent.value.length > 0) {
    emit('search', searchContent.value)
  }
  isActive.value = true
}
const enterSearch = (event) => {
  if (event.key === 'Enter') {
    searchToggle()
  }
}
// 点击外部触发关闭搜索框的逻辑
const handleClickOutside = (event) => {
  if (!searchWrapperRef.value || searchWrapperRef.value.contains(event.target)) {
    return
  }
  if (searchContent.value.length == 0) {
    isActive.value = false
  }
}

// 页面加载时监听点击事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// 在组件卸载时移除监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<template>
  <div class="search-wrapper" :class="{ active: isActive }" ref="searchWrapperRef">
    <div class="input-holder">
      <input
        v-model="searchContent"
        type="text"
        class="search-input"
        :placeholder="props.searchPlaceholder"
        @keydown="enterSearch"
      />
      <button class="search-icon" @click="searchToggle">
        <PhMagnifyingGlass class="icon" weight="bold" />
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
::selection {
  background: #dbdbe6;
}
.search-wrapper {
  height: 3rem;
  width: 3rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0);
  border-radius: 6px;
  position: relative;
  transition: all 0.3s ease-in-out;

  .search-input {
    width: 100%;
    height: 2rem;
    padding: 0px 3rem 0 20px;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 0px;
    background: transparent;
    box-sizing: border-box;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 400;
    line-height: 20px;
    color: $chatInputTextColor;
    transform: translateY(-50%);
    transition: all 0.3s cubic-bezier(0, 0.105, 0.035, 1.57);
    transition-delay: 0.3s;
  }
  .search-icon {
    width: 3rem;
    height: 3rem;
    border: none;
    border-radius: 6px;
    background: #fff;
    padding: 0px;
    outline: none;
    position: relative;
    z-index: 2;
    float: right;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    .icon {
      width: 22px;
      height: 22px;
      display: inline-block;
      vertical-align: middle;
      position: relative;
      transform: rotate(90deg);
      transition: all 0.4s cubic-bezier(0.65, -0.6, 0.24, 1.65);
    }
  }
  &.active {
    width: 100%;
    border-radius: 2rem;
    background: $chatInputBgColor_light;
    transition: all 0.5s cubic-bezier(0, 0.105, 0.035, 1.57);
    .search-input {
      opacity: 1;
    }
    .search-icon {
      width: 2rem;
      height: 2rem;
      margin: 0.5rem;
      border-radius: 30px;
      .icon {
        transform: rotate(0deg);
      }
    }
  }
}
</style>
