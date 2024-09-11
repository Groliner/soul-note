<!--
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-09-11 16:54:51
-->
<script setup>
import profileFront from './profileFront.vue'
import calendar from '@/components/modules/YearCalendar.vue'
import { onMounted, ref } from 'vue'
import { useUserStore, useDiaryStore } from '@/stores'
const userStore = useUserStore()
const diaryStore = useDiaryStore()
onMounted(() => {
  userStore.updateUserInfo()
  diaryStore.init()
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
