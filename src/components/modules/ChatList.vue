<!--
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2025-01-30 10:51:51
-->
<script setup>
import { useContactsStore, useChatStore } from '@/stores'
import { PhSlidersHorizontal, PhMagnifyingGlassPlus } from '@phosphor-icons/vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
const contactsStore = useContactsStore()
const chatStore = useChatStore()

const props = defineProps({
  chatOrientation: Number
})
const chatLists = computed(() => {
  const lists = contactsStore.getChatLists(props.chatOrientation)
  return lists
})
const { chatId } = storeToRefs(chatStore)
const emit = defineEmits(['chatChange'])

// 好友列表动画
const handleFriends = (id) => {
  // const text = messageStore.accountConstant['DEVELOP_FRIEND_SYSTEM']
  // const res = messageManager.showConfirmModal(text, {
  //   mask: false,
  //   pressTime: 60,
  //   draggable: true
  // })
  // console.log(res)
  chatStore.setChatId(id)
  emit('chatChange', id)
}
</script>
<template>
  <!-- chat列表 -->
  <div class="chat-list">
    <TransitionGroup tag="ul">
      <li v-for="chat in chatLists" :key="chat.id" :class="{ chatting: chatId == chat.id }">
        <div class="chat-card" @click="handleFriends(chat.id)" v-if="chatOrientation == 0">
          <div class="chat-avatar">
            <img :src="chat.avatar" />
          </div>
          <div class="chat-info">
            <h4>{{ chat.nickname || chat.username }}</h4>
            <p>{{ chat.email }}</p>
          </div>
          <a class="options"><ph-sliders-horizontal class="icon" /></a>
        </div>
        <div class="chat-card" @click="handleFriends(chat.id)" v-else>
          <div class="chat-avatar">
            <img :src="chat.avatar" />
          </div>
          <div class="chat-info">
            <h4>{{ chat.name }}</h4>
            <p>{{ chat.description }}</p>
          </div>
          <a class="options"><ph-sliders-horizontal class="icon" /></a>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>
<style lang="scss" scoped>
.chat-list {
  // min-height: 3rem;
  padding-top: 0;
  overflow-y: scroll;
  user-select: none;
  padding: 0 0.6rem 0 0.3rem;
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
    width: 20rem;
  }
  li {
    list-style: none;
    transition: all 0.25s;
    border-radius: 10px;
    overflow: hidden;

    .chat-card {
      display: grid;
      align-items: center;
      grid-template-columns: 5rem 11.3rem 2.7rem;
      column-gap: 0.5rem;
      border-bottom: 4px solid var(--c-gray-400);
      cursor: pointer;
    }
    .chat-avatar {
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
    .chat-info {
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
    &.chatting {
      filter: opacity(1);
      .chat-card {
        border-bottom: 3px solid $chattingColor;

        .chat-avatar:hover {
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
</style>
