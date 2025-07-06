/*
 * @Author: Gro lin
 * @Date: 2025-04-26 15:04:16
 * @LastEditors: Gro lin
 * @LastEditTime: 2025-05-18 12:44:50
 */
// 定义img-lazy
import loading from '@/assets/images/loading.webp'
import { gsap } from 'gsap'

export const customDirectives = {
  install(app) {
    // app.directive('img-lazy', {
    //   mounted(el, binding) {
    // useIntersectionObserver检测是否在视口中
    //     const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
    //       el.src = isIntersecting ? binding.value : loading
    //       if (isIntersecting) stop()
    //     })
    //   }
    // })
    app.directive('lazyLoad', {
      mounted(el, binding) {
        lazyLoad(el, binding)
      },
      updated(el, binding) {
        if (binding.value !== binding.oldValue) {
          lazyLoad(el, binding)
        }
      }
    })
  }
}

function lazyLoad(el, binding) {
  el.src = binding.oldValue || el.src || loading
  el.classList.add('loading')
  console.log('挂载与更新事件')
  const loadImage = () => {
    const img = new Image()
    img.src = binding.value
    img.onload = () => {
      el.src = binding.value
      el.classList.remove('loading')
    }
    img.onerror = () => {}
  }
  loadImage()
}
