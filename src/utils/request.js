/*
 * @Author: Gro lin
 * @Date: 2024-03-11 22:23:44
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-03-11 22:24:12
 */
// axios请求
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
  timeout: 1000000
})

import { useUserStore } from '@/stores'
import router from '@/router'
import { ElMessage } from 'element-plus'

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // 2. 按照后端的要求拼接token数据
    const token = userStore.userInfo?.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    ElMessage.error(error.response?.data?.message || '未知错误')
    if (error.response.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default instance
