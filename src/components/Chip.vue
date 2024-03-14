<script setup>
/*
弹窗组件
可拖动
content : 弹窗内容 (slot)
 */
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { ref, onMounted } from 'vue'
import { PhPalette, PhX } from '@phosphor-icons/vue'
gsap.registerPlugin(Draggable)
const chip = ref(null)
const drg = ref(null)
onMounted(() => {
  drg.value = Draggable.create(chip.value, {
    type: 'x,y',
    bounds: 'html'
  })
})
const isShow = ref(true)
</script>
<template>
  <div class="chip" ref="chip" v-show="isShow">
    <div class="chip__icon">
      <ph-palette weight="bold" />
    </div>
    <div class="chip__content">
      <slot name="content">默 认 弹 窗, 无 需 担 忧</slot>
    </div>
    <div class="chip__close">
      <ph-x weight="bold" @click="isShow = false" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
/*  CHIP  */
.chip {
  width: min-content;
  min-height: 4rem;
  border-radius: 1rem;
  box-shadow: $shadow;
  display: grid;
  grid-template-columns: 1.5fr 7fr 1fr;
  align-items: center;
  justify-items: center;
  gap: 0.5rem;
  padding: 0.3rem;

  &__icon {
    width: 3rem;
    height: 3rem;
    border-radius: 1rem;
    margin: 0 0 0 0.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    color: var(--primary);
  }

  &__content {
    max-width: 20rem;
    font-size: 0.9rem;
    color: var(--greyDark);
    word-wrap: break-word;
  }

  &__close {
    width: 1.6rem;
    height: 1.6rem;
    margin: 0 0.5rem;
    display: flex;
    font-size: 1.6rem;
    color: var(--greyLight-3);
    cursor: pointer;
  }
}
</style>
