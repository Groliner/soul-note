<!--
 * @Author: Gro lin
 * @Date: 2024-08-31 17:54:31
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-09-11 17:47:38
-->
<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { formatTimeToSecond } from '@/composables/formatTime'
import { PhPaperclip, PhTrash, PhArrowCircleDown, PhSpinnerGap } from '@phosphor-icons/vue'
import { useChatStore, useUserStore, useMessageStore } from '@/stores'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
import { storeToRefs } from 'pinia'
gsap.registerPlugin(ScrollToPlugin)
const chatWindowMessage = ref('')
const chatThread = ref(null)
const attachFilesNameLength = 12
const chatStore = useChatStore()
const userStore = useUserStore()
const messageStore = useMessageStore()

const { chatBox, chatId, isConnected } = storeToRefs(chatStore)
const receiveUserInfo = computed(() => userStore.getUserInfoById(chatId.value))
// import sakura_cover from '@/assets/music/桜咲く.jpg'
// import light_cover from '@/assets/music/光芒.jpg'
// import light from '@/assets/music/光芒.ogg'
// import rimless_cover from '@/assets/music/Rimless ～无边的世界～.jpg'
// import big from '@/assets/images/Snipaste_2024-08-31_09-56-14.png'
// chatBox.value.push({
//   id: '5e576650-7c14-4f74-8da4-3518aa188ae3',
//   receiveId: 79,
//   sendId: 79,
//   isSelf: true,
//   type: 'file',
//   content: '哈哈哈哈哈哈哈哈',
//   time: '2024-09-09 22:04:51',
//   status: 'sent',
//   isPinned: false,
//   isChannel: false,
//   fileNames: ['Iroha Isshiki [Oregairu].jpg', '下载 (3).jpg', '雪之下雪乃.jpg'],
//   fileNameUriMapList: [
//     {
//       name: 'Iroha Isshiki [Oregairu].jpg',
//       uri: sakura_cover
//     },
//     {
//       name: '下载 (3).jpg',
//       uri: light_cover
//     },
//     {
//       name: '雪之下雪乃.ogg',
//       uri: light
//     },
//     {
//       name: '雪之下.ogg',
//       uri: light
//     },
//     {
//       name: '雪.png',
//       uri: big
//     },
//     {
//       name: '雪之下雪乃.jpg',
//       uri: rimless_cover
//     }
//   ]
// })
const canGetMoreMessages = ref(true)
const isGettingMoreMessages = ref(false)
const handleMessage = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    // 阻止默认换行行为并执行发送操作
    event.preventDefault()
    sendMessage()
    // 这里可以放入消息发送逻辑
  } else if (event.key === 'Enter' && event.shiftKey) {
    event.preventDefault()
    // Shift + Enter 让它换行
    chatWindowMessage.value += '\n'
    nextTick(() => {
      autoExpand(event)
    })
  }
}
const autoExpand = (event) => {
  const target = event.target
  target.style.height = 'auto' // 先将高度设为自动，清除之前的高度
  target.style.height = Math.min(target.scrollHeight + 1.2, window.innerHeight * 0.2) + 'px'
  target.scrollTop = target.scrollHeight
}
import { v4 as uuidv4 } from 'uuid'
import { ElMessage } from 'element-plus'
const sendMessage = () => {
  // 检查是否有输入
  if (chatWindowMessage.value.length === 0 && attachedFiles.value.length === 0) return

  // 构造基础消息
  const message = {
    id: uuidv4(),
    receiveId: chatId.value,
    sendId: userStore.userInfo.id,
    isSelf: true,
    type: attachedFiles.value.length > 0 ? 'file' : 'text',
    content: chatWindowMessage.value,
    time: formatTimeToSecond(new Date()),
    status: 'sending',
    isPinned: false,
    isChannel: false,
    fileNames: [] // 初始化文件数组
  }

  // 计算文件大小并检查
  const totalFileSize = attachedFiles.value.reduce((total, file) => total + file.size, 0)
  if (attachedFiles.value.length > 0 && totalFileSize / 1024 / 1024 > 10) {
    ElMessage({
      message: messageStore.chatConstant['SEND_OVER_SIZE_WARRING'],
      type: 'warning',
      grouping: true
    })
    return
  }

  // 如果是文件消息，处理文件
  if (attachedFiles.value.length > 0) {
    const formData = new FormData()

    attachedFiles.value.forEach((file) => {
      message.fileNames.push(file.name) // 将文件名保存到消息对象
      formData.append('fileContents', file)
    })
    formData.append('id', message.id)
    formData.append('receiveId', message.receiveId)
    formData.append('isChannel', message.isChannel)
    chatStore.sendFiles(message, formData) // 发送文件消息
    attachedFiles.value = [] // 发送后清空文件
  } else {
    // 文本消息处理
    chatStore.sendMessage(message) // 发送文本消息
  }

  // 清空输入框
  chatWindowMessage.value = ''

  // 处理界面更新
  nextTick(() => {
    scrollToBottom(chatThread.value)
    autoExpand({ target: document.querySelector('.chat-message') })
  })
}

