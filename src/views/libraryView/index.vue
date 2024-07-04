<script setup>
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
const { userPreferences } = storeToRefs(useUserStore())
</script>
<template>
  <div class="container">
    <section>
      {{
        userPreferences.languageSelectNum === 1
          ? 'there should be library'
          : '这里将会是图书馆系统'
      }}
    </section>
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
