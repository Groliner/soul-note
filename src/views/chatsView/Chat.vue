<!--
 * @Author: Gro lin
 * @Date: 2024-08-31 17:54:31
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-09-05 22:57:36
-->
<script setup>
import avatar from '@/assets/music/光芒.jpg'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { formatTimeToSecond } from '@/composables/formatTime'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
gsap.registerPlugin(ScrollToPlugin)
const chatWindowMessage = ref('')
const chatThread = ref(null)
const sendChannelOpen = ref(true)
const chatBox = ref([
  {
    id: 1,
    content:
      'ewjgroiejjeoiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热',
    type: 'text',
    origin: 'server',

    avatar: avatar,
    time: formatTimeToSecond(Date.now())
  },
  {
    id: 2,
    content:
      'ewjgroiejjeoiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热',
    type: 'text',
    origin: 'server',

    avatar: avatar,
    time: formatTimeToSecond(Date.now())
  },
  {
    id: 2,
    content:
      'ewjgroiejjeewjgroiejjeoiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热ewjgroiejjeoiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热oiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热',
    type: 'text',
    origin: 'server',

    avatar: avatar,
    time: formatTimeToSecond(Date.now())
  },
  {
    id: 2,
    content:
      'ewjgroiejjeewjgroiejjeoiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热ewjgroiejjeoiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热oiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热',
    type: 'text',
    origin: 'server',

    avatar: avatar,
    time: formatTimeToSecond(Date.now())
  },
  {
    id: 2,
    content:
      'ewjgroiejjeewjgroiejjeoiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热ewjgroiejjeoiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热oiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热',
    type: 'text',
    origin: 'server',
    avatar: avatar,
    time: formatTimeToSecond(Date.now())
  },
  {
    id: 2,
    content:
      'ewjgroiejjeewjgroiejjeoiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热ewjgroiejjeoiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南ewjgroiejjeewjgroiejjeoiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热ewjgroiejjeoiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热oiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热瑞额外后i额外软件欧菲那我i人家额我热oiwjfoewjfoehwtodijoj偶尔u和我欸金融危机南瑞额外后i额外软件欧菲那我i人家额我热',
    type: 'text',
    origin: 'client',
    avatar: avatar,
    time: formatTimeToSecond(Date.now())
  }
])

const handleMessage = (event) => {
  if (event.key && event.key !== 'Enter') return
  chatBox.value.push({
    id: Math.round(Math.random() * 1000),
    content: chatWindowMessage.value,
    origin: Math.round(Math.random()) ? 'server' : 'client',
    type: 'text',
    avatar: avatar,
    time: formatTimeToSecond(Date.now())
  })

  // Clear text value
  chatWindowMessage.value = ''
  gsap.to(chatThread.value, {
    duration: 0.66, // 动画时间，1秒
    scrollTo: {
      y: 'max' // 滚动到元素的最底部
    },
    ease: 'power2' // 平滑效果
  })
}
</script>
<template>
  <div class="chat">
    <ul class="chat-thread" ref="chatThread">
      <li v-for="(chat, index) in chatBox" :key="index">
        <article :class="chat.origin">
          <div class="cover">
            <img :src="chat.avatar" alt="avatar" />
          </div>
          <div class="content">
            <p v-if="chat.type == 'text'">
              {{ chat.content }}
            </p>
            <p v-else-if="chat.type == 'image'">
              <img :src="chat.uri" :alt="chat.content" />
            </p>
            <p v-else-if="chat.type == 'file'">
              <a :href="chat.uri" download>{{ chat.content }}<span>download</span></a>
            </p>
            <span class="time">{{ chat.time }}</span>
          </div>
        </article>
      </li>
    </ul>
    <div class="chat-window">
      <input
        class="chat-window-message"
        v-model="chatWindowMessage"
        :disabled="!sendChannelOpen"
        placeholder="Type a message..."
        @keydown="handleMessage"
      />
      <button class="chat-window-send" :disabled="!sendChannelOpen" @click="handleMessage">
        Send
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
$scrollbar-width: 3px;
$chat-thread-bgd-color: $onlineColor;
$chat-thread-msg-arrow-size: 15px;
$chat-thread-avatar-size: 50px;
$chat-thread-offset: #{$chat-thread-avatar-size + 30px};

::-webkit-scrollbar {
  width: $scrollbar-width;
}

::-webkit-scrollbar-track {
  border-radius: $scrollbar-width;
  background-color: rgba(25, 147, 147, 0.1);
}

