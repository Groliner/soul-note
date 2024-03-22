<script setup>
import foot from '../footerView/index.vue'
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
const tl = gsap.timeline()
onMounted(() => {
  tl.fromTo('.footer', { opacity: 0 }, { opacity: 1, y: 0 })
  ScrollTrigger.create({
    animation: tl,
    trigger: '.mapper',
    start: 'bottom-=400px bottom',
    end: 'bottom bottom',
    scrub: 2.7
  })
})
</script>
<template>
  <div>
    <div class="mapper">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
      <foot class="footer" />
    </div>
    <div class="grolin">groLin</div>
  </div>
</template>
<style lang="scss" scoped>
.mapper {
  overflow: hidden;
  .footer {
    width: 100%;
    transform: translateY(100%);
  }
}

.grolin {
  position: fixed;
  animation: flows 20s infinite both cubic-bezier(0.36, 0.43, 0.2, 0.53);
  overflow: hidden;
  opacity: 0.7;
  user-select: none;
  top: 10%;
  left: 48%;
}
@keyframes flows {
  0% {
    top: 10%;
    left: 48%;
  }
  25% {
    top: 40%;
    left: 78%;
  }
  50% {
    top: 90%;
    left: 48%;
  }
  75% {
    top: 40%;
    left: 18%;
  }
  100% {
    top: 10%;
    left: 48%;
  }
}
</style>
