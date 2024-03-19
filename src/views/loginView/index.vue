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
      ElMessage({ type: 'warning', message: err.data.msg })
    })
  if (res) {
    template.value = res.data.template
  }
})
</script>
<template>
  <div class="backImg"></div>
  <login v-bind="template" />
</template>
<style lang="scss" scoped>
.backImg {
  width: 100vw;
  height: 100vh;
  background-image: url('../../assets/images/loading.webp');
  background-size: cover;
  background-position: center;
  filter: opacity(0.92);
}
</style>
