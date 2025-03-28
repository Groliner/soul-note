/*
 * @Author: Gro lin
 * @Date: 2024-09-28 21:50:42
 * @LastEditors: Gro lin
 * @LastEditTime: 2025-03-28 15:20:19
 */
/**
管理用户的联系人信息

 */
import { defineStore } from 'pinia'
import { getChatFriendsAPI, getChatGroupsAPI, getChatGroupMembersAPI } from '@/api/chat'
import { getOnlineUsers, getUserInfoByIdAPI } from '@/api/user'
import { useUserStore } from './user'
import { useMessageStore } from './message'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { formatTimeToSecond } from '@/composables/formatTime'
import { softUpdate } from '@/composables/methods'

export const useContactsStore = defineStore(
  'contacts',
  () => {
    const friends = ref([])
    const groups = ref([])
    const findList = ref([])
    const contactsUserList = ref([]) // 存储具体信息
    const userStore = useUserStore()
    const messageStore = useMessageStore()
    const initAll = ref(
      window.location.pathname.startsWith('/chats') ||
        window.location.pathname.startsWith('/account')
    ) // 设置是否初始化所有数据,在用户想要重新加载数据时使用
    const init = async (force = false) => {
      if (!userStore.isAuthenticated) {
        return false
      }
      if (!initAll.value && !force) {
        return
      }
      initAll.value = false
      await getFriends()
      await getGroups()
    }
    const logout = () => {
      friends.value = []
      groups.value = []
      findList.value = []
      contactsUserList.value = []
    }

    const getChatLists = (index) => {
      if (index == 0) {
        return friends.value.map((friend) => {
          // 注意字段的类型，字符串或者数字
          const index = contactsUserList.value.findIndex((user) => friend.userId == user.id)
          if (index != -1) {
            return {
              ...contactsUserList.value[index],
              isOnline: friend.isOnline,
              nickname: friend.nickname
            }
          }
        })
      } else if (index == 1) {
        return groups.value
      } else {
        return []
      }
    }
    const getFriends = async () => {
      const res = await getChatFriendsAPI()
      if (res.data.code == 1) {
        softUpdate(friends, res.data.data)
        friends.value.forEach((friend) => {
          getUserInfoByIdAPI(friend.userId).then((res) => {
            if (res.data.code == 1) {
              softUpdate(contactsUserList, [res.data.data])
            }
          })
        })
        loadFriendsStatus()
      } else {
        ElMessage.info(res.data.msg)
      }
    }
    const loadFriendsStatus = async () => {
      if (!userStore.isAuthenticated) return
      const res = await getOnlineUsers()
      if (res.data != null) {
        const onlineUsers = res.data.onlineUserIdList
        console.log(onlineUsers)
        friends.value.forEach((item) => {
          item.isOnline = onlineUsers.includes(parseInt(item.userId))
        })
        friends.value.sort((b, a) => a.isOnline - b.isOnline)
      }
    }

    const getGroups = async () => {
      const res = await getChatGroupsAPI()
      if (res.data.code == 1) {
        softUpdate(groups, res.data.data)
        groups.value.forEach((item) => {
          getGroupsMembers(item.id)
        })
      } else {
        ElMessage.info(res.data.msg)
      }
    }

    const getGroupsMembers = async (groupId) => {
      const res = await getChatGroupMembersAPI(groupId)
      if (res.data.code == 1) {
        res.data.data.forEach((member) => {
          getUserInfoByIdAPI(member.id).then((res) => {
            if (res.data.code == 1) {
              softUpdate(contactsUserList, [res.data.data])
            }
          })
        })
      } else {
        ElMessage.info(res.data.msg)
      }
    }

    const getChatObjectInfo = (id, isGroup) => {
      return (
        groups.value.find((group) => group.id == id) ||
        contactsUserList.value.find((user) => user.id == id)
      )
    }

    const refreshFriendsInterval = ref(null)
    const FRIENDS_REFRESH_INTERVAL = 1000 * 60 * 1 // 1分钟
    const startTokenRefreshTimer = () => {
      stopTokenRefreshTimer()
      refreshFriendsInterval.value = setInterval(loadFriendsStatus, FRIENDS_REFRESH_INTERVAL)
    }
    const stopTokenRefreshTimer = () => {
      clearInterval(refreshFriendsInterval)
      refreshFriendsInterval.value = null
    }

    startTokenRefreshTimer()
    return {
      friends,
      groups,
      contactsUserList,
      init,
      logout,
      getChatLists,
      getChatObjectInfo
    }
  },
  { persist: true }
)
