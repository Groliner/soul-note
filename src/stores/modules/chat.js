/*
 * @Author: Gro lin
 * @Date: 2024-09-07 15:49:55
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-09-11 15:54:51
 */
import { defineStore } from 'pinia'
import { Client } from '@stomp/stompjs'
import { getWebSocketConfiguration, uploadFiles, getMessages, responseMessageAPI } from '@/api/chat'
import { useUserStore } from './user'
import { useMessageStore } from './message'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { formatTimeToSecond } from '@/composables/formatTime'
// {
//   websocketAppDestinationPrefix: '/app'
//   websocketEndpoint: 'soul-note'
//   websocketFile: '/file'
//   websocketQueueBroker: '/queue'
//   webSocketUserBroker: '/user'
//   websocketStompEndpoints: {
//     "system",
//     "user_messageACK",
//     "user_message",
//     "user_error",
//     "group",
//   }
//   websocketText: '/message'
//   websocketTopicBroker: '/topic'
// }
const messageInstance = {
  sendId: null,
  receiveId: null,
  content: 'Hello, how can I help you today?',
  type: 'text',
  isSelf: true,
  avatar: '',
  time: '',
  fileNameUriMapList: [],
  isPinned: false,
  status: 'sending',
  channelId: null
}
export const useChatStore = defineStore(
  'chat',
  () => {
    const configuration = ref({})
    let stompClient = null
    let isConnected = ref(false)
    const chatBoxes = ref([])
    const userStore = useUserStore()
    const messageStore = useMessageStore()
    const chatId = ref(0)
    const init = () => {
      if (userStore.isAuthenticated) {
        if (!stompClient || !isConnected.value) {
          initConfiguration()
          userStore.friends.forEach((item) => {
            getChatMessages(item.id)
          })
        }
      }
    }
    const initConfiguration = () => {
      getWebSocketConfiguration()
        .then((response) => {
          configuration.value = response.data.data
          connectWebSocket()
        })
        .catch((error) => {
          console.log(error)
        })
    }
    // 连接到 WebSocket
    const connectWebSocket = () => {
      stompClient = new Client({
        brokerURL: 'ws://localhost:12345/ws/soul-note', // WebSocket URL
        connectHeaders: {
          // 可以传递连接时的额外信息，如认证信息
          Authorization: userStore.getAccessToken_()
        },
        // debug: (str) => {
        //   console.log(str) // 打印调试信息
        // },
        onConnect: (frame) => {
          console.log('Connected to WebSocket')
          console.log(frame)
          subscribeSystem()
          subscribeUser()
          isConnected.value = true
        },
        onDisconnect: () => {
          console.log('Disconnected from WebSocket')
          isConnected.value = false
        },
        reconnectDelay: 5000 // 设置自动重连的延迟
      })

      stompClient.activate()
    }
    const subscribeSystem = () => {
      // 订阅系统消息
      stompClient.subscribe(configuration.value.websocketStompEndpoints['system'], (mes) => {
        ElMessage({
          message: mes.body,
          grouping: true,
          type: 'info'
        })
      })
    }
    const subscribeUser = () => {
      // 订阅用户消息
      stompClient.subscribe(
        configuration.value.webSocketUserBroker +
          configuration.value.websocketStompEndpoints['user_message'],
        (mes) => {
          const message = JSON.parse(mes.body)
          message.isSelf = false
          const index = chatBoxes.value.findIndex((item) => item.id == message.id)
          console.log(message)
          if (index !== -1) {
            const currentBox = chatBoxes.value[index]

            // 根据不同的类型更新相应的属性
            if (currentBox.type === 'text' && message.type === 'file') {
              currentBox.fileNameUriMapList = message.fileNameUriMapList
            } else if (currentBox.type === 'file' && message.type === 'text') {
              // 更新当前消息的其他属性，除了 fileNameUriMapList
              Object.assign(currentBox, {
                ...message,
                fileNameUriMapList: currentBox.fileNameUriMapList
              })
            }
          } else {
            chatBoxes.value.push(message)
          }
          responseMessage(message.id, message.sendId)
        }
      )

      // 订阅用户发送消息结果
      stompClient.subscribe(
        configuration.value.webSocketUserBroker +
          configuration.value.websocketStompEndpoints['user_messageACK'],
        (mes) => {
          const message = JSON.parse(mes.body)
          console.log(message)
          chatBoxes.value.forEach((item) => {
            if (item.id === message.id) {
              item.status = message.status
            }
          })
          if (message.content) {
            ElMessage({
              message: message.content ? message.content : messageStore.chatConstant['SEND_ERROR'],
              grouping: true,
              type: 'error'
            })
          }
        }
      )
      stompClient.subscribe(
        configuration.value.webSocketUserBroker +
          configuration.value.websocketStompEndpoints['user_error'],
        (mes) => {
          ElMessage({
            message: mes.body,
            grouping: true,
            type: 'error'
          })
        }
      )
    }

    const subscribeGroup = () => {
      // userStore.getGroupList()
      // 订阅群组消息
      stompClient.subscribe(configuration.value.websocketStompEndpoints['group'], (mes) => {
        const message = JSON.parse(mes.body)
        message.isSelf = false
        chatBoxes.value.push(message)
      })
    }

    const chatBox = computed(() => {
      if (chatId.value === undefined) {
        return chatBoxes.value
      }
      return chatBoxes.value.filter(
        (item) => item.sendId == chatId.value || item.receiveId == chatId.value
      )
    })
    const sendMessage = (message) => {
      const serializedMessage = JSON.stringify(message)
      stompClient.publish({
        destination:
          configuration.value.websocketAppDestinationPrefix + configuration.value.websocketText,
        body: serializedMessage
      })
      chatBoxes.value.push(message)
    }
    const sendFiles = (message, data) => {
      const serializedMessage = JSON.stringify(message)
      // for (let pair of data.entries()) {
      //   console.log(pair[0] + ':', pair[1])
      // }
      stompClient.publish({
        destination:
          configuration.value.websocketAppDestinationPrefix + configuration.value.websocketFile,
        body: serializedMessage
      })
      uploadFiles(data).then((response) => {
        if (response.data.code == 1) {
          const id = response.data.data.id
          chatBoxes.value.forEach((item) => {
            if (item.id === id) {
              item.fileNameUriMapList = [...response.data.data.fileNameUriMapList]
            }
          })
        }
      })
      chatBoxes.value.push(message)
    }

    const setChatId = (id) => {
      chatId.value = id
    }

    const getChatMessages = async (receiveId, time) => {
      const params = {
        sendId: userStore.userInfo.id,
        receiveId: receiveId,
        time: time ? time : formatTimeToSecond(Date.now()),
        pageSize: 30
      }
      return getMessages(params).then((response) => {
        const res = response.data
        if (res.code == 1) {
          res.data.forEach((item) => {
            item.isSelf = item.sendId == userStore.userInfo.id
            if (item.status == 'sent' && !item.isSelf) {
              responseMessage(item.id, item.sendId)
            }
          })
          chatBoxes.value.unshift(...res.data)
          return res.data.length > 29
        } else {
          ElMessage({
            message: res.msg ? res.msg : messageStore.chatConstant['GET_MESSAGE_ERROR'],
            type: 'error',
            grouping: true
          })
        }
        return false
      })
    }
    const responseMessage = (id, sendId) => {
      const params = {
        id: id,
        sendId: sendId
      }
      responseMessageAPI(params)
    }
    return {
      chatBox,
      chatId,
      isConnected,
      init,
      sendMessage,
      sendFiles,
      setChatId,
      getChatMessages
    }
  },
  {
    persist: true
  }
)
