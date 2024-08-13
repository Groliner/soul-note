import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDiaryStore } from './diary'
import { useMessageStore } from './message'
import router from '@/router'
import {
  getUserInfoAPI,
  updateUserInfoAPI,
  getUserWordCountAPI,
  updateBackgroundImg,
  updateLastReadDiaryId
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
const defaultUserInfoString = JSON.stringify({
  avatar: defaultIMG,
  username: 'grolin',
  id: 0,
  email: '123@qwe.com',
  description: "there is nothing here, it's empty",
  backgroundImg:
    'https://java-spring-mybatis.oss-cn-beijing.aliyuncs.com/ae727f0a-5660-4e59-872c-901b285351f2.jpg',
  status: 'active',
  isEdited: false,
  updatedTime: '',
  lastReadDiaryId: 0,
  isRememberMe: false
})
const defaultFriends = [
  {
    id: 1,
    username: 'friend_1',
    avatar: defaultIMG,
    description: 'friend_1 is a good friend'
  },
  {
    id: 2,
    username: 'friend_2',
    avatar: defaultIMG,
    description: 'friend_2 is a good friend'
  },
  {
    id: 3,
    username: 'friend_3',
    avatar: defaultIMG,
    description: 'friend_3 is a good friend'
  }
]
const defaultUserDiary = [
  {
    id: 1,
    diaryId: 0,
    status: 'reader',
    lastReadPage: 1
  }
]
const defaultWordCount = []
export const useUserStore = defineStore(
  'user',
  () => {
    // 存储用户信息
    const friends = ref(JSON.parse(JSON.stringify(defaultFriends)))
    const userInfo = ref(JSON.parse(defaultUserInfoString))
    const userDiary = ref(JSON.parse(JSON.stringify(defaultUserDiary)))
    const userWordCount = ref(defaultWordCount)
    const userPreferences = ref({
      languageSelectNum: 0,
      theme: 'default',
      languageList: ['zh-CN', 'en-US']
    })
    const tokens = ref({})

    // 工具类
    const messageStore = useMessageStore()
    const diaryStore = useDiaryStore()
    const login = async (isRememberMe) => {
      initAll.value = false

      const res = await getAuthorizationCode()
      if (res.data.code == 1) {
        userInfo.value.isRememberMe = isRememberMe
        await setToken(res.data.data.code)
        startTokenRefreshTimer()
        updateUserInfo()
        diaryStore.init()
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
        initAll.value = false
        isNeedToUpdate.value = true
        diaryStore.logout()
        router.push('/home')
      }
    }
    const isAuthenticated = computed(() => (tokens.value?.access_token ? true : false))

    const initAll = ref(false)
    const isNeedToUpdate = ref(true) // 减少请求次数
    // 设置token
    const setToken = async (code) => {
      const res = await getAccessToken(code)
      if (res.data.code == 1) {
        tokens.value = res.data.data
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
        if (e.response.status == 401 && userInfo.value.isRememberMe) {
          // 如果refreshToken过期，就重新登录
          await getUserInfo() // 通过访问授权服务器的api来调用rememberMe功能
          const res = await getAuthorizationCode()
          if (res.data.code == 1) {
            await setToken(res.data.data.code)
          } else {
            ElMessage({
              message: res.data.msg,
              grouping: true,
              type: 'error'
            })
          }
        } else {
          ElMessage({
            message: messageStore.accountConstant['SESSION_EXPIRED'],
            grouping: true,
            type: 'error'
          })
          logout()
        }
      } finally {
        localStorage.setItem('lastTokenRefreshTime', Date.now().toString()) // 每次刷新后更新时间
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
        // 获取用户日记状态 UserDiaryStatusList
        await getUserDiaryStatus()
        await getUserWordCount()
        ElMessage({
          message: messageStore.accountConstant['LOAD_SUCCESS'],
          grouping: true,
          type: 'success'
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
          if (index !== -1) userWordCount.value[index] = res.data.data
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
      const lastReadDiaryId = userInfo.value.lastReadDiaryId
      const index = userDiary.value.findIndex((item) => item.diaryId === diaryId)
      if (index < 1) return false
      if (lastReadDiaryId === diaryId) {
        userInfo.value.lastReadDiaryId = userDiary.value[index - 1].diaryId
        return true
      }
      userDiary.value.splice(index, 1)
      isNeedToUpdate.value = true
    }
    const setLocalLastReadDiaryId = (diaryId) => {
      const index = userDiary.value.findIndex((item) => item.diaryId === diaryId)
      if (index !== -1) {
        userInfo.value.lastReadDiaryId = diaryId
        saveLastReadDiaryId(diaryId)
      } else {
        userInfo.value.lastReadDiaryId = userDiary.value[0].diaryId
      }
    }
    const saveLastReadDiaryId = async (diaryId) => {
      const res = await updateLastReadDiaryId(userInfo.value.id, {
        lastReadDiaryId: diaryId
      })
      // 考虑到频繁更新，这里不再提示
      // if (res.data.code == 1) {
      //   // 由于设置了lastReadDiaryId的侦测器，这里如果再次设置会导致无限循环
      //   // userInfo.value.lastReadDiaryId = diaryId
      //   return true
      // }
    }
    const getUsernameById = (id) => {
      if (userInfo.value.id === id) return userInfo.value.username
      const user = friends.value.find((item) => item.id === id)
      return user ? user.username : ''
    }

    // 背景图片
    const setBackgroundImg = (img) => {
      // 实时更新
      userInfo.value.backgroundImg = img
      updateBackgroundImg(userInfo.value.id, { backgroundImg: img }).then((res) => {
        if (res.data.code == 1) {
          ElMessage.success(messageStore.accountConstant['BACKGROUND_IMG_UPLOAD_SUCCESS'])
        } else {
          ElMessage.error(res.data.msg)
        }
      })
    }
    const selectLanguage = computed(
      () => userPreferences.value.languageList[userPreferences.value.languageSelectNum]
    )

    const refreshInterval = ref(null)
    const refreshInterval_ = ref(null)
    const TOKEN_REFRESH_INTERVAL = 1000 * 60 * 20 // 20分钟
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
        remainingTime > 1000 ? remainingTime : 1000
      )
    }
    const stopTokenRefreshTimer = () => {
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value)
        clearTimeout(refreshInterval_.value)
        refreshInterval.value = null
        refreshInterval_.value = null
      }
    }

    // 刷新页面自动执行
    startTokenRefreshTimer()
    return {
      userInfo,
      userDiary,
      friends,
      tokens,
      userWordCount,
      isAuthenticated,
      userPreferences,
      selectLanguage,
      setToken,
      getAccessToken_,
      refreshToken_,
      updateUserInfo,
      getUserDiaryStatus,
      getUserWordCount,
      saveUserInfo,
      setUserInfo,
      login,
      logout,
      updateLocalUserDiaryStatus,
      getLocalUserDiaryStatus,
      addLocalUserDiaryStatus,
      deleteLocalUserDiaryStatus,
      setLocalLastReadDiaryId,
      getUsernameById,
      setBackgroundImg
    }
  },
  {
    persist: true
  }
)
