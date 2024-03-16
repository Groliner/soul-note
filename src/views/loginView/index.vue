<script setup>
import { onBeforeMount, ref } from 'vue'
import login from './login_b.vue'
import { useUserStore } from '@/stores'
import { loginAPI, signUpAPI, LogInTemplateAPI } from '@/api/user'
const userStore = useUserStore()
let template = ref({})
onBeforeMount(async () => {
  template.value = await LogInTemplateAPI()
  console.log(template.value)
})
const handleLogin = async (data) => {
  await loginAPI(data)
    .then((res) => {
      if (res.token) {
        userStore.setToken(res.token)
        return true
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
const handleSignup = async (data) => {
  await signUpAPI(data)
    .then((res) => res)
    .catch((err) => {
      console.log(err)
    })
}
</script>
<template>
  <div class="backImg"></div>
  <login @login="handleLogin" @signup="handleSignup" />
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
