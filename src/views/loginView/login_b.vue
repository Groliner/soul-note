<script setup>
/*
登录页面
独特的UI设计
signUP 注册设置数组(props)
logIn 登录设置数组(props)
*/
import { toRef, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  PhArrowCircleRight,
  PhArrowCircleLeft,
  PhCheckFat,
  PhArrowsClockwise
} from '@phosphor-icons/vue'
import { gsap } from 'gsap'
const router = useRouter()
const props = defineProps({
  sigUp: {
    type: Array,
    default: () => [
      {
        id: 'email',
        type: 'email',
        placeholder: 'Your email address',
        spellcheck: 'false',
        autocomplete: 'off',
        regex: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
      },
      {
        id: 'username',
        type: 'text',
        placeholder: 'Your username',
        spellcheck: 'false',
        autocomplete: 'off',
        regex: '^[a-zA-Z0-9._-]{3,}$'
      },
      {
        id: 'password',
        type: 'password',
        placeholder: 'Password (More than 5 characters)',
        autocomplete: 'off',
        regex: '^\\S{6,}$'
      }
    ]
  },
  logIn: {
    type: Array,
    default: () => [
      {
        id: 'username',
        type: 'text',
        placeholder: 'Your username',
        spellcheck: 'false',
        autocomplete: 'off',
        regex: '^[a-zA-Z0-9._-]{3,}$'
      },
      {
        id: 'password',
        type: 'password',
        placeholder: 'Password ',
        autocomplete: 'off',
        regex: '^\\S{6,}$'
      }
    ]
  }
})

const inputArray = ref(props.logIn)
const totalSteps = computed(() => inputArray.value.length)
let refArray = []
const setRefArray = (el, index) => {
  console.log('重组')
  if (el) {
    refArray[index] = toRef(el)
  }
}
watch(totalSteps, () => {
  refArray = refArray.filter((item) =>
    inputArray.value.some((item2) => item2.id === item.value.name)
  )
  refArray.forEach((inner) => {
    if (responseData.value?.data) {
      inner.value.value = responseData.value.data[inner.value.name]
      nextStep.value = true
    } else {
      inner.value.value = ''
    }
  })
})
const finishedStep = ref(0)
const stepNumber = ref(1)
const progress = ref(null)
const isFinished = ref(false)
const nextStep = ref(false)
const isHover = ref(false)
const handleHover = (el) => {
  if (isHover.value) return
  if (el.target.classList.contains('up')) inputArray.value = props.sigUp
  if (el.target.classList.contains('down')) inputArray.value = props.logIn
  isHover.value = true
  if (finishedStep.value < totalSteps.value)
    setTimeout(function () {
      refArray[stepNumber.value - 1].value.focus()
    }, 600)
}
const handleOut = () => {
  isHover.value =
    stepNumber.value > 1 || refArray[0].value.value.trim().length > 0
  if (responseData.value?.data) {
    responseData.value.data = undefined
  }
}
const checkInput = (el) => {
  inputArray.value.forEach((inner, index) => {
    if (inner.id === el.value.name && index + 1 === stepNumber.value) {
      if (el.value.value.match(inner.regex)) {
        nextStep.value = true
        finishedStep.value = index + 1
      } else {
        finishedStep.value = index
        nextStep.value = false
      }
      return nextStep.value
    }
  })
}
const moveToNextStep = () => {
  if (isFinished.value) return console.log('Account Created')
  stepNumber.value =
    finishedStep.value >= stepNumber.value
      ? stepNumber.value + 1
      : finishedStep.value + 1
  progress.value.style.width = `${((stepNumber.value - 1) / totalSteps.value) * 100}%`
  if (
    finishedStep.value < totalSteps.value ||
    stepNumber.value <= totalSteps.value
  )
    return checkInput(refArray[stepNumber.value - 1])
  isFinished.value = true
  setTimeout(handleFinished, 500)
}
const moveToPreviousStep = () => {
  if (stepNumber.value > 1) stepNumber.value--
  progress.value.style.width = `${((stepNumber.value - 1) / totalSteps.value) * 100}%`
  nextStep.value = true
}

