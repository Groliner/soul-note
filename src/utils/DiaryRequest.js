/*
 * @Author: Gro lin
 * @Date: 2024-08-11 17:58:57
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-08-13 11:13:59
 */
// axios请求
import axios from 'axios'

const instance = axios.create({
  baseURL: '/api/diary',
  timeout: 60000,
  withCredentials: true
})
import { useUserStore } from '@/stores'
import router from '@/router'

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // 2. 按照后端的要求拼接token数据
    if (config.headers.Authorization) return config
    config.headers.Authorization = userStore.getAccessToken_()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    console.log(response)
    if (response.status === 203) {
      const userStore = useUserStore()
      userStore.refreshToken_()
    }
    return response
  },
  (error) => {
    ElMessage.error(error.response.data.msg || error.message || '未知错误')
    const status = error.response?.status
    if (status == 401) {
      const userStore = useUserStore()
      userStore.refreshToken_()
    }
    return Promise.reject(error)
  }
)

export default instance
