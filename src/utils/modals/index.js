/*
 * @Author: Gro lin
 * @Date: 2025-05-17 11:33:12
 * @LastEditors: Gro lin
 * @LastEditTime: 2025-05-18 13:01:05
 */
import { h, createApp } from 'vue'
import Popup from '@/components/popup/Popup.vue'
import editPop from '@/components/popup/editPop.vue'
import AccountSettings from '@/components/popup/AccountSettings.vue'
export const messageManager = {
  showDiaryEditModal(diaryId) {
    return createModal(editPop, { diaryId }, { delay: 1000 })
  },

  showAccountSettingsModal() {
    return createModal(AccountSettings, { sliderTime: 0.5 }, {})
  },

  showConfirmModal(message, options = {}) {
    return createModal(
      Popup,
      {
        message,
        ...options
      },
      { delay: 600 }
    )
  }
}
import { customDirectives } from '@/directives'

function createModal(Component, props = {}, options = {}) {
  return new Promise((resolve) => {
    // 创建元素
    const container = document.createElement('div')
    document.body.appendChild(container)
    // 创建实例
    const app = createApp({
      data() {
        return { isOpen: true }
      },
      render() {
        // 渲染函数h，这里默认传递open参数，以及监听close，confirm，refuse事件。
        return h(Component, {
          // 由于这里默认传递了props参数，如果子组件中不声明defineProps，会触发警告。
          open: this.isOpen,
          ...props,
          onClose: (...args) => {
            this.isOpen = false
            resolve(...args)
          },
          onConfirm: () => {
            this.isOpen = false
            resolve(true)
          },
          onRefuse: () => {
            this.isOpen = false
            resolve(false)
          }
        })
      }
    })
    app.use(customDirectives)
    // 实例挂载到新建的div元素
    const instance = app.mount(container)

    instance.$watch('isOpen', (newVal) => {
      if (!newVal) {
        setTimeout(() => {
          app.unmount()
          container.remove()
        }, options.delay || 600)
      }
    })
  })
}