const load = ref(true)
const responseData = ref({})
const emit = defineEmits(['login', 'signup'])
const reset = () => {
  isHover.value = false
  load.value = true
  progress.value.parentElement.classList.remove('hide-form')
  stepNumber.value = 1
  inputArray.value = props.logIn
  progress.value.style.width = `${((stepNumber.value - 1) / totalSteps.value) * 100}%`
  isFinished.value = false
  nextStep.value = false
  checkInput(refArray[stepNumber.value - 1])
}
const handleFinished = async () => {
  load.value = true
  progress.value.parentElement.classList.add('hide-form')
  const { tl, tween } = handleAnimation()
  if (totalSteps.value > 2) await handleSignUp(tl, tween)
  else await handleLogIn(tl, tween)
}
const handleSignUp = async (tl, tweenFinish) => {
  const data = {
    email: refArray[0].value.value,
    username: refArray[1].value.value,
    password: refArray[2].value.value
  }
  //发送数据等待返回
  const res = await emit('signup', data)
  console.log('handleSignUp', res)
  if (true) {
    responseData.value.data = data
    setTimeout(() => {
      tweenFinish.play()
      gsap.to(
        '#acc-success',
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power1.in'
        },
        '>-0.3'
      )
    }, 1000)
  } else {
    setTimeout(() => {
      tweenFinish.play()
      gsap.set('.loading', {
        rotation: 0
      })
      tl.kill()
      reset()
    }, 2000)
  }
}
const handleLogIn = async (tl, tweenFinish) => {
  const data = {
    email: refArray[0].value.value,
    password: refArray[1].value.value
  }
  const res = await emit('login', data)
  console.log('handleLogIn', res)
  if (res) {
    router.push('/home')
  } else {
    setTimeout(() => {
      tweenFinish.play()
      gsap.set('.loading', {
        rotation: 0
      })
      tl.kill()
      reset()
    }, 2000)
  }
}

const handleAnimation = () => {
  const tl = gsap.timeline()
  gsap.set('#working', {
    scale: 1,
    opacity: 1
  })
  tl.to('.loading', {
    duration: 1.76,
    rotation: 360,
    repeat: -1,
    ease: 'none'
  })
  const tween = gsap.to('#working', {
    scale: 0,
    duration: 0.5,
    ease: 'power1.Out',
    paused: true,
    onStart: () => {
      gsap.set('#acc-success', {
        yPercent: 200,
        opacity: 0
      })
    },
    onComplete: () => {
      load.value = false
      gsap.set('.loading', {
        rotation: 0
      })
      tl.kill()
    }
  })
  return { tl, tween }
}
</script>
<template>
  <div
    id="app-cover"
    ref="app_cover"
    :class="{ active: isHover }"
    @mouseover="handleHover"
    @mouseleave="handleOut"
  >
    <h1
      id="heading"
      class="up"
      :class="{ inactive: totalSteps !== 3 && isHover }"
    >
      Sign Up
    </h1>

    <form method="post" action="" autocomplete="off">
      <div id="inp-box-cover">
        <div id="inp-padd">
          <div
            class="inp-box"
            :class="{
              inactive: stepNumber > index + 1 && isHover,
              active: stepNumber === index + 1 && isHover
            }"
            v-for="(inp, index) in inputArray"
            :key="index"
            :id="inp.id"
          >
            <input
              :name="inp.id"
              :disabled="stepNumber < index + 1"
              :ref="(el) => setRefArray(el, index)"
              :type="inp.type"
              class="inp"
              :placeholder="inp.placeholder"
              :spellcheck="inp?.spellcheck"
              :autocomplete="inp?.autocomplete"
              @keyup="checkInput(refArray[index])"
            />
          </div>
          <div
            id="prev-action-btn"
            :class="{ active: stepNumber > 1 && !isFinished }"
            ref="preAction"
            @click="moveToPreviousStep()"
          >
            <ph-arrow-circle-left class="arrow" weight="bold" />
          </div>
          <div
            id="next-action-btn"
            :class="{ active: nextStep && !isFinished }"
            ref="nextAction"
            @click="moveToNextStep"
          >
            <ph-arrow-circle-right class="arrow" weight="bold" />
          </div>
        </div>
        <div id="progress-bar-cover" :class="{ hideForm: isFinished }">
          <div id="progress" ref="progress">
            <div id="working" v-show="load">
              Working<ph-arrows-clockwise class="loading" weight="bold" />
            </div>
            <div id="acc-success" v-show="!load">
              <p>
                Account Created<ph-check-fat class="checkout" weight="fill" />
              </p>
              <span id="init-login" @click="reset">Login now</span>
            </div>
          </div>
        </div>
      </div>
    </form>

    <h1
      id="heading"
      class="down"
      :class="{ inactive: totalSteps !== 2 && isHover }"
    >
      Log In
    </h1>
  </div>
