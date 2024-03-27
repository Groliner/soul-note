import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDiaryStore } from './diary'
const defaultUserInfo = {
  token: '',
  avatar: '/deepSouls/src/assets/images/logo.png'
}
const defaultDiary = {
  last_read_diary_id: 'diary_1',
  diaries: ['diary_1', 'diary_2', 'diary_3', 'diary_4']
}
export const useUserStore = defineStore(
  'user',
  () => {
    // 存储用户信息

    const userInfo = ref(defaultUserInfo)
    const user_diary = ref(defaultDiary)
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
    const setReadPage = (page) => {
      userInfo.value.diary.last_read_page = page
    }

    return {
      userInfo,
      user_diary,
      setToken,
      setReadPage,
      logout
    }
  },
  {
    persist: true
  }
)
