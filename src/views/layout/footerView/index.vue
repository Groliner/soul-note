<script setup>
import { onMounted, ref } from 'vue'
import logo from './logo.vue'
const isAvailableToShow = ref(true)
onMounted(() => {
  if (window.innerWidth < 620) {
    isAvailableToShow.value = false
  }
})

import { useUserStore } from '@/stores'
const userStore = useUserStore()
</script>
<template>
  <footer style="opacity: 0.92">
    <div class="wave-container">
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
        </g>
      </svg>
    </div>
    <div class="foot-container">
      <logo class="logo" v-if="isAvailableToShow" />
      <div class="foot">
        <h1>
          Soul-Note<small style="color: #545454">.<sub>all</sub></small>
        </h1>
        <h2>
          {{
            userStore.selectLanguage === 'en-US'
              ? 'Always searching and experiencing every story'
              : '寻 找 和 体 验 每 一 个 故 事'
          }}
        </h2>
        <br />
        <div>
          <small style="font-size: 0.83rem"
            >&copy; 2024-, <a href="https://github.com/Groliner/soul-note.git">soul-note</a>,
            {{ userStore.selectLanguage === 'en-US' ? 'the source of everything.' : '网页源码' }}
          </small>
        </div>
      </div>
    </div>
  </footer>
</template>
<style lang="scss" scoped>
.wave-container {
  .waves {
    position: relative;
    width: 100%;
    height: 12vh;
    margin-bottom: -1rem; /*Fix for safari gap*/
    min-height: 7rem;
    max-height: 13rem;
  }

  /* Animation */

  .parallax > use {
    animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
  }
  .parallax > use:nth-child(1) {
    fill: var(--c-yellow-100);
    animation-delay: -2s;
    animation-duration: 7s;
  }
  .parallax > use:nth-child(2) {
    fill: var(--c-yellow-100);
    animation-delay: -3s;
    animation-duration: 10s;
  }
  .parallax > use:nth-child(3) {
    fill: var(--c-yellow-200);
    animation-delay: -4s;
    animation-duration: 13s;
  }
  .parallax > use:nth-child(4) {
    fill: var(--c-yellow-300);
    animation-delay: -5s;
    animation-duration: 20s;
  }
  @keyframes move-forever {
    0% {
      transform: translate3d(-90px, 0, 0);
    }
    100% {
      transform: translate3d(85px, 0, 0);
    }
  }
  /*Shrinking for mobile*/
  @media (max-width: 768px) {
    .waves {
      height: 40px;
      min-height: 40px;
    }
    .content {
      height: 30vh;
    }
    h1 {
      font-size: 20px;
    }
  }
}
.foot-container {
  background-color: var(--c-yellow-300);
  position: relative;
  .logo {
    width: 22%;
    height: 90%;
    position: absolute;
    bottom: 0;
    left: 3%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 1rem;
  }
  .foot {
    text-align: center;
    h1 {
      font-size: 2.88rem;
      text-align: center;
      font-weight: 300;
      padding: 0.5em;
      margin: 0;
    }

    h2 {
      font-size: 1.31rem;
      text-align: center;
      font-weight: 300;
      margin: 0;
    }

    a {
      color: #aaaaaa;
      text-decoration: none;
    }

    a:hover {
      color: rgb(148, 8, 212);
    }
  }
}
</style>