onMounted(() => {
  const chat_thread = document.querySelector('.chat-thread')
  chat_thread.addEventListener('scroll', checkScrollPosition)
  // 在刷新页面此处滚动条并没有渲染出来，作用在视图切换
  // scrollToBottom(chat_thread)
  checkScrollPosition()

  // focusChatFunction() // 是否添加这个功能有待商榷。默认只有用户点击输入框才会聚焦
})
onUnmounted(() => {
  const chat_thread = document.querySelector('.chat-thread')
  chat_thread.removeEventListener('scroll', checkScrollPosition)
})

const scrollToBottom = (target) => {
  // console.log(target)
  gsap.to(target, {
    scrollTo: {
      y: 'max',
      ease: 'power1',
      duration: 0.2
    }
  })
}
const checkScrollPosition = () => {
  const chatThread = document.querySelector('.chat-thread')
  // console.log(
  //   Math.floor(chatThread.scrollHeight - chatThread.scrollTop) - 10,
  //   Math.floor(chatThread.clientHeight)
  // )
  const isAtBottom =
    Math.floor(chatThread.scrollHeight - chatThread.scrollTop) - 10 <
    Math.floor(chatThread.clientHeight)
  if (!isAtBottom) {
    document.querySelector('.gotoBottom').classList.add('active')
  } else {
    document.querySelector('.gotoBottom').classList.remove('active')
  }
}
watch(chatBox, () => {
  nextTick(() => {
    checkScrollPosition()
  })
  canGetMoreMessages.value = true
})
const focusChatFunction = () => {
  const chat = document.getElementsByClassName('chat')[0]
  chat.addEventListener('click', () => {
    chat.classList.add('focused')
  })
  document.addEventListener('click', (event) => {
    if (!chat.contains(event.target)) {
      chat.classList.remove('focused')
    }
  })
}

const attachmentInput = ref(null)
const attachedFiles = ref([])
const fileCount = computed(() => attachedFiles.value.length)
const filesSize = computed(() => {
  const size = attachedFiles.value.reduce((total, file) => total + file.size, 0)

  return size / 1024 / 1024 < 0.01
    ? (size / 1024).toFixed(2) + 'KB'
    : (size / 1024 / 1024).toFixed(2) + 'MB'
})
let draggedItemIndex = null

const triggerAttachment = () => {
  attachmentInput.value.click()
}
const handleAttachmentChange = (event) => {
  const files = event.target.files
  if (files.length > 0) {
    attachedFiles.value.push(...files) // 保存用户选择的文件
  }
}
const handleDropFile = (index) => {
  attachedFiles.value.splice(index, 1)
}

const getMoreMessages = () => {
  if (canGetMoreMessages.value && !isGettingMoreMessages.value) {
    isGettingMoreMessages.value = true

    const time = chatBox.value[0]?.time
    chatStore.getChatMessages(chatId.value, time).then((res) => {
      isGettingMoreMessages.value = false
      canGetMoreMessages.value = res
    })
  }
}

