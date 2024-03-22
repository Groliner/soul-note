<script setup></script>
<template>
  <div class="back">
    <RouterView />
  </div>
</template>
<style lang="scss" scoped>
.back {
  width: 100vw;
  height: 100vh;
  // background-image: url('../assets/images/loading.webp');
  // background-size: cover;
  // background-position: center;
  filter: opacity(0.92);
}
</style>
