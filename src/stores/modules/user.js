import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 存储用户信息
    const userInfo = ref({})
    //
    const logout = () => {
      userInfo.value = {}
      diary.value = []
    }
    // 设置token
    const setToken = (token) => {
      userInfo.value.token = token
    }
    const diary = ref([])
    const updateDiary = (diaryData) => {
      diary.value[page.value] = diaryData
    }
    const page = ref(0)
    return {
      userInfo,
      diary,
      page,
      setToken,
      logout,
      updateDiary
    }
  },
  {
    persist: true
  }
)
