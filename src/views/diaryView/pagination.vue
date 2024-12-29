<script setup>
import { messageManager } from '@/directives/index'
defineProps({
  total: {
    type: Number,
    required: true
  }
})
const page = defineModel('page', {
  type: Number,
  required: true
})
const emit = defineEmits(['add', 'flip'])
const handleAdd = () => {
  messageManager
    .showConfirmModal('Do you want to add a new page?', {
      mask: false,
      pressTime: 100
    })
    .then((res) => {
      if (res) {
        emit('add')
      }
    })
}

import { gsap } from 'gsap'
function onBeforeEnter(el) {
  el.style.opacity = 0
  el.style.height = 0
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: 'auto',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: el.dataset.index * 0.14,
    onComplete: done
  })
}

const scrollToPage = () => {
  const container = document.querySelector('.pages')
  const target = document.querySelector('.pages .active')

  // 如果 target 元素不可见，则进行滚动
  gsap.to(container, {
    scrollTo: {
      y: target,
      ease: 'power1.out',
      duration: 0.4
    }
  })
}

import { PhPlusSquare } from '@phosphor-icons/vue'
import { nextTick, onMounted, watch } from 'vue'
</script>
<template>
  <div class="container_pagination">
    <div class="pages-container">
      <TransitionGroup
        tag="ul"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
        @after-leave="scrollToPage"
        @after-enter="scrollToPage"
        class="pages"
      >
        <li
          class="pageNum"
          v-for="pageNum in total"
          :key="pageNum"
          @click="page = pageNum"
          :class="{ active: page === pageNum }"
        >
          <div class="page-content">
            <div class="tip-title">{{ pageNum }}</div>
          </div>
        </li>
      </TransitionGroup>
      <div class="suffix">
        <ph-plus-square class="add" weight="bold" @click="handleAdd" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container_pagination {
  position: fixed;
  top: 120px;
  right: 8em;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  justify-content: center;
  align-items: center;
  gap: 2px;
  transition: all 0.3s ease;

  @media screen and (max-width: 800px) {
    right: 5em;
  }
}

.pages-container {
  position: fixed;
  right: 21px;
  top: 26%;
  font-family: inherit;
  border-radius: 5%;
  overflow: hidden;
  .suffix {
    text-align: center;
    width: auto;
    margin-top: 1rem;
    .add {
      font-size: 1.5rem;
      cursor: pointer;

      &:hover {
        color: var(--c-green-300);
      }
      &:active {
        color: black;
      }
    }
  }

  .pages {
    max-height: 33vh;
    width: fit-content;
    overflow-y: scroll;
    user-select: none;
    &::-webkit-scrollbar {
      width: 3px;
      height: 2px;
    }
    list-style: none;
    padding: 0;
    li {
      width: 3.8rem;
      cursor: pointer;
      .page-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .tip-title {
          font-size: 1em;
          @media screen and (max-width: 800px) {
            font-size: 1.2em;
          }
          font-weight: bold;
          &:not(last-child) {
            border-bottom: 1px solid #e0e0e0;
          }
        }
      }
      &:hover {
        background-color: var(--c-yellow-200);
        color: var(--greyDark);
      }
      &.active {
        background: radial-gradient(circle at 50% 50%, #000000, #faf5e9);
        color: #fff;
      }
    }
  }
}
</style>
