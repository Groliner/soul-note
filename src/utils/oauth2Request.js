// axios请求
import axios from 'axios'

const instance = axios.create({
  baseURL: '/oauth2',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
import { useUserStore } from '@/stores'
import router from '@/router'

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // 2. 按照后端的要求拼接token数据
    config.headers.token = userStore.userInfo?.token
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
    return response
  },
  (error) => {
    // ElMessage.error(error.message || '未知错误')
    if (error.response?.status === 401) {
      console.log('401')
    }
    return Promise.reject(error)
  }
)

export default instance
