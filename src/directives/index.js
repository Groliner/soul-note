// 定义img-lazy
import { useIntersectionObserver } from '@vueuse/core'
import loading from '@/assets/images/loading.webp'

export const lazyLoad = {
  install(app) {
    app.directive('img-lazy', {
      mounted(el, binding) {
        const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
          el.src = isIntersecting ? binding.value : loading
          if (isIntersecting) stop()
        })
      }
    })
  }
}

import { h, render, createApp } from 'vue'
import Popup from '@/components/popup/Popup.vue'

import editPop from '@/components/popup/editPop.vue'
export const messageManager = {
  showDiaryEditModal(diaryId) {
    return new Promise((resolve) => {
      // 创建一个Vue实例来挂载Popup组件
      const container = document.createElement('div')
      document.body.appendChild(container)
      const editPopApp = createApp({
        data() {
          return {
            // 控制Popup显示的状态
            isOpen: true
          }
        },
        render() {
          return this.isOpen
            ? h(editPop, {
                diaryId,
                onClose: () => {
                  this.isOpen = false
                }
              })
            : null
        }
      }).mount(container)
      // 监听动画完成并清理
      editPopApp.$watch('isOpen', (newVal) => {
        if (!newVal) {
          // 动画完成，清理Vue实例和容器
          setTimeout(() => {
            container.remove()
          }, 600) // 这里的延时应与退出动画的持续时间匹配
        }
      })
    })
  },
  showConfirmModal(message, options = {}) {
    return new Promise((resolve) => {
      // 创建一个Vue实例来挂载Popup组件
      const container = document.createElement('div')
      document.body.appendChild(container)

      const popupApp = createApp({
        data() {
          return {
            // 控制Popup显示的状态
            isOpen: true
          }
        },
        render() {
          // 使用v-if或v-show根据isOpen状态控制Popup组件的显示
          // 当isOpen为false时，<Transition>将处理退出动画
          return this.isOpen
            ? h(Popup, {
                open: this.isOpen,
                message,
                ...options,
                onConfirm: () => {
                  this.isOpen = false // 触发退出动画
                  resolve(true)
                },
                onRefuse: () => {
                  this.isOpen = false
                  resolve(false)
                },
                onClose: () => {}
              })
            : null
        }
      }).mount(container)

      // 监听动画完成并清理
      popupApp.$watch('isOpen', (newVal) => {
        if (!newVal) {
          // 动画完成，清理Vue实例和容器
          setTimeout(() => {
            container.remove()
          }, 600) // 这里的延时应与退出动画的持续时间匹配
        }
      })
    })
  }
}
