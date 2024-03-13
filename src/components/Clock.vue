<script setup>
import { gsap } from 'gsap'
import {
  PhCheck,
  PhPlay,
  PhPause,
  PhUser,
  PhHouse,
  PhGear,
  PhMagnifyingGlass,
  PhX,
  PhPalette
} from '@phosphor-icons/vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { Draggable } from 'gsap/Draggable'
gsap.registerPlugin(Draggable)
const drg = ref({})
/*  clock */
const hours = ref(null)
const minutes = ref(null)
const seconds = ref(null)
const time = ref(null)

/*  play button */
const play = ref(null)
const pause = ref(null)
const playBtn = ref(null)
const wave1 = ref(null)
const wave2 = ref(null)

/*  rate slider */
const container = ref(null)
const btn = ref(null)
const color = ref(null)
const tooltip = ref(null)

//clock
const updateTime = setInterval(() => {
  time.value = new Date().toLocaleTimeString()
}, 1000)
const calibratePointer = () => {
  setInterval(clock, 60000)
}
const clock = () => {
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
  window.addEventListener('mouseup', mouseup)
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      clock()
    }
  }
  window.addEventListener('visibilitychange', handleVisibilityChange)
  onUnmounted(() => {
    window.removeEventListener('visibilitychange', handleVisibilityChange)
  })
  Draggable.create('.showtime', {
    type: 'x,y',
    bounds: 'html'
  })
  drg.value = Draggable.create('.search', {
    type: 'x,y',
    bounds: 'html',
    onDragEnd: function () {
      console.log('drag end')
      this.disable()
    }
  })[0]
  drg.value.disable()
})
onUnmounted(() => {
  window.removeEventListener('mouseup', mouseup)
  clearInterval(updateTime)
  clearInterval(calibratePointer)
})

//slider
const isDown = ref(false)
const mouseup = () => {
  isDown.value = false
  tooltip.value.style.opacity = 0
}
const onMouseMove = (e) => {
  if (!isDown.value) return
  let targetRect = container.value.getBoundingClientRect()
  let x = e.pageX - targetRect.left
  if (x > targetRect.width) {
    x = targetRect.width
  }
  if (x < 0) {
    x = 0
  }
  btn.value.x = x - 10
  btn.value.style.left = btn.value.x + 'px'

  // get the position of the button inside the container (%)
  let percentPosition = ((btn.value.x + 10) / targetRect.width) * 100

  // color width = position of button (%)
  color.value.style.width = percentPosition + '%'

  // move the tooltip when button moves, and show the tooltip
  tooltip.value.style.left = btn.value.x - 5 + 'px'
  tooltip.value.style.opacity = 1

  // show the percentage in the tooltip
  tooltip.value.textContent = Math.round(percentPosition) + '%'
}

