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
const defaultDiary = {
  lastReadDiaryId: 'diary',
  diaries: ['diary', 'diary_2', 'diary_3', 'diary_4']
}
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
        // 获取用户日记状态
        // const res2 = await getUserDiaryStatusAPI({ userId: userInfo.value.id })
        // if (res2.data.code) {
        //   userDiary.value = res2.data.data
        //   diaryStore.setDiary(userDiary.value.diaries)
        // } else ElMessage.error(res2.data.msg)
      } else ElMessage.error(res.data.msg)
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
        ...userInfo.value,
        lastReadDiaryId: userDiary.value.lastReadDiaryId
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
    const addDiary = (id) => {
      userDiary.value.diaries.push(id)
      userDiary.value.lastReadDiaryId = id
    }
    const deleteDiary = (id) => {
      const index = userDiary.value.diaries.indexOf(id)
      if (index !== -1) {
        userDiary.value.diaries.splice(index, 1)
        userDiary.value.lastReadDiaryId = userDiary.value.diaries[index - 1]
      }
    }

    const isAuthenticated = computed(() => !!userInfo.value.token)

    return {
      userInfo,
      userDiary,
      isAuthenticated,
      setToken,
      updateUserInfo,
      saveUserInfo,
      setUserInfo,
      logout,
      addDiary,
      deleteDiary
    }
  },
  {
    persist: true
  }
)
