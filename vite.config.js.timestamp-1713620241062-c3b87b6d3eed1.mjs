// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Users/Surface/Documents/Front-End%20Projects/soul-note/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/Surface/Documents/Front-End%20Projects/soul-note/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///C:/Users/Surface/Documents/Front-End%20Projects/soul-note/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/Surface/Documents/Front-End%20Projects/soul-note/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///C:/Users/Surface/Documents/Front-End%20Projects/soul-note/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/Surface/Documents/Front-End%20Projects/soul-note/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: "sass" })]
    })
  ],
  //base: '/note',
  server: {
    port: 5173,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        // '/api'是代理标识，用于告诉node，url前面是/api的就是使用代理的
        target: "http://192.168.60.208:12345",
        //目标地址，一般是指后台服务器地址
        changeOrigin: true,
        //是否跨域
        rewrite: (path) => path.replace(/^\/api/, "")
        //重写路径，去掉路径中的/api
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
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
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTdXJmYWNlXFxcXERvY3VtZW50c1xcXFxGcm9udC1FbmQgUHJvamVjdHNcXFxcc291bC1ub3RlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTdXJmYWNlXFxcXERvY3VtZW50c1xcXFxGcm9udC1FbmQgUHJvamVjdHNcXFxcc291bC1ub3RlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9TdXJmYWNlL0RvY3VtZW50cy9Gcm9udC1FbmQlMjBQcm9qZWN0cy9zb3VsLW5vdGUvdml0ZS5jb25maWcuanNcIjsvKlxyXG4gKiBAQXV0aG9yOiBHcm8gbGluXHJcbiAqIEBEYXRlOiAyMDI0LTAzLTExIDIyOjA2OjAwXHJcbiAqIEBMYXN0RWRpdG9yczogR3JvIGxpblxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDI0LTA0LTEwIDE3OjU5OjA2XHJcbiAqL1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcclxuXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldXHJcbiAgICB9KSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKHsgaW1wb3J0U3R5bGU6ICdzYXNzJyB9KV1cclxuICAgIH0pXHJcbiAgXSxcclxuICAvL2Jhc2U6ICcvbm90ZScsXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiA1MTczLFxyXG4gICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy9hcGknOiB7XHJcbiAgICAgICAgLy8gJy9hcGknXHU2NjJGXHU0RUUzXHU3NDA2XHU2ODA3XHU4QkM2XHVGRjBDXHU3NTI4XHU0RThFXHU1NDRBXHU4QkM5bm9kZVx1RkYwQ3VybFx1NTI0RFx1OTc2Mlx1NjYyRi9hcGlcdTc2ODRcdTVDMzFcdTY2MkZcdTRGN0ZcdTc1MjhcdTRFRTNcdTc0MDZcdTc2ODRcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC42MC4yMDg6MTIzNDUnLCAvL1x1NzZFRVx1NjgwN1x1NTczMFx1NTc0MFx1RkYwQ1x1NEUwMFx1ODIyQ1x1NjYyRlx1NjMwN1x1NTQwRVx1NTNGMFx1NjcwRFx1NTJBMVx1NTY2OFx1NTczMFx1NTc0MFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwgLy9cdTY2MkZcdTU0MjZcdThERThcdTU3REZcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpIC8vXHU5MUNEXHU1MTk5XHU4REVGXHU1Rjg0XHVGRjBDXHU1M0JCXHU2Mzg5XHU4REVGXHU1Rjg0XHU0RTJEXHU3Njg0L2FwaVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY3NzOiB7XHJcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgIC8vIFx1OEZEOVx1OTFDQ1x1OTE0RFx1N0Y2RSBtaXhpbi5zY3NzIFx1NkRGN1x1NTQwOFx1NjU4N1x1NEVGNlx1NzY4NFx1NTE2OFx1NUM0MFx1NUYxNVx1NTE2NVxyXG4gICAgICBzY3NzOiB7XHJcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcclxuICAgICAgICBAdXNlIFwiQC9hc3NldHMvc3R5bGVzL2VsZW1lbnQvaW5kZXguc2Nzc1wiIGFzICo7XHJcbiAgICAgICAgQHVzZSBcIkAvYXNzZXRzL3N0eWxlcy92YXIuc2Nzc1wiIGFzICo7XHJcbiAgICAgICAgQHVzZSBcIkAvYXNzZXRzL3N0eWxlcy9taXhpbi5zY3NzXCIgYXMgKjtcclxuICAgICAgICBAdXNlIFwiQC9hc3NldHMvc3R5bGVzL2ZvbnRzLnNjc3NcIiBhcyAqO1xyXG4gICAgICAgIGBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQU1BLFNBQVMsZUFBZSxXQUFXO0FBRW5DLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQVo2TCxJQUFNLDJDQUEyQztBQWVsUixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNuQyxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMsb0JBQW9CLEVBQUUsYUFBYSxPQUFPLENBQUMsQ0FBQztBQUFBLElBQzFELENBQUM7QUFBQSxFQUNIO0FBQUE7QUFBQSxFQUVBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQTtBQUFBLFFBRU4sUUFBUTtBQUFBO0FBQUEsUUFDUixjQUFjO0FBQUE7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQTtBQUFBLE1BQzlDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQTtBQUFBLE1BRW5CLE1BQU07QUFBQSxRQUNKLGdCQUFnQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU1sQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
