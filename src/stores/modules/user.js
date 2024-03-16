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
    }
    // 设置token
    const setToken = (token) => {
      userInfo.value.token = token
    }
    return {
      userInfo,
      setToken,
      logout
    }
  },
  {
    persist: true
  }
)
