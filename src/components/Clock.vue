<script setup>
/*
时钟组件
提供时钟动画
showtime : 是否显示时间 (props)
*/
import { gsap } from 'gsap'
import { ref, onMounted, onUnmounted } from 'vue'
import { Draggable } from 'gsap/Draggable'
gsap.registerPlugin(Draggable)
/*  clock */
const hours = ref(null)
const minutes = ref(null)
const seconds = ref(null)
const time = ref(null)

//clock
const updateTime = setInterval(() => {
  time.value = new Date().toLocaleTimeString()
}, 1000)

const clock = () => {
  //   console.log('时钟矫正')
  gsap.killTweensOf([seconds.value, minutes.value, hours.value], 'rotation')
  const nows = new Date()
  const s = nows.getSeconds()
  const m = nows.getMinutes() + s / 60
  const h = (nows.getHours() % 12) + m / 60
  setPointer(seconds.value, s * 6, 60)
  setPointer(minutes.value, m * 6, 3600)
  setPointer(hours.value, h * 30, 43200)
}
const setPointer = (pointer, deg, round) => {
  gsap.set(pointer, { rotation: deg })
  gsap.to(pointer, {
    rotation: deg + 360,
    duration: round,
    repeat: -1,
    ease: 'none'
  })
}

onMounted(() => {
  clock()
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      clock()
    }
  }
  const calibratePointer = setInterval(clock, 60000)
  window.addEventListener('visibilitychange', handleVisibilityChange)
  onUnmounted(() => {
    window.removeEventListener('visibilitychange', handleVisibilityChange)
    clearInterval(calibratePointer)
    clearInterval(updateTime)
  })
  Draggable.create(['.showtime', '.clock'], {
    type: 'x,y',
    bounds: 'html'
  })
})
const props = defineProps({
  showtime: {
    type: Boolean,
    default: true
  }
})
</script>
<template>
  <div class="showtime" v-show="props.showtime">
    {{ time }}
  </div>
  <div class="clock">
    <div class="hand hours" ref="hours"></div>
    <div class="hand minutes" ref="minutes"></div>
    <div class="hand seconds" ref="seconds"></div>
    <div class="point"></div>
    <div class="marker">
      <span
        v-for="i in 4"
        :class="`marker__${i}`"
        :key="i"
        :style="`transform: rotateZ(${90 * (i - 1)}deg)`"
      ></span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
/* showtime */
.showtime {
  cursor: pointer;
  user-select: none;
  display: inline-block;
  position: absolute;
  left: 50%;
  top: 3%;
  transform: translate(-50%, 0);
  width: auto;
  height: 2rem;
}
/*  CLOCK  */
.clock {
  width: 12rem;
  height: 12rem;
  box-shadow: $shadow;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .hand {
    position: absolute;
    transform-origin: bottom;
    bottom: 6rem;
    border-radius: 0.2rem;
    z-index: 200;
  }

  .hours {
    width: 0.4rem;
    height: 3.2rem;
    background: var(--greyLight-3);
  }

  .minutes {
    width: 0.4rem;
    height: 4.6rem;
    background: var(--greyDark);
  }
  .seconds {
    width: 0.2rem;
    height: 5.2rem;
    background: var(--primary);
  }
  .point {
    position: absolute;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: var(--primary);
    z-index: 300;
  }

  .marker {
    width: 95%;
    height: 95%;
    border-radius: 50%;
    position: relative;
    box-shadow: $inner-shadow;

    &::after {
      content: '';
      width: 60%;
      height: 60%;
      position: absolute;
      box-shadow:
        inset 1px 1px 1px var(--greyLight-2),
        inset -1px -1px 1px var(--white);
      border-radius: 50%;
      top: 20%;
      left: 20%;
      filter: blur(1px);
    }

    [class^='marker__'] {
      position: absolute;
      border-radius: 0.1rem;
      box-shadow:
        inset 1px 1px 1px var(--greyLight-2),
        inset -1px -1px 1px var(--white);
      width: 0.2rem;
      height: 0.6rem;
      left: 5.6rem;
      top: 2%;
      transform-origin: center 5.472rem;
    }
  }
}
</style>
