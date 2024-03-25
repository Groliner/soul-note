<script setup>
import { watch, ref } from 'vue'
import notePage from './note.vue'
import pagination from './pagination.vue'
import { useDiaryStore, useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const { user_diary } = storeToRefs(userStore)
const diaryStore = useDiaryStore()
const diary = diaryStore.getDiary(user_diary.value.last_read_diary_id)
const page = ref(
  diaryStore.getPage(
    user_diary.value.last_read_diary_id,
    user_diary.value.last_read_page
  )
)

watch(
  user_diary,
  (newValue) => {
    page.value = diaryStore.getPage(
      newValue.last_read_diary_id,
      newValue.last_read_page
    )
  },
  { deep: true }
)

import { gsap } from 'gsap'
const is_edit_page_title = ref(false)
const mirror = ref(null)
const adjustWidth = () => {
  // 获取镜像span的宽度
  const mirrorWidth = mirror.value.offsetWidth
  console.log(mirror.value.offsetWidth)
  // 根据内容宽度调整input宽度，这里+10是为了让宽度比内容宽一点点
  gsap.to('.page_title_input', { width: mirrorWidth + 10 })
}
</script>
<template>
  <div class="container_note">
    <h1>--{{ diary.title }}</h1>
    <article :id="page.title">
      <h2>
        <span class="sub__">--</span>
        <input
          class="page_title_input"
          v-show="is_edit_page_title"
          v-model="page.title"
          @blur="is_edit_page_title = false"
          @input="adjustWidth"
        />
        <span
          ref="mirror"
          v-show="!is_edit_page_title"
          @click="is_edit_page_title = true"
          >{{ page.title }}</span
        >
        <span class="sup__">--</span>
      </h2>

      <Transition name="fade">
        <notePage
          v-model:context="page.context"
          v-model:content="page.content"
          v-model:page="page.page"
        />
      </Transition>
    </article>
    <pagination
      class="pagination"
      :total="diary.pages"
      v-model:page="user_diary.last_read_page"
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
    input {
      background-color: transparent;
      outline: none;
      font-family: inherit;
      font-size: 1.5em;
      width: fit-content;
    }

    span {
      transition: all 0.3s ease;
    }
    &:hover span.sub__ {
      transform: translateX(-5px);
    }
    &:hover span.sup__ {
      transform: translateX(5px);
    }
  }
}
</style>
