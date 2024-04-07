import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDiaryStore } from './diary'
import { getUserInfoAPI, updateUserInfoAPI, logOutAPI } from '@/api/user'
import { getUserDiaryStatusAPI } from '@/api/userDiaryStatus'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const defaultUserInfo = {
  token: '',
  avatar: '/deepSouls/src/assets/images/logo.png',
  username: 'grolin',
  id: 'author',
  email: '123@qwe.com',
  description: "there is nothing here, it's empty",
  status: 'active',
  isEdited: false,
  updatedTime: '',
  lastReadDiaryId: 0,
  friends: [
    {
      id: 'friend_1',
      username: 'friend_1',
      avatar: '/deepSouls/src/assets/images/logo.png',
      description: 'friend_1 is a good friend'
    },
    {
      id: 'friend_2',
      username: 'friend_2',
      avatar: '/deepSouls/src/assets/images/logo.png',
      description: 'friend_2 is a good friend'
    },
    {
      id: 'friend_3',
      username: 'friend_3',
      avatar: '/deepSouls/src/assets/images/logo.png',
      description: 'friend_3 is a good friend'
    }
  ]
}
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

    const userInfo = ref(JSON.parse(JSON.stringify(defaultUserInfo)))
    const userDiary = ref(JSON.parse(JSON.stringify(defaultDiary)))
    const diaryStore = useDiaryStore()
    // 清空用户关联信息
    const logout = async () => {
      const router = useRouter()
      try {
        logOutAPI()
      } finally {
        router.push('/login')
        userInfo.value = defaultUserInfo
        userDiary.value = defaultDiary
        diaryStore.setDiary()
        diaryStore.setPages()
      }
    }
    const initAll = ref(true)
    const isNeedToUpdate = ref(true)
    // 设置token
    const setToken = (token) => {
      userInfo.value.token = token
    }
    const updateUserInfo = async () => {
      if (!initAll.value) return
      const res = await getUserInfoAPI()
      initAll.value = false
      if (res.data.code) {
        setUserInfo(res.data.data)
        userInfo.value.isEdited = false
        if (!userInfo.value.id) return
        // 获取用户日记状态 UserDiaryStatusList
        await getUserDiaryStatus()
      } else ElMessage.error(res.data.msg)
    }
    const getUserDiaryStatus = async (username = userInfo.value.username) => {
      if (!isNeedToUpdate.value) return true
      const res = await getUserDiaryStatusAPI({ username })
      if (res.data.code) {
        userDiary.value = res.data.data
        isNeedToUpdate.value = false
        return true
      }
      ElMessage.error(res.data.msg)
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
    const saveUserInfo = async () => {
      if (!userInfo.value.isEdited) return true
      const res = await updateUserInfoAPI({
        ...userInfo.value
      })
      if (res.data.code) {
        ElMessage.success('保存成功')
        userInfo.value.isEdited = false
        return true
      } else {
        updateUserInfo(userInfo.value.username)
        ElMessage.error(res.data.msg)
        return false
      }
    }
    const updateLocalUserDiaryStatus = ({ diaryId, lastReadPage }) => {
      const index = userDiary.value.findIndex(
        (item) => item.diaryId === diaryId
      )
      if (index === -1) return false
      userDiary.value[index].lastReadPage = lastReadPage
      isNeedToUpdate.value = true
      return true
    }
    const getLocalUserDiaryStatus = (diaryId) => {
      const index = userDiary.value.findIndex(
        (item) => item.diaryId === diaryId
      )
      if (index === -1) return 1
      return userDiary.value[index]
    }
    const addLocalUserDiaryStatus = (diaryId) => {
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
      if (index === -1) return false
      userInfo.value.lastReadDiaryId = userDiary.value[index - 1].diaryId
      userDiary.value.splice(index, 1)
      isNeedToUpdate.value = true
    }
    const setLocalLastReadDiaryId = (diaryId) => {
      userInfo.value.lastReadDiaryId = diaryId
    }
    const isAuthenticated = computed(() => !!userInfo.value.token)

    return {
      userInfo,
      userDiary,
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
      setLocalLastReadDiaryId
    }
  },
  {
    persist: true
  }
)
