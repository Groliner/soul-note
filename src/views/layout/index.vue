<script setup>
import foot from './footerView/index.vue'
import leftNav from './navView/index.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
const tl = gsap.timeline()

const resizeObserver = new ResizeObserver((entries) => {
  // for (let entry of entries) {
  //   const { target } = entry
  //   console.log(target)
  //   // 这里可以根据目标元素的新尺寸来做一些事情
  //   // 比如更新ScrollTrigger的配置
  // }
  ScrollTrigger.refresh()
})
onMounted(() => {
  tl.to('.footer', {
    keyframes: {
      '0%': { opacity: 0 },
      '70%': { opacity: 0.34 },
      '100%': { opacity: 1, y: 0 }
    }
  })
  ScrollTrigger.create({
    animation: tl,
    trigger: '.mapper',
    start: 'bottom-=361px bottom',
    end: 'bottom bottom',
    scrub: 2.7
  })
  resizeObserver.observe(document.querySelector('.mapper'))
})
onUnmounted(() => {
  clearInterval(updateTime)
  resizeObserver.disconnect()
})
const time = ref({})
const updateTime = setInterval(() => {
  const t = new Date()
  time.value.month = (t.getMonth() + 1).toString().padStart(2, '0')
  time.value.day = t.getDate().toString().padStart(2, '0')
  time.value.hour = t.getHours().toString().padStart(2, '0')
  time.value.minute = t.getMinutes().toString().padStart(2, '0')
  time.value.second = t.getSeconds().toString().padStart(2, '0')
}, 3000)
</script>
<template>
  <div class="mapper">
    <section class="head-mask"></section>
    <section class="timer">
      <span class="timer__left"
        >{{ time.hour || '--' }}:{{
          time.minute || '--'
        }}&nbsp;&shortmid;&nbsp;</span
      >
      <span class="timer__right"
        >{{ time.month || '--' }}/{{ time.day || '--' }}</span
      >
    </section>
    <leftNav class="_nav" />
    <section class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </section>
    <foot class="footer" />
  </div>
</template>
<style lang="scss" scoped>
.mapper {
  overflow: hidden;
  border: 5px solid black;

  .head-mask {
    position: fixed;
    width: calc(100% - 10px);
    height: 70px;
    top: 0;
    border-top: 5px solid black;
    background-color: var(--greyLight-1);
    z-index: 100;
  }

  .timer {
    position: fixed;
    top: 40px;
    right: 50px;
    padding: 0.2rem 0.5rem;
    background-color: var(--greyLight-1);
    z-index: 100;
    &__left {
      font-size: 1.9rem;
    }
    &__right {
      font-size: 1.6rem;
    }
  }

  .main {
    width: 91%;
    margin: 0 auto;
    margin-top: 5.2%;
    min-height: 100vh;
    position: relative;
  }
  .footer {
    width: 100%;
    transform: translateY(100%);
  }
}
</style>
