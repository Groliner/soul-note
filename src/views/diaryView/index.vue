<script setup>
import { watch, ref } from 'vue'
import notePage from './note.vue'
import pagination from './pagination.vue'
import { useDiaryStore, useUserStore } from '@/stores'
const userStore = useUserStore()
const userDiaryInfo = ref(userStore.userInfo.diary)

const diaryStore = useDiaryStore()
const diary = diaryStore.getDiary(userDiaryInfo.value.last_read_diary_id)
const page = ref(
  diaryStore.getPage(
    userDiaryInfo.value.last_read_diary_id,
    userDiaryInfo.value.last_read_page
  )
)

watch(
  userDiaryInfo,
  (newValue) => {
    page.value = diaryStore.getPage(
      newValue.last_read_diary_id,
      newValue.last_read_page
    )
  },
  { deep: true }
)
</script>
<template>
  <div class="container_note">
    <h1>--{{ diary.title }}</h1>
    <article :id="page.title">
      <h2>--{{ page.title }}--</h2>
      <notePage
        v-model:context="page.context"
        v-model:content="page.content"
        v-model:page="page.page"
      />
    </article>
    <pagination
      class="pagination"
      :total="diary.pages"
      v-model:page="userDiaryInfo.last_read_page"
    />
  </div>
</template>
<style lang="scss" scoped>
.container_note {
  padding-bottom: 9.3rem;
}
h1 {
  font-size: 3rem;
}
article {
  margin: 0 auto;
  width: 90%;
  h2 {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
