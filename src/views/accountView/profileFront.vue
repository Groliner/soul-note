<script setup>
/*
用户中心简要概述:
个人信息的查看和修改
好友列表
日记本列表

自定义背景
**/

import { useUserStore, useDiaryStore, useMessageStore } from '@/stores'
import { ref, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const diaryStore = useDiaryStore()
const messageStore = useMessageStore()
const { userInfo, friends } = storeToRefs(userStore)
let originalUserInfo = JSON.stringify({
  username: userInfo.value.username,
  email: userInfo.value.email,
  description: userInfo.value.description,
  avatar: userInfo.value.avatar
})
const diaries = computed(() =>
  diaryStore.getLocalDiariesByUserId(userInfo.value.id)
)
import { gsap } from 'gsap'
onUnmounted(() => {
  handleCancel()
})
// user Info edit
const avatarInput = ref(null)
const isEdit = ref(false)
import { uploadImgAPI } from '@/api/fundamental'
// 触发文件选择
const triggerUpload = (target, value = true) => {
  if (!value) return
  target.click() // 打开文件选择对话框
  // 使用GSAP添加一些动画，例如按钮点击反馈
  gsap.to(target, {
    opacity: 0.7,
    yoyo: true,
    repeat: 1,
    duration: 0.5
  })
}
// 处理文件选择
const handleAvatarChange = async (event) => {
  const files = event.target.files
  if (files.length > 0) {
    const formData = new FormData()
    formData.append('image', files[0])
    const res = await uploadImgAPI(formData)
    userStore.setUserInfo({ avatar: res.data.data })
  }
}
const handleSave = async () => {
  isEdit.value = false
  userInfo.value.isEdited = originalUserInfo !== JSON.stringify(userInfo.value)
  await userStore.saveUserInfo()
  originalUserInfo = JSON.stringify(userInfo.value)
}
const handleCancel = () => {
  // 重置用户信息
  isEdit.value = false
  userStore.setUserInfo(JSON.parse(originalUserInfo))
  userInfo.value.isEdited = false
}

import {
  PhNotePencil,
  PhCheckCircle,
  PhReceiptX,
  PhSlidersHorizontal,
  PhFadersHorizontal
} from '@phosphor-icons/vue'
import { messageManager } from '@/directives/index'

// 好友列表动画
const handleFriends = () => {
  const text = messageStore.accountConstant['DEVELOP_FRIEND_SYSTEM']
  messageManager.showConfirmModal(text, {
    mask: false,
    pressTime: 60,
    draggable: true
  })
}
const handleClick = (diaryId) => {
  messageManager.showDiaryEditModal(diaryId)
}

import { Flip } from 'gsap/all'
gsap.registerPlugin(Flip) // 后续可以添加删除后的移动动画

// 日记本列表动画
function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    delay: 0.3,
    onComplete: done
  })
}
function onBeforeEnter(el) {
  el.style.opacity = 0
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    delay: 0.2,
    onComplete: done
  })
}

