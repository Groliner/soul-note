<script setup>
import img from '@/assets/images/loading.webp'
import { ref, onMounted, watch, nextTick, useTemplateRef } from 'vue'
import { useUserStore, useConstantStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { gsap } from 'gsap'
import { addUserBackgroundImgAPI, deleteUserBackgroundImgAPI } from '@/api/user'
const userStore = useUserStore()
const { userInfo, userPreferences } = storeToRefs(userStore)
const emit = defineEmits(['close'])
const avatarImgSelectNum = ref(0)
const backgroundList = userPreferences.value.backgroundList
const backgroundImgSelectNum = ref(
  Math.max(
    backgroundList.findIndex((x) => x.imgUrl === userPreferences.value.background),
    0
  )
)
let backgroundImgSelectedNum = backgroundImgSelectNum.value

const deletedImgList = ref([])
const addImgList = ref([])

const sliderTime = 1
let i = 999

// gsapSlider 方法，用于实现动画效果
function gsapSlider(left) {
  const slide = document.querySelectorAll('.slider ul li')[backgroundImgSelectNum.value]
  i++
  if (slide === undefined) return
  gsap.fromTo(slide, { zIndex: i, left: left }, { left: '0%', duration: sliderTime })
}
const handlePrev = () => {
  if (backgroundImgSelectNum.value === 0) {
    backgroundImgSelectNum.value = userPreferences.value.backgroundList.length - 1
  } else {
    backgroundImgSelectNum.value--
  }
  gsapSlider('100%')
}
const handleNext = () => {
  if (backgroundImgSelectNum.value === userPreferences.value.backgroundList.length - 1) {
    backgroundImgSelectNum.value = 0
  } else {
    backgroundImgSelectNum.value++
  }
  gsapSlider('-100%')
}
onMounted(() => {
  gsapSlider('100%')
  open.value = true
})

import { uploadImgAPI } from '@/api/fundamental'
import { messageManager } from '@/utils/modals'

const constantStore = useConstantStore()
const { accountConstant } = storeToRefs(constantStore)
const triggerUpload = (target, value = true) => {
  if (!value) return
  const inputEl = target.currentTarget.querySelector('input[type="file"]')
  // console.log(inputEl)

  inputEl.click() // 打开文件选择对话框
}
const handleBackgroundImgChange = async (event) => {
  const files = event.target.files
  if (files.length > 0) {
    const formData = new FormData()
    formData.append('image', files[0])
    const res = await uploadImgAPI(formData)
    if (res.data.data) {
      backgroundList.push({
        imgUrl: res.data.data,
        type: 'background'
      })
      addImgList.value.push({
        imgUrl: res.data.data,
        type: 'background'
      })
      backgroundImgSelectNum.value = backgroundList.length - 1
    }
  }
}
const handleBackgroundImgSelect = () => {
  userPreferences.value.background = backgroundList[backgroundImgSelectNum.value].imgUrl
  backgroundImgSelectedNum = backgroundImgSelectNum.value
}
</script>

<template>
  <div class="container_settings">
    <!-- 设置两个蒙版，z-index分别为299，301，background-img的z-index为300 -->
    <div
      class="background-img"
      :style="{
        backgroundImage: `url(${userPreferences.backgroundList[backgroundImgSelectNum].imgUrl})`
      }"
    ></div>
    <div class="account_wrapper">
      <section class="account_info">
        <figure class="account_avatar">
          <figcaption class="account_avatar_label">
            {{ userStore.selectLanguage === 'en-US' ? 'Avatar' : '头像' }}
          </figcaption>
          <img class="account_avatar_img" :src="userInfo.avatar" />
        </figure>
        <div class="account_name">
          <p class="account_name_label">
            {{ userStore.selectLanguage === 'en-US' ? 'NAME:' : '昵称' }}:
          </p>
          <p class="account_name_value">
            {{ userInfo.username }}
          </p>
        </div>
        <div class="account_email">
          <p class="account_email_label">
            {{ userStore.selectLanguage === 'en-US' ? 'EMAIL:' : '邮箱' }}:
          </p>
          <p class="account_email_value">
            {{ userInfo.email }}
          </p>
        </div>
        <div class="account_desc">
          <p class="account_desc_label">
            {{ userStore.selectLanguage === 'en-US' ? 'INTRO' : '简介' }}:
          </p>
          <p class="account_desc_value">
            {{ userInfo.description }}
          </p>
        </div>
      </section>
      <div class="dash-line"></div>

      <div class="account_select">
        <p class="account_select_label">
          {{ userStore.selectLanguage === 'en-US' ? 'language' : '语言' }}:
        </p>
        <div class="select">
          <div class="zh">
            <input
              id="Chinese"
              type="radio"
              class="account_select_input"
              value="0"
              v-model="userPreferences.language"
            />
            <label for="Chinese" class="account_select_label">简体中文</label>
          </div>
          <div class="en">
            <input
              id="English"
              type="radio"
              class="account_select_input"
              value="1"
              v-model="userPreferences.language"
            />
            <label for="English" class="account_select_label">English</label>
          </div>
        </div>
      </div>
      <div class="dash-line"></div>
      <div class="account_select">
        <p class="account_select_label">
          {{ userStore.selectLanguage === 'en-US' ? 'theme' : '主题' }}:
        </p>
        <div class="select">
          <div class="de">
            <input
              id="default"
              type="radio"
              class="account_select_input"
              value="0"
              v-model="userPreferences.theme"
            />
            <label for="default" class="account_select_label">
              {{ userStore.selectLanguage === 'en-US' ? 'default' : '默认' }}
            </label>
          </div>
          <div class="cr">
            <input
              id="crazy"
              type="radio"
              class="account_select_input"
              value="1"
              v-model="userPreferences.theme"
            />
            <label for="crazy" class="account_select_label">
              {{ userStore.selectLanguage === 'en-US' ? 'crazy' : '疯狂' }}
            </label>
          </div>
        </div>
      </div>
      <div class="dash-line"></div>

      <div class="account_others">
        <p class="account_others_labels">
          {{ userStore.selectLanguage === 'en-US' ? 'other_operation' : '其他' }}:
        </p>
        <button class="account_others_btn" @click="handleSave" :disabled="saveProcess">
          {{
            userStore.selectLanguage === 'en-US'
              ? saveProcess
                ? 'saving...'
                : 'save'
              : saveProcess
                ? '保存中...'
                : '保存'
          }}
        </button>
        <button class="account_others_btn" @click="handleCancel" :disabled="saveProcess">
          {{ userStore.selectLanguage === 'en-US' ? 'cancel' : '取消' }}
        </button>
      </div>

      <div class="dash-line"></div>

      <div class="account_bg" id="account_bg">
        <div class="slider">
          <!-- slide -->
          <ul v-if="false">
            <li
              v-for="(backgroundImg, index) in userPreferences.backgroundList"
              :key="index"
              :class="{ active: index === backgroundImgSelectNum }"
            >
              <img :src="backgroundImg" />
            </li>
          </ul>
          <!-- controll -->
          <span class="controll" @click="handlePrev"></span>
          <span class="controll" @click="handleNext"></span>

          <div class="operation">
            <button class="operation_btn upload" @click="triggerUpload">
              <input type="file" @change="handleBackgroundImgChange" style="display: none" />
              {{ userStore.selectLanguage === 'en-US' ? 'upload' : '上传' }}
            </button>
            <blusterButton class="operation_btn select" @click="handleBackgroundImgSelect">
              {{ userStore.selectLanguage === 'en-US' ? 'select' : '选择' }}
            </blusterButton>
            <button class="operation_btn delete" @click="handleBackgroundImgDelete">
              {{ userStore.selectLanguage === 'en-US' ? 'delete' : '删除' }}
            </button>
          </div>
        </div>
        <button class="account_others_btn">
          <!-- {{ userStore.selectLanguage === 'en-US' ? 'change pwd' : '修改密码' }} -->
          debug...
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container_settings {
  // color: rgba(223, 34, 122, 0.986);
  max-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 600;
  @include absCenter;
  position: fixed;
}
.mask {
  will-change: opacity;
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color: rgb(235 235 235 / 76%);
  z-index: 301;

  &_2 {
    background-color: rgb(236 205 222 / 45%);
    z-index: 299;
  }
}
.background-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 1;
  z-index: 300;
  transition: background-image 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
