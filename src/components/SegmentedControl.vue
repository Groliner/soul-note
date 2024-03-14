<script setup>
/*
选项卡组件
pickedValue : 选中的值  绑定方式(v-model:pickedValue)
n : 选项卡的数量 (props)
*/
import { watch } from 'vue'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
gsap.registerPlugin(CustomEase)
CustomEase.create('privateEase', '0.645, 0.045, 0.355, 1')
const picked = defineModel('pickedValue', { default: 1 })
watch(picked, (newVal, oldVal) => {
  gsap.to('.segmented-control__color', {
    x: `+=${(newVal - oldVal) * 6.8}rem`,
    duration: 0.3,
    ease: 'privateEase'
  })
})
const props = defineProps({
  n: {
    type: Number,
    default: 3
  }
})
</script>
<template>
  <div class="segmented-control">
    <div v-for="i in props.n" :key="i" :class="`segmented-control__${i}`">
      <input
        type="radio"
        name="radio2"
        :value="i"
        :id="`tab-${i}`"
        v-model="picked"
      />
      <label :for="`tab-${i}`">
        <p>Tab {{ i }}</p></label
      >
    </div>
    <div class="segmented-control__color"></div>
  </div>
</template>
<style lang="scss" scoped>
.segmented-control {
  width: 20.4rem;
  height: 4rem;
  box-shadow: $shadow;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  position: relative;

  &__1,
  &__2,
  &__3 {
    input {
      display: none;
    }

    > input:checked + label {
      transition: all 0.5s ease;
      color: var(--primary);
    }
    label {
      width: 6.8rem;
      height: 3.6rem;
      font-size: 1.4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      color: var(--greyDark);
      transition: all 0.5s ease;

      &:hover {
        color: var(--primary);
      }
    }
  }

  &__color {
    position: absolute;
    height: 3.4rem;
    width: 6.2rem;
    margin-left: 0.3rem;
    border-radius: 0.8rem;
    box-shadow: $inner-shadow;
    pointer-events: none;
  }
}
</style>