/*  play button  */
const isActive = ref(false)
</script>
<template>
  <div class="container" @mousemove.prevent="onMouseMove">
    <div
      class="showtime"
      style="
        cursor: pointer;
        user-select: none;
        display: inline-block;
        position: absolute;
        left: 50%;
        top: 3%;
        transform: translate(-50%, 0);
      "
    >
      {{ time }}
    </div>
    <div class="components">
      <div class="switch">
        <div class="switch__1">
          <input id="switch-1" type="checkbox" />
          <label for="switch-1"></label>
        </div>

        <div class="switch__2">
          <input id="switch-2" type="checkbox" checked />
          <label for="switch-2"></label>
        </div>
      </div>

      <div class="checkbox">
        <div class="checkbox__1">
          <input id="checkbox-1" type="checkbox" />
          <label for="checkbox-1">
            <phCheck class="phCheck" weight="bold" />
          </label>
        </div>
        <div class="checkbox__2">
          <input id="checkbox-2" type="checkbox" checked />
          <label for="checkbox-2"
            ><phCheck class="phCheck" weight="bold"
          /></label>
        </div>
      </div>

      <div class="radio">
        <div class="radio__1">
          <input id="radio-1" type="radio" name="radio" value="1" />
          <label for="radio-1"></label>
        </div>

        <div class="radio__2">
          <input id="radio-2" type="radio" name="radio" value="2" checked />
          <label for="radio-2"></label>
        </div>
      </div>

      <div class="btn btn__primary"><p>Button</p></div>
      <div class="btn btn__secondary"><p>Button</p></div>

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

      <div class="chip">
        <div class="chip__icon">
          <ph-palette weight="bold" />
        </div>
        <p>Neumorphic Design</p>
        <div class="chip__close">
          <ph-x weight="bold" />
        </div>
      </div>

      <div class="circle">
        <span
          class="circle__btn"
          @click.prevent="
            () => {
              isActive = !isActive
            }
          "
          ref="playBtn"
          :class="{ shadow: !isActive }"
        >
          <phPause
            class="pause"
            name="pause"
            ref="pause"
            weight="fill"
            :class="{ visibility: !isActive }"
          ></phPause>
          <phPlay
            class="play"
            name="play"
            ref="play"
            weight="fill"
            :class="{ visibility: !isActive }"
          ></phPlay>
        </span>
        <span
          class="circle__back-1"
          ref="wave1"
          :class="{ paused: !isActive }"
        ></span>
        <span
          class="circle__back-2"
          ref="wave2"
          :class="{ paused: !isActive }"
        ></span>
      </div>

      <div class="form">
        <input type="text" class="form__input" placeholder="Type anything..." />
      </div>

      <div class="search">
        <input type="text" class="search__input" placeholder="Search..." />
        <div class="search__icon">
          <ph-magnifying-glass
            class="ph-magnifying-glass"
            weight="bold"
            @mouseenter="drg.enable()"
          />
        </div>
      </div>

      <div class="segmented-control">
        <input type="radio" name="radio2" value="3" id="tab-1" checked />
        <label for="tab-1" class="segmented-control__1"> <p>Tab 1</p></label>

        <input type="radio" name="radio2" value="4" id="tab-2" />
        <label for="tab-2" class="segmented-control__2"> <p>Tab 2</p></label>

        <input type="radio" name="radio2" value="5" id="tab-3" />
        <label for="tab-3" class="segmented-control__3"> <p>Tab 3</p></label>

        <div class="segmented-control__color"></div>
      </div>

      <div class="icon">
        <div class="icon__home">
          <phHouse weight="fill" />
        </div>
        <div class="icon__account">
          <phUser weight="fill" />
        </div>
        <div class="icon__settings">
          <phGear weight="fill" />
        </div>
      </div>

      <div class="slider">
        <div
          class="slider__box"
          ref="container"
          @mousedown="
            (e) => {
              isDown = true
              onMouseMove(e)
            }
          "
        >
          <span
            class="slider__btn"
            id="find"
            ref="btn"
            @mouseover="
              () => {
                tooltip.style.opacity = 1
              }
            "
            @mouseout="
              () => {
                tooltip.style.opacity = 0
              }
            "
          ></span>
          <span class="slider__color" ref="color"></span>
          <span class="slider__tooltip" ref="tooltip">50%</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  background: var(--greyLight-1);
}

.components {
  width: 75rem;
  height: 40rem;
  border-radius: 3rem;
  box-shadow:
    0.8rem 0.8rem 1.4rem var(--greyLight-2),
    -0.2rem -0.2rem 1.8rem var(--white);
  padding: 4rem;
  display: grid;
  grid-template-columns: 17.6rem 19rem 20.4rem;
  grid-template-rows: repeat(autofit, min-content);
  grid-column-gap: 5rem;
  grid-row-gap: 2.5rem;
  align-items: center;
}

