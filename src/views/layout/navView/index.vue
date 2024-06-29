<script setup>
import { gsap } from 'gsap'
import { useUserStore } from '@/stores'
import { ref, watch, onMounted } from 'vue'
const show = ref(false)
gsap.defaults({ duration: 0.5 })
// ===== Open Nav =====
watch(show, (newVal, oldVal) => {
  if (newVal) {
    gsap.to('.dim', {
      opacity: 1,
      display: 'block',
      ease: 'Power2.easeInOut'
    })
    gsap.fromTo(
      '.nav',
      { xPercent: -100 },
      { xPercent: 0, display: 'block', ease: 'Expo.easeOut' }
    )
    gsap.from('.nav li', {
      opacity: 0,
      y: 20,
      ease: 'Power2.easeInOut',
      stagger: 0.1
    })
    logoText.value.style.opacity = '0'
    logoText.value.style.display = 'none'
  } else {
    gsap.to('.dim', {
      opacity: 0,
      display: 'none',
      ease: 'Power2.easeInOut'
    })
    gsap.to('.nav', {
      xPercent: -100,
      display: 'none',
      ease: 'Expo.easeOut'
    })
    logoText.value.style.opacity = '1'
    logoText.value.style.display = 'block'
  }
})
const burgerWrapper = ref(null)
const logoText = ref(null)

onMounted(() => {
  const elements = [burgerWrapper.value, logoText.value]
  elements.push(...document.querySelectorAll('.nav_link'))
  elements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      gsap.fromTo(el, { opacity: 0.5, ease: 'power2.inOut' }, { opacity: 1 })
    })

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { opacity: 1 })
    })
  })
})

import { ElMessage } from 'element-plus'
import { messageManager } from '@/directives/index'
import router from '@/router'
// 检查是否登录
const userStore = useUserStore()
const logout = () => {
  if (userStore.userInfo.token) {
    userStore.logout()
    router.push('/home')
  } else {
    ElMessage.error('You are not logged in')
  }
}
const handleLogout = () => {
  messageManager.showConfirmModal('Are you sure to logout ?').then((res) => {
    if (res) logout()
  })
}
</script>
<template>
  <section class="wrapper">
    <div class="header">
      <div class="burger-wrapper" ref="burgerWrapper" @click="show = !show">
        <div class="burger"></div>
      </div>
      <div class="logo-text" ref="logoText">Soul Note</div>
    </div>
    <div class="nav">
      <ul class="nav_main">
        <li>
          <RouterLink class="nav_link" active-class="active" to="/home">
            Home
          </RouterLink>
        </li>
        <li>
          <RouterLink class="nav_link" active-class="active" to="/diary">
            Diary
          </RouterLink>
        </li>
        <li>
          <RouterLink class="nav_link" active-class="active" to="/library">
            Library
          </RouterLink>
        </li>
        <li>
          <RouterLink class="nav_link" active-class="active" to="/topic">
            Topics
          </RouterLink>
        </li>
        <li>
          <RouterLink class="nav_link" active-class="active" to="/chats">
            Chats
          </RouterLink>
        </li>
      </ul>
      <div class="nav_divider"></div>
      <ul class="nav_sub" v-if="userStore.userInfo.token">
        <li>
          <RouterLink class="nav_link" active-class="active" to="/account">
            Account
          </RouterLink>
        </li>
        <li>
          <a class="nav_link" @click="handleLogout"> Log out </a>
        </li>
      </ul>
      <ul class="nav_sub" v-else>
        <li>
          <RouterLink class="nav_link" to="/login"> Log in </RouterLink>
        </li>
      </ul>
    </div>
    <div class="dim" @click="show = false"></div>
  </section>
</template>
<style lang="scss" scoped>
//  ===== Global Values =====
$color-bg: #f2d7d3;
$color-light: #fff9e1;
$color-black: #252120;
$color-gray: rgb(68, 68, 68);

ul,
li {
  list-style: none;
  padding: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

// ===== Header =====
.header {
  position: fixed;
  left: 2.2vw;
  top: 2.2vw;
  margin-left: -4px;
  margin-top: -1.3rem;
  color: $color-black;
  z-index: 303;
  display: flex;
  cursor: pointer;
  align-items: center;
  height: 3rem;

  @media screen and (max-width: 800px) {
    left: 4.2vw;
    top: 4.2vw;
  }

  .burger-wrapper {
    width: 2rem;
    height: 3rem;
    margin-right: 20px;
    display: flex;
    align-items: center;
  }

  .burger {
    width: 1.5rem;
    height: 0.21rem;
    background-color: $color-black;
    position: relative;

    &:before,
    &:after {
      content: '';
      width: 1.5rem;
      height: 0.21rem;
      background-color: $color-black;
      position: absolute;
      left: 0;
    }

    &:before {
      top: -0.42rem;
    }

    &:after {
      top: 0.42rem;
      width: 1.1rem;
    }
  }

  .logo-text {
    font-size: 1.5rem;
    color: $color-black;
  }
}

// ===== Navigation =====
.nav {
  will-change: transform;
  position: fixed;
  background-color: rgb(255 255 255 / 84%);
  width: 23vw;
  min-width: 30rem;
  height: 100vh;
  z-index: 302;
  box-shadow: 0 30px 80px 0 rgba(97, 45, 45, 0.25);
  display: none;

  ul {
    color: $color-gray;

    &.nav_main {
      margin-top: 20vh;
      a {
        font-size: 1.97rem;
      }
    }

    &.nav_sub {
      margin-top: 3vh;

      a {
        font-size: 1.67rem;
      }
    }

    li {
      margin-left: 3vw;
      margin-bottom: 0.5vw;
      position: relative;
    }
  }
}

.nav_link {
  cursor: pointer;

  &:before {
    content: '';
    position: absolute;
    width: 4vw;
    height: 2px;
    background-color: $color-gray;
    left: -10vw;
    top: 50%;
    transition: 0.4s;
  }
}

.nav_divider {
  width: 3vw;
  height: 1px;
  background-color: rgba(37, 33, 32, 0.12);
  margin: 4vh 3vw;
}

.nav li .nav_link:hover:before {
  left: -5.8vw;
}
.nav li .nav_link.active:before {
  left: -5vw;
}

.dim {
  will-change: opacity;
  width: 100vw;
  height: 100vh;
  background-color: rgba(37, 33, 32, 0.2);
  position: fixed;
  background-color: rgba(224, 221, 209, 0.701961);
  display: none;
  z-index: 301;
  opacity: 0;
}
</style>
