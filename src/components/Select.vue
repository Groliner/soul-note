<script setup>
import { gsap } from 'gsap'
import { onMounted, ref } from 'vue'
const selectedTip = ref(0)
</script>
<template>
  <div class="tips-container">
    <ul class="tips">
      <li
        class="tip"
        v-for="tip in 100"
        :key="tip"
        @click="selectedTip = tip"
        :class="{ active: selectedTip === tip }"
      >
        <div class="tip-content">
          <div class="tip-title">{{ tip }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tips-container {
  @include absCenter;
  .tips {
    max-height: 33vh;
    width: fit-content;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 3px;
      height: 2px;
    }
    list-style: none;
    padding: 0;
    li {
      width: 5rem;
      border-radius: 5px;
      background-color: #f0f0f0;
      cursor: pointer;
      .tip-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .tip-title {
          font-size: 16px;
          font-weight: bold;
          &:not(last-child) {
            border-bottom: 1px solid #e0e0e0;
          }
        }
      }
      &:hover {
        background-color: var(--c-yellow-200);
        color: #afdad7;
      }
      &.active {
        background-color: #ff0000;
        color: #fff;
      }
    }
  }
}
</style>
