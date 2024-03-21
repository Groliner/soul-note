<!--
 * @Author: Gro lin
 * @Date: 2024-03-11 22:06:00
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-03-11 22:09:45
-->
<script setup>
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'
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
  </div>
</template>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
