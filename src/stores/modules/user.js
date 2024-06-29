import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDiaryStore } from './diary'
import {
  getUserInfoAPI,
  updateUserInfoAPI,
  logOutAPI,
  getUserWordCountAPI,
  updateBackgroundImg,
  updateLastReadDiaryId
} from '@/api/user'
import { getUserDiaryStatusAPI } from '@/api/userDiaryStatus'
import { ElMessage } from 'element-plus'
import defaultIMG from '../../assets/images/logo.png'
const defaultUserInfoString = JSON.stringify({
  token: '',
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
  lastReadDiaryId: 0
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
const defaultDiary = [
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
    const userDiary = ref(JSON.parse(JSON.stringify(defaultDiary)))
    const userWordCount = ref(defaultWordCount)
    const diaryStore = useDiaryStore()
    const login = async (data) => {
      initAll.value = false
      setToken(data.token)
      updateUserInfo()
      diaryStore.init()
    }
    // 清空用户关联信息
    const logout = async () => {
      try {
        await saveUserInfo()
        const res = await logOutAPI()
        if (res.data.code) {
          ElMessage({
            message: res.data.data,
            grouping: true,
            type: 'success'
          })
          friends.value = defaultFriends
          userDiary.value = defaultDiary
          console.log(JSON.parse(defaultUserInfoString))
          userInfo.value = JSON.parse(defaultUserInfoString)
          userWordCount.value = []
          initAll.value = false
          isNeedToUpdate.value = true
          diaryStore.logout()
        } else {
          ElMessage.error(res.data.msg || 'logout failed')
        }
      } catch (e) {
        console.log(e)
      }
    }
    const initAll = ref(false)
    const isNeedToUpdate = ref(true) // 减少请求次数
    // 设置token
    const setToken = (token) => {
      userInfo.value.token = token
    }
    const updateUserInfo = async () => {
      // 如果已经初始化过了，就不再初始化
      if (initAll.value) return
      const res = await getUserInfoAPI()
      initAll.value = true
      if (res.data.code) {
        setUserInfo(res.data.data)
        userInfo.value.isEdited = false
        if (userInfo.value.id === 0 || userInfo.value.id === undefined) return
        // 获取用户日记状态 UserDiaryStatusList
        await getUserDiaryStatus()
        await getUserWordCount()
      } else ElMessage.error(res.data.msg)
    }
    const getUserDiaryStatus = async (userId = userInfo.value.id) => {
      if (!isNeedToUpdate.value) return true
      const res = await getUserDiaryStatusAPI({ userId })
      if (res.data.code) {
        userDiary.value = res.data.data
        isNeedToUpdate.value = false
        return true
      }
      ElMessage.error(res.data.msg)
      //userDiary.value = defaultDiary
      return false
    }
    const getUserWordCount = async (date) => {
      const res = await getUserWordCountAPI({ userId: userInfo.value.id, date })
      if (res.data.code) {
        if (date) {
          const index = userWordCount.value.findIndex(
            (item) => item.date === date
          )
          if (index !== -1) userWordCount.value[index] = res.data.data
        } else userWordCount.value = res.data.data
        return true
      }
      ElMessage.warning("can't get user word count")
      return false
    }
    const setUserInfo = (data) => {
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
      if (res.data.code) {
        ElMessage.success('保存成功')
        userInfo.value.isEdited = false
        return true
      } else {
        initAll.value = true
        updateUserInfo()
        ElMessage.error(res.data.msg)
        return false
      }
    }
    const updateLocalUserDiaryStatus = (
      { diaryId, lastReadPage },
      record = true
    ) => {
      const index = userDiary.value.findIndex(
        (item) => item.diaryId === diaryId
      )
      if (index === -1) return false
      userDiary.value[index].lastReadPage = lastReadPage
      isNeedToUpdate.value = record
      return true
    }
    const getLocalUserDiaryStatus = (diaryId) => {
      const index = userDiary.value.findIndex(
        (item) => item.diaryId === diaryId
      )
      return userDiary.value
        ? userDiary.value[index > -1 ? index : 0]
        : defaultDiary[0]
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
      const index = userDiary.value.findIndex(
        (item) => item.diaryId === diaryId
      )
      if (index < 1) return false
      userInfo.value.lastReadDiaryId = userDiary.value[index - 1].diaryId
      userDiary.value.splice(index, 1)
      isNeedToUpdate.value = true
    }
    const setLocalLastReadDiaryId = (diaryId) => {
      const index = userDiary.value.findIndex(
        (item) => item.diaryId === diaryId
      )
      if (index !== -1) userInfo.value.lastReadDiaryId = diaryId
      else {
        userInfo.value.lastReadDiaryId = userDiary.value[0].diaryId
      }
      saveLastReadDiaryId(diaryId)
    }
    const saveLastReadDiaryId = async (diaryId) => {
      const res = await updateLastReadDiaryId({
        id: userInfo.value.id,
        lastReadDiaryId: diaryId
      })
      if (res.data.code) {
        userInfo.value.lastReadDiaryId = diaryId
        return true
      }
    }
    const isAuthenticated = computed(() => !!userInfo.value.token)
    const getUsernameById = (id) => {
      if (userInfo.value.id === id) return userInfo.value.username
      const user = friends.value.find((item) => item.id === id)
      return user ? user.username : ''
    }

    // 背景图片
    const setBackgroundImg = (img) => {
      // 实时更新
      userInfo.value.backgroundImg = img
      updateBackgroundImg({ id: userInfo.value.id, backgroundImg: img }).then(
        (res) => {
          if (res.data.code) {
            ElMessage.success('background image updated successfully!')
          } else {
            ElMessage.error(res.data.msg)
          }
        }
      )
    }
    return {
      userInfo,
      userDiary,
      friends,
      userWordCount,
      isAuthenticated,
      setToken,
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
