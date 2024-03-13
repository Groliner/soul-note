// 插件方式将组件全局注册
import clock from './Clock.vue'

export const componentPlugin = {
  install(app) {
    app.component('ClockComponent', clock)
  }
}
