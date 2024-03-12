/*
 * @Author: Gro lin
 * @Date: 2024-03-11 22:06:00
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-03-11 22:21:00
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

//导入插件
// import { lazyLoad } from '@/directives'
// import { componentPlugin } from '@/components'

import '@/assets/index.scss'

const app = createApp(App)

app.use(createPinia().use(persist))
app.use(router)
// app.use(lazyLoad)
// app.use(componentPlugin)

app.mount('#app')
