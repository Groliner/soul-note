<script setup>
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
const { userPreferences } = storeToRefs(useUserStore())
</script>
<template>
  <div class="container">
    <div>
      {{
        userPreferences.languageSelectNum === 1
          ? 'there should be topics'
          : '这里将会是话题系统'
      }}
    </div>
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
  background-image: url('../../assets/images/soul-note/note_4.webp');
  align-items: center;
}
</style>
