<script setup>
import { RouterView } from 'vue-router'
</script>
<template>
  <div class="backImg">
    <RouterView />
  </div>
</template>
<style lang="scss" scoped>
.backImg {
  width: 100vw;
  height: 100vh;
  // background-image: url('../assets/images/loading.webp');
  // background-size: cover;
  // background-position: center;
  filter: opacity(0.92);
}
</style>
