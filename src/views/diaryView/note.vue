<script setup>
import { nextTick, watch } from 'vue'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
import { ref, onUpdated, onMounted } from 'vue'
gsap.registerPlugin(ScrollToPlugin)
gsap.defaults({ duration: 0.3 })
const diaryContext = defineModel('context', {
  type: Object,
  required: true
})
const diaryContent = defineModel('content', {
  type: String,
  required: true
})
const page = defineModel('page', {
  type: Number,
  required: true
})
const textareaRef = ref(null)
const pretty = () => {
  gsap.to(window, {
    scrollTo: {
      y: diaryContext.value.scrollY,
      autoKill: false
    }
  })
  textareaRef.value.style.height = diaryContext.value.height
  undoStack.value = [
    {
      text: diaryContent.value,
      selectionStart: diaryContext.value.selectionStart,
      selectionEnd: diaryContext.value.selectionEnd
    }
  ]
}
onMounted(() => {
  pretty()
})
watch(page, () => {
  pretty()
})
// 自动扩展高度以适应内容
function autoExpand(event) {
  const textarea = event.target
  const y = window.scrollY
  // 先重置高度以确保能够减少高度,注意这个操作会引发html重绘,为了防止滚动条跳动,我们先记录滚动位置
  textarea.style.height = 'auto'
  // 然后设置为scrollHeight以适应内容
  textarea.style.height = textarea.scrollHeight + 'px'
  window.scrollTo(0, y)
  nextTick(() => {
    // 检查是否需要滚动以保持视线
    const bottomPosition = textarea.getBoundingClientRect().bottom
    const viewBottom = bottomPosition + window.innerHeight * 0.29
    // console.log(bottomPosition, viewBottom, window.innerHeight, window.scrollY)
    if (bottomPosition + 21 < window.innerHeight) {
      gsap.to(window, {
        scrollTo: {
          y: window.scrollY + viewBottom - window.innerHeight,
          autoKill: false
        }
      })
    }
    diaryContext.value.height = textarea.style.height
    diaryContext.value.scrollY = window.scrollY
  })
}
const undoStack = ref([
  {
    text: diaryContent.value,
    selectionStart: diaryContext.value.selectionStart,
    selectionEnd: diaryContext.value.selectionEnd
  }
])
const currentIndex = ref(0)

function handleInput(event) {
  if (event.isComposing) return // 处理中文输入法,取消输入法输入时的事件
  const text = event.target.value
  const selectionStart = (diaryContext.value.selectionStart =
    event.target.selectionStart)
  const selectionEnd = (diaryContext.value.selectionEnd =
    event.target.selectionEnd)

  if (currentIndex.value < undoStack.value.length - 1) {
    undoStack.value.splice(currentIndex.value + 1)
  }

  currentIndex.value++
  undoStack.value.push({ text, selectionStart, selectionEnd })
  autoExpand(event)
}

function handleKeyDown(event) {
  if (event.ctrlKey && event.key === 'z') {
    // 撤销 (Ctrl + Z)
    event.preventDefault()
    undo(event)
  } else if (event.ctrlKey && event.key === 'y') {
    // 重做 (Ctrl + Y)
    event.preventDefault()
    redo(event)
  } else if (event.key === 'Tab') {
    // 插入9空格作为新段落的段首缩进，并扩展高度
    event.preventDefault()
    insertTabAndExpand(event)
  }
}
// 插入9空格作为新段落的段首缩进，并扩展高度
function insertTabAndExpand(event) {
  const start = event.target.selectionStart
  const end = event.target.selectionEnd
  const beforeText = diaryContent.value.substring(0, start)
  const afterText = diaryContent.value.substring(end)

  diaryContent.value = beforeText + '\n         ' + afterText
  handleInput(event)
  // 更新光标位置
  const newPos = start + 10 // 跳过换行符和两个空格
  nextTick(() => {
    event.target.selectionStart = event.target.selectionEnd = newPos
    autoExpand(event)
  })
}
function undo(event) {
  if (currentIndex.value > 0) {
    currentIndex.value--
    const prevState = undoStack.value[currentIndex.value]
    diaryContent.value = prevState.text
    // 恢复光标位置
    nextTick(() => {
      event.target.selectionStart = prevState.selectionStart
      event.target.selectionEnd = prevState.selectionEnd
      autoExpand(event)
    })
  }
}
function redo(event) {
  if (currentIndex.value < undoStack.value.length - 1) {
    currentIndex.value++
    const nextState = undoStack.value[currentIndex.value]
    diaryContent.value = nextState.text
    // 恢复光标位置
    nextTick(() => {
      event.target.selectionStart = nextState.selectionStart
      event.target.selectionEnd = nextState.selectionEnd
      autoExpand(event)
    })
  }
}
</script>
<template>
  <textarea
    ref="textareaRef"
    v-model="diaryContent"
    @keydown="handleKeyDown"
    placeholder="Start typing your diary entry..."
    @input="handleInput"
  ></textarea>
</template>
<style lang="scss" scoped>
textarea {
  text-indent: 2em; /* 段首缩进 */
  font-size: 2rem; /* 字体大小 */
  width: 100%;
  background-color: #fffbe7; /* 保留日记本背景色 */
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.1) 1.2px,
    transparent 1.6px
  );
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
  overflow: hidden;
}

/* 用于模拟每个段落开头空两格的样式 */
textarea::placeholder,
textarea {
  text-indent: 2em; /* 段首缩进 */
}
</style>
