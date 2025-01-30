<!--
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2025-01-30 13:54:59
-->
<script setup>
import { useUserStore } from '@/stores'
const userStore = useUserStore()
</script>
<template>
  <div class="container">
    <section>
      {{ userStore.selectLanguage === 'en-US' ? 'there will be library' : '这里将会是图书馆系统' }}
    </section>
  </div>
</template>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 40rem;
  // background-image: url('../../assets/images/soul-note/note_3.webp');
  align-items: center;
}
</style>
