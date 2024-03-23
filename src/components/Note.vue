<script setup>
import { nextTick } from 'vue'
import gsap from 'gsap'

const diaryContent = defineModel('content', {
  type: String,
  default: ''
})
const diaryHeight = defineModel('height', {
  type: String,
  default: 'auto'
})
// 基本的文本输入动画效果
function animateText(event) {
  // 使用 GSAP 添加动画，例如轻微放大再缩小的效果，增加交互性
  gsap.fromTo(event.target, { scale: 1.02 }, { scale: 1, duration: 0.2 })
}
// 自动扩展高度以适应内容
function autoExpand(event) {
  nextTick(() => {
    diaryHeight.value = 'auto'
    diaryHeight.value = event.target.scrollHeight + 'px'
  })
}

// 插入两个空格作为新段落的段首缩进，并扩展高度
function insertTabAndExpand(event) {
  const start = event.target.selectionStart
  const end = event.target.selectionEnd
  const beforeText = diaryContent.value.substring(0, start)
  const afterText = diaryContent.value.substring(end)

  diaryContent.value = beforeText + '\n         ' + afterText

  // 更新光标位置
  const newPos = start + 10 // 跳过换行符和两个空格
  nextTick(() => {
    event.target.selectionStart = event.target.selectionEnd = newPos
    autoExpand(event)
  })
}
</script>
<template>
  <textarea
    v-model="diaryContent"
    @keydown.tab.prevent="insertTabAndExpand"
    placeholder="Start typing your diary entry..."
    @input="autoExpand"
  ></textarea>
</template>
<style lang="scss" scoped>
textarea {
  text-indent: 2em; /* 段首缩进 */
  font-size: 2rem; /* 字体大小 */
  width: 100%;
  height: v-bind(diaryHeight);
  min-height: 100%; /* 最小高度为 100% */
  background-color: #fffbe7; /* 保留日记本背景色 */
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 100% 2em; /* 调整这里以匹配你的行高 */
  border: none; /* 无边框 */
  outline: none; /* 点击时不显示轮廓线 */
  resize: none; /* 禁止调整大小 */
  padding: 20px; /* 添加内边距 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 轻微的阴影效果 */
  font-family: 'PatrickHand', 'JNMaiYuanTi', sans-serif;
  white-space: pre-wrap; /* 保持空白符，如空格和换行 */
  word-wrap: break-word; /* 自动换行 */
  line-height: 2em; /* 调整行高以匹配背景横线 */
}

/* 用于模拟每个段落开头空两格的样式 */
textarea::placeholder,
textarea {
  text-indent: 2em; /* 段首缩进 */
}
</style>