// 背景图片设置
const backgroundImgInput = ref(null)
const backImgSettingSize = ref('1.5em')
const backImgSettingType = ref('light')
const handleBackgroundImgChange = async (event) => {
  const files = event.target.files
  if (files.length > 0) {
    const formData = new FormData()
    formData.append('image', files[0])
    const res = await uploadImgAPI(formData)
    userStore.setBackgroundImg(res.data.data)
  }
}
</script>
<template>
  <div class="pfl-wrapper">
    <div
      class="background-settings"
      @mouseover="backImgSettingType = 'bold'"
      @mouseleave="backImgSettingType = 'light'"
    >
      <a class="_">
        <PhFadersHorizontal
          class="icon"
          :size="backImgSettingSize"
          :weight="backImgSettingType"
          @click="triggerUpload(backgroundImgInput)"
        />
      </a>
      <input
        type="file"
        ref="backgroundImgInput"
        @change="handleBackgroundImgChange"
        style="display: none"
      />
    </div>

    <article>
      <div class="profile-photo">
        <button
          class="avatar"
          @click="triggerUpload(avatarInput, isEdit)"
          :class="{ active: isEdit }"
        >
          <img :src="userInfo.avatar" />
        </button>
        <input
          type="file"
          ref="avatarInput"
          @change="handleAvatarChange"
          style="display: none"
        />
        <div class="button button-edit">
          <ph-note-pencil
            class="icon_avatar"
            v-show="!isEdit"
            @click="isEdit = true"
          />
          <ph-check-circle
            class="icon_avatar"
            v-show="isEdit"
            @click="handleSave"
          />
        </div>
        <div class="button button-cancel" :class="{ active: isEdit }">
          <ph-receipt-x
            class="icon_cancel"
            v-show="isEdit"
            @click="handleCancel"
          />
        </div>
      </div>
      <div class="profile-info">
        <h1 class="profile_username">
          <flexInput
            v-model:text="userInfo.username"
            placeholder="username"
            :status="isEdit"
          />
        </h1>
        <a class="profile_email">
          <flexInput
            v-model:text="userInfo.email"
            placeholder="email"
            :status="isEdit"
          />
        </a>
        <p>
          <flexInput
            v-model:text="userInfo.description"
            placeholder="there is nothing here, it's empty"
            :status="isEdit"
          />
        </p>
      </div>
      <div class="profile-content">
        <!-- 好友列表 -->
        <div class="friend-list">
          <TransitionGroup tag="ul">
            <li v-for="friend in friends" :key="friend.id">
              <div class="friend-card" @click="handleFriends">
                <div class="friend-avatar">
                  <img :src="friend.avatar" />
                </div>
                <div class="friend-info">
                  <h4>{{ friend.username }}</h4>
                  <p>{{ friend.description }}</p>
                </div>
                <a class="options"><ph-sliders-horizontal class="icon" /></a>
              </div>
            </li>
          </TransitionGroup>
        </div>

        <!-- 日记本列表 -->
        <TransitionGroup
          tag="div"
          @leave="onLeave"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          class="diary-list"
        >
          <div class="tile" v-for="diary in diaries" :key="diary.id">
            <div class="inner" @click="handleClick(diary.id)">
              <figure>
                <img :src="diary.cover" />
                <figcaption
                  :class="{
                    active: diary.id === userInfo.lastReadDiaryId
                  }"
                >
                  {{ diary.title }}
                </figcaption>
              </figure>
              <h4>{{ diary.description }}</h4>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </article>
  </div>
</template>
<style lang="scss" scoped>
.pfl-wrapper {
  width: 100%;
  height: 100%;
  padding: 40px;
  background-color: rgb(251 248 242 / 42%);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.08);
  position: relative;
}

.background-settings {
  position: absolute;
  top: 1.3em;
  right: 1.2em;
  cursor: pointer;
  border-right: 3px solid transparent;
  border-radius: 30%;
  transition: border-color 0.2s ease;

  .icon {
    transition: font-size 0.25s ease;
    font-size: 1.4em;
    color: var(--c-gray-500);
  }
  ._ {
    &:active .icon {
      color: #8fd8b6;
    }
  }

  &:hover {
    .icon {
      font-size: 1.55em;
    }
    border-color: #1dc779ad;
  }
}

