<!--
 * @Author: Gro lin
 * @Date: 2024-09-11 22:42:29
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-09-12 11:30:39
-->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
onMounted(() => {
  const faceButton = document.querySelector('.face-button')
  const faceContainer = document.querySelector('.face-container')
  const containerCoords = document.querySelector('#container')
  const mouseCoords = containerCoords.getBoundingClientRect()

  faceButton.addEventListener('mousemove', function (e) {
    const mouseX = e.pageX - containerCoords.offsetLeft
    const mouseY = e.pageY - containerCoords.offsetTop

    gsap.to(faceButton, {
      x: ((mouseX - mouseCoords.width / 2) / mouseCoords.width) * 50,
      y: ((mouseY - mouseCoords.height / 2) / mouseCoords.width) * 50,
      ease: 'Power4.easeOut',
      duration: 0.3
    })
  })

  faceButton.addEventListener('mousemove', function (e) {
    const mouseX = e.pageX - containerCoords.offsetLeft
    const mouseY = e.pageY - containerCoords.offsetTop

    gsap.to(faceContainer, {
      x: ((mouseX - mouseCoords.width / 2) / mouseCoords.width) * 25,
      y: ((mouseY - mouseCoords.height / 2) / mouseCoords.width) * 25,
      ease: 'Power4.easeOut',
      duration: 0.3
    })
  })

  faceButton.addEventListener('mouseenter', function (e) {
    gsap.to(faceButton, {
      scale: 0.975,
      duration: 0.3
    })
  })

  faceButton.addEventListener('mouseleave', function (e) {
    gsap.to(faceButton, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.3
    })

    gsap.to(faceContainer, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.3
    })
  })
})
</script>
<template>
  <div id="container">
    <button class="face-button">
      <span class="face-container">
        <span class="eye left"></span>
        <span class="eye right"></span>
        <span class="mouth"></span>
      </span>
    </button>
  </div>
</template>
<style lang="scss" scoped>
$black: #2a2927;
$white: #fff;
$bg: #fbf6e6;
$face: #fdda5f;
$face-shadow: #fd9744;
$main-width: 6.25rem;
$main-height: 6.25rem;

@mixin center {
  display: flex;
  align-items: center;
  justify-content: center;
}

* {
  box-sizing: border-box;
  &::before,
  &::after {
    box-sizing: border-box;
  }
}

body {
  @include center;
  margin: 0;
  min-height: 100vh;
  background: $bg;
}

#container {
  @include center;
  width: $main-width;
  height: $main-height;
}

button {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  &.face-button {
    width: $main-width;
    height: $main-height;
    border-radius: 50%;
    background: $face;
    box-shadow: inset 2px -4px 18px $face-shadow;
  }
}

.face-container {
  position: relative;
  display: block;
  width: 40px;
  height: 20px;
  margin: auto;
}

.eye {
  position: absolute;
  height: 0.5rem;
  width: 0.5rem;
  background: $black;
  border-radius: 50%;
  animation: eyeBlink 3200ms linear infinite;
  &.left {
    left: 0;
  }
  &.right {
    left: 2rem;
  }
}

.mouth {
  position: absolute;
  top: 1.125rem;
  left: 0.8rem;
  width: 1rem;
  height: 0.125rem;
  background: $black;
  border-radius: 0;
}

.eye,
.mouth {
  box-shadow: inset 1px 2px 4px #121110;
}

.face-button:hover .mouth,
.face-button:active .mouth {
  left: 1rem;
  width: 0.5rem;
  height: 0.4rem;
  border-radius: 1rem 1rem 0.125rem 0.125rem;
}

.face-button:hover .eye,
.face-button:active .eye {
  height: 0.375rem;
  width: 0.375rem;
  box-shadow: 0 0 0 0.25rem $white;
}

@keyframes eyeBlink {
  0%,
  30%,
  36%,
  100% {
    transform: scale(1);
  }
  32%,
  34% {
    transform: scale(1, 0);
  }
}
</style>