</template>
<style lang="scss" scoped>
* {
  outline: none;
}

input {
  display: block;
  width: 100%;
  color: #424245;
  font-size: 1.6rem;
  padding: 0;
  background-color: transparent;
}

#password input::placeholder {
  font-weight: normal;
  letter-spacing: 0;
}

#password input {
  font-weight: bold;
  letter-spacing: 4px;
}

body,
input {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app-cover {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  max-width: 42rem;
  display: flex;
  flex-direction: column;
}

#heading {
  color: #5f5f64;
  font-size: 3rem;
  font-weight: bold;
  padding-bottom: 1rem;
  transition: 0.5s cubic-bezier(0.65, 0.05, 0.36, 1) all;
  &.down {
    padding-top: 1rem;
  }
  &.inactive {
    opacity: 0;
    pointer-events: none;
  }
}

#inp-box-cover {
  position: relative;
  width: 11.1rem;
  height: 0.6rem;
  background-color: #f4f4f4;
  border-radius: 4px;
  overflow: hidden;
  transition:
    0.5s cubic-bezier(0.65, 0.05, 0.36, 1) all,
    0s ease border;
}

#app-cover.active #inp-box-cover {
  width: 42rem;
  height: 6rem;
  border: 1px solid #5f5f64;
  box-shadow: inset 0 2px 2px #fff;
}
#inp-padd {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.inp-box {
  height: fit-content;
  width: 100%;
  position: absolute;
  padding-right: 8.5rem;
  padding-left: 1.5rem;
  top: 50%;
  opacity: 0;
  transition:
    0.6s ease-in-out all,
    1.2s ease-out opacity;
}

.inp-box.active {
  transform: translateY(-50%);
  opacity: 1;
  z-index: 1;
}

.inp-box.inactive {
  transform: translateY(-250%);
  opacity: 0;
}

#prev-action-btn,
#next-action-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 2.5rem;
  cursor: pointer;
  overflow: hidden;
  @include flexCenter;
  opacity: 0;
  transition: 0.3s ease-in-out all;
  z-index: 2;
  pointer-events: none;
}

#prev-action-btn {
  right: 3.35rem;
}

#next-action-btn .arrow,
#prev-action-btn .arrow {
  color: #5f5f64;
  font-size: 2.1rem;
  cursor: pointer;
}

#prev-action-btn.active {
  pointer-events: painted;
  opacity: 1;
  right: 4.35rem;
}
#next-action-btn.active {
  pointer-events: painted;
  opacity: 1;
  right: 1.5rem;
}

#progress-bar-cover {
  position: absolute;
  bottom: 0;
  height: 0.6rem;
  width: 100%;
  overflow: hidden;
  background-color: #e7e7e7;
  transition: 0.5s ease all;
  z-index: 3;
}

#progress-bar-cover.hide-form {
  height: 100%;
}

#progress {
  position: absolute;
  bottom: 0;
  color: transparent;
  width: 0%;
  background-color: #5f5f64;
  transition: 0.5s ease all;
  @include flexCenter;
}

#progress-bar-cover.hide-form #progress {
  height: 100%;
  width: 100%;
  color: #fff;
  text-align: center;
  padding: 16px 0;
}

#working {
  font-size: 1.6rem;
  line-height: 1;
  padding: 0.35rem;
  opacity: 0;
}

#working .loading {
  position: relative;
  top: -1px;
  display: inline-block;
  color: #9c9c9c;
  margin-left: 0.5rem;
  vertical-align: middle;
}

#acc-success {
  opacity: 0;
  width: 100%;
  transition: 0.5s ease all;
  display: flex;
  justify-content: space-around;
  align-items: center;

  p {
    padding-left: 10%;
    font-size: 1.6rem;
    @include flexCenter;

    .checkout {
      margin-left: 0.5rem;
    }
  }
}

#init-login {
  font-size: 1.4rem;
  line-height: 1;
  padding: 6px 10px 8px 10px;
  cursor: pointer;
  border-radius: 2rem;
  background-color: #7d7d7d;
  box-shadow: 0 0 0 1px #4d4d4d;
}
</style>
