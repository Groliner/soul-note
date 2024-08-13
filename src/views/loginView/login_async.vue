<script setup>
/*
登录页面
独特的UI设计
signUP 注册设置数组(props)
logIn 登录设置数组(props)
TODO:
添加邮箱验证功能
*/
import { toRef, ref, computed, watch, nextTick } from 'vue'
import {
  PhArrowCircleRight,
  PhArrowCircleLeft,
  PhCheckFat,
  PhArrowsClockwise
} from '@phosphor-icons/vue'
import { gsap } from 'gsap'
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

const inputArray = ref(props.logIn)
const isSignUp = ref(false)
const totalSteps = computed(() => inputArray.value.length)
let refArray = []
const setRefArray = (el, index) => {
  //执行时机在inputArray变化,且dom更新(每次输入或者触发事件)之后,
  // console.log('重组', el?.name, el?.value, index)
  if (el) {
    refArray[index] = toRef(el)
  }
}
watch(inputArray, () => {
  // 由于refArray绑定的input取决于位置,并且setRefArray执行时机比较晚,所以此处更新input.value根据最新的inputArray
  // console.log('侦测到模式转换,开始规则refArray', totalSteps.value)
  refArray.length = totalSteps.value
  refArray.forEach((inner, index) => {
    const key = inputArray.value[index].id
    inner.value.value =
      responseData.value?.data && key in responseData.value.data ? responseData.value.data[key] : ''
  })
})
const finishedStep = ref(0)
const stepNumber = ref(1)
const progress = ref(null)
const isFinished = ref(false)
const nextStep = ref(false)
const isHover = ref(false)
const preAction = ref(null)
const nextAction = ref(null)
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
      refArray[0].value.focus()
    })
}
const handleOut = () => {
  // console.log(responseData.value.data)
  isHover.value = stepNumber.value > 1 || refArray[0].value.value.trim().length > 0

  if (responseData.value?.data && !isFinished.value) {
    responseData.value.data = undefined
  }
}
const checkInput = (el) => {
  // 用户每次输入自动执行
  // console.log('检查输入', el.value.name, el.value.value, stepNumber.value)
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
watch(stepNumber, (new_step, old_step) => {
  if (new_step < 0 || new_step > totalSteps.value) return
  // console.log(new_step, old_step)
  checkInput(refArray[new_step - 1])
  nextTick(() => {
    refArray[new_step - 1].value.focus()
  })
})
const moveToNextStep = () => {
  if (!nextAction.value.classList.contains('active')) return
  stepNumber.value =
    finishedStep.value >= stepNumber.value ? stepNumber.value + 1 : finishedStep.value + 1
  progress.value.style.width = `${((stepNumber.value - 1) / totalSteps.value) * 100}%`
  if (finishedStep.value >= totalSteps.value && stepNumber.value > totalSteps.value) {
    isFinished.value = true
    setTimeout(handleFinished, 500)
  }
}
const moveToPreviousStep = () => {
  if (!preAction.value.classList.contains('active')) return
  if (stepNumber.value > 1) stepNumber.value--
  progress.value.style.width = `${((stepNumber.value - 1) / totalSteps.value) * 100}%`
}

const handleKeyDownEnter = () => {
  if (nextAction.value.classList.contains('active')) moveToNextStep()
  else if (preAction.value.classList.contains('active')) moveToPreviousStep()
}

// 定义结束以及异步动画
const load = ref(true)
const responseData = ref({}) // 用于用户注册后的快速登录
const reset = (change = true, toStep = '1') => {
  load.value = true
  progress.value.parentElement.classList.remove('hide-form')
  // console.log(toStep)
  // 判断toStep是否包含username
  stepNumber.value =
    toStep === '1'
      ? 1
      : Math.max(inputArray.value.findIndex((item) => toStep.contains(item.id)) + 1, 1)
  if (change) {
    inputArray.value = props.logIn
    isSignUp.value = false
  }
  progress.value.style.width = `${((stepNumber.value - 1) / totalSteps.value) * 100}%`
  isFinished.value = false
  // nextStep.value = false
  // 由于setRefArray执行时机比较晚,所以当change=true时下面check由于refArray更新较慢
  // 也就是在注册后转入登录input时的第一次checkInput不会影响nextStep.value,保持为true,除非上面设置为false
  // checkInput(refArray[stepNumber.value - 1])
}
const handleFinished = () => {
  load.value = true
  progress.value.parentElement.classList.add('hide-form')
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

import { useUserStore } from '@/stores'
const userStore = useUserStore()
import { login, register } from '@/api/oauth2'

const remember = ref(false)
// 异步请求
const handleSignUp = async (resetTween) => {
  const formData = new FormData()
  refArray.forEach((item) => {
    formData.append(item.value.name, item.value.value)
  })
  responseData.value.data = Object.fromEntries(formData)
  //发送数据等待返回
  const code = await register(formData)
    .then((res) => {
      if (res.data.code == 1) {
        ElMessage({ type: 'success', message: 'Signup successfully' })
      } else {
        ElMessage({
          type: 'warning',
          message: res.data.msg || 'User creation failed'
        })
      }
      return res.data.code
    })
    .catch((err) => {
      ElMessage.error(err.response.data?.msg || err.data.message)
    })
    .finally(() => {
      return 0
    })
  // console.log('handleSignUp:res', res)
  // 将formData数据存入responseData对象
  resetTween(code, 0.5)
}
const handleLogIn = async (resetTween) => {
  const formData = new FormData()
  refArray.forEach((item) => {
    formData.append(item.value.name, item.value.value)
  })
  formData.append('remember-me', remember.value)
  const code = await login(formData)
    .then((res) => {
      if (res.data.code === 1) {
        userStore.login(remember.value)
        ElMessage({ type: 'success', message: 'Login successfully' })
      } else {
        ElMessage({
          type: 'warning',
          message: res.data.msg || 'Incorrect username or password'
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
    @mouseleave="handleOut"
  >
    <h1 id="heading" class="up" :class="{ inactive: !isSignUp && isHover }">Sign Up</h1>

    <form method="post" action="" autocomplete="off">
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
        <div id="progress-bar-cover" :class="{ hideForm: isFinished }">
          <div id="progress" ref="progress">
            <div id="working" v-show="load">
              Working<ph-arrows-clockwise class="loading" weight="bold" />
            </div>
            <div id="acc-success" v-show="!load">
              <p>Account Created<ph-check-fat class="checkout" weight="fill" /></p>
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
        :class="{ active: isHover && stepNumber > 1 && totalSteps >= stepNumber }"
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
  padding: 1.6rem 0;
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
