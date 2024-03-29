import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDiaryStore } from './diary'
const defaultUserInfo = {
  token: '',
  avatar: '/deepSouls/src/assets/images/logo.png',
  username: 'grolin',
  id: 'author',
  email: '123@qwe.com',
  desc: "there is nothing here, it's empty"
}
const defaultDiary = {
  last_read_diary_id: 'diary',
  diaries: ['diary', 'diary_2', 'diary_3', 'diary_4']
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
    const addDiary = (diary_id) => {
      user_diary.value.diaries.push(diary_id)
      user_diary.value.last_read_diary_id = diary_id
    }
    const deleteDiary = (diary_id) => {
      const index = user_diary.value.diaries.indexOf(diary_id)
      if (index !== -1) {
        user_diary.value.diaries.splice(index, 1)
        user_diary.value.last_read_diary_id =
          user_diary.value.diaries[index - 1]
      }
    }

    return {
      userInfo,
      user_diary,
      setToken,
      logout,
      addDiary,
      deleteDiary
    }
  },
  {
    persist: true
  }
)
