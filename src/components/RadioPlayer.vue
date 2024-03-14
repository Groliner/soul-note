<script setup>
/*
播放按钮组件
提供播放暂停动画
*/
import { ref, onMounted } from 'vue'
import { PhPlay, PhPause } from '@phosphor-icons/vue'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
gsap.registerPlugin(Draggable)
/*  play button */
const isActive = ref(false)
onMounted(() => {
  Draggable.create('.circle', {
    type: 'x,y',
    bounds: 'html'
  })
})
</script>
<template>
  <div class="circle">
    <span
      class="circle__btn"
      @click.prevent="
        () => {
          isActive = !isActive
        }
      "
      :class="{ shadow: !isActive }"
    >
      <phPause
        class="pause"
        name="pause"
        weight="fill"
        :class="{ visibility: !isActive }"
      ></phPause>
      <phPlay
        class="play"
        name="play"
        weight="fill"
        :class="{ visibility: !isActive }"
      ></phPlay>
    </span>
    <span class="circle__back-1" :class="{ paused: !isActive }"></span>
    <span class="circle__back-2" :class="{ paused: !isActive }"></span>
  </div>
</template>
<style lang="scss" scoped>
/*  PLAY BUTTON  */
.circle {
  width: 9rem;
  height: 9rem;
  justify-self: center;
  border-radius: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  justify-items: center;
  align-items: center;

  &__btn {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    width: 6rem;
    height: 6rem;
    display: flex;
    margin: 0.6rem;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-size: 3.2rem;
    color: var(--primary);
    z-index: 300;
    background: var(--greyLight-1);
    box-shadow: $shadow;
    cursor: pointer;
    position: relative;
    &.shadow {
      box-shadow: $inner-shadow;
    }

    .play {
      position: absolute;
      opacity: 0;
      transition: all 0.2s linear;
      &.visibility {
        opacity: 1;
      }
    }
    .pause {
      position: absolute;
      transition: all 0.2s linear;
      &.visibility {
        opacity: 0;
      }
    }
  }

  &__back-1,
  &__back-2 {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    filter: blur(1px);
    z-index: 100;
  }

  &__back-1 {
    box-shadow:
      0.4rem 0.4rem 0.8rem var(--greyLight-2),
      -0.4rem -0.4rem 0.8rem var(--white);
    background: linear-gradient(
      to bottom right,
      var(--greyLight-2) 0%,
      var(--white) 100%
    );
    animation: waves 4s linear infinite;

    &.paused {
      animation-play-state: paused;
    }
  }

  &__back-2 {
    box-shadow:
      0.4rem 0.4rem 0.8rem var(--greyLight-2),
      -0.4rem -0.4rem 0.8rem var(--white);
    animation: waves 4s linear 2s infinite;

    &.paused {
      animation-play-state: paused;
    }
  }
}
@keyframes waves {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
