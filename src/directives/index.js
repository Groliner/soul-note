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
import Popup from '@/components/Popup.vue'

const showConfirmModal = (message, options = {}) => {
  // 因为要等待用户操作，所以必须返回 Promise
  // return new Promise((resolve) => {
  //   // 创建一个新节点，用来容纳 modal
  //   const node = document.createElement('div') // 使用 `h` 创建虚拟节点，其中ModalsConfirm 是做好的 Vue SFC
  //   const vnode = h(Popup, {
  //     open: open,
  //     message,
  //     ...options,
  //     // `on` + `事件名称` 即事件处理函数
  //     onConfirm() {
  //       open.value = false
  //       resolve(true)
  //     },
  //     onRefuse() {
  //       open.value = false

  //       resolve(false)
  //     },
  //     onClose() {
  //       node.remove()
  //     }
  //   })
  //   document.body.appendChild(node) // 使用 `render` 将虚拟节点添加到 DOM 树里
  //   render(vnode, node)
  // })
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

export const ConfirmModalPlugin = {
  install(app) {
    app.config.globalProperties.$showConfirmModal = showConfirmModal
  }
}
