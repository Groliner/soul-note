<script setup>
/*
拖动条组件
可拖动,自定义初始值
sliderPercent : 滑动百分比  绑定方式(v-model:sliderPercent)
width : 滑动条宽度 (props)
*/
import { ref, onMounted, onUnmounted } from 'vue'

const container = ref(null)
const btn = ref(null)
const color = ref(null)
const tooltip = ref(null)
const isDown = ref(false)
onMounted(() => {
  document.addEventListener('mouseup', mouseup)
  document.addEventListener('mousemove', onMouseMove)
  console.log('props.width', props.width)
  btn.value.style.left = (props.width * sliderPercent.value) / 100 - 10 + 'px'
  color.value.style.width = sliderPercent.value + '%'
  tooltip.value.style.left = (props.width * sliderPercent.value) / 100 - 15 + 'px'
})
onUnmounted(() => {
  document.removeEventListener('mouseup', mouseup)
  document.removeEventListener('mousemove', onMouseMove)
})
const mouseup = () => {
  isDown.value = false
  // tooltip.value.style.opacity = 0
}
const onMouseMove = (e) => {
  if (!isDown.value) return
  let targetRect = container.value.getBoundingClientRect()
  let x = e.pageX - targetRect.left
  if (x > targetRect.width) {
    x = targetRect.width
  }
  if (x < 0) {
    x = 0
  }
  btn.value.x = x - 10
  btn.value.style.left = btn.value.x + 'px'

  // get the position of the button inside the container (%)
  let percentPosition = ((btn.value.x + 10) / targetRect.width) * 100

  // color width = position of button (%)
  color.value.style.width = percentPosition + '%'

  // move the tooltip when button moves, and show the tooltip
  tooltip.value.style.left = btn.value.x - 5 + 'px'
  tooltip.value.style.opacity = 1

  // show the percentage in the tooltip
  tooltip.value.textContent = Math.round(percentPosition) + '%'
  sliderPercent.value = Math.round(percentPosition)
}
const sliderPercent = defineModel('sliderPercent', { default: 33 })
const props = defineProps({
  width: {
    type: Number,
    default: 200
  }
})
</script>
<template>
  <div class="slider" :style="`width:${props.width}px`">
    <div
      class="slider__box"
      ref="container"
      @mousedown="
        (e) => {
          isDown = true
          onMouseMove(e)
        }
      "
    >
      <span
        class="slider__btn"
        id="find"
        ref="btn"
        @mouseover="
          () => {
            tooltip.style.opacity = 1
          }
        "
        @mouseout="
          () => {
            tooltip.style.opacity = 0
          }
        "
      ></span>
      <span class="slider__color" ref="color"></span>
      <span class="slider__tooltip" ref="tooltip">{{ sliderPercent }}%</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.slider {
  display: flex;
  flex-direction: column;

  &__box {
    width: 100%;
    height: 1rem;
    cursor: pointer;
    box-shadow: $inner-shadow;
    border-radius: 1rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__btn {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--white);
    position: absolute;
    box-shadow: 0px 0.1rem 0.3rem 0px var(--greyLight-3);
    z-index: 200;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover ~ .slider__tooltip {
      opacity: 1;
    }
    &::after {
      content: '';
      position: absolute;
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      box-shadow: $inner-shadow;
    }
  }

  &__color {
    height: 100%;
    width: 50%;
    position: absolute;
    left: 0;
    z-index: 100;
    border-radius: inherit;
    background: var(--primary);
    background: linear-gradient(
      -1deg,
      var(--primary-dark) 0%,
      var(--primary) 50%,
      var(--primary-light) 100%
    );
  }

  &__tooltip {
    position: absolute;
    top: 2.6rem;
    height: 2.5rem;
    width: 3rem;
    border-radius: 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    color: var(--primary);
    box-shadow: $shadow;
    opacity: 0;
    transition: opacity 0.6s ease;
  }
}
</style>
