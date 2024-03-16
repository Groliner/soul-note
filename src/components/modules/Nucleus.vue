<!--
 * @Author: Gro lin
 * @Date: 2024-03-11 22:34:28
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-03-11 22:35:50
-->
<script setup>
import { gsap } from 'gsap'
import { ref, onMounted, watch, reactive } from 'vue'
const sliderPercent = ref(0)
const atom = ref(null)
const tl = gsap.timeline()
const atomTl = gsap.timeline({
  defaults: {
    duration: 300
  }
})

const dur = 2
const del = 0.5
const atomAnimation = () => {
  tl.fromTo(
    '.electron',
    { rotationX: 90 },
    {
      rotationZ: -360,
      rotationX: 90,
      duration: dur,
      ease: 'none',
      stagger: {
        each: -del,
        repeat: -1
      }
    },
    0
  )
  tl.to(
    '.path',
    {
      rotationZ: 360,
      ease: 'none',
      duration: dur,
      stagger: {
        each: -del,
        repeat: -1
      }
    },
    0
  )

  atomTl.set(atom.value, { transformOrigin: 'center center' })

  // Add a rotation to the whole atom
  atomTl.to(atom.value, {
    rotation: 360,
    ease: 'none',
    repeat: -1
  })

  // Skip the loading
  tl.progress(0.9999)
}
onMounted(() => {
  atomAnimation()
})

const electron = reactive({
  number: 1
})

watch(sliderPercent, (n) => {
  gsap.to(electron, { duration: 0.5, number: Number(n) || 0 })
  tl.timeScale(sliderPercent.value)
})
const nucleusSpeed = ref(1)
const nucleus = reactive({
  number: 1
})

watch(nucleusSpeed, (n) => {
  gsap.to(nucleus, { duration: 0.5, number: Number(n) || 0 })
  atomTl.timeScale(nucleusSpeed.value)
})
sliderPercent.value = 1
</script>
<template>
  <ClockComponent :showtime="false" />
  <div class="container">
    <div class="atom-edge">
      <div
        class="atom"
        ref="atom"
        @mouseleave="
          () => {
            tl.timeScale(tl.timeScale() * 10)
            atomTl.timeScale(atomTl.timeScale() * 10)
          }
        "
        @mouseenter="
          () => {
            tl.timeScale(tl.timeScale() * 0.1)
            atomTl.timeScale(atomTl.timeScale() * 0.1)
          }
        "
      >
        <div class="orbit">
          <div class="path">
            <div class="electron"></div>
          </div>
        </div>
        <div class="orbit">
          <div class="path">
            <div class="electron"></div>
          </div>
        </div>
        <div class="orbit">
          <div class="path">
            <div class="electron"></div>
          </div>
        </div>
        <div class="orbit">
          <div class="path">
            <div class="electron"></div>
          </div>
        </div>
        <div class="nucleus"></div>
      </div>
    </div>
    <div class="atomControl">
      <SliderComponent v-model:sliderPercent="sliderPercent"></SliderComponent>
      <div class="slider-demo-block">
        <el-slider v-model="nucleusSpeed" size="large" :show-tooltip="false" />
        <p class="speed">Nucleus speed:{{ nucleus.number.toFixed(0) }}</p>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  background: grey;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30rem;
  margin: auto;
  padding: 1rem;
  position: relative;
  .atom-edge {
    font-weight: 300;
    overflow: hidden;
    color: white;
    text-align: center;
    position: relative;
    @include atom-size;

    .atom {
      position: absolute;
      top: 50%;
      left: 50%;
      @include atom-size;
      transform: translate(-50%, -50%);
      transform-style: preserve-3d;
      perspective: 1000;

      .orbit {
        position: absolute;
        top: 0;
        left: 0;
        @include atom-size;
        border-radius: 30rem;
        border: 0.5rem solid #ccc;
        transform-style: preserve-3d;
        transform: rotateX(80deg) rotateY(20deg);
        &:nth-child(2) {
          transform: rotateX(80deg) rotateY(70deg);
        }
        &:nth-child(3) {
          transform: rotateX(80deg) rotateY(-20deg);
        }
        &:nth-child(4) {
          transform: rotateX(80deg) rotateY(-50deg);
        }

        .path {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;

          .electron {
            position: absolute;
            top: -0.75rem;
            left: 50%;
            margin-left: -0.5rem;
            width: 1rem;
            height: 1rem;
            border-radius: 1rem;
            background: #ccc;
          }
        }
      }

      .nucleus {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background: #272727;
      }
    }
  }
  .atomControl {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .slider-demo-block {
      width: 27rem;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .speed {
        white-space: nowrap;
        margin-left: 1rem;
        width: 19rem;
        padding-bottom: 3px;
      }
    }
    .slider-demo-block .el-slider {
      margin-top: 0;
      margin-left: 12px;
    }
  }
}
</style>
