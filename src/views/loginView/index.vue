<script setup>
import { onBeforeMount, ref } from 'vue'
import login from './login_async.vue'
import { LogInTemplateAPI } from '@/api/user'
import { ElMessage } from 'element-plus'
let template = ref({})
onBeforeMount(async () => {
  const res = await LogInTemplateAPI()
    .then((res) => res.data)
    .catch((err) => {
      ElMessage({
        type: 'warning',
        message: err.data?.msg || 'Request timeout'
      })
    })
  if (res) {
    template.value = res.data.template
  }
})
</script>
<template>
  <div class="container">
    <div class="backImg"></div>
    <login v-bind="template" />
    <ClockComponent
      class="clock"
      :showtime="false"
      seconds_color="#7c8a97"
      point_color="#7c8a97"
    />
  </div>
</template>
<style lang="scss" scoped>
.container {
}
.backImg {
  border: 2px solid black;
  width: 100%;
  padding: 2px;
  height: 100vh;
  background-image: url('../../assets/images/loading.webp');
  background-size: cover;
  background-position: center;
  filter: opacity(0.92);
}
.clock {
  position: absolute;
  right: 18%;
  top: 5%;
  width: 0;
  height: 0;
}
</style>