/*  SWITCH  */
.switch {
  grid-column: 1 / 2;
  display: grid;
  grid-template-columns: repeat(2, min-content);
  grid-gap: 3rem;
  justify-self: center;
  input {
    display: none;
  }

  &__1,
  &__2 {
    width: 6rem;
    label {
      display: flex;
      align-items: center;
      width: 100%;
      height: 3rem;
      box-shadow: $shadow;
      background: rgba(255, 255, 255, 0);
      position: relative;
      cursor: pointer;
      border-radius: 1.6rem;

      &::after {
        content: '';
        position: absolute;
        left: 0.4rem;
        width: 2.1rem;
        height: 2.1rem;
        border-radius: 50%;
        background: var(--greyDark);
        transition: all 0.4s ease;
      }
      &::before {
        content: '';
        width: 100%;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(
          330deg,
          var(--primary-dark) 0%,
          var(--primary) 50%,
          var(--primary-light) 100%
        );
        opacity: 0;
        transition: all 0.4s ease;
      }
    }
  }
  & input:checked {
    & ~ label {
      &::before {
        opacity: 1;
      }
      &::after {
        left: 57%;
        background: var(--greyLight-1);
      }
    }
  }
}

/*  CHECKBOX  */
.checkbox {
  grid-column: 1 / 2;
  display: grid;
  grid-template-columns: repeat(2, 6rem);
  grid-gap: 3rem;
  justify-content: center;
  input {
    display: none;
  }

  &__1,
  &__2 {
    width: 6rem;
    display: flex;
    justify-content: center;
    label {
      box-shadow: $shadow;
      cursor: pointer;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.5rem;
      width: 2.8rem;
      height: 2.8rem;

      &:hover .phCheck {
        color: var(--primary);
      }

      .phCheck {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--greyDark);
        transition: 0.3s ease;
      }
    }

    & input:checked {
      & ~ label {
        box-shadow: $inner-shadow;
        .phCheck {
          color: var(--primary);
        }
      }
    }
  }
}

/*  RADIO  */
.radio {
  grid-column: 1 / 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-items: center;
  input {
    display: none;
  }

  &__1,
  &__2 {
    & input:checked {
      & ~ label {
        box-shadow: $inner-shadow;
        &::after {
          background: var(--primary);
        }
      }
    }
    label {
      box-shadow: $shadow;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      width: 2.8rem;
      height: 2.8rem;
      border-radius: 50%;
      &:hover {
        &::after {
          background: var(--primary);
        }
      }

      &::after {
        content: '';
        position: absolute;
        width: 1.4rem;
        height: 1.4rem;
        background: var(--greyDark);
        border-radius: 50%;
        transition: 0.3s ease;
      }
    }
  }
}

/*  BUTTONS  */
.btn {
  width: 15rem;
  height: 4rem;
  border-radius: 1rem;
  box-shadow: $shadow;
  justify-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s ease;

  &__primary {
    grid-column: 1 / 2;
    grid-row: 4 / 5;
    background: var(--primary);
    box-shadow:
      inset 0.2rem 0.2rem 1rem var(--primary-light),
      inset -0.2rem -0.2rem 1rem var(--primary-dark),
      $shadow;
    color: var(--greyLight-1);

    &:hover {
      color: var(--white);
    }
    &:active {
      box-shadow:
        inset 0.2rem 0.2rem 1rem var(--primary-dark),
        inset -0.2rem -0.2rem 1rem var(--primary-light);
    }
  }

  &__secondary {
    grid-column: 1 / 2;
    grid-row: 5 / 6;
    color: var(--greyDark);
    &:hover {
      color: var(--primary);
    }
    &:active {
      box-shadow: $inner-shadow;
    }
  }

  p {
    font-size: 1.6rem;
  }
}

