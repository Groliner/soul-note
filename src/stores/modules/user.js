import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDiaryStore } from './diary'
import { getUserInfoAPI, updateUserInfoAPI, logOutAPI } from '@/api/user'
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
export const useUserStore = defineStore(
  'user',
  () => {
    // 存储用户信息
    const friends = ref(JSON.parse(JSON.stringify(defaultFriends)))
    const userInfo = ref(JSON.parse(defaultUserInfoString))
    const userDiary = ref(JSON.parse(JSON.stringify(defaultDiary)))
    const diaryStore = useDiaryStore()
    // 清空用户关联信息
    const logout = async () => {
      try {
        await saveUserInfo()
        const res = await logOutAPI()
        if (res.data.code) {
          ElMessage.success(res.data.data)
          friends.value = defaultFriends
          userDiary.value = defaultDiary
          userInfo.value = JSON.parse(defaultUserInfoString)
          diaryStore.setDiary()
          diaryStore.setPages()
        } else {
          ElMessage.error(res.data.msg || 'logout failed')
        }
      } catch (e) {
        console.log(e)
      }
    }
    const initAll = ref(true)
    const isNeedToUpdate = ref(true) // 减少请求次数
    // 设置token
    const setToken = (token) => {
      userInfo.value.token = token
    }
    const updateUserInfo = async () => {
      // 如果已经初始化过了，就不再初始化
      if (!initAll.value) return
      const res = await getUserInfoAPI()
      initAll.value = false
      if (res.data.code) {
        setUserInfo(res.data.data)
        userInfo.value.isEdited = false
        if (userInfo.value.id === 0 || userInfo.value.id === undefined) return
        // 获取用户日记状态 UserDiaryStatusList
        await getUserDiaryStatus()
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
      userDiary.value = defaultDiary
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
      if (index === -1) return defaultDiary[0]
      return userDiary.value[index]
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
      const index = userDiary.value.findIndex((item) => item.diaryId === diaryId)
      if (index < 1) return false
      userInfo.value.lastReadDiaryId = userDiary.value[index - 1].diaryId
      userDiary.value.splice(index, 1)
      isNeedToUpdate.value = true
    }
    const setLocalLastReadDiaryId = (diaryId, record = true) => {
      const index = userDiary.value.findIndex((item) => item.diaryId === diaryId)
      let isNeedToSave = userInfo.value.lastReadDiaryId === 0 ? record : false
      if (index !== -1) userInfo.value.lastReadDiaryId = diaryId
      else {
        userInfo.value.lastReadDiaryId = userDiary.value[0].diaryId
        isNeedToSave = true
      }
      saveUserInfo(isNeedToSave)
    }
    const isAuthenticated = computed(() => !!userInfo.value.token)
    const getUsernameById = (id) => {
      if (userInfo.value.id === id) return userInfo.value.username
      const user = friends.value.find((item) => item.id === id)
      return user ? user.username : ''
    }
    return {
      userInfo,
      userDiary,
      friends,
      isAuthenticated,
      setToken,
      updateUserInfo,
      getUserDiaryStatus,
      saveUserInfo,
      setUserInfo,
      logout,
      updateLocalUserDiaryStatus,
      getLocalUserDiaryStatus,
      addLocalUserDiaryStatus,
      deleteLocalUserDiaryStatus,
      setLocalLastReadDiaryId,
      getUsernameById
    }
  },
  {
    persist: true
  }
)