article {
  display: block;
  width: auto;
  height: auto;
  padding: 50px 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .profile-photo {
    position: relative;
    .avatar {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid var(--greyDark);
      padding: 2px;
      background-color: white;
      transition: all 0.25s;
      &.active {
        cursor: pointer;
      }

      img {
        width: 100%;
        object-fit: cover;
        object-position: center;
        transition: transform 0.25s;
        transform: scale(1.1);
        user-select: none;
      }
      &:hover {
        box-shadow:
          $shadow,
          $inner-shadow,
          0 0 50px rgba(0, 0, 0, 0.08);
        border-color: transparent;
        img {
          transform: scale(1.01);
        }
      }
    }

    .button {
      position: absolute;
      right: -2em;
      bottom: -1.2em;
      font-size: 1.5em;
      z-index: 100;
      cursor: pointer;
      transition: all 0.25s;
      @media screen and (max-width: 800px) {
        font-size: 2.1em;
      }
      &:hover {
        color: var(--primary);
      }
      &-cancel.active {
        bottom: -2.8em;

        &:hover {
          color: var(--c-blue-500);
        }
      }
    }
  }

  .profile-info {
    display: block;
    max-width: 80%;
    text-align: center;
    position: relative;

    .profile {
      &_username {
        font-size: 2em;
        font-weight: 600;
        margin-top: 0.3em;
        margin-bottom: 0.2em;
      }
      &_email {
        display: inline-block;
        font-size: 1.2em;
        color: var(--c-blue-500);
        margin-bottom: 0.2em;
        cursor: pointer;
        transition: color 0.25s;
        &:hover {
          color: var(--primary-light);
        }
      }
      &_description {
        font-size: 1.1em;
        color: var(--c-gray-500);
      }
    }
  }
  .profile-content {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 1fr 4fr;
    gap: 1rem;
    border-top: 2px solid var(--primary-light);
    justify-content: space-around;

    @media screen and (max-width: 630px) {
      grid-template-columns: 1fr;
      justify-items: center;
    }

    .friend-list {
      width: 90%;
      min-height: 3rem;
      padding: 3rem;
      width: 26rem;
      min-width: 200px;
      ul {
        padding: 0;
      }
      li {
        list-style: none;
        transition: all 0.25s;
        border-radius: 10px;
        overflow: hidden;
        .friend-card {
          display: flex;
          align-items: center;
          border-bottom: 4px solid var(--c-gray-400);
          cursor: pointer;
        }
        .friend-avatar {
          margin: 0.5em 1em;
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          background-clip: border-box;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .friend-info {
          margin-right: 2em;
          display: flex;
          flex-direction: column;
          h4 {
            font-size: 1.2em;
            margin-bottom: 0.5rem;
          }
          p {
            font-size: 1em;
            color: var(--c-gray-500);
          }
        }
        .options {
          background-color: var(--c-gray-300);
          width: 2em;
          height: 2em;
          border-radius: 50%;
          position: relative;
          .icon {
            @include absCenter;
          }
        }
        &:hover {
          transform: translateY(-5px);
          box-shadow:
            0 0 20px rgba(0, 0, 0, 0.08),
            $shadow;
          h4 {
            color: var(--primary);
          }
          .options {
            background-color: var(--c-gray-400);
            .icon {
              color: var(--c-gray-900);
            }
          }
        }

        &:not(:last-child) {
          margin-bottom: 1em;
        }
      }
    }

    .diary-list {
      align-self: flex-start;
      margin: 1rem 0;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      @media screen and (max-width: 630px) {
        justify-content: center;
      }

      .tile {
        align-self: center;
        justify-self: center;

        .inner {
          overflow: hidden;
          border-radius: 5px;
          background-color: white;
          cursor: pointer;
          border: 2.7px solid var(--c-gray-900);

          transition: box-shadow 0.25s;

          figure {
            max-width: 10rem;
            display: flex;
            flex-direction: column;
            img {
              width: 100%;
              min-height: 10rem;
              max-height: 16rem;
              object-fit: cover;
              object-position: center;
            }
            figcaption {
              background-color: var(--greyDark);
              color: #fff;
              text-align: center;
              font-size: 1.2em;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;

              &.active {
                background-color: var(--primary);
              }
            }
          }

          h4 {
            font-size: 1.1em;
            line-height: 1.4em;
            padding: 0.7rem 0.4rem 1rem;
            transition: color 0.25s;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 9rem;
            overflow: hidden;
          }

          &:hover {
            box-shadow:
              0 0 50px rgba(0, 0, 0, 0.08),
              $shadow;
            transition: box-shadow 0.25s;

            h4 {
              color: rgb(2, 117, 216);
            }
          }
        }
      }
    }
  }
}
</style>
