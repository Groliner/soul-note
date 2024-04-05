import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDiaryStore } from './diary'
import { getUserInfoAPI, updateUserInfoAPI } from '@/api/user'
import { getUserDiaryStatusAPI } from '@/api/userDiaryStatus'
import { ElMessage } from 'element-plus'
const defaultUserInfo = {
  token: '',
  avatar: '/deepSouls/src/assets/images/logo.png',
  username: 'grolin',
  id: 'author',
  email: '123@qwe.com',
  description: "there is nothing here, it's empty",
  status: 'active',
  updatedTime: '',
  lastReadDiaryId: '',
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
    diaryId: 1,
    status: 'author',
    lastReadPage: 1
  },
  {
    id: 2,
    diaryId: 2,
    status: 'author',
    lastReadPage: 1
  },
  {
    id: 3,
    diaryId: 3,
    status: 'author',
    lastReadPage: 1
  },
  {
    id: 4,
    diaryId: 4,
    status: 'author',
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
    const logout = () => {
      userInfo.value = defaultUserInfo
      diaryStore.setDiary()
      diaryStore.setPages()
    }
    // 设置token
    const setToken = (token) => {
      userInfo.value.token = token
    }
    const updateUserInfo = async () => {
      const res = await getUserInfoAPI()
      if (res.data.code) {
        Object.keys(res.data.data).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(userInfo.value, key)) {
            userInfo.value[key] = res.data.data[key]
          }
        })
        if (!userInfo.value.id) return
        // 获取用户日记状态 UserDiaryStatusList
        await getUserDiaryStatus()
      } else ElMessage.error(res.data.msg)
    }
    const getUserDiaryStatus = async (userId = userInfo.value.id) => {
      const res = await getUserDiaryStatusAPI({ userId })
      if (res.data.code) {
        userDiary.value = res.data.data
        return true
      }
      ElMessage.error(res.data.msg)
      return false
    }
    const setUserInfo = (data) => {
      Object.keys(data).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(userInfo.value, key)) {
          userInfo.value[key] = data[key]
        }
      })
    }
    const saveUserInfo = async () => {
      const res = await updateUserInfoAPI({
        ...userInfo.value
      })
      if (res.data.code) {
        ElMessage.success('保存成功')
        return true
      } else {
        updateUserInfo(userInfo.value.username)
        ElMessage.error(res.data.msg)
        return false
      }
    }
    const updateUserDiaryStatus = ({ diaryId, lastReadPage }) => {
      const index = userDiary.value.findIndex(
        (item) => item.diaryId === diaryId
      )
      if (index === -1) return false
      userDiary.value[index].lastReadPage = lastReadPage
      return true
    }
    const getLocalUserDiaryStatus = (diaryId) => {
      const index = userDiary.value.findIndex(
        (item) => item.diaryId === diaryId
      )
      if (index === -1) return 1
      return userDiary.value[index]
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
      updateUserDiaryStatus,
      getLocalUserDiaryStatus
    }
  },
  {
    persist: true
  }
)
