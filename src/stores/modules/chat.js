/*
 * @Author: Gro lin
 * @Date: 2024-09-07 15:49:55
 * @LastEditors: Gro lin
 * @LastEditTime: 2025-01-31 22:49:43
 */
/*
管理消息的发送与socket，rtc的连接
*/
import { defineStore } from 'pinia'
import { Client } from '@stomp/stompjs'
import {
  getWebSocketConfiguration,
  uploadFiles,
  getMessages,
  responseMessageAPI,
  getChatGroupsAPI
} from '@/api/chat'
import { useUserStore } from './user'
import { useContactsStore } from './contacts'
import { useMessageStore } from './message'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { formatTimeToSecond, compareTime } from '@/composables/formatTime'
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
    const chatBoxGroups = ref([])
    const userStore = useUserStore()
    const contactsStore = useContactsStore()
    const messageStore = useMessageStore()

    const chatId = ref(0)
    const init = (force = false) => {
      if (!userStore.isAuthenticated) {
        return false
      }
      if (!stompClient || !isConnected.value) {
        initConfiguration()
      }
      if (force) {
        chatBoxes.value = []
        chatBoxGroups.value = []
      }
      if (chatBoxes.value.length == 0) {
        contactsStore.friends.forEach((item) => {
          getChatMessages(item.userId)
        })
      }
      if (chatBoxGroups.value.length == 0) {
        contactsStore.groups.forEach((item) => {
          getChatMessages(item.id, null, true)
        })
      }
    }

    const logout = () => {
      if (stompClient) {
        stompClient.deactivate()
        stompClient = null
      }
      chatBoxes.value = []
      chatBoxGroups.value = []
      isConnected.value = false
      configuration.value = {}
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
      const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
      const wsUrl = `${wsProtocol}://${window.location.host}/ws/soul-note`
      stompClient = new Client({
        brokerURL: wsUrl, // WebSocket URL

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
          subscribeGroup()
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
      stompClient.subscribe(
        configuration.value.websocketStompEndpoints['system'],
        (mes) => {
          ElMessage({
            message: mes.body,
            grouping: true,
            type: 'info'
          })
        }
      )
    }
    const subscribeUser = () => {
      // 订阅用户消息
      stompClient.subscribe(
        configuration.value.webSocketUserBroker +
          configuration.value.websocketStompEndpoints['user_message'],
        (mes) => {
          const message = JSON.parse(mes.body)
          message.isSelf = false
          const index = chatBoxes.value.findIndex(
            (item) => item.id == message.id
          )
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
              message: message.content
                ? message.content
                : messageStore.chatConstant['SEND_ERROR'],
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
      // 订阅群组消息
      contactsStore.groups.forEach((group) => {
        stompClient.subscribe(
          configuration.value.websocketStompEndpoints['group'] + '-' + group.id,
          (mes) => {
            const message = JSON.parse(mes.body)
            message.isSelf = false
            chatBoxGroups.value.push(message)
          }
        )
      })
      // userStore.getGroupList()
      // 不再单独获取群组列表，而是在contactsStore中获取
      // getChatGroupsAPI().then((response) => {
      //   if (response.data.code == 1) {
      //     response.data.data.forEach((group) => {
      //       console.log(configuration.value.websocketStompEndpoints['group'] + '/' + group.id)
      //       stompClient.subscribe(
      //         configuration.value.websocketStompEndpoints['group'] + '-' + group.id,
      //         (mes) => {
      //           const message = JSON.parse(mes.body)
      //           message.isSelf = false
      //           chatBoxGroups.value.push(message)
      //         }
      //       )
      //     })
      //   } else {
      //     ElMessage({
      //       message: response.data.msg
      //         ? response.data.msg
      //         : messageStore.chatConstant['GET_GROUP_ERROR'],
      //       type: 'error',
      //       grouping: true
      //     })
      //   }
      // })
    }

    const getChatBox = (id, isGroup) => {
      if (id === undefined) {
        return []
      }
      if (isGroup) {
        return chatBoxGroups.value.filter((item) => item.receiveId == id)
      } else {
        return chatBoxes.value.filter(
          (item) =>
            (item.sendId == id && item.receiveId == userStore.userInfo.id) ||
            (item.receiveId == id && item.sendId == userStore.userInfo.id)
        )
      }
    }
    const sendMessage = (message) => {
      const serializedMessage = JSON.stringify(message)
      stompClient.publish({
        destination:
          configuration.value.websocketAppDestinationPrefix +
          configuration.value.websocketText,
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
          configuration.value.websocketAppDestinationPrefix +
          configuration.value.websocketFile,
        body: serializedMessage
      })
      uploadFiles(data).then((response) => {
        if (response.data.code == 1) {
          const id = response.data.data.id
          chatBoxes.value.forEach((item) => {
            if (item.id === id) {
              item.fileNameUriMapList = [
                ...response.data.data.fileNameUriMapList
              ]
            }
          })
        }
      })
      chatBoxes.value.push(message)
    }

    const getChatMessages = async (receiveId, time, group = false) => {
      const params = {
        sendId: userStore.userInfo.id,
        receiveId: receiveId,
        group,
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
          const targetArray = group ? chatBoxGroups.value : chatBoxes.value

          targetArray.unshift(...res.data)

          return res.data.length > 29
        } else {
          ElMessage({
            message: res.msg
              ? res.msg
              : messageStore.chatConstant['GET_MESSAGE_ERROR'],
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
    const setChatId = (id) => {
      chatId.value = id
    }
    return {
      chatBoxes,
      chatBoxGroups,
      chatId,
      isConnected,
      init,
      logout,
      subscribeGroup,
      sendMessage,
      sendFiles,
      setChatId,
      getChatBox,
      getChatMessages
    }
  },
  {
    persist: true
  }
)
