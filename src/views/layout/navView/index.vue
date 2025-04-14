<script setup>
import { gsap } from 'gsap'
import { useUserStore, useConstantStore } from '@/stores'
import { ref, watch, onMounted, useTemplateRef } from 'vue'
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
    gsap.fromTo('.nav', { xPercent: -100 }, { xPercent: 0, display: 'block', ease: 'Expo.easeOut' })
    gsap.fromTo(
      '.nav li',
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        ease: 'Power2.easeInOut',
        stagger: 0.1
      }
    )
    logoTextRef.value.style.opacity = '0'
    logoTextRef.value.style.display = 'none'
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
    // gsap.to('.nav li', {
    //   opacity: 0,
    //   y: 20
    // })
    logoTextRef.value.style.opacity = '1'
    logoTextRef.value.style.display = 'block'
  }
})
const burgerWrapperRef = useTemplateRef('burgerWrapper')
const logoTextRef = useTemplateRef('logoText')

onMounted(() => {
  const elements = [burgerWrapperRef.value, logoTextRef.value]
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
import { storeToRefs } from 'pinia'

// 检查是否登录
const userStore = useUserStore()
const { userPreferences } = storeToRefs(userStore)
const constantStore = useConstantStore()
const { accountConstant } = storeToRefs(constantStore)
const logout = () => {
  // console.log(userStore.isAuthenticated)
  if (userStore.isAuthenticated) {
    userStore.logout()
  } else {
    ElMessage.error(accountConstant.value[NO_AUTH])
  }
}
const handleLogout = () => {
  messageManager.showConfirmModal(accountConstant.value['LOGOUT']).then((res) => {
    if (res) logout()
  })
}

console.log()
</script>
<template>
  <section class="wrapper">
    <div class="header" @click="show = !show">
      <div class="burger-wrapper" ref="burgerWrapper">
        <div class="burger"></div>
      </div>
      <div class="logo-text" ref="logoText">Soul Note</div>
    </div>
    <div class="nav">
      <ul class="nav_main">
        <li>
          <RouterLink class="nav_link" active-class="active" to="/home">
            {{ userStore.selectLanguage === 'en-US' ? 'Home' : '主页' }}
          </RouterLink>
        </li>
        <li>
          <RouterLink class="nav_link" active-class="active" to="/diary">
            {{ userStore.selectLanguage === 'en-US' ? 'Diary' : '日记' }}
          </RouterLink>
        </li>
        <li>
          <RouterLink class="nav_link" active-class="active" to="/library">
            {{ userStore.selectLanguage === 'en-US' ? 'Library' : '图书馆' }}
          </RouterLink>
        </li>
        <li>
          <RouterLink class="nav_link" active-class="active" to="/topic">
            {{ userStore.selectLanguage === 'en-US' ? 'Topic' : '话题' }}
          </RouterLink>
        </li>
        <li>
          <RouterLink class="nav_link" active-class="active" to="/chats">
            {{ userStore.selectLanguage === 'en-US' ? 'Chats' : '聊天' }}
          </RouterLink>
        </li>
      </ul>
      <div class="nav_divider"></div>
      <ul class="nav_sub" v-if="userStore.isAuthenticated === true">
        <li>
          <RouterLink class="nav_link" active-class="active" to="/account">
            {{ userStore.selectLanguage === 'en-US' ? 'Account' : '账户' }}
          </RouterLink>
        </li>
        <li>
          <a class="nav_link" @click="handleLogout">
            {{ userStore.selectLanguage === 'en-US' ? 'log out' : '登出' }}
          </a>
        </li>
      </ul>
      <ul class="nav_sub" v-else>
        <li>
          <RouterLink class="nav_link" to="/login">
            {{ userStore.selectLanguage === 'en-US' ? 'Login' : '登录' }}
          </RouterLink>
        </li>
      </ul>
      <div
        class="container-radio"
        :style="`grid-template-columns: repeat(${userPreferences.languageList.length}, min-content)`"
      >
        <!-- 语言选择,此处为测试,预计放到用户的个性化设置中 -->
        <div
          :class="`radio radio__${index}`"
          v-for="(content, index) in userPreferences.languageList"
          :key="index"
        >
          <input
            :id="`radio-${index}`"
            type="radio"
            name="radio"
            :value="index"
            v-model="userPreferences.language"
          />
          <label :for="`radio-${index}`">{{ content }}</label>
        </div>
      </div>
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
      opacity: 1;
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
  position: fixed;
  background-color: rgba(224, 221, 209, 0.701961);
  display: none;
  z-index: 301;
  opacity: 0;
}

.container-radio {
  width: fit-content;
  position: absolute;
  top: 1rem;
  right: 1rem;

  display: grid;
  justify-items: center;
  gap: 1rem;
  input {
    display: none;
  }

  .radio {
    & input:checked {
      & ~ label {
        box-shadow: $inner-shadow;
        color: var(--primary);
      }
    }
    label {
      transition: color 0.2s ease;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      user-select: none;
      width: 3rem;
      height: 2.8rem;
      border-radius: 50%;
      font-size: 1rem;
      &:hover {
        color: var(--primary);
      }

      // &::after {
      //   content: '';
      //   position: absolute;
      //   width: 1.4rem;
      //   height: 1.4rem;
      //   background: var(--greyDark);
      //   border-radius: 50%;
      //   transition: 0.3s ease;
      // }
    }
  }
}
</style>
