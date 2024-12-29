<!--
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-11-18 11:15:53
-->
<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
const { userPreferences } = storeToRefs(useUserStore())

import AnimatedSearchBox from '@/components/funnyGadgets/AnimatedSearchBox.vue'
import { encryptData } from '@/composables/IOAESKey'
const topicList = ref([])
const handleSearch = (content) => {
  encryptData(content).then((res) => {
    topicList.value.push(res)
  })
}
</script>
<template>
  <div class="container">
    <div>
      {{
        userPreferences.languageSelectNum === 1 ? 'there should be topics' : '这里将会是话题系统'
      }}
    </div>
    <div class="search_wrapper">
      <AnimatedSearchBox
        @search="handleSearch"
        class="animatedSearchBox"
        searchPlaceholder="search topics...."
      />
      <div class="search_result">
        <div class="result" v-for="(topic, index) in topicList" :key="index">
          {{ topic }}
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 40rem;
  // background-image: url('../../assets/images/soul-note/note_4.webp');
  align-items: center;
  width: 50vw;
  margin: 0 auto;
}
.search_wrapper {
  width: 90%;
  display: flex;
  align-items: center;
  flex-direction: column;
  .search_result {
    margin-top: 1rem;
    max-height: 20rem;
    overflow: auto;
  }
}
</style>
