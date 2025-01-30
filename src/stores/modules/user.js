import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDiaryStore } from './diary'
import { useContactsStore } from './contacts'
import { useMessageStore } from './message'
import router from '@/router'
import {
  getUserInfoAPI,
  updateUserInfoAPI,
  getUserWordCountAPI,
  updateLastReadDiaryId,
  getFriendsAPI,
  getOnlineUsers,
  getUserPreferencesAPI,
  updateUserPreferencesAPI
} from '@/api/user'
import {
  getAuthorizationCode,
  getAccessToken,
  login,
  introspectToken,
  logout_,
  revokeToken,
  refreshToken,
  register,
  getUserInfo
} from '@/api/oauth2'
import { getUserDiaryStatusAPI } from '@/api/userDiaryStatus'
import { ElMessage } from 'element-plus'

import defaultIMG from '../../assets/images/logo.png'
import avatar from '@/assets/images/logo.png'

const defaultUserInfoString = JSON.stringify({
  avatar: defaultIMG,
  username: 'grolin',
  id: 0,
  email: '123@qwe.com',
  description: "there is nothing here, it's empty",
  status: 'active',
  isEdited: false,
  updatedTime: '',
  isRememberMe: false
})
const defaultUserInfo = {
  avatar: avatar,
  backgroundImg:
    'https://java-spring-mybatis.oss-cn-beijing.aliyuncs.com/3d6d7ffe-2c03-45a0-bd45-6b31ea0767c9.png',
  createdTime: '2024-08-15T10:56:02',
  description: '测试用户',
  email: 'p2rr2@r32r23rqweewrew.com',
  id: 0,
  isOnline: true,
  lastReadDiaryId: 152
}
const defaultFriends = []
const defaultUserDiary = [
  {
    id: 1,
    diaryId: 0,
    status: 'reader',
    lastReadPage: 1
  }
]
const defaultWordCount = []
const defaultUserPreferences = {
  id: 1,
  userId: 0,
  language: 0,
  theme: 0,
  background:
    'https://java-spring-mybatis.oss-cn-beijing.aliyuncs.com/23289fc9-a0ce-4b04-8ee2-d72f701b6b97.png',
  avatar:
    'https://java-spring-mybatis.oss-cn-beijing.aliyuncs.com/782ada3e-2ba7-4c6c-a38d-a5e796546ef8.jpg',
  lastReadDiaryId: 99,
  backgroundList: [
    {
      id: 1,
      userId: 107,
      type: 'background',
      imgUrl:
        'https://java-spring-mybatis.oss-cn-beijing.aliyuncs.com/23289fc9-a0ce-4b04-8ee2-d72f701b6b97.png',
      createdTime: '2024-08-18T18:44:58',
      updatedTime: '2024-08-18T18:44:58'
    }
  ],
  avatarList: [
    {
      id: 2,
      userId: 107,
      type: 'avatar',
      imgUrl:
        'https://java-spring-mybatis.oss-cn-beijing.aliyuncs.com/782ada3e-2ba7-4c6c-a38d-a5e796546ef8.jpg',
      createdTime: '2024-08-18T18:45:15',
      updatedTime: '2024-08-18T18:45:15'
    }
  ],
  languageList: ['zh-CN', 'en-US'],
  themeList: ['default', 'crazy']
}
export const useUserStore = defineStore(
  'user',
  () => {
    // 存储用户信息
    const friends = ref(JSON.parse(JSON.stringify(defaultFriends)))
    const userInfo = ref(JSON.parse(defaultUserInfoString))
    const userDiary = ref(JSON.parse(JSON.stringify(defaultUserDiary)))
    const userWordCount = ref(defaultWordCount)
    const userPreferences = ref(JSON.parse(JSON.stringify(defaultUserPreferences)))
    const tokens = ref({})

    // 工具类
    const messageStore = useMessageStore()
    const diaryStore = useDiaryStore()
    const contactsStore = useContactsStore()
    const login = async (isRememberMe) => {
      initAll.value = false

      const res = await getAuthorizationCode()
      if (res.data.code == 1) {
        userInfo.value.isRememberMe = isRememberMe
        await setToken(res.data.data.code)

        ElMessage({ type: 'success', message: messageStore.loginConstant['LOGIN_SUCCESS'] })

        startTokenRefreshTimer()
        updateUserInfo()

        // 注意以下数据更新的条件限制
        diaryStore.init(true)
        contactsStore.init()
      } else {
        ElMessage({
          message: messageStore.accountConstant['AUTHORIZE_ERROR'],
          grouping: true,
          type: 'error'
        })
      }
    }
    // 清空用户关联信息
    const logout = async () => {
      try {
        await saveUserInfo()
        const res = await logout_()
        if (res.data.code == 1) {
          ElMessage({
            message: messageStore.accountConstant['LOG_OUT_SUCCESS'],
            grouping: true,
            type: 'success'
          })
        } else {
          ElMessage.error(res.data.msg || messageStore.accountConstant['LOG_OUT_ERROR'])
        }
      } catch (e) {
        console.error(e)
      } finally {
        stopTokenRefreshTimer()
        localStorage.removeItem('lastTokenRefreshTime') // 清除存储的时间
        localStorage.removeItem('diaryAccessKey')
        if (tokens.value) {
          revokeToken(tokens.value.access_token)
          revokeToken(tokens.value.refresh_token, 'refresh_token')
        }
        friends.value = defaultFriends
        userDiary.value = defaultUserDiary
        console.log(JSON.parse(defaultUserInfoString))
        userInfo.value = JSON.parse(defaultUserInfoString)
        tokens.value = {}
        userWordCount.value = []
        userPreferences.value = defaultUserPreferences
        initAll.value = false
        isNeedToUpdate.value = true
        diaryStore.logout()
        contactsStore.logout()
        router.push('/home')
      }
    }
    const isAuthenticated = computed(() => (tokens.value?.access_token ? true : false))

    const initAll = ref(!window.location.pathname.startsWith('/account')) // 是否初始化过
    const isNeedToUpdate = ref(window.location.pathname.startsWith('/account')) // 减少请求次数
    // 设置token
    const setToken = async (code) => {
      const res = await getAccessToken(code)
      if (res.data.code == 1) {
        tokens.value = res.data.data
        localStorage.setItem('lastTokenRefreshTime', Date.now().toString())
      }
    }
    const getAccessToken_ = () => {
      return tokens.value.token_type + ' ' + tokens.value.access_token
    }
    const refreshToken_ = async () => {
      if (!isAuthenticated.value) return
      try {
        const res = await refreshToken(tokens.value.refresh_token)
        if (res.data.code == 1) {
          tokens.value = res.data.data
        }
      } catch (e) {
        regularInfo()
      } finally {
        localStorage.setItem('lastTokenRefreshTime', Date.now().toString()) // 每次刷新后更新时间
      }
    }
    const regularInfo = async () => {
      let _ = false
      try {
        const res_ = await getUserInfo() // 通过访问授权服务器的api来调用rememberMe功能
        if (res_.data.code == 1) {
          const res = await getAuthorizationCode()
          _ = true
          if (res.data.code == 1) {
            await setToken(res.data.data.code)
          } else {
            ElMessage({
              message: res.data.msg,
              grouping: true,
              type: 'error'
            })
          }
        }
      } catch (e) {
      } finally {
        if (!_) {
          ElMessage({
            message: messageStore.accountConstant['SESSION_EXPIRED'],
            grouping: true,
            type: 'error'
          })
          logout()
        }
        return _
      }
    }

    // 这里的功能转移到chat模块。
    const getFriends = async () => {
      if (!isAuthenticated.value) return
      const res = await getFriendsAPI()
      if (res.data.code == 1) {
        const friends_ = new Map()
        res.data.data.forEach((item) => friends_.set(item.id, item))
        friends.value.forEach((item, index) => {
          if (item != null && friends_.has(item.id)) {
            friends.value[index] = friends_.get(item.id)
            friends_.set(item.id, null)
          } else {
            friends.value[index] = null
          }
        })
        friends.value = friends.value.filter((item) => item != null)
        friends_.forEach((value) => {
          if (value) friends.value.push(value)
        })

        loadFriendsStatus()
      } else {
        ElMessage.info(res.data.msg)
      }
    }
    const loadFriendsStatus = async () => {
      if (!isAuthenticated.value) return
      const res = await getOnlineUsers()
      if (res.data != null) {
        const onlineUsers = res.data.onlineUserIdList
        friends.value.forEach((item) => {
          item.isOnline = onlineUsers.includes(item.id)
        })
        friends.value.sort((b, a) => a.isOnline - b.isOnline)
      }
    }

    const getUserPreferences = async () => {
      const res = await getUserPreferencesAPI()
      if (res.data.code == 1) {
        Object.keys(res.data.data).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(userPreferences.value, key)) {
            userPreferences.value[key] = res.data.data[key]
          }
        })
        return true
      } else {
        ElMessage.info(res.data.msg)
      }
    }
    const updateUserInfo = async () => {
      // 如果已经初始化过了，就不再初始化
      if (initAll.value) return
      const res = await getUserInfoAPI()
      initAll.value = true
      if (res.data.code == 1) {
        setUserInfo(res.data.data)
        userInfo.value.isEdited = false
        if (userInfo.value.id === 0 || userInfo.value.id === undefined) return
        getUserPreferences().then((res) => {
          if (res) {
            getUserDiaryStatus()
            getUserWordCount()
            // getFriends()
            ElMessage({
              message: messageStore.accountConstant['LOAD_SUCCESS'],
              grouping: true,
              type: 'success'
            })
          } else {
            ElMessage.error(messageStore.accountConstant['LOAD_ERROR'])
          }
        })
      } else ElMessage.error(res.data.msg)
    }
    const getUserDiaryStatus = async (userId = userInfo.value.id) => {
      if (!isNeedToUpdate.value) return true
      const res = await getUserDiaryStatusAPI({ userId })
      if (res.data.code === 1) {
        userDiary.value = res.data.data
        isNeedToUpdate.value = false
        return true
      }
      ElMessage.error(res.data.msg)
      //userDiary.value = defaultUserDiary

      return false
    }
    const getUserWordCount = async (date) => {
      const res = await getUserWordCountAPI({ userId: userInfo.value.id, date })
      if (res.data.code == 1) {
        if (date) {
          const index = userWordCount.value.findIndex((item) => item.date === date)
          if (res.data.data == null) return false
          if (index == -1) userWordCount.value.push(res.data.data)
          else userWordCount.value[index] = res.data.data
        } else userWordCount.value = res.data.data
        return true
      }
      ElMessage.warning(messageStore.accountConstant['ACCOUNT_WORDS_LOAD_ERROR'])
      return false
    }
    const setUserInfo = (data) => {
      if (!data) return
      Object.keys(data).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(userInfo.value, key)) {
          userInfo.value[key] = data[key]
          userInfo.value.isEdited = true
        }
      })
    }
    const saveUserInfo = async (isMust = false) => {
      if (!userInfo.value.isEdited && !isMust) return true
      const res = await updateUserInfoAPI({
        ...userInfo.value
      })
      if (res.data.code == 1) {
        ElMessage.success(messageStore.accountConstant['SAVE_SUCCESS'])
        userInfo.value.isEdited = false
        return true
      } else {
        initAll.value = true
        updateUserInfo()
        ElMessage.error(res.data.msg)
        return false
      }
    }
    const savePreferences = async (isMust = false) => {
      if (!userPreferences.value.isEdited && isMust) return
      const res = await updateUserPreferencesAPI(userPreferences.value)
      return res.data.code == 1
    }

    // 保存用户信息,分为基恩信息与偏好设置
    const saveAccountInfo = async () => {
      const res_ = await savePreferences()
      let res = true
      if (userInfo.value.isEdited) {
        res = await updateUserInfoAPI({
          ...userInfo.value
        })
      }
      if (res && res_) {
        ElMessage.success(messageStore.accountConstant['SAVE_SUCCESS'])
        return true
      } else {
        ElMessage.error(messageStore.accountConstant['SAVE_ERROR'])
        return false
      }
    }
    const updateLocalUserDiaryStatus = ({ diaryId, lastReadPage }, record = true) => {
      const index = userDiary.value.findIndex((item) => item.diaryId === diaryId)
      if (index === -1) return false
      userDiary.value[index].lastReadPage = lastReadPage
      isNeedToUpdate.value = record

      return true
    }
    const getLocalUserDiaryStatus = (diaryId) => {
      const index = userDiary.value.findIndex((item) => item.diaryId === diaryId)

      return userDiary.value ? userDiary.value[index > -1 ? index : 0] : defaultUserDiary[0]
    }
    const addLocalUserDiaryStatus = (diaryId) => {
      // 设置默认的日记状态,id为任意
      const diary_ = {
        id: userDiary.value.length + 1,
        diaryId,
        status: 'author',
        lastReadPage: 1
      }
      userDiary.value.push(diary_)
      isNeedToUpdate.value = true

      return diary_.id
    }
    const deleteLocalUserDiaryStatus = (diaryId) => {
      const lastReadDiaryId = userPreferences.value.lastReadDiaryId
      const index = userDiary.value.findIndex((item) => item.diaryId === diaryId)
      if (index < 1) return false
      if (lastReadDiaryId === diaryId) {
        userPreferences.value.lastReadDiaryId = userDiary.value[index - 1].diaryId
      }
      userDiary.value.splice(index, 1)
      isNeedToUpdate.value = true
    }
    const setLocalLastReadDiaryId = (diaryId) => {
      const index = userDiary.value.findIndex((item) => item.diaryId === diaryId)
      if (index !== -1) {
        userPreferences.value.lastReadDiaryId = diaryId
        saveLastReadDiaryId(diaryId)
      } else {
        userPreferences.value.lastReadDiaryId = userDiary.value[0].diaryId
      }
    }
    const saveLastReadDiaryId = async (diaryId) => {
      const res = await updateLastReadDiaryId(userInfo.value.id, {
        lastReadDiaryId: diaryId
      })
      // 考虑到频繁更新，这里不再提示
      // if (res.data.code == 1) {
      //   // 由于设置了lastReadDiaryId的侦测器，这里如果再次设置会导致无限循环
      //   // userPreferences.value.lastReadDiaryId = diaryId
      //   return true
      // }
    }
    const getUsernameById = (id) => {
      if (userInfo.value.id === id) return userInfo.value.username
      const user = friends.value.find((item) => item.id === id)
      return user ? user.username : ''
    }
    const getUserInfoById = (id) => {
      if (userInfo.value.id == id)
        return { ...userInfo.value, backgroundImg: userPreferences.value.background }
      const user = friends.value.find((item) => item.id == id)
      return user ? user : defaultUserInfo
    }

    const selectLanguage = computed(() => {
      const language = userPreferences.value.languageList[userPreferences.value.language]
      return language ? language : 'zh-CN'
    })

    const refreshInterval = ref(null)
    const refreshInterval_ = ref(null)
    const refreshFriendsInterval = ref(null)
    const TOKEN_REFRESH_INTERVAL = 1000 * 60 * 20 // 20分钟
    const FRIENDS_REFRESH_INTERVAL = 1000 * 60 * 1 // 1分钟
    // const TOKEN_REFRESH_INTERVAL = 1000 * 20 // 20分钟
    const startTokenRefreshTimer = () => {
      stopTokenRefreshTimer()
      const lasRefreshTime = localStorage.getItem('lastTokenRefreshTime')
      const elapsedTime = Date.now() - parseInt(lasRefreshTime || 0, 10)
      const remainingTime = TOKEN_REFRESH_INTERVAL - elapsedTime
      console.log('remainingTime', remainingTime)
      refreshInterval_.value = setTimeout(
        () => {
          refreshToken_()
          clearTimeout(refreshInterval_.value)
          refreshInterval.value = setInterval(refreshToken_, TOKEN_REFRESH_INTERVAL)
        },
        remainingTime > 1000 ? remainingTime : 5000
      )

      refreshFriendsInterval.value = setInterval(loadFriendsStatus, FRIENDS_REFRESH_INTERVAL)
    }
    const stopTokenRefreshTimer = () => {
      clearInterval(refreshInterval.value)
      clearTimeout(refreshInterval_.value)
      clearInterval(refreshFriendsInterval)
      refreshInterval.value = null
      refreshInterval_.value = null
      refreshFriendsInterval.value = null
    }

    // 刷新页面自动执行
    startTokenRefreshTimer()
    return {
      userInfo,
      userDiary,
      friends,
      tokens,
      userWordCount,
      userPreferences,
      isAuthenticated,
      selectLanguage,
      setToken,
      getAccessToken_,
      refreshToken_,
      updateUserInfo,
      getUserDiaryStatus,
      getUserWordCount,
      saveUserInfo,
      setUserInfo,
      saveAccountInfo,
      login,
      logout,
      regularInfo,
      updateLocalUserDiaryStatus,
      getLocalUserDiaryStatus,
      addLocalUserDiaryStatus,
      deleteLocalUserDiaryStatus,
      setLocalLastReadDiaryId,
      getUsernameById,
      getUserInfoById
    }
  },
  {
    persist: true
  }
)
