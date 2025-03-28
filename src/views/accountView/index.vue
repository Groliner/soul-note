<!--
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2025-01-30 20:06:19
-->
<script setup>
import profileFront from './profileFront.vue'
import calendar from '@/components/modules/YearCalendar.vue'
import { onMounted, ref } from 'vue'
import { useUserStore, useDiaryStore, useContactsStore } from '@/stores'
const userStore = useUserStore()
const diaryStore = useDiaryStore()
const contactsStore = useContactsStore()
onMounted(() => {
  userStore.updateUserInfo()
  diaryStore.init()
  contactsStore.init()
})
</script>
<template>
  <div class="container_profile">
    <div class="card">
      <div class="front"><profileFront /></div>
      <div class="back"><calendar /></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.back {
  margin: 10rem auto;
  & > * {
    margin: auto;
  }
}
.goto {
  position: absolute;
  top: 20%;
  left: 50%;
  background-color: aquamarine;
}
.container_profile {
  width: 91%;
  margin: 0 auto;
}
</style>
