<!--
 * @Author: Gro lin
 * @Date: 2024-03-11 22:06:00
 * @LastEditors: Gro lin
 * @LastEditTime: 2025-03-29 22:03:18
-->
<script setup>
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'
import { ref, provide, watch, onMounted } from 'vue'

const pop = ref(false)
provide('pressTime', 101)

import { useUserStore } from './stores'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const { userPreferences } = storeToRefs(userStore)
</script>
<template>
  <div class="top-div" :class="{ crazy: userPreferences.theme == 1 }">
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
$times: 0.33s;
.fade-enter-active,
.fade-leave-active {
  transition: all $times ease-in;
  width: 100%;
}
.fade-leave-active {
  transition: all $times * 0.63 ease-out;
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
  transition: opacity $times * 0.85 cubic-bezier(0.5, 1, 0.89, 1);
}
.popup-leave-active {
  transition: opacity $times * 0.6 cubic-bezier(0.5, 1, 0.89, 1);
}

.crazy {
  filter: invert(1);
}
</style>
