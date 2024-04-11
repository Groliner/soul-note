<script setup>
import profileFront from './profileFront.vue'
import calendar from '@/components/modules/YearCalendar.vue'
import { onMounted, ref } from 'vue'
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
</style>
