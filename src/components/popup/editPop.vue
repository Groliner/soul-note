<script setup>
/*
编辑日记
删除,编辑,添加,查看日记

*/
import { gsap } from 'gsap'
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { formatTime } from '@/composables/formatTime'
import { useDiaryStore, useUserStore } from '@/stores'
const props = defineProps({
  diaryId: {
    type: Number
  },
  status: {
    type: Boolean,
    default: false
  }
})
const diaryId = ref(props.diaryId)
const open = ref(false)
onMounted(() => {
  open.value = true
  nextTick(() => {
    textareaDesc.value.style.height = diaryRef.value.height + 'px'
  })
})
const userStore = useUserStore()
const diaryStore = useDiaryStore()
const diaryRef = ref(diaryStore.getLocalDiaryById(diaryId.value))
const diaryPagesRef = computed(() =>
  diaryStore.getLocalPagesByDiaryId(diaryId.value)
)
const diaryInfo = computed(() => {
  return {
    author: userStore.getUsernameById(diaryRef.value.userId),
    lastReadPage: userStore.getLocalUserDiaryStatus(diaryId.value).lastReadPage,
    totalPages: diaryRef.value.pages,
    words: diaryRef.value.words,
    createdTime: formatTime(diaryRef.value.createdTime),
    updatedTime: formatTime(diaryRef.value.updatedTime)
  }
})
const diaryPageInfo = computed(() =>
  diaryPagesRef.value
    .filter((page) =>
      (page.page + page.title).toLowerCase().includes(query.value.toLowerCase())
    )
    .toSorted((a, b) => -a.page + b.page)
)
const textareaDesc = ref(null)

const menu = ref(['Overview', 'Others'])
const select = ref(0)
// popup
import {
  PhTrash,
  PhPlusSquare,
  PhMagnifyingGlass,
  PhFilePlus,
  PhBackspace
} from '@phosphor-icons/vue'
import { messageManager } from '@/directives/index'
const pretty = () => {
  query.value = ''
  select.value = 0
}
watch(diaryRef, () => {
  pretty()
})
const handleAdd = () => {
  // 向后端发送请求,返回新的日记
  messageManager
    .showConfirmModal('Want to add a new diary?', {
      mask: false,
      pressTime: 80,
      draggable: true
    })
    .then(async (res) => {
      if (res) {
        const _diaryId = await diaryStore.addDiary()
        diaryId.value = _diaryId
        diaryRef.value = diaryStore.getLocalDiaryById(_diaryId)
      }
    })
}

const handleDelete = () => {
  messageManager
    .showConfirmModal('Are you sure to delete the diary?', {
      mask: false,
      pressTime: 80,
      draggable: true
    })
    .then((res) => {
      open.value = false
      if (res) {
        diaryStore.deleteDiary(diaryId.value)
      }
    })
}
const handleDeletePage = () => {
  messageManager
    .showConfirmModal('Are you sure to delete the page (past)? ', {
      mask: false,
      pressTime: 60,
      draggable: true
    })
    .then(async (res) => {
      if (res) {
        await diaryStore.deletePage(diaryRef.value.id, diaryRef.value.pages)
      }
    })
}
const handleSave = async () => {
  // 保存日记信息
  const res = await diaryStore.saveDiary(diaryId.value, true)
  open.value = res ? false : true
  // 添加动画
}

// textarea 动画
function autoExpand(event) {
  const textarea = event.target
  textarea.style.height = 'auto'
  // 然后设置为scrollHeight以适应内容
  textarea.style.height = textarea.scrollHeight + 'px'
  nextTick(() => {
    diaryRef.value.height = textarea.scrollHeight
    diaryRef.value.words = textarea.value.replace(/\s+/g, '').trim().length
    diaryRef.value.isEdited = true
  })
}

// search
const query = ref('')

// list 动画
function onBeforeEnter(el) {
  el.style.opacity = 0
  el.style.height = 0
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: 'auto',
    delay: el.dataset.index * 0.06,
    onComplete: done
  })
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: el.dataset.index * 0.05,
    onComplete: done
  })
}

// cover upload
import { uploadImgAPI } from '@/api/fundamental'
const coverInput = ref(null)

// 触发文件选择
const triggerUpload = () => {
  coverInput.value.click() // 打开文件选择对话框
  // 使用GSAP添加一些动画，例如按钮点击反馈
  gsap.to(coverInput.value, {
    opacity: 0.7,
    yoyo: true,
    repeat: 1,
    duration: 0.5
  })
}

