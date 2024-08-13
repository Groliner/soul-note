<script setup>
import {
  getAuthorizationCode,
  getAccessToken,
  login,
  introspectToken,
  logout_,
  revokeToken,
  refreshToken,
  register,
  getUserInfo
} from '@/api/oauth2'
import request from '@/utils/request'
import { ref } from 'vue'
const token = ref('')
const code = ref('')
const introspect_ = ref('')
const username = ref('')
const password = ref('')
const email = ref('')
const captcha = ref('')
const remember = ref(false)

const register_ = async () => {
  const formData = new FormData()
  formData.append('username', username.value)
  formData.append('password', password.value)
  formData.append('email', email.value)
  formData.append('captcha', captcha.value)
  const res = await register(formData)
}

const login_ = async () => {
  const formData = new FormData()
  formData.append('username', username.value)
  formData.append('password', password.value)
  formData.append('remember-me', remember.value)
  const res = await login(formData)
}
const logout = async () => {
  const res_ = revokeToken(token.value.access_token)
  const res__ = revokeToken(token.value.refresh_token, 'refresh_token')
  const res___ = await logout_()
}
const authorize_ = async () => {
  const res = await getAuthorizationCode()
  if (res.data.code == 1) {
    code.value = res.data.data.code
  }
}
const getAccessToken_ = async () => {
  const res = await getAccessToken(code.value)
  if (res.data.code == 1) {
    token.value = res.data.data
  }
}

const introspectToken_ = async () => {
  const res = await introspectToken(token.value.access_token)
  if (res.data.code == 1) {
    introspect_.value = res.data.data
  }
}
const refreshToken_ = async () => {
  const res = await refreshToken(token.value.refresh_token)
  if (res.data.code == 1) {
    token.value = res.data.data
  }
}

const getUserInfo_ = async () => {
  await getUserInfo()
}
const getOnlineUsers_ = async () => {
  const res = await request.get('online-users', {
    headers: {
      Authorization: `Bearer ${token.value.access_token}`
    }
  })
  console.log(res)
}
</script>
<template>
  <div class="container">
    <div class="input_wrapper">
      <input type="text" v-model="username" placeholder="username" />
      <input type="password" v-model="password" placeholder="password" />
      <input type="text" v-model="email" placeholder="email" />
      <input type="text" v-model="captcha" placeholder="captcha" />
      <input type="checkbox" v-model="remember" />
    </div>
    <button @click="register_">register</button>
    <button @click="login_">login</button>
    <button @click="authorize_">authorize</button>
    <p>{{ code }}</p>
    <button @click="getAccessToken_">getAccessToken</button>
    <p>{{ token.access_token }}</p>
    <button @click="introspectToken_">introspectToken</button>
    <p>{{ introspect_ }}</p>
    <button @click="refreshToken_">refreshToken</button>
    <p>{{ token.refresh_token }}</p>
    <button @click="logout">logout</button>
    <button @click="getUserInfo_">getUserInfo</button>
    <button @click="getOnlineUsers_">getOnlineUsers</button>
  </div>
</template>
<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  // background-image: url('../assets/images/loading.webp');
  // background-size: cover;
  // background-position: center;
  // filter: opacity(0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;

  button {
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #f0f0f0;
    color: #000;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background-color: #e0e0e0;
    }
  }

  .input_wrapper {
    position: absolute;
    left: 10%;
    top: 10%;
  }
}
</style>
