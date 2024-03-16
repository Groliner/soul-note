<template>
  <div
    @click="
      () => {
        ElMessage({
          type: 'warning',
          message: 'Please login first',
          duration: 0
        })
      }
    "
  >
    layout-index
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
</script>
<style lang="scss" scoped>
div {
  width: 100px;
  height: 100px;
  background-color: aqua;
}
</style>
