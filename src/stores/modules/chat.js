/*
 * @Author: Gro lin
 * @Date: 2024-09-07 15:49:55
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-09-08 22:09:38
 */
import { defineStore } from 'pinia'
import { Client } from '@stomp/stompjs'
import { getWebSocketConfiguration } from '@/api/chat'
import { useUserStore } from './user'
import { useMessageStore } from './message'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
{
  websocketAppDestinationPrefix: '/app'
  websocketEndpoint: 'soul-note'
  websocketFile: '/file'
  websocketQueueBroker: '/queue'
  webSocketUserBroker: '/user'
  websocketStompEndpoints: {
  }
  websocketText: '/message'
  websocketTopicBroker: '/topic'
}
const messageInstance = {
  sendId: null,
  receiveId: null,
  content: 'Hello, how can I help you today?',
  type: 'text',
  isSelf: true,
  avatar: '',
  time: '',
  uri: '',
  isPinned: false,
  status: 'sending',
  channelId: null
}
export const useChatStore = defineStore(
  'chat',
  () => {
    const configuration = ref({})
    let stompClient = null
    const chatBoxes = ref([])
    const userStore = useUserStore()
    const messageStore = useMessageStore()
    const chatId = ref(0)
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
        },
        onDisconnect: () => {
          console.log('Disconnected from WebSocket')
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
        configuration.value.websocketQueueBroker + '/' + userStore.userInfo.id,
        (mes) => {
          const message = JSON.parse(mes.body)
          message.isSelf = false
          chatBoxes.value.push(message)
        }
      )

      // 订阅用户发送消息结果
      stompClient.subscribe(
        configuration.value.webSocketUserBroker +
          configuration.value.websocketStompEndpoints['messageACK'],
        (mes) => {
          const message = JSON.parse(mes.body)
          console.log(message)
          chatBoxes.value.forEach((item) => {
            if (item.id === message.id) {
              item.status = message.status
            }
          })
          ElMessage({
            message: messageStore.chatConstant['SEND_SUCCESS'],
            grouping: true,
            type: 'success'
          })
        }
      )
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
    const sendFile = (file) => {}

    const setChatId = (id) => {
      chatId.value = id
    }
    return {
      initConfiguration,
      chatBox,
      sendMessage,
      setChatId,
      chatId
    }
  },
  {
    persist: true
  }
)
