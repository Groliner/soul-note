/*
 * @Author: Gro lin
 * @Date: 2025-04-14 11:23:51
 * @LastEditors: Gro lin
 * @LastEditTime: 2025-04-14 13:17:00
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './user'

export const useConstantStore = defineStore(
  'constant',
  () => {
    const userStore = useUserStore()
    const diaryConstant = computed(() => {
      const msg = {
        'zh-CN': {
          ADD: '想要添加一个新的日记本吗？',
          ADD_PAGE: '新 增 一 页？',

          DELE: '你确定要删除这个日记本吗？',
          DELE_PAGE: '你确定要删除这一页吗？'
        },
        'en-US': {
          ADD: 'want to add a new diary ?',
          ADD_PAGE: 'want to add a new page ?',

          DELE: 'Are you sure to delete the diary ?',
          DELE_PAGE: 'Are you sure to delete the page ? (past)'
        }
      }
      return msg[userStore.selectLanguage]
    })
    const accountConstant = computed(() => {
      const msg = {
        'zh-CN': {
          NO_AUTH: '并未登录授权！',
          LOGOUT: '确 定 登 出？',
          DELE_BACKGROUND: '你确定要删除这个背景吗？'
        },
        'en-US': {
          NO_AUTH: 'You are not logged in!',
          LOGOUT: 'Are you sure to logout ?',
          DELE_BACKGROUND: 'Are you sure to delete this background ?'
        }
      }
      return msg[userStore.selectLanguage]
    })

    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)

    const increment = () => {
      count.value++
    }

    return {
      diaryConstant,
      accountConstant,
      count,
      doubleCount,
      increment
    }
  },
  { persist: true }
)
