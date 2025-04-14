<!--
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2025-03-28 15:27:58
-->
<script setup>
import { onMounted, ref, watch, useTemplateRef, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { PhArrowSquareRight, PhMagnifyingGlass } from '@phosphor-icons/vue'
import chatBox from './Chat.vue'
import gsap from 'gsap'
import {
  useChatStore,
  useUserStore,
  useContactsStore,
  useConstantStore
} from '@/stores'
const chatStore = useChatStore()
const userStore = useUserStore()
const contactsStore = useContactsStore()

const constantStore = useConstantStore()
const { chatConstant } = storeToRefs(constantStore)

// 实现联系列表的动画
const isShowChatList = ref(true)
watch(isShowChatList, (newVal) => {
  if (newVal) {
    gsap.fromTo(
      '.chat-list-container',
      { width: 0 },
      { width: '22rem', ease: 'Expo.easeOut', duration: 0.5 }
    )
  } else {
    gsap.to('.chat-list-container', {
      width: 0,
      ease: 'Expo.easeOut',
      duration: 0.5
    })
  }
})
const handleSwitchToFollowings = () => {
  chatOrientation.value = 0
}
const handleSwitchToGroups = () => {
  chatOrientation.value = 1
}
const handleFindChat = () => {}
const chatOrientation = ref(0)

const isSearchActive = ref(false)
const searchWrapperRef = useTemplateRef('searchWrapper')
const searchContent = ref('')
const searchToggle = (event) => {
  chatOrientation.value = 2
  if (!isSearchActive.value && searchContent.value.length > 0) {
    handleFindChat()
  }
  isSearchActive.value = true
}
// 点击外部触发关闭搜索框的逻辑
const handleClickOutside = (event) => {
  if (
    !searchWrapperRef.value ||
    searchWrapperRef.value.contains(event.target)
  ) {
    return
  }
  isSearchActive.value = false
}

const handleChatChange = (id) => {}

// 页面加载时监听点击事件
onMounted(() => {
  contactsStore.init().then((res) => {
    chatStore.init()
  })
  document.addEventListener('click', handleClickOutside)
})

// 在组件卸载时移除监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<template>
  <div class="container-chat">
    <div class="chat-box-wrapper">
      <chatBox :chatOrientation="chatOrientation" class="chat-box"></chatBox>
    </div>
    <div class="chat-list-container">
      <div class="chat-list-wrapper">
        <chatList
          :chatOrientation="chatOrientation"
          @chatChange="handleChatChange"
          class="chat-list"
        ></chatList>

        <div class="switch-button-wrapper">
          <div
            class="follows-wrapper"
            :class="{ zeroWidth: isSearchActive, active: chatOrientation == 0 }"
          >
            <button class="follows" @click="handleSwitchToFollowings">
              {{ userStore.selectLanguage === 'en-US' ? 'follow' : '好友' }}
            </button>
          </div>
          <div
            class="groups-wrapper"
            :class="{ zeroWidth: isSearchActive, active: chatOrientation == 1 }"
          >
            <button class="groups" @click="handleSwitchToGroups">
              {{ userStore.selectLanguage === 'en-US' ? 'groups' : '群组' }}
            </button>
          </div>
          <div
            class="search-wrapper"
            @click="searchToggle"
            :class="{ active: isSearchActive }"
            ref="searchWrapper"
          >
            <input
              v-model="searchContent"
              type="text"
              class="search-input"
              :placeholder="chatConstant['SEARCH_PLACEHOLDER']"
            />
            <button class="search-icon" @click="searchToggle">
              <PhMagnifyingGlass class="icon" weight="bold" />
            </button>
          </div>
        </div>
      </div>
      <div class="side-list-show-button" :class="{ expanded: isShowChatList }">
        <PhArrowSquareRight
          class="icon"
          weight="light"
          @click="isShowChatList = !isShowChatList"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container-chat {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}
.chat-box-wrapper {
  order: 1;
  display: flex;
  width: 100%;
  justify-content: center;
  .chat-box {
    max-width: 77vw;
    width: 91%;
  }
}
.chat-list-container {
  width: 22rem;
  position: relative;

  .side-list-show-button {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%) translateX(100%);
    .icon {
      font-size: 2.5rem;
      cursor: pointer;
      color: black;
      transition: transform 0.3s ease;
      &:hover {
        color: rgb(60, 67, 67);
        background-color: $chatClientBgColor;
      }
    }
    &.expanded {
      .icon {
        transform: rotate(180deg);
      }
    }
  }
}
.chat-list-wrapper {
  order: 0;
  width: 100%;
  overflow: hidden;
  .chat-list {
    height: 70vh;
  }

  .switch-button-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    padding-left: 1.3rem;
    align-items: center;

    .follows-wrapper,
    .groups-wrapper {
      width: 5rem;
      color: black;
      transition: all 0.5s cubic-bezier(0, 0.105, 0.035, 1.57);
      button {
        padding: 0.5rem 1rem;
        border: none;
        background-color: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1.1rem;
        white-space: nowrap;
        &:hover {
          background-color: #98ffe537;
        }
      }
      &.active button {
        background-color: #98ffe66e;
      }
      &.zeroWidth {
        width: 0;
        overflow: hidden;
      }
    }

    .search-wrapper {
      height: 3rem;
      width: 3rem;
      overflow: hidden;
      background: rgba(255, 255, 255, 0);
      border-radius: 6px;
      position: relative;
      transition: all 0.3s ease-in-out;

      .search-input {
        width: 100%;
        height: 2rem;
        padding: 0px 3rem 0 20px;
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 0px;
        background: transparent;
        box-sizing: border-box;
        border: none;
        outline: none;
        font-family: inherit;
        font-size: 1rem;
        font-weight: 400;
        line-height: 20px;
        color: $chatInputTextColor;
        transform: translateY(-50%);
        transition: all 0.3s cubic-bezier(0, 0.105, 0.035, 1.57);
        transition-delay: 0.3s;
      }
      .search-icon {
        width: 3rem;
        height: 3rem;
        border: none;
        border-radius: 6px;
        background: #fff;
        padding: 0px;
        outline: none;
        position: relative;
        z-index: 2;
        float: right;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        .icon {
          width: 22px;
          height: 22px;
          display: inline-block;
          vertical-align: middle;
          position: relative;
          transform: rotate(90deg);
          transition: all 0.4s cubic-bezier(0.65, -0.6, 0.24, 1.65);
        }
      }
      &.active {
        width: 100%;
        border-radius: 2rem;
        background: $chatInputBgColor_light;
        transition: all 0.5s cubic-bezier(0, 0.105, 0.035, 1.57);
        .search-input {
          opacity: 1;
        }
        .search-icon {
          width: 2rem;
          height: 2rem;
          margin: 0.5rem;
          border-radius: 30px;
          .icon {
            transform: rotate(0deg);
          }
        }
      }
    }
  }
}
</style>
