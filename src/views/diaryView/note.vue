<script setup>
/*
日记本- 页组件
实现日记本页的编辑功能
crtl + z 撤销
crtl + y 重做
tab 插入9空格作为新段落的段首缩进
diaryContext: 上下文属性(models)
diaryContent: 内容属性(models)
props: 当前页数与diaryId(props)
TODO
- 优化撤销重做功能
目前当使用撤回或重做,光标的撤销因为undoStack中的selectionStart并没有去实现(selectionStart===selectionEnd),
所以光标会返回至上一个stack的selectionEnd
*/
import { nextTick, watch, computed } from 'vue'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
import { ref, onMounted } from 'vue'
gsap.registerPlugin(ScrollToPlugin)
gsap.defaults({ duration: 0.37 })
const diaryContext = defineModel('context', {
  type: Object,
  required: true
})
const diaryContent = defineModel('content', {
  type: String,
  required: true
})
const props = defineProps({
  diaryId: {
    type: Number,
    required: true
  },
  page: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'write down your past or thinking'
  }
})
const textareaRef = ref(null)
let undoStack = [
  {
    text: diaryContent.value,
    selectionStart: diaryContext.value.selectionStart,
    selectionEnd: diaryContext.value.selectionEnd,
    scrollY: diaryContext.value.scrollY
  }
]
let currentIndex = 0

const pretty = () => {
  gsap.to(window, {
    scrollTo: {
      y: diaryContext.value.scrollY,
      autoKill: false
    }
  })
  gsap.fromTo(
    textareaRef.value,
    { opacity: 0.42 },
    {
      opacity: 1,
      duration: 1,
      ease: 'power2'
    }
  )
  textareaRef.value.style.height = diaryContext.value.height + 'px'

  undoStack = [
    {
      text: diaryContent.value,
      selectionStart: diaryContext.value.selectionStart,
      selectionEnd: diaryContext.value.selectionEnd,
      scrollY: diaryContext.value.scrollY
    }
  ]
  currentIndex = 0
}
onMounted(() => {
  pretty()
})
watch(
  () => [props.diaryId, props.page],
  () => {
    pretty()
  }
)
// 自动扩展高度以适应内容
function autoExpand(event, scroll_distance = -1) {
  const textarea = event.target
  const y = window.scrollY
  // 先重置高度以确保能够减少高度,注意这个操作会引发html重绘,为了防止滚动条跳动,我们先记录滚动位置
  textarea.style.height = 'auto'
  // 然后设置为scrollHeight以适应内容
  textarea.style.height = textarea.scrollHeight + 'px'
  window.scrollTo(0, y)

  nextTick(() => {
    if (scroll_distance === -1) {
      const remaining_lines_match = textareaRef.value.value
        .substring(diaryContext.value.selectionEnd)
        .match(/\n/g)
      const remaining_lines = remaining_lines_match
        ? remaining_lines_match.length
        : 0
      // 检查是否需要滚动以保持视线
      const viewBottom =
        textarea.getBoundingClientRect().bottom + window.innerHeight * 0.28
      scroll_distance =
        remaining_lines < 5
          ? window.scrollY + viewBottom - window.innerHeight
          : -1
    }
    if (scroll_distance > -1) {
      gsap.to(window, {
        scrollTo: {
          y: scroll_distance,
          autoKill: false
        }
      })
    }
  })
  diaryContext.value.height = textarea.scrollHeight
  diaryContext.value.words = diaryContent.value
    .replace(/\s+/g, '')
    .trim().length
  diaryContext.value.isEdited = true
}

function handleInput(event) {
  if (event.isComposing) return // 处理中文输入法,取消输入法输入时的事件
  const text = event.target.value
  const selectionStart = (diaryContext.value.selectionStart =
    event.target.selectionStart)
  const selectionEnd = (diaryContext.value.selectionEnd =
    event.target.selectionEnd)
  const scrollY = (diaryContext.value.scrollY = window.scrollY)
  if (currentIndex < undoStack.length - 1) {
    undoStack.splice(currentIndex + 1)
  }

  currentIndex++
  undoStack.push({ text, selectionStart, selectionEnd, scrollY })
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
  textareaRef.value.focus()
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
  if (currentIndex > 0) {
    currentIndex--
    const prevState = undoStack[currentIndex]
    diaryContent.value = prevState.text
    // 恢复光标位置
    rescueCursor(event, prevState)
  }
}
function redo(event) {
  if (currentIndex < undoStack.length - 1) {
    currentIndex++
    const nextState = undoStack[currentIndex]
    diaryContent.value = nextState.text
    // 恢复光标位置
    rescueCursor(event, nextState)
  }
}
const rescueCursor = (event, state) => {
  nextTick(() => {
    event.target.selectionStart = state.selectionStart
    event.target.selectionEnd = state.selectionEnd
    autoExpand(event, state.scrollY)
  })
}
</script>
<template>
  <textarea
    ref="textareaRef"
    v-model="diaryContent"
    @keydown="handleKeyDown"
    :placeholder="placeholder"
    @input="handleInput"
    :disabled="!status"
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

  @media screen and (max-width: 1200px) {
    padding: 12px;
  }
}

/* 用于模拟每个段落开头空两格的样式 */
textarea::placeholder,
textarea {
  text-indent: 2em; /* 段首缩进 */
}
</style>
