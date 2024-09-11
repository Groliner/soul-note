<!--
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-09-11 10:24:55
-->
<script setup>
import { ref } from 'vue'
import chatBox from './Chat.vue'
import { useChatStore } from '@/stores'
const chatStore = useChatStore()
chatStore.init()
</script>
<template>
  <div class="container">
    <chatBox></chatBox>
    <friendList @chatChange="chatStore.setChatId" class="chat-list"></friendList>
  </div>
</template>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.chat-list {
  position: fixed;
  right: 0;
  top: 120px;
}
</style>
