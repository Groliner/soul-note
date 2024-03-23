<script setup>
import { ref, watchEffect } from 'vue'
import { useUserStore } from '@/stores'
const userStore = useUserStore()

const diary = ref({
  title: userStore.diary[userStore.page]?.title || 'Diary',
  content: userStore.diary[userStore.page]?.content || '',
  height: 'auto'
})
watchEffect(() => {
  userStore.updateDiary(diary.value)
})
</script>
<template>
  <div class="container">
    <title>--{{ diary.title }}--</title>
    <section :id="diary.title">
      <!--
        页面resize会产生滚动条
        注意媒体查询,对每一行底部横线的调节,消除位置异常
      
      -->
      <notePage v-model:content="diary.content" v-model:height="diary.height"</notePage>
    </section>
  </div>
</template>
<style lang="scss" scoped></style>
