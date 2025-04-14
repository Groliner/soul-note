<script setup>
/*
登录页面
独特的UI设计
signUP 注册设置数组(props)
logIn 登录设置数组(props)
TODO:
添加邮箱验证功能

QUESTION:
loginData是否应该在handout时进行条件空置？
*/
import { useTemplateRef, ref, computed, watch, nextTick, onMounted } from 'vue'
import {
  PhArrowCircleRight,
  PhArrowCircleLeft,
  PhCheckFat,
  PhArrowsClockwise
} from '@phosphor-icons/vue'
import { gsap } from 'gsap'

// 移动端的触发问题,通过区分是否为移动端来设置互动
const isMobile = ref(false)
onMounted(() => {
  if (window.innerWidth < 620) {
    isMobile.value = true
  }
})

const props = defineProps({
  signUp: {
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
        regex: '^[\\u4e00-\\u9fa5\\w.-]{2,}$'
      },
      {
        id: 'password',
        type: 'password',
        placeholder: 'Password (More than 5 characters)',
        autocomplete: 'off',
        regex: '^\\S{6,}$'
      },
      {
        id: 'captcha',
        type: 'text',
        placeholder: 'captcha (Only 4 characters)',
        autocomplete: 'off',
        regex: '^\\S{4}$'
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
        regex: '^[\\u4e00-\\u9fa5\\w.-]{2,}$'
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

const isSignUp = ref(false)
const inputArray = ref(props.logIn)
const totalSteps = computed(() => inputArray.value.length)

const finishedStep = ref(0)
const stepNumber = ref(1)
const nextStep = ref(false)
const isFinished = ref(false)
const isHover = ref(false)
const inpBoxRef = useTemplateRef('inpBox')
const inputArrayRef = ref([])
const preActionRef = useTemplateRef('preAction')
const nextActionRef = useTemplateRef('nextAction')
const progressBarCoverRef = useTemplateRef('progressBarCover')
const progressWidth = computed(
  () => ((stepNumber.value - 1) / totalSteps.value) * 100
)
watch(
  () => inputArray.value.length,
  async () => {
    await nextTick() // 等待DOM更新(异步函数的另一种写法)
    inputArrayRef.value = inpBoxRef.value.map((item) =>
      item.querySelector('input')
    )
    inputArrayRef.value.forEach((item) => {
      item.value = loginData.value ? loginData.value[item.name] : ''
    })
  },
  { immediate: true } // 此处设置会在第一次渲染时自动执行一次
)
const handleHover = (el) => {
  if (isHover.value) return
  if (el.target.classList.contains('up')) {
    inputArray.value = props.signUp
    isSignUp.value = true
    remember.value = false
  }
  if (el.target.classList.contains('down')) {
    inputArray.value = props.logIn
    isSignUp.value = false
  }
  isHover.value = true
  if (finishedStep.value < totalSteps.value)
    nextTick(() => {
      inputArrayRef.value[0].focus()
    })
}
const handleOut = () => {
  isHover.value =
    stepNumber.value > 1 || inputArrayRef.value[0].value.trim().length > 0
  if (loginData.value && !isFinished.value) {
    loginData.value = null
  }
}
const checkInput = (event) => {
  const el = event.target
  //console.log(el, el.name, el.value)
  // 用户每次输入自动执行
  const index = inputArray.value.findIndex((item) => item.id === el.name)
  const inputRegular = inputArray.value[index]
  if (el.value.match(inputRegular.regex)) {
    nextStep.value = true
    finishedStep.value = index + 1
  } else {
    nextStep.value = false
    finishedStep.value = index
  }
}
watch(stepNumber, async (new_step, old_step) => {
  if (new_step < 0 || new_step > totalSteps.value) return
  // console.log(new_step, old_step)
  await nextTick()
  inputArrayRef.value[new_step - 1].focus()
})
const moveToNextStep = () => {
  if (!nextActionRef.value.classList.contains('active')) return
  stepNumber.value =
    finishedStep.value >= stepNumber.value
      ? stepNumber.value + 1
      : finishedStep.value + 1
  if (
    finishedStep.value >= totalSteps.value &&
    stepNumber.value > totalSteps.value
  ) {
    isFinished.value = true
    setTimeout(handleFinished, 500)
  }
}
const moveToPreviousStep = () => {
  if (!preActionRef.value.classList.contains('active')) return
  if (stepNumber.value > 1) stepNumber.value--
}

const handleKeyDownEnter = () => {
  if (nextActionRef.value.classList.contains('active')) moveToNextStep()
  else if (preActionRef.value.classList.contains('active')) moveToPreviousStep()
}

// 定义结束以及异步动画
const load = ref(true)
const reset = (change = true, toStep = '1') => {
  load.value = true
  progressBarCoverRef.value.classList.remove('hide-form')
  // console.log(toStep)
  // 判断toStep是否包含username
  stepNumber.value =
    toStep === '1'
      ? 1
      : Math.max(
          inputArray.value.findIndex((item) => toStep.contains(item.id)) + 1,
          1
        )
  if (change) {
    inputArray.value = props.logIn
    isSignUp.value = false
  }
  isFinished.value = false
}
const handleFinished = () => {
  load.value = true
  progressBarCoverRef.value.classList.add('hide-form')
  const resetTween = handleAnimation()
  if (isSignUp.value) handleSignUp(resetTween)
  else handleLogIn(resetTween)
}
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()

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
        yPercent: 300,
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

  return function (result = 0, latency = 2) {
    // console.log('是否注册', isSignup, '是否成功', result, '延迟', latency)
    setTimeout(() => {
      tween.play()
      if (result !== 1) {
        reset(false, result.msg)
      } else {
        if (isSignUp.value)
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
        else router.push('/home')
      }
    }, latency * 1000)
  }
}

import { useUserStore, useMessageStore } from '@/stores'
import { login, register } from '@/api/oauth2'
import { generateAESKey, encryptPassword } from '@/composables/IOAESKey'

const userStore = useUserStore()
const messageStore = useMessageStore()
const loginData = ref(null) // 用于用户注册后的快速登录
const remember = ref(false)
const getBasicData = async () => {
  const formData = new FormData()
  inputArrayRef.value.forEach((item) => {
    formData.append(item.name, item.value)
  })
  loginData.value = Object.fromEntries(formData)

  const pwd = formData.get('password')
  formData.set('password', await encryptPassword(pwd))
  return [formData, pwd]
}
// 异步请求
const handleSignUp = async (resetTween) => {
  const [formData, pwd] = await getBasicData()
  //发送数据等待返回
  const code = await register(formData)
    .then((res) => {
      if (res.data.code == 1) {
        ElMessage({
          type: 'success',
          message: messageStore.loginConstant['REGISTER_SUCCESS']
        })
      } else {
        ElMessage({
          type: 'warning',
          message: res.data.msg || messageStore.loginConstant['REGISTER_ERROR']
        })
      }
      return res.data.code
    })
    .catch((err) => {
      ElMessage.error(err.response.data?.msg || err.message)
    })
    .finally(() => {
      return 0
    })
  // console.log('handleSignUp:res', res)
  resetTween(code, 0.5)
}
const handleLogIn = async (resetTween) => {
  const [formData, pwd] = await getBasicData()
  formData.append('remember-me', remember.value)
  const code = await login(formData)
    .then((res) => {
      if (res.data.code === 1) {
        userStore.login(remember.value)
        generateAESKey(pwd, 'diaryAccessKey', '')
      } else {
        ElMessage({
          type: 'warning',
          message: res.data.msg || messageStore.loginConstant['LOGIN_ERROR']
        })
      }
      return res.data.code
    })
    .catch((err) => {
      ElMessage.error(err.response?.data?.msg || err.message)
    })
    .finally(() => {
      return 0
    })
  // console.log('handleLogIn:res', res)
  resetTween(code, 0.5)
}
</script>
<template>
  <div
    id="app-cover"
    ref="app_cover"
    :class="{ active: isHover }"
    @mouseover="handleHover"
  >
    <h1 id="heading" class="up" :class="{ inactive: !isSignUp && isHover }">
      Sign Up
    </h1>

    <form
      method="post"
      action=""
      autocomplete="off"
      @mouseout="handleOut"
      v-if="isMobile"
    >
      <div id="inp-box-cover">
        <div id="inp-padd" :class="{ rememberMe: remember }">
          <div
            class="inp-box"
            :class="{
              inactive: stepNumber > index + 1 && isHover,
              active: stepNumber === index + 1 && isHover
            }"
            v-for="(inp, index) in inputArray"
            :key="index"
            :id="inp.id"
            ref="inpBox"
          >
            <input
              :name="inp.id"
              :disabled="stepNumber < index + 1"
              :type="inp.type"
              class="inp"
              :placeholder="inp.placeholder"
              :spellcheck="inp?.spellcheck"
              :autocomplete="inp?.autocomplete"
              @keyup="checkInput"
              @keydown.enter.prevent="handleKeyDownEnter"
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
        <div id="progress-bar-cover" ref="progressBarCover">
          <div id="progress" :style="{ width: progressWidth + '%' }">
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
    <form
      method="post"
      action=""
      autocomplete="off"
      @focusout="handleOut"
      v-else
    >
      <div id="inp-box-cover">
        <div id="inp-padd" :class="{ rememberMe: remember }">
          <div
            class="inp-box"
            :class="{
              inactive: stepNumber > index + 1 && isHover,
              active: stepNumber === index + 1 && isHover
            }"
            v-for="(inp, index) in inputArray"
            :key="index"
            :id="inp.id"
            ref="inpBox"
          >
            <input
              :name="inp.id"
              :disabled="stepNumber < index + 1"
              :type="inp.type"
              class="inp"
              :placeholder="inp.placeholder"
              :spellcheck="inp?.spellcheck"
              :autocomplete="inp?.autocomplete"
              @keyup="checkInput"
              @keydown.enter.prevent="handleKeyDownEnter"
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
        <div id="progress-bar-cover" ref="progressBarCover">
          <div id="progress" :style="{ width: progressWidth + '%' }">
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
    <h1 id="heading" class="down" :class="{ inactive: isHover && isSignUp }">
      Log In
      <div
        class="remember-box"
        :class="{
          active: isHover && stepNumber > 1 && totalSteps >= stepNumber
        }"
      >
        <input id="remember-me" type="checkbox" v-model="remember" />
        <label for="remember-me">Remember me</label>
      </div>
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
    position: relative;

    .remember-box {
      position: absolute;
      top: 8%;
      left: 48%;
      font-size: 1.4rem;
      height: 1rem;
      color: #3c5259;
      display: none;

      label {
        cursor: pointer;
        transition: color 0.3s ease;
        white-space: nowrap;
        margin-right: 1rem;
        line-height: 50%;
        &:hover {
          color: chocolate;
        }
      }
      &.active {
        display: flex;
        flex-flow: row-reverse;
      }
    }
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
  transition: background-color 0.4s ease;
  &.rememberMe {
    background-color: #f8eed7;
  }
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
  &.active {
    transform: translateY(-50%);
    opacity: 1;
    z-index: 1;
  }
  &.inactive {
    transform: translateY(-250%);
    opacity: 0;
  }
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
  &.active {
    pointer-events: painted;
    opacity: 1;
    right: 1.5rem;
  }
}

