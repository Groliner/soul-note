<!--
 * @Author: Gro lin
 * @Date: 2024-03-11 22:06:00
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-03-11 22:09:45
-->
<script setup>
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'
import { ref, provide } from 'vue'
const pop = ref(false)
provide('pressTime', 123)
</script>
<template>
  <div>
    <el-config-provider :locale="zh">
      <!-- 路由出口 -->
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-config-provider>
    <Teleport to="body">
      <PopupComponent
        :open="pop"
        @close="pop = false"
        @confirm="console.log('you agree')"
        @refuse="console.log('you refuse')"
        ><template #content>没有什么东西, 点 × 关闭</template></PopupComponent
      ></Teleport
    >
  </div>
</template>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.54s ease-in;
  width: 100%;
}
.fade-leave-active {
  transition: all 0.34s ease-out;
  position: absolute;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.popup-enter-active {
  transition: opacity 0.46s cubic-bezier(0.5, 1, 0.89, 1);
}
.popup-leave-active {
  transition: opacity 0.32s cubic-bezier(0.5, 1, 0.89, 1);
}
</style>
