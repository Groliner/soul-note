<script setup>
import foot from './footerView/index.vue'
import leftNav from './navView/index.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
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
  // 设置footer的动画
  tl.to('.footer', {
    keyframes: {
      '0%': { opacity: 0 },
      '70%': { opacity: 0.34 },
      '100%': { opacity: 0.91, y: 0 }
    }
  })
  ScrollTrigger.create({
    animation: tl,
    trigger: '.mapper',
    start: 'bottom-=361px bottom',
    end: 'bottom bottom',
    scrub: 2.7
  })
  resizeObserver.observe(document.querySelector('.mapper')) // 当页面大小变化时，更新ScrollTrigger的配置
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
}, 10000)

//背景图片,需要修改其他配件的透明度,否则会有不协调感.
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const { userPreferences } = storeToRefs(userStore)
const backgroundImg = computed(() => userPreferences.value.background)

import testBackground from '@/assets/images/background.png'
const isTest = computed(() => window.location.hostname === 'localhost')
</script>
<template>
  <div class="mapper">
    <img class="background-img" :src="testBackground" v-if="isTest" />
    <img class="background-img" :src="backgroundImg" v-else />

    <!-- head-mask 暂定透明 -->
    <section class="head-mask"></section>
    <section class="timer">
      <span class="timer__left"
        >{{ time.hour || '--' }}:{{ time.minute || '--' }}&nbsp;&shortmid;&nbsp;</span
      >
      <span class="timer__right">{{ time.month || '--' }}/{{ time.day || '--' }}</span>
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
  .background-img {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.21;
    z-index: -1;
  }

  .head-mask {
    position: fixed;
    width: calc(100% - 10px);
    height: 3em;
    top: 0;
    border-top: 5px solid black;
    background-color: transparent;
    z-index: 100;
  }

  .timer {
    position: fixed;
    top: 2rem;
    right: 2.6rem;
    padding: 0.2rem 0.5rem;
    background-color: transparent;
    z-index: 100;
    &__left {
      font-size: 1.8rem;
    }
    &__right {
      font-size: 1.5rem;
    }
  }

  .main {
    width: 100vw;
    margin-top: 5rem;
    min-height: 100vh;
    position: relative;
  }
  .footer {
    width: 100%;
    transform: translateY(100%);
  }
}
</style>
