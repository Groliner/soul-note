<script setup>
import { messageManager } from '@/directives/index'
const props = defineProps({
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
const handleAdd = (m) => {
  if (page.value < props.total || m === -1) {
    emit('flip', m)
  } else {
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
</script>
<template>
  <div class="container_pagination">
    <button
      class="paginate left"
      :data-state="page === 1 ? 'disabled' : ''"
      @click="handleAdd(-1)"
    >
      <i></i><i></i>
    </button>
    <div class="counter">
      <p>{{ page }}</p>
      <p>/</p>
      <p>{{ total }}</p>
    </div>
    <button
      class="paginate right"
      :data-state="page === total ? 'add' : ''"
      @click="handleAdd(1)"
    >
      <i></i><i></i>
    </button>
    <div class="pages-container">
      <TransitionGroup
        tag="ul"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
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
    </div>
  </div>
</template>
<style lang="scss" scoped>
$size: 20px;
$thickness: 2px;
$angle: 40deg;
$angleHover: 30deg;
$angleActive: 25deg;

@mixin arrowTransform($angle, $x: 0, $y: 0) {
  i:first-child {
    transform: translate($x, $y) rotate($angle);
  }

  i:last-child {
    transform: translate($x, -$y) rotate(-$angle);
  }
}

.container_pagination {
  position: fixed;
  top: 120px;
  right: 130px;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  justify-content: center;
  align-items: center;
  gap: 2px;
  transition: all 0.3s ease;

  .counter {
    text-align: center;
    font-size: 30px;
    font-family: Helvetica, sans-serif;
    text-shadow: 0px 2px 0px rgba(0, 0, 0, 0.2);
    color: #130303;
    display: grid;
    grid-template-columns: 1fr min-content 1fr;
    justify-content: space-between;
    align-items: center;
  }
}

button {
  -webkit-appearance: none;
  background: transparent;
  border: 0;
  outline: 0;
}

.paginate {
  position: relative;
  margin: 10px;
  width: $size;
  height: $size;
  cursor: pointer;
  transform: translate3d(0, 0, 0); // fixes flicker in webkit

  top: 50%;
  margin-top: -20px;
  -webkit-filter: drop-shadow(0 2px 0px rgba(0, 0, 0, 0.2));

  i {
    position: absolute;
    top: 40%;
    left: 0;
    width: $size;
    height: $thickness;
    border-radius: calc($thickness / 2);
    background: #131212;

    transition: all 0.15s ease;
  }

  &.left {
    i {
      transform-origin: 0% 50%;
    }

    @include arrowTransform($angle, 0, -1px);

    &:hover {
      @include arrowTransform($angleHover, 0, -1px);
    }

    &:active {
      @include arrowTransform($angleActive, 1px, -1px);
    }

    &[data-state='disabled'] {
      @include arrowTransform(0deg, -5px, 0);

      &:hover {
        @include arrowTransform(0deg, -5px, 0);
      }
    }
  }

  &.right {
    i {
      transform-origin: 100% 50%;
    }

    @include arrowTransform($angle, 0, 1px);

    &:hover {
      @include arrowTransform($angleHover, 0, 1px);
    }

    &:active {
      @include arrowTransform($angleActive, 1px, 1px);
    }
  }

  &[data-state='add'] i {
    background-color: var(--c-green-500);
    cursor: default;
  }
  &[data-state='disabled'] {
    opacity: 0.3;
    cursor: default;
  }
}

.pages-container {
  position: fixed;
  right: 21px;
  top: 26%;
  font-family: inherit;
  border-radius: 5%;
  overflow: hidden;

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
