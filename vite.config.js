/*
 * @Author: Gro lin
 * @Date: 2024-03-11 22:06:00
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-08-12 15:57:48
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
    })
  ],
  //base: '/note',
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        // '/api'是代理标识，用于告诉node，url前面是/api的就是使用代理的
        //target: 'http://47.108.78.99:12345', //可以不用配置,因为用的nginx代理
        target: 'http://192.168.0.179:11110',
        //target: 'https://localhost:12345', //目标地址，一般是指后台服务器地址
        changeOrigin: true, //是否跨域
        rewrite: (path) => path.replace(/^\/api/, '') //重写路径，去掉路径中的/api
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      // 这里配置 mixin.scss 混合文件的全局引入
      scss: {
        additionalData: `
        @use "@/assets/styles/element/index.scss" as *;
        @use "@/assets/styles/var.scss" as *;
        @use "@/assets/styles/mixin.scss" as *;
        @use "@/assets/styles/fonts.scss" as *;
        `
      }
    }
  }
})
