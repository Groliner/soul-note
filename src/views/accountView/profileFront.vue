<!--
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2025-04-14 12:41:04
-->
<script setup>
/*
用户中心简要概述:
个人信息的查看和修改
好友列表
日记本列表

自定义背景
**/

import { useUserStore, useDiaryStore, useMessageStore, useContactsStore } from '@/stores'
import { ref, onUnmounted, computed, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const diaryStore = useDiaryStore()
const messageStore = useMessageStore()
const contactsStore = useContactsStore()
const friends = computed(() => contactsStore.getChatLists(0))
const { userInfo, userPreferences } = storeToRefs(userStore)
const fields = ['username', 'email', 'description', 'avatar']
let originalUserInfo = Object.fromEntries(fields.map((key) => [key, userInfo.value[key]]))
const diaries = computed(() => diaryStore.getLocalDiariesByUserId(userInfo.value.id))

/*
此处的isOnline暂且搁置，不起作用。
*/
const isOnline = computed(() => {
  const list = friends.value.filter((user) => user.id == userInfo.value.id)
  if (list.length > 0) {
    return list[0].isOnline
  }
})
import { gsap } from 'gsap'
onUnmounted(() => {
  handleCancel()
})

// user Info edit
const avatarInputRef = useTemplateRef('avatarInput')
const isEdit = ref(false)
import { uploadImgAPI } from '@/api/fundamental'
const triggerUpload = (value = true) => {
  if (!value) return

  avatarInputRef.value.click() // 打开文件选择对话框
  // 使用GSAP添加一些动画，例如按钮点击反馈
  gsap.to(avatarInputRef.value, {
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
import { compareObjBaseA } from '@/composables/methods'
const handleSave = async () => {
  userInfo.value.isEdited = !compareObjBaseA(originalUserInfo, userInfo.value)
  await userStore.saveUserInfo()
  originalUserInfo = Object.fromEntries(fields.map((key) => [key, userInfo.value[key]]))
  isEdit.value = false
}
const handleCancel = () => {
  // 重置用户信息

  if (isEdit.value) {
    userStore.setUserInfo(originalUserInfo)
    userInfo.value.isEdited = false
  }
  isEdit.value = false
}

import {
  PhNotePencil,
  PhCheckCircle,
  PhReceiptX,
  PhSlidersHorizontal,
  PhFadersHorizontal,
  PhArrowClockwise
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
import { ElMessage } from 'element-plus'
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

// 个性化设置
const SettingType = ref('light')

// 触发文件选择
const handleSelfEdit = () => {
  messageManager.showAccountSettingsModal()
}

const isRefreshing = ref(false)
const handleRefresh = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  const res = await userStore.regularInfo()
  if (res) {
    ElMessage({
      message: messageStore.accountConstant['REFRESH_AUTHORIZE_SUCCESS'],
      type: 'success',
      grouping: true
    })
  }
  isRefreshing.value = false
}
</script>
<template>
  <div class="pfl-wrapper">
    <div class="authRefresh" :class="{ refreshing: isRefreshing }">
      <PhArrowClockwise class="icon" @click="handleRefresh" />
      <div class="text">
        {{ userStore.selectLanguage === 'en-US' ? 'refreshAuth' : '刷新权限' }}
      </div>
    </div>
    <div
      class="background-settings"
      @mouseover="SettingType = 'bold'"
      @mouseleave="SettingType = 'light'"
    >
      <a class="_">
        <PhFadersHorizontal class="icon" :weight="SettingType" @click="handleSelfEdit" />
      </a>
    </div>

    <article>
      <div class="profile-photo">
        <button class="avatar" @click="triggerUpload(isEdit)" :class="{ active: isEdit }">
          <img :src="userInfo.avatar" />
        </button>
        <input type="file" ref="avatarInput" @change="handleAvatarChange" style="display: none" />
        <div class="button button-edit">
          <ph-note-pencil class="icon_avatar" v-show="!isEdit" @click="isEdit = true" />
          <ph-check-circle class="icon_avatar" v-show="isEdit" @click="handleSave" />
        </div>
        <div class="button button-cancel" :class="{ active: isEdit }">
          <ph-receipt-x class="icon_cancel" v-show="isEdit" @click="handleCancel" />
        </div>
      </div>
      <div class="profile-info">
        <h1 class="profile_username">
          <flexInput v-model:text="userInfo.username" placeholder="username" :status="isEdit" />
        </h1>
        <a class="profile_email">
          <flexInput v-model:text="userInfo.email" placeholder="email" :status="isEdit" />
        </a>
        <p>
          <flexInput
            v-model:text="userInfo.description"
            placeholder="there is nothing here, it's empty"
            :status="isEdit"
          />
        </p>
      </div>
      <div class="dash" :class="{ online: isOnline }"></div>
      <div class="profile-content">
        <!-- 好友列表 -->
        <div class="friend-list">
          <TransitionGroup tag="ul">
            <li v-for="friend in friends" :key="friend.id" :class="{ online: friend.isOnline }">
              <div class="friend-card" @click="handleFriends">
                <div class="friend-avatar">
                  <img :src="friend.avatar" />
                </div>
                <div class="friend-info">
                  <h4>{{ friend.username }}</h4>
                  <p>{{ friend.email }}</p>
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
                    active: diary.id === userPreferences.lastReadDiaryId
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
  margin: 0 auto;
  width: 92%;
  height: 100%;
  padding: 40px;
  background-color: rgb(251 248 242 / 42%);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.08);
  position: relative;
}
.authRefresh {
  position: absolute;
  top: 1.3em;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon {
    cursor: pointer;
    transition: color 0.25s ease;
    font-size: 1.7em;
    color: var(--c-gray-500);
    &:hover {
      color: #8fd8b6;
    }
  }
  .text {
    font-size: 1rem;
    color: $sucColor;
    opacity: 0;
    user-select: none;
    cursor: auto;
    transition: all 0.25s ease;
  }
  &.refreshing {
    .icon {
      cursor: progress;
      color: #8fd8b6;
      animation: spin 1s linear infinite;
    }
  }
  & .icon:hover + .text {
    opacity: 1;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
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
    font-size: 1.6em;
    color: var(--c-gray-500);
  }
  ._ {
    &:active .icon {
      color: #8fd8b6;
    }
  }

  &:hover {
    .icon {
      font-size: 1.66em;
    }
    border-color: #1dc779ad;
  }
}

article {
  display: block;
  width: auto;
  height: auto;
  padding: 50px 0;
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
        height: 100%;
        object-fit: cover;
        object-position: top;
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
  .dash {
    margin-top: 1rem;
    height: 2px;
    width: 100%;
    background-color: var(--primary-light);
    &.online {
      background-color: $onlineColor;
    }
  }
  .profile-content {
    display: grid;
    grid-template-columns: 1fr 4fr;
    gap: 1rem;
    justify-content: space-around;

    @media screen and (max-width: 630px) {
      grid-template-columns: 1fr;
      justify-items: center;
    }

    & > * {
      max-height: 80vh;
    }

    .friend-list {
      // min-height: 3rem;
      padding: 3rem;
      padding-top: 0;
      margin-top: 2rem;
      width: 26rem;
      overflow-y: scroll;
      user-select: none;
      &::-webkit-scrollbar {
        width: 2px;
        height: 2px;
      }
      &::-webkit-scrollbar-thumb {
        background: #2dd806;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-track {
        background: #f0dde6;
        border-radius: 10px;
      }
      ul {
        padding: 0;
      }
      li {
        list-style: none;
        transition: all 0.25s;
        border-radius: 10px;
        overflow: hidden;
        margin-top: 1rem;

        .friend-card {
          display: grid;
          align-items: center;
          grid-template-columns: 5rem 11.3rem 2.7rem;
          column-gap: 0.5rem;
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
          transition: all 0.25s;

          box-shadow: 0 0 0.5rem #babbbc;
          border: 2px solid #fafafa;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
            transition: transform 0.25s;
          }
          &:hover {
            box-shadow:
              $shadow,
              $inner-shadow,
              0 0 20px #9fabc3b9;
            border-color: transparent;

            img {
              transform: scale(1.08);
            }
          }
        }
        .friend-info {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;
          & > * {
            overflow: hidden;
            text-overflow: ellipsis;
          }
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
          filter: opacity(1);

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
        filter: opacity(0.8);
        &.online {
          filter: opacity(1);
          .friend-card {
            border-bottom: 3px solid $onlineColor;

            .friend-avatar:hover {
              box-shadow:
                $shadow,
                $inner-shadow,
                0 0 20px #fb74a86e;
            }
          }
          &:hover {
            box-shadow:
              0 0 20px rgba(105, 206, 219, 0.31),
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
        }

        &:not(:last-child) {
          margin-bottom: 1em;
        }
      }
    }

    .diary-list {
      align-self: flex-start;
      margin-top: 1.8rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;

      overflow-y: scroll;
      user-select: none;
      &::-webkit-scrollbar {
        width: 2px;
        height: 2px;
      }
      &::-webkit-scrollbar-thumb {
        background: #35f01c;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-track {
        background: #f5dada;
        border-radius: 10px;
      }
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