// 提取文件名（不包括后缀）
function truncatedFileName(fileName) {
  const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'))
  if (nameWithoutExtension.length > attachFilesNameLength) {
    return nameWithoutExtension.substring(0, attachFilesNameLength) + '...'
  }
  return nameWithoutExtension
}
// 提取文件的后缀
function fileExtension(fileName) {
  return fileName.substring(fileName.lastIndexOf('.'))
}
function isImage(uri) {
  // 检查文件后缀名是否为图片类型
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg']
  const fileExtension = uri.split('.').pop().toLowerCase()
  return imageExtensions.includes(fileExtension)
}
function onDragStart(index) {
  console.log(index)
  draggedItemIndex = index
}
// 处理放置事件
function onDrop(index) {
  if (draggedItemIndex !== null) {
    // 将元素从原来的位置移除并插入到目标位置
    const draggedItem = attachedFiles.value[draggedItemIndex]
    attachedFiles.value.splice(draggedItemIndex, 1) // 移除原位置元素
    attachedFiles.value.splice(index, 0, draggedItem) // 插入到新的位置
    draggedItemIndex = null // 重置拖拽索引
  }
}
</script>
<template>
  <div class="chat">
    <h2 class="chat-name">{{ receiveUserInfo.username }}</h2>
    <ul class="chat-thread" ref="chatThread">
      <li v-if="canGetMoreMessages" @click="getMoreMessages" class="get-more-messages">
        <div class="icon-wrapper" :class="{ gettingMessages: isGettingMoreMessages }">
          <PhSpinnerGap class="icon" weight="bold" />
          <span class="text">Get more messages</span>
        </div>
      </li>
      <li v-for="(chat, index) in chatBox" :key="index">
        <article :class="chat.isSelf ? 'client' : 'server'">
          <div class="cover">
            <img :src="receiveUserInfo.avatar" :alt="receiveUserInfo.username" />
          </div>
          <div class="context">
            <p class="content">
              {{ chat.content }}
            </p>
            <div class="attach-file">
              <div
                v-for="({ name, uri }, index) in chat.fileNameUriMapList"
                :key="index"
                :class="isImage(name) ? 'image' : 'file'"
              >
                <img v-if="isImage(name)" :src="uri" :alt="name" />
                <a v-else :href="uri" target="_blank">{{ name }}</a>
              </div>
            </div>
            <span class="time">{{ chat.time }}</span>
          </div>
        </article>
      </li>
    </ul>
    <div class="chat-window">
      <div class="gotoBottom">
        <PhArrowCircleDown class="icon" weight="light" @click="scrollToBottom(chatThread)" />
      </div>

      <div class="chat-wrapper">
        <div class="chat-attach">
          <PhPaperclip class="icon" @click="triggerAttachment" />
          <div :class="{ text: fileCount < 1 }" class="file-count-badge">{{ fileCount }}</div>
          <input
            type="file"
            ref="attachmentInput"
            @change="handleAttachmentChange"
            style="display: none"
            multiple
          />
        </div>
        <textarea
          class="chat-message"
          :class="{ online: isConnected }"
          v-model="chatWindowMessage"
          :disabled="!isConnected"
          placeholder="Type a message..."
          @keydown="handleMessage"
          @input="autoExpand"
          rows="1"
        />
        <button class="chat-send" :disabled="!isConnected" @click="sendMessage">Send</button>
      </div>
    </div>
    <div v-if="attachedFiles.length > 0" class="chat-attachment">
      <div class="caption">
        <h4>
          {{ userStore.selectLanguage === 'en-US' ? 'Attached Files:' : '附件：' }}
        </h4>
        <span class="total-size">{{ filesSize }}</span>
      </div>
      <ul class="attachment-list">
        <li
          v-for="(file, index) in attachedFiles"
          :key="index"
          draggable="true"
          @dragstart="onDragStart(index)"
          @dragover.prevent
          @drop="onDrop(index)"
        >
          <p class="attachment-name" :title="file.name">
            {{ truncatedFileName(file.name) }}
            <span class="extension">{{ fileExtension(file.name) }}</span>
          </p>
          <div class="attachment-suffix">
            <ph-trash class="icon" alt="delete" @click="handleDropFile(index)" />

            <span class="size"
              >({{
                file.size / 1024 / 1024 < 0.01
                  ? (file.size / 1024).toFixed(2) + 'KB'
                  : (file.size / 1024 / 1024).toFixed(2) + 'MB'
              }})</span
            >
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" scoped>
$scrollbar-width: 3px;
$chat-thread-bgd-color: $onlineColor;
$chat-thread-msg-arrow-size: 15px;
$chat-thread-avatar-size: 50px;

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
  border-radius: 7px;
  position: relative;
  // box-shadow: 0 0 10px rgba(25, 245, 98, 0.3); /* 添加阴影效果 */
  &:focus-within {
    box-shadow: 0px 3px 5px rgba(123, 238, 232, 0.3); /* 添加阴影效果 */
  }
  &.focused {
    box-shadow: 0px 3px 5px rgba(123, 238, 232, 0.3); /* 添加阴影效果 */
  }
}
.chat-name {
  width: 74%;
  font-size: 1.5em;
  font-weight: 100;
  word-spacing: 5px;
  position: absolute;
  top: 0;
  text-align: center;
  transform: translateY(-110%) translateX(17.56%);
}
.chat-thread {
  padding: 0 20px 0 0;
  height: 78vh;
  width: 100%;
  list-style: none;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;

  li {
    position: relative;
    clear: both;
    display: block;
    padding: 16px 40px 16px 20px;
    &.get-more-messages {
      text-align: center;
      .icon-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &.gettingMessages {
          .icon {
            transform: scale(1.2);
            color: $onlineColor;
            animation: rotate 1s linear infinite;
          }
          .text {
            opacity: 0;
          }
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        }
        & > * {
          transition: all 0.23s ease;
        }
        .icon {
          width: 1rem;
          height: 1rem;
        }
        .text {
          font-size: 0.7rem;
        }
        &:hover {
          .icon,
          .text {
            color: $onlineColor;
          }
          .text {
            text-decoration: underline;
          }
        }
      }
    }

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
      .context {
        border-radius: 10px;
        max-width: 53%;
        min-width: 200px;
        word-wrap: break-word;
        white-space: pre-wrap;
        letter-spacing: normal;
        color: #000000;
        display: flex;
        flex-direction: column;
        gap: 0.4em;
        position: relative;
        .content {
          margin-bottom: 0.6em;
          line-height: 1.3em;
        }
        .attach-file {
          display: flex;
          gap: 0.2em;
          flex-direction: column;
          .file {
            order: 1;
            width: 100%;
            a {
              color: #000000;
              text-decoration: none;
              &:hover {
                color: var(--primary-dark);
                text-decoration: underline;
              }
            }
          }
          .image {
            order: 0;
            max-width: 15rem;
            border-radius: 8px;
            overflow: hidden;
            img {
              max-width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center;
            }
          }
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
        .context {
          padding: 0.66em 0.56em 0.4em 0.66em;

          background-color: $chatClientBgColor;
          .time {
            align-self: self-start;
            margin-left: 1em;
          }
          &::after {
            border-right: $chat-thread-msg-arrow-size solid transparent;
            right: -$chat-thread-msg-arrow-size;
            border-top-color: $chatClientBgColor;
          }
        }
      }
      &.server {
        animation: show-chat-even 0.15s 1 ease-in;
        -moz-animation: show-chat-even 0.15s 1 ease-in;
        -webkit-animation: show-chat-even 0.15s 1 ease-in;

        .context {
          padding: 0.66em 0.6em 0.4em 0.56em;

          background-color: $chatServerBgColor;
          .time {
            margin-right: 1em;
            align-self: self-end;
          }
          &::after {
            border-left: $chat-thread-msg-arrow-size solid transparent;
            left: -$chat-thread-msg-arrow-size;
            border-top-color: $chatServerBgColor;
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
  bottom: 55px;

  background-color: $chatInputBgColor;
  border-radius: 10px;
  .gotoBottom {
    position: absolute;
    top: -2rem;
    left: 50%;
    transform: translateX(-0.975rem);
    display: none;
    width: 1.95rem;
    height: 1.95rem;
    color: #000000;
    cursor: pointer;
    z-index: 100;
    transition: background 0.23s ease;
    background-color: rgba(240, 248, 255, 0.542);
    border-radius: 50%;
    &:hover {
      background-color: aliceblue;
    }
    .icon {
      width: 100%;
      height: 100%;
    }
    &.active {
      display: block;
    }
  }
  .chat-wrapper {
    display: flex;
    gap: 0.7rem;
    align-items: flex-end;
    padding: 0.375rem;
    .chat-attach {
      background: rgba(242, 234, 234, 0.49);
      border: 0;
      border-radius: 10px;
      width: 3rem;
      height: 3rem;
      text-align: center;
      position: relative;

      .icon {
        cursor: pointer;
        width: 1.7rem;
        height: 3rem;
        color: $chatInputTextColor;
        &:hover + .text {
          opacity: 1;
        }
      }
      .text {
        opacity: 0;
      }
      .file-count-badge {
        background-color: rgba(222, 34, 34, 0.942);
        color: #f2e8e8;
        border-radius: 50%;
        padding: 0.1rem 0.2rem;
        font-size: 0.6rem;
        line-height: 0.6rem;
        position: absolute;
        bottom: 0px;
        right: 1px;
      }
    }
    .chat-message {
      min-width: 200px;
      max-width: 50vw;
      width: 34rem;
      max-height: 20vh;
      height: 3rem;
      min-height: 3rem;
      resize: none;
      font-family: inherit;
      font-size: 1rem;
      line-height: 1.5rem;
      padding: 0.6rem 0.5rem;
      background: rgba(242, 234, 234, 0.49);
      color: $chatInputTextColor;
      border: 0;
      border-radius: 10px;
      outline: none;
      overflow-y: auto;
      &.online {
        border-bottom: 1.66px solid $chat-thread-bgd-color;
      }
    }
    .chat-send {
      width: 5rem;
      height: 3rem;
      font-family: inherit;
      font-size: 1rem;
      line-height: 1.5rem;
      background: rgba(251, 222, 166, 0.463);
      transition: all 0.3s ease;
      color: #adadad;
      border: 0;
      border-radius: 10px;
      outline: none;
      cursor: pointer;
      &:hover {
        background: #18ead5;
        color: black;
      }
    }
  }
}
.chat-attachment {
  z-index: 100;
  position: fixed;
  left: 1rem;
  top: 10vh;
  width: fit-content;
  max-height: 70vh;
  .caption {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  .attachment-list {
    width: fit-content;
    // direction: rtl;
    overflow-y: auto;
    max-height: 65vh;
    list-style: none;
    padding: 0;
    min-width: 12.7rem;
    li {
      transition: all 0.23s ease;
      cursor: all-scroll;
      &:hover {
        background-color: $chatInputBgColor;
      }
      .attachment-name {
        transition: all 0.23s ease;
        cursor: default;
        white-space: nowrap;
        font-size: 1.3rem;
        line-height: 1.22rem;
        color: var(--c-gray-600);
        .extension {
          white-space: nowrap;
        }
        &:hover {
          color: #724b21;
        }
      }
      .attachment-suffix {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .size {
          font-size: 1.2rem;
        }
        .icon {
          height: 1.2rem;
          width: auto;
          cursor: pointer;
          &:hover {
            color: brown;
          }
        }
      }
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
    transform: translateX(-480px);
  }
  100% {
    transform: translateX(0);
  }
}

@-moz-keyframes show-chat-even {
  0% {
    transform: translateX(-480px);
  }
  100% {
    transform: translateX(0);
  }
}

@-webkit-keyframes show-chat-even {
  0% {
    transform: translateX(-480px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes show-chat-odd {
  0% {
    transform: translateX(480px);
  }
  100% {
    transform: translateX(0);
  }
}

@-moz-keyframes show-chat-odd {
  0% {
    transform: translateX(480px);
  }
  100% {
    transform: translateX(0);
  }
}

@-webkit-keyframes show-chat-odd {
  0% {
    transform: translateX(480px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
