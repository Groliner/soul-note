<script setup>
import { gsap } from 'gsap'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import avatar from '@/assets/images/logo.png'
import { formatTime } from '@/composables/formatTime'
import { useDiaryStore } from '@/stores'
const diaryStore = useDiaryStore()
const diary = diaryStore.getDiary('diary_1')
const pages = diaryStore.getPages(diary.diary_id)
const menu = ref(['Overview', 'Others'])
const select = ref(menu.value[0])
const diaryInfo = {
  author: diary.author,
  last_read_page: diary.last_read_page,
  create_time: formatTime(diary.create_time),
  update_time: formatTime(diary.update_time)
}

// textarea 动画
function autoExpand(event) {
  const textarea = event.target
  // 先重置高度以确保能够减少高度,注意这个操作会引发html重绘,为了防止滚动条跳动,我们先记录滚动位置
  textarea.style.height = 'auto'
  // 然后设置为scrollHeight以适应内容
  textarea.style.height = textarea.scrollHeight + 'px'
}
</script>
<template>
  <div class="edit-pop">
    <header class="header">
      <div class="header-buttons">
        <button class="avatar">
          <img :src="avatar" />
        </button>
        <p>grolin</p>
      </div>
      <div class="header-title">Diary</div>
      <div class="header-buttons">
        <button class="cover">
          <img :src="diary.cover" />
        </button>
      </div>
    </header>
    <section class="title">
      <h3>
        <flexInput v-model:text="diary.title" placeholder="diary title" />
      </h3>
      <p>
        <textarea
          v-model="diary.desc"
          placeholder="diary desc"
          @input="autoExpand"
        ></textarea>
      </p>
    </section>
    <nav class="navigation">
      <a
        v-for="item in menu"
        :key="item"
        :class="{ 'navigation-item': true, active: item === select }"
        @click="select = item"
        >{{ item }}</a
      >
    </nav>
    <section class="profile">
      <ul v-show="select === menu[0]">
        <li v-for="item in pages" :key="item.title" :data-index="item.page">
          <span>{{ item.title }}</span>
          <span>words:{{ item.context.words }}</span>
        </li>
      </ul>
      <ul v-show="select === menu[1]">
        <li
          v-for="(value, key, index) in diaryInfo"
          :key="key"
          :data-index="index"
        >
          <span>{{ key }}</span>
          <span>{{ value }}</span>
        </li>
      </ul>
    </section>
    <footer class="selection">
      <button class="selection-item">Save</button>
      <button class="selection-item">Cancel</button>
    </footer>
  </div>
</template>
<style lang="scss" scoped>
textarea {
  width: 100%;
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.1) 1.2px,
    transparent 1.6px
  );
  background-size: 100% 1.4em; /* 调整这里以匹配你的行高 */
  line-height: 1.4em;
  border: none; /* 无边框 */
  outline: none; /* 点击时不显示轮廓线 */
  font-family: 'PatrickHand', 'JNMaiYuanTi', sans-serif;
  white-space: pre-wrap; /* 保持空白符，如空格和换行 */
  word-wrap: break-word; /* 自动换行 */
  overflow: hidden;
  resize: none;
}

/* 用于模拟每个段落开头空两格的样式 */
textarea::placeholder,
textarea {
  text-indent: 2em; /* 段首缩进 */
}

img {
  display: block;
  max-width: 100%;
}

.profile {
  ul {
    padding: 0;
    li {
      list-style: none;
      display: flex;
      justify-content: space-between;
    }
  }
}

input,
button {
  font: inherit;
}

.edit-pop {
  width: 460px;
  border-radius: 25px;
  overflow: hidden;
  padding: 2rem;
  box-shadow:
    0 0 0 10px var(--c-gray-300),
    0 0 0 11px var(--c-gray-200);
  background-color: #fff;
  position: relative;
  z-index: 1;
  margin-left: auto;
  margin-right: auto;
}

.header {
  display: grid;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  grid-template-columns: 1fr 2fr 1fr;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-left: auto;
  margin-right: auto;
}

.header-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &:first-child {
    justify-content: flex-start;
  }
}

.cover,
.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 15px;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 8px 10px -4px rgba(#000, 0.2);
  transform-origin: center center;
  transition: 0.15s ease;
  cursor: pointer;
  &:hover,
  &:focus {
    transform: translatey(-4px);
    box-shadow: 0 12px 14px -4px rgba(#000, 0.3);
  }
}

.title {
  margin-top: 1rem;
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
  }

  p {
    font-size: 1rem;
    color: var(--c-gray-500);
    margin-top: 0.375em;
  }
}

.navigation {
  margin-top: 1.23rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--c-gray-900);
  display: flex;
  justify-content: space-between;
}

.navigation-item {
  font-size: 1.125rem;
  display: inline-block;
  padding: 0 0.5rem;
  text-decoration: none;
  color: inherit;
  position: relative;
  z-index: 1;
  font-weight: 500;
  cursor: pointer;
  &.active {
    font-weight: 800;
    background-color: var(--c-yellow-500);

    &:before {
      background-color: var(--c-yellow-500);
    }
  }

  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 14px;
    background-color: transparent;
    z-index: -1;
    bottom: -2px;
    left: 0;
    transition: 0.15s ease;
  }

  & + & {
    margin-left: 1.25rem;
  }

  &:hover:before {
    background-color: var(--c-yellow-500);
  }
}

.selection {
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
  &-item {
    width: 80px;
    border-radius: 15px;
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
    text-decoration: none;
    background-color: transparent;
    border: 2px solid var(--c-gray-900);
    &:hover,
    &:focus,
    &.active {
      background-color: var(--c-yellow-500);
      color: var(--c-gray-900);
    }
  }
}
</style>