// 处理文件选择
const handleCoverChange = async (event) => {
  const files = event.target.files
  if (files.length > 0) {
    const formData = new FormData()
    formData.append('image', files[0])
    const res = await uploadImgAPI(formData)
    diaryStore.updateLocalDiaryCover({
      id: diaryRef.value.id,
      cover: res.data.data
    })
  }
}
import router from '@/router'
// 添加页面跳转
const handleGoTo = (page) => {
  router.push({
    name: 'diary',
    query: {
      diaryId: diaryRef.value.id,
      page: page
    }
  })
  userStore.updateLocalUserDiaryStatus(
    {
      diaryId: diaryRef.value.id,
      lastReadPage: page
    },
    false
  )
  open.value = false
}
</script>
<template>
  <Transition name="popup">
    <div
      v-if="open"
      style="position: fixed; top: 0; z-index: 600; width: 100%; height: 100%"
    >
      <div class="mask"></div>
      <div class="edit-pop">
        <div
          class="mirror"
          :style="`
          background:url(${diaryRef.cover});
          background-size: cover;
          background-position: center;`"
        ></div>
        <header class="header">
          <div class="header-buttons">
            <button class="avatar" disabled>
              <img :src="userStore.userInfo.avatar" />
            </button>
            <p>{{ userStore.userInfo.username }}</p>
          </div>
          <div class="header-title">
            <ph-plus-square class="add" weight="bold" @click="handleAdd" />
            <h2>Diary</h2>
            <ph-trash weight="bold" class="delete" @click="handleDelete" />
          </div>
          <div class="header-buttons">
            <button class="cover" @click="triggerUpload">
              <img :src="diaryRef.cover" />
            </button>
            <input
              type="file"
              ref="coverInput"
              @change="handleCoverChange"
              style="display: none"
            />
          </div>
        </header>
        <section class="title">
          <h3>
            <flexInput
              v-model:text="diaryRef.title"
              placeholder="diary title"
            />
          </h3>
          <p>
            <textarea
              style="
                max-height: 180px;
                overflow: auto;
                background-attachment: local;
              "
              ref="textareaDesc"
              v-model="diaryRef.description"
              placeholder="diary description"
              @input="autoExpand"
            ></textarea>
          </p>
        </section>
        <section class="search">
          <div class="search-inner">
            <button class="search-button">
              <ph-magnifying-glass class="search_icon" />
            </button>
            <input
              v-model="query"
              type="text"
              class="search-input"
              placeholder="Search Pages"
            />
          </div>
        </section>
        <nav class="navigation">
          <a
            v-for="(item, index) in menu"
            :key="item"
            :class="{ 'navigation-item': true, active: index === select }"
            @click="select = index"
            >{{ item }}</a
          >
        </nav>
        <section class="profile">
          <Transition
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @leave="onLeave"
          >
            <TransitionGroup
              tag="ul"
              v-show="select === 0"
              :class="menu[0]"
              @before-enter="onBeforeEnter"
              @enter="onEnter"
              @leave="onLeave"
            >
              <li
                v-for="(item, index) in diaryPageInfo"
                :key="item.title"
                :data-index="index"
              >
                <span
                  @click="handleGoTo(item.page)"
                  :class="{ active: item.page === diaryInfo.lastReadPage }"
                  >{{ item.page }}-{{ item.title }}</span
                >

                <span>words:{{ item.context.words }}</span>
                <span>{{ formatTime(item.createdTime) }}</span>
                <ph-backspace
                  v-if="
                    item.page === diaryRef.pages && item.status !== 'disable'
                  "
                  weight="bold"
                  @click="handleDeletePage"
                  class="icon del"
                />
              </li>
              <li key="icon_add">
                <ph-file-plus
                  weight="bold"
                  @click="diaryStore.addPage(diaryRef.id)"
                  class="icon add"
                />
              </li> </TransitionGroup
          ></Transition>
          <Transition
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @leave="onLeave"
          >
            <ul v-show="select === 1" :class="menu[1]">
              <li
                v-for="(value, key, index) in diaryInfo"
                :key="key"
                :data-index="index"
              >
                <span>{{ key }}</span>
                <span>{{ value }}</span>
              </li>
            </ul></Transition
          >
        </section>
        <footer class="selection">
          <button class="selection-item" @click="handleSave">Save</button>
          <button class="selection-item" @click="open = false">Cancel</button>
        </footer>
      </div>
    </div></Transition
  >
</template>
<style lang="scss" scoped>
textarea {
  font-size: inherit;
  width: 100%;
  background-image: linear-gradient(to top, #e68a69 1.2px, #faf5e9 1.6px);
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
  position: relative;
  ul {
    padding: 0;
    /* 自定义滚动条的整体部分 */
    &::-webkit-scrollbar {
      width: 4px; /* 设置滚动条的宽度 */
      height: 4px; /* 设置滚动条的高度，对水平滚动条有效 */
    }

    &.Overview {
      max-height: 30vh;
      overflow-y: scroll;
    }
    li {
      list-style: none;
      display: grid;
      grid-template-columns: 3fr 1fr min-content 30px;
      justify-content: space-round;
      align-items: center;

      span:first-child {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 95%;
        cursor: pointer;

        &.active {
          color: var(--primary);
          &:hover {
            color: var(--primary-dark);
          }
        }
        &:not(.active):hover {
          color: var(--primary-light);
        }
      }

      .icon {
        &.del {
          margin-left: auto;
          font-size: 1.2rem;
          &:hover {
            color: var(--c-red-500);
          }
        }
        &.add {
          position: absolute;
          bottom: -2em;
          font-size: 1.5rem;
          &:hover {
            color: var(--c-green-300);
          }
        }

        cursor: pointer;
      }
    }
  }
  ul:last-child li {
    list-style: none;
    display: flex;
    justify-content: space-between;
  }
}

input,
button {
  font: inherit;
}

.edit-pop {
  max-width: 88vw;
  min-width: 47vw;
  border-radius: 25px;
  overflow: hidden;
  padding: 2rem;
  box-shadow:
    0 0 0 8px var(--c-gray-300),
    0 0 0 7px var(--c-gray-200);
  background-color: #fff;
  @include absCenter;
  z-index: 302;
  @media screen and (max-width: 900px) {
    width: 100vw;
    box-shadow:
      0 0 0 2px var(--c-gray-300),
      0 0 0 2px var(--c-gray-200);
  }
  .mirror {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    filter: opacity(0.4) blur(4px);
  }
}

.mask {
  will-change: opacity;
  width: 100vw;
  height: 100vh;
  background-color: rgba(37, 33, 32, 0.2);
  position: fixed;
  background-color: rgba(224, 221, 209, 0.701961);
  z-index: 301;
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
  position: relative;
  user-select: none;

  .delete {
    position: absolute;
    right: -100%;
    top: 0.6rem;
    font-size: 1.6rem;
    cursor: pointer;

    &:hover {
      color: var(--c-red-500);
    }
    &:active {
      color: black;
    }
  }
  .add {
    position: absolute;
    left: -100%;
    top: 0.6rem;
    font-size: 1.6rem;
    cursor: pointer;

    &:hover {
      color: var(--c-green-300);
    }
    &:active {
      color: black;
    }
  }
}

.header-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &:first-child {
    justify-content: flex-start;
  }

  p {
    font-size: 1.2em;
  }
}

.cover {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4rem;
  height: 4rem;
  padding: 0;
  border-radius: 15px;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 8px 10px -4px rgba(#000, 0.2);
  transform-origin: center center;
  transition: 0.15s ease;
  cursor: pointer;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
  &:hover,
  &:focus {
    box-shadow: 0 10px 12px -4px rgba(#000, 0.3);
  }
}
.avatar {
  width: 4rem;
  height: 4rem;
  padding: 0;
  border-radius: 15px;
  overflow: hidden;
  border: 3px solid #fff;
  transform-origin: center center;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: top;
  }
}

.title {
  margin-top: 1rem;
  h3 {
    width: 95%;
    font-size: 1.8rem;
    font-weight: 500;
  }

  p {
    font-size: 1.5rem;
    color: var(--c-gray-500);
    margin-top: 0.375em;
  }
}

.search {
  position: relative;
}

.search-inner {
  display: flex;
  align-items: center;
  border: 2px solid var(--c-gray-900);
  border-radius: 15px;
  height: 3rem;
  font-size: 1rem;
  width: 66%;
  background-color: #fff;
  position: relative;
  margin-top: 1rem;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px 0 0 15px;
  border: 0;
  background-color: var(--c-gray-100);
  position: relative;
  height: 100%;
  border-right: 2px solid var(--c-gray-900);
  width: 14%;
  i {
    font-size: 1.25em;
  }

  .search_icon {
    font-size: 1.25em;
  }
}

.search-input {
  border: 0;
  border-radius: 0 15px 15px 0;
  height: 100%;
  background-color: #fff;
  width: 100%;
  padding-left: 1em;
  padding-right: 1em;
  &:focus {
    outline: 0;
  }
  &::placeholder {
    font-weight: 600;
    color: var(--c-gray-900);
    transition: 0.15s ease;
  }
}

.navigation {
  margin-top: 1.23rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--c-gray-900);
  display: flex;
  justify-content: flex-start;
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