::-webkit-scrollbar-thumb {
  border-radius: $scrollbar-width;
  background-color: $chat-thread-bgd-color;
}
.chat {
  width: 77vw;
}
.chat-thread {
  margin: 24px auto 0 auto;
  padding: 0 20px 0 0;
  max-height: 70vh;
  list-style: none;
  overflow-y: scroll;
  overflow-x: hidden;
  li {
    position: relative;
    clear: both;
    display: block;
    padding: 16px 40px 16px 20px;
    article {
      display: flex;
      align-items: center;
      gap: 1.2em;

      .cover {
        align-self: flex-start;
        width: $chat-thread-avatar-size;
        height: $chat-thread-avatar-size;
        border-radius: $chat-thread-avatar-size;
        overflow: hidden;
        img {
          width: 100%;
          object-fit: cover;
          object-position: center;
        }
      }
      .content {
        border-radius: 10px;
        max-width: 66%;
        word-wrap: break-word;
        color: #000000;
        display: flex;
        flex-direction: column;
        gap: 0.4em;
        position: relative;
        p {
          margin-bottom: 0.6em;
          line-height: 1.3em;
        }
        .time {
          font-size: 0.8em;
          color: #000000;
        }
        &:after {
          position: absolute;
          top: $chat-thread-msg-arrow-size;
          content: '';
          width: 0;
          height: 0;
          border-top: $chat-thread-msg-arrow-size solid;
        }
      }
      &.client {
        animation: show-chat-odd 0.15s 1 ease-in;
        -moz-animation: show-chat-odd 0.15s 1 ease-in;
        -webkit-animation: show-chat-odd 0.15s 1 ease-in;
        flex-direction: row-reverse;
        .cover {
          display: none;
        }
        .content {
          padding: 0.66em 0.56em 0.4em 0.66em;

          background-color: rgba(249, 246, 204, 0.258);
          .time {
            align-self: self-start;
            margin-left: 1em;
          }
          &::after {
            border-right: $chat-thread-msg-arrow-size solid transparent;
            right: -$chat-thread-msg-arrow-size;
            border-top-color: rgba(249, 246, 204, 0.258);
          }
        }
      }
      &.server {
        animation: show-chat-even 0.15s 1 ease-in;
        -moz-animation: show-chat-even 0.15s 1 ease-in;
        -webkit-animation: show-chat-even 0.15s 1 ease-in;

        .content {
          padding: 0.66em 0.6em 0.4em 0.56em;

          background-color: rgba(196, 186, 108, 0.2);
          .time {
            margin-right: 1em;
            align-self: self-end;
          }
          &::after {
            border-left: $chat-thread-msg-arrow-size solid transparent;
            left: -$chat-thread-msg-arrow-size;
            border-top-color: rgba(196, 186, 108, 0.2);
          }
        }
      }
    }
  }
}
.chat-window {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 18px;
  display: flex;
  gap: 1rem;
  align-items: center;

  & &-message {
    min-width: 200px;
    max-width: 50vw;
    width: 30rem;
    height: 3rem;
    font:
      32px/48px 'Noto Sans',
      sans-serif;
    background: rgba(242, 234, 234, 0.49);
    color: #0ad5c1;
    border: 0;
    border-radius: 10px;
    border-bottom: 1px solid $chat-thread-bgd-color;
    outline: none;
  }
  & &-send {
    width: 5rem;
    height: 3rem;
    font:
      16px/48px 'Noto Sans',
      sans-serif;
    background: rgba(251, 222, 166, 0.463);
    transition: all 0.3s ease;
    color: #adadad;
    border: 0;
    border-radius: 10px;
    outline: none;
    cursor: pointer;
    &:hover {
      background: #0ad5c1;
      color: black;
    }
  }
}

// A tiny bit responsive...
// --------------------------------------
/* Small screens */
// @media all and (max-width: 767px) {
//   .chat-thread {
//     width: 90%;
//     height: 260px;
//   }

//   .chat-window {
//     left: 5%;
//     width: 90%;
//   }
// }

// /* Medium and large screens */
// @media all and (min-width: 768px) {
//   .chat-thread {
//     width: 50%;
//     height: 320px;
//   }

//   .chat-window {
//     left: 25%;
//     width: 50%;
//   }
// }

// Animation
// --------------------------------------
@keyframes show-chat-even {
  0% {
    margin-left: -480px;
  }
  100% {
    margin-left: 0;
  }
}

@-moz-keyframes show-chat-even {
  0% {
    margin-left: -480px;
  }
  100% {
    margin-left: 0;
  }
}

@-webkit-keyframes show-chat-even {
  0% {
    margin-left: -480px;
  }
  100% {
    margin-left: 0;
  }
}

@keyframes show-chat-odd {
  0% {
    margin-right: -480px;
  }
  100% {
    margin-right: 0;
  }
}

@-moz-keyframes show-chat-odd {
  0% {
    margin-right: -480px;
  }
  100% {
    margin-right: 0;
  }
}

@-webkit-keyframes show-chat-odd {
  0% {
    margin-right: -480px;
  }
  100% {
    margin-right: 0;
  }
}
</style>