.account_wrapper {
  z-index: 302;
  border: 2px solid var(--primary-light);
  border-radius: 1rem;
  padding: 2rem 3rem;
  font-size: 1.2rem;
  min-width: 42vw;

  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  width: auto;

  .dash-line {
    width: 100%;
    height: 1px;
    border-bottom: 1.4px rgb(224, 224, 241) dashed;
  }
  .account_info {
    display: grid;
    grid-template-columns: minmax(min-content, 15%) 1fr;
    // 这里不设置网格的行,未来保持响应性
    column-gap: 1.8rem;
    row-gap: 0.5rem;
    grid-auto-flow: row;

    & > *:not(:last-child) {
      align-self: center;
      border-bottom: 1px solid var(--primary-light);
    }

    .account_avatar {
      width: 7rem;
      height: 7rem;
      border-radius: 50%;
      border: 2px solid rgb(154 198 13);
      grid-row: 1 / 3;
      align-self: center;
      justify-self: center;
      padding: 2px;
      background-color: white;
      transition: all 0.25s;
      cursor: pointer;
      box-shadow: $outer-shadow;
      overflow: hidden;

      &_label {
        display: none;
      }

      &_img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
        border-radius: inherit;
        transform: scale(1.1);
        transition: transform 0.25s;
        border: 2px solid var(--c-yellow-100);
      }
      &:hover {
        box-shadow:
          $shadow,
          $inner-shadow,
          0 0 30px rgba(0, 0, 0, 0.08);
        border-color: transparent;
        img {
          transform: scale(1.01);
        }
      }
    }
    .account_name {
      grid-row: 1 / 2;
      align-self: last baseline;

      & > * {
        display: inline-block;
        margin-right: 2rem;
        font-size: 1.2rem;
      }

      &_label {
      }
      &_value {
      }
    }

    .account_email {
      grid-row: 2 / 3;

      & > * {
        display: inline-block;
        margin-right: 2rem;
        font-size: 1.2rem;
      }
    }

    .account_desc {
      grid-column: 1/-1;
      margin-top: 0.2em;
      & > * {
        display: inline-block;
        margin-right: 2rem;
        word-break: break-all;
        font-size: 1.2rem;
      }
    }
  }

  .account_bg {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .slider {
      width: 100%;
      max-width: 28rem;
      padding: 0 50px;

      position: relative;
      filter: opacity(0.8);
      ul {
        position: relative;
        overflow: hidden;
        border-radius: 15px;
        width: 100%;
        height: 100%;

        li {
          list-style: none;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: -100%;

          color: #fff;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
        }
      }

      .controll {
        width: 1.6rem;
        height: 1.2rem;
        position: absolute;
        top: calc(50% - 0.6rem);
        border-bottom: 3px solid #333;
        border-left: 3px solid #333;
        cursor: pointer;
        color: #333;

        &:first-of-type {
          transform: rotate(45deg);
          left: 1%;
        }
        &:last-of-type {
          transform: rotate(225deg);
          right: 1%;
        }
        &:hover,
        &.active {
          border-color: #f98686; /* rose */
        }
      }

      .operation {
        display: flex;
        gap: 1rem;
        justify-content: center;

        &_btn {
          font-family: inherit;
          background: none;
          margin: 0.5rem;
          padding: 0.3rem 1rem;
          transition: 0.25s;
          border-radius: 5px;
          border: 1px solid #a19a9a5c;
          font-size: 1rem;

          &:hover {
            background-color: rgb(255 255 255 / 57%);
          }

          &.upload {
            &:hover {
              background-color: #bdfbfa;
            }
          }

          &.select {
          }

          &.delete {
            &:hover {
              background-color: #f98686;
              color: white;
            }
          }
        }
      }
    }
  }

  .account_select {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    font-size: 1.2rem;
    &_label {
      transition: color 0.1s ease;
    }

    .select {
      width: 70%;
      display: flex;
      gap: 3rem;
    }

    &_input {
      display: none;

      &:hover + label {
        color: var(--primary-light);
        text-decoration: underline;
      }

      &:checked + label {
        color: var(--primary);
      }
    }
    &_label {
      cursor: pointer;
    }
  }
  .account_others {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    gap: 1rem;

    &_labels {
      flex: 1;
    }
    &_btn {
      font-size: 0.9rem;
      padding: 0.6rem 1.2rem;
      border-radius: 5px;
      background-color: #f0f0f0;
      color: #000;
      font-weight: 600;
      height: fit-content;
      cursor: pointer;
      &:hover {
        background-color: #e0e0e0;
      }
    }
  }
}

.default_btn {
  padding: 0.6rem 1.2rem;
  border-radius: 5px;
  background-color: #f0f0f0;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
}
</style>
