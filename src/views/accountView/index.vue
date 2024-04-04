<script setup>
import { useUserStore, useDiaryStore } from '@/stores'
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const diaryStore = useDiaryStore()
const { userDiary, userInfo } = storeToRefs(userStore)
let originalUserInfo = JSON.parse(JSON.stringify(userInfo.value))
const diaries = computed(() => diaryStore.getDiaries(userInfo.value.username))
onMounted(() => {
  userStore.updateUserInfo(userInfo.value.username)
})
import { gsap } from 'gsap'

// user Info edit
const avatarInput = ref(null)
const isEdit = ref(false)
import { uploadImgAPI } from '@/api/fundamental'
// 触发文件选择
const triggerUpload = () => {
  if (!isEdit.value) return
  avatarInput.value.click() // 打开文件选择对话框
  // 使用GSAP添加一些动画，例如按钮点击反馈
  gsap.to(avatarInput.value, {
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
const handleSave = () => {
  isEdit.value = false
  if (JSON.stringify(originalUserInfo) === JSON.stringify(userInfo.value))
    return
  if (userStore.saveUserInfo()) {
    originalUserInfo = JSON.parse(JSON.stringify(userInfo.value))
  }
}

// friends system
import {
  PhNotePencil,
  PhCheckCircle,
  PhSlidersHorizontal
} from '@phosphor-icons/vue'
import { messageManager } from '@/directives/index'
const handleFriends = () => {
  messageManager.showConfirmModal('The friend system is developing ...', {
    mask: false,
    pressTime: 60,
    draggable: true
  })
}
const handleClick = (diaryId) => {
  messageManager.showDiaryEditModal(diaryId)
}

import calendar from '@/components/modules/YearCalendar.vue'
</script>
<template>
  <div class="pfl-wrapper">
    <article>
      <div class="profile-photo">
        <button
          class="avatar"
          @click="triggerUpload"
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
        <div class="button-edit">
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
            placeholder="description"
            :status="isEdit"
          />
        </p>
      </div>
      <div class="profile-content">
        <div class="friend-list">
          <TransitionGroup tag="ul">
            <li v-for="friend in userInfo.friends" :key="friend.id">
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
        <div class="diary-list">
          <div class="tile" v-for="diary in diaries" :key="diary.id">
            <div class="inner" @click="handleClick(diary.id)">
              <figure>
                <img :src="diary.cover" />
                <figcaption
                  :class="{
                    active: diary.id === userDiary.lastReadDiaryId
                  }"
                >
                  {{ diary.title }}
                </figcaption>
              </figure>
              <h4>{{ diary.description }}</h4>
            </div>
          </div>
        </div>
      </div>
    </article>
    <calendar class="calendar-record" />
  </div>
</template>
<style lang="scss" scoped>
.pfl-wrapper {
  width: 100%;
  height: 100%;
  padding: 40px;
  background-color: var(--c-gray-100);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.08);
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

    .button-edit {
      position: absolute;
      right: -2em;
      bottom: -1.2em;
      font-size: 1.3em;
      z-index: 100;
      cursor: pointer;
      transition: color 0.25s;
      &:hover {
        color: var(--primary);
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
.calendar-record {
  margin: 0 auto;
}
</style>