#prev-action-btn {
  right: 3.35rem;
  &.active {
    pointer-events: painted;
    opacity: 1;
    right: 4.35rem;
  }
}

#next-action-btn .arrow,
#prev-action-btn .arrow {
  color: #5f5f64;
  font-size: 2.1rem;
  cursor: pointer;
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
  &.hide-form {
    height: 100%;
    #progress {
      height: 100%;
      width: 100%;
      color: #fff;
      text-align: center;
      padding: 1.6rem 0;
    }
  }
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

#working {
  font-size: 1.6rem;
  line-height: 1;
  padding: 0.35rem;
  opacity: 0;
  .loading {
    position: relative;
    top: -1px;
    display: inline-block;
    color: #9c9c9c;
    margin-left: 0.5rem;
    vertical-align: middle;
  }
}

#acc-success {
  opacity: 0;
  width: 100%;
  transition: 0.5s ease all;
  display: flex;
  justify-content: space-around;
  align-items: center;

  p {
    user-select: none;
    padding-left: 10%;
    font-size: 1.6rem;
    @include flexCenter;

    .checkout {
      margin-left: 0.5rem;
    }
  }
}

#init-login {
  width: fit-content;
  font-size: 1.4rem;
  line-height: 1;
  padding: 0.6rem 1rem 0.8rem 1rem;
  cursor: pointer;
  border-radius: 2rem;
  background-color: #7d7d7d;
  box-shadow: 0 0 0 1px #4d4d4d;
}
</style>