/*  CLOCK  */
.clock {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
  width: 12rem;
  height: 12rem;
  justify-self: center;
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

/*  CHIP  */
.chip {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
  justify-self: center;
  width: 17rem;
  height: 4rem;
  border-radius: 1rem;
  box-shadow: $shadow;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__icon {
    width: 3rem;
    height: 3rem;
    border-radius: 1rem;
    margin: 0 0 0 0.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    color: var(--primary);
  }

  p {
    font-size: 0.9rem;
    margin-left: -1.8rem;
    color: var(--greyDark);
  }

  &__close {
    width: 1.6rem;
    height: 1.6rem;
    margin: 0 0.5rem;
    display: flex;
    font-size: 1.6rem;
    color: var(--greyLight-3);
    cursor: pointer;
  }
}

/*  PLAY BUTTON  */
.circle {
  grid-column: 2 / 3;
  grid-row: 4 / 6;
  width: 9rem;
  height: 100%;
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

/*  FORM  */
.form {
  grid-column: 3 / 4;
  grid-row: 3 / 4;

  &__input {
    width: 20.4rem;
    height: 4rem;
    border: none;
    border-radius: 1rem;
    font-size: 1.4rem;
    padding-left: 1.4rem;
    box-shadow: $inner-shadow;
    background: none;
    font-family: inherit;
    color: var(--greyDark);

    &::placeholder {
      color: var(--greyLight-3);
    }
    &:focus {
      outline: none;
      box-shadow: $shadow;
    }
  }
}

/*  SEARCH  */
.search {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
  position: relative;
  display: flex;
  align-items: center;

  &__input {
    width: 20.4rem;
    height: 4rem;
    border: none;
    border-radius: 1rem;
    font-size: 1.4rem;
    padding-left: 3.8rem;
    box-shadow: $inner-shadow;
    background: none;
    font-family: inherit;
    color: var(--greyDark);

    &::placeholder {
      color: var(--greyLight-3);
    }
    &:focus {
      outline: none;
      box-shadow: $shadow;

      + .search__icon {
        color: var(--primary);
      }
    }
  }

  &__icon {
    height: 2rem;
    position: absolute;
    font-size: 2rem;
    padding: 0 1rem;
    display: flex;
    color: var(--greyDark);
    transition: 0.3s ease;
  }
}

/*  SEGMENTED-CONTROL */
.segmented-control {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
  width: 20.4rem;
  height: 4rem;
  box-shadow: $shadow;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  position: relative;

  input {
    display: none;
  }

  > input:checked + label {
    transition: all 0.5s ease;
    color: var(--primary);
  }

  &__1,
  &__2,
  &__3 {
    width: 6.8rem;
    height: 3.6rem;
    font-size: 1.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: var(--greyDark);
    transition: all 0.5s ease;

    &:hover {
      color: var(--primary);
    }
  }

  &__color {
    position: absolute;
    height: 3.4rem;
    width: 6.2rem;
    margin-left: 0.3rem;
    border-radius: 0.8rem;
    box-shadow: $inner-shadow;
    pointer-events: none;
  }
}

#tab-1:checked ~ .segmented-control__color {
  transform: translateX(0);
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
#tab-2:checked ~ .segmented-control__color {
  transform: translateX(6.8rem);
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
#tab-3:checked ~ .segmented-control__color {
  transform: translateX(13.6rem);
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/*  ICONS  */
.icon {
  grid-column: 3 / 4;
  grid-row: 4 / 5;
  display: flex;
  justify-content: space-between;
  &__account,
  &__home,
  &__settings {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    box-shadow: $shadow;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    cursor: pointer;
    color: var(--greyDark);
    transition: all 0.5s ease;

    &:active {
      box-shadow: $inner-shadow;
      color: var(--primary);
    }
    &:hover {
      color: var(--primary);
    }
  }
}

/*  RANGE-SLIDER  */
.slider {
  grid-column: 3 / 4;
  grid-row: 5 / 6;
  align-self: center;
  display: flex;
  flex-direction: column;

  &__box {
    width: 100%;
    height: 1rem;
    cursor: pointer;
    box-shadow: $inner-shadow;
    border-radius: 1rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__btn {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--white);
    position: absolute;
    box-shadow: 0px 0.1rem 0.3rem 0px var(--greyLight-3);
    z-index: 200;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover ~ .slider__tooltip {
      opacity: 1;
    }
    &::after {
      content: '';
      position: absolute;
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      box-shadow: $inner-shadow;
    }
  }

  &__color {
    height: 100%;
    width: 50%;
    position: absolute;
    left: 0;
    z-index: 100;
    border-radius: inherit;
    background: var(--primary);
    background: linear-gradient(
      -1deg,
      var(--primary-dark) 0%,
      var(--primary) 50%,
      var(--primary-light) 100%
    );
  }

  &__tooltip {
    position: absolute;
    top: 2.6rem;
    height: 2.5rem;
    width: 3rem;
    border-radius: 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    color: var(--primary);
    box-shadow: $shadow;
    opacity: 0;
    transition: opacity 0.6s ease;
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
