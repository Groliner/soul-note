<script setup>
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const handleGoTo = () => {
  // router.push({
  //   name: 'diary'
  // })
  userInfo.value.lastReadDiaryId = 110
  userInfo.value.tt = 110
  userStore.updateLocalUserDiaryStatus(
    {
      diaryId: 110,
      lastReadPage: 1
    },
    false
  )
}
</script>
<template>
  <div class="container">
    <section>there should be library</section>
    <button @click="handleGoTo" class="goto">click</button>
  </div>
</template>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 40rem;
  background-image: url('../../assets/images/soul-note/note_3.webp');
  align-items: center;
}
</style>
