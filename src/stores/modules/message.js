import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { computed, ref } from 'vue'
export const useMessageStore = defineStore(
  'messageConstant',
  () => {
    const message = ref([])
    const homeConstant = computed(() => {
      const msg = {
        'zh-CN': { error: 'home error', success: 'home success' },
        'en-US': { error: 'home error' }
      }
      return msg[userStore.selectLanguage]
    })
    const userStore = useUserStore()
    const diaryConstant = computed(() => {
      const msg = {
        'zh-CN': {
          SAVE_SUCCESS: '日记本 保存 成功',
          DELETE_SUCCESS: '日记本 删除 成功',
          LOAD_SUCCESS: '日记本 加载 成功',
          ADD_SUCCESS: '日记本 添加 成功',

          SAVE_ERROR: '日记本 保存 失败',
          DELETE_ERROR: '日记本 删除 失败',
          DELETE_WARNING: '第一个日记本 无法 删除 ',
          ADD_ERROR: '日记本 添加 失败',
          LOAD_ERROR: '日记本 加载 失败',
          FIND_ERROR: '未日记本 找到 ',

          DIARY_DESC_PLACEHOLDER: '请输入日记描述'
        },
        'en-US': {
          SAVE_SUCCESS: 'diary save success',
          DELETE_SUCCESS: 'diary delete success',
          LOAD_SUCCESS: 'diary load success',
          ADD_SUCCESS: 'diary add success',

          SAVE_ERROR: 'diary save error',
          DELETE_ERROR: 'diary delete error',
          DELETE_WARNING: 'The first diary cannot be deleted',
          LOAD_ERROR: 'diary load error',
          ADD_ERROR: 'diary add error',
          FIND_ERROR: 'diary not found',

          DIARY_DESC_PLACEHOLDER: 'Please enter the diary description'
        }
      }
      return msg[userStore.selectLanguage]
    })
    const diaryPageConstant = computed(() => {
      const msg = {
        'zh-CN': {
          SAVE_SUCCESS: '页 保存 成功',
          DELETE_SUCCESS: '页 删除 成功',
          LOAD_SUCCESS: '页 加载 成功',
          ADD_SUCCESS: '页 添加 成功',

          SAVE_ERROR: '页 保存 失败',
          DELETE_ERROR: '页 删除 失败',
          DELETE_FIRST_ERROR: '删除页  第 失败',
          DELETE_WITH_CONTENT_ERROR: '页有内容,请先清空',
          LOAD_ERROR: '页 加载 失败',
          ADD_ERROR: '页 添加 失败',

          DESC_PLACEHOLDER: '写你所想',

          SAVED: '页 已保存',
          HINTS: `                 写日记的一些技巧： 
                          1. crtl + z --> 撤销。
                          2. crtl + y --> 重做。
                          3. crtl + s --> 保存。
                          4. tab --> 写新段落。
                          5. 请不要随意创建日记或页面。
                          6. 当你离开时，你写下的所有内容都会自动保存在该区域。
                          7. 只要有弹出提示，就会立即保存。`
        },
        'en-US': {
          SAVE_SUCCESS: 'diary page save success',
          DELETE_SUCCESS: 'diary page delete success',
          LOAD_SUCCESS: 'diary page load success',
          ADD_SUCCESS: 'diary page add success',

          SAVE_ERROR: 'diary page save error',
          DELETE_ERROR: 'diary page delete error',
          DELETE_FIRST_ERROR: 'Failed to delete the first page',
          DELETE_WITH_CONTENT_ERROR: 'Failed to delete the page with content',
          LOAD_ERROR: 'diary page load error',
          ADD_ERROR: 'diary page add error',

          DESC_PLACEHOLDER: 'write down your past or thinking',

          SAVED: 'page saved',
          HINTS: `                 there are some tips for writing diary：
                          1. crtl + z  --> undo.
                          2. crtl + y --> redo.
                          3. crtl + s --> save.
                          4. tab --> write a new paragraph.
                          5. Please don't create a diary or a page at random.
                          6. all you write down will auto save in the area when you go away.
                          7. Anytime there's a pop-up alert asking it's saved immediately.`
        }
      }
      return msg[userStore.selectLanguage]
    })
    const accountConstant = computed(() => {
      const msg = {
        'zh-CN': {
          DEVELOP_FRIEND_SYSTEM: '好友系统正在开发...',
          LOGIN_SUCCESS: '登录成功',
          LOG_OUT_SUCCESS: '退出成功',
          SAVE_SUCCESS: '账号 保存 成功',
          LOAD_SUCCESS: '账号信息 加载 成功',
          BACKGROUND_IMG_UPLOAD_SUCCESS: '背景 设置 成功',
          REFRESH_AUTHORIZE_SUCCESS: '刷新授权成功',

          LOG_OUT_ERROR: '退出失败',
          SAVE_ERROR: '账号 保存 失败',
          LOAD_ERROR: '账号信息 加载 失败',
          AUTHORIZE_ERROR: '授权失败，请重新登录',

          ACCOUNT_WORDS_LOAD_ERROR: '字数记录 加载 失败',
          BACKGROUND_IMG_LOAD_ERROR: '背景 加载 失败',

          SESSION_EXPIRED: '会话过期，请重新登录'
        },
        'en-US': {
          DEVELOP_FRIEND_SYSTEM: 'The friend system is developing ...',
          LOGIN_SUCCESS: 'Login success',
          LOG_OUT_SUCCESS: 'Log out success',
          SAVE_SUCCESS: 'account save success',
          LOAD_SUCCESS: 'account load success',
          BACKGROUND_IMG_UPLOAD_SUCCESS: 'background set success',
          REFRESH_AUTHORIZE_SUCCESS: 'Refresh authorize success',

          LOG_OUT_ERROR: 'Log out error',
          SAVE_ERROR: 'account save error',
          LOAD_ERROR: 'account load error',
          AUTHORIZE_ERROR: 'Authorize error, please login again',

          ACCOUNT_WORDS_LOAD_ERROR: 'word count load error',
          BACKGROUND_IMG_LOAD_ERROR: 'background image load error',
          SESSION_EXPIRED: 'Session expired, please login again'
        }
      }
      return msg[userStore.selectLanguage]
    })
    const chatConstant = computed(() => {
      const msg = {
        'zh-CN': {
          SEND_SUCCESS: '发送 成功',

          SEND_ERROR: '发送 失败',
          GET_MESSAGE_ERROR: '获取消息失败',

          SEND_OVER_SIZE_WARRING: '附件文件总大小不能超过10MB'
        },
        'en-US': {
          SEND_SUCCESS: 'send success',

          SEND_ERROR: 'send error',
          GET_MESSAGE_ERROR: 'get message error',

          SEND_OVER_SIZE_WARRING: 'The total size of the attached files cannot exceed 10MB'
        }
      }
      return msg[userStore.selectLanguage]
    })
    const tips = computed(() => {
      const msg = {
        'zh-CN': {
          REFRESH_TIPS: '刷新页面可从数据库更新数据'
        },
        'en-US': {
          REFRESH_TIPS: 'Refresh the page to update data from the database'
        }
      }
      return msg[userStore.selectLanguage]
    })
    return {
      message,
      tips,
      homeConstant,
      diaryConstant,
      diaryPageConstant,
      accountConstant,
      chatConstant
    }
  },
  {
    persist: true
  }
)
