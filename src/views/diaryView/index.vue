<script setup>
import { ref, nextTick, onMounted, onUnmounted, computed, watch } from 'vue'
import notePage from './note.vue'
import pagination from './pagination.vue'
import { useDiaryStore, useUserStore, useMessageStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { PhPencilLine } from '@phosphor-icons/vue'
import { formatTimeToSecond } from '@/composables/formatTime'

const userStore = useUserStore()
const messageStore = useMessageStore()
const { userDiary, userInfo, userPreferences } = storeToRefs(userStore)
const lastReadDiaryId = computed(() => {
  const diaryId = userPreferences.value.lastReadDiaryId
  if (diaryId === 0) {
    userStore.setLocalLastReadDiaryId(userDiary.value[0].diaryId)
  }
  return userPreferences.value.lastReadDiaryId
})
const diaryStore = useDiaryStore()
const userDiaryStatus = computed(() => userStore.getLocalUserDiaryStatus(lastReadDiaryId.value))
const diary = computed(() => diaryStore.getLocalDiaryById(lastReadDiaryId.value))
const diaryPage = computed(() =>
  diaryStore.getLocalPageByDiaryId(lastReadDiaryId.value, userDiaryStatus.value.lastReadPage)
)
import { gsap } from 'gsap'
const originalTitle = ref('')
const pageTitleInputMirrorRef = ref(null)
const pageTitleInputRef = ref(null)
const isEditPageTitle = ref(false)
// 创建一个ResizeObserver来监听尺寸变化
const observer = new ResizeObserver((entries) => {
  for (let entry of entries) {
    if (entry.contentRect.width)
      // 更新<span>元素的宽度
      gsap.to(pageTitleInputRef.value, {
        width: entry.contentRect.width + 8,
        ease: 'power4.Out',
        duration: 0.3
      })
  }
})
onMounted(() => {
  userStore.updateUserInfo()
  diaryStore.init()
  // 开始观察<span>元素
  observer.observe(pageTitleInputMirrorRef.value)

  // 直接在跳转前设置相关状态，这里不再需要
  // if (route.query.diaryId && route.query.page) {
  //   const diaryId = parseInt(route.query.diaryId)
  //   const lastReadPage = parseInt(route.query.page)
  //   userStore.setLocalLastReadDiaryId(diaryId)
  //   userStore.updateLocalUserDiaryStatus(
  //     {
  //       diaryId,
  //       lastReadPage
  //     },
  //     false
  //   )
  // }
})
// 记得在组件卸载时停止观察
onUnmounted(() => {
  observer.disconnect()
  diaryStore.savePage(lastReadDiaryId.value, userDiaryStatus.value.lastReadPage)
  userInfo.value.tt = 10
})
const isAbleToEdit = computed(
  () => (diaryPage.value ? diaryPage.value.status === 'private' : false)
  //diaryPage.value ? diaryPage.value.status === 'active' : false
)
const handlePageTitleEdit = () => {
  if (!isAbleToEdit.value) return
  originalTitle.value = diaryPage.value.title
  isEditPageTitle.value = true
  pageTitleInputRef.value.style.width = pageTitleInputMirrorRef.value.offsetWidth + 8 + 'px'
  // 此处聚焦要延时,否则无法聚焦,但是会引入魔法延迟
  // setTimeout(() => {
  //   pageTitleInputRef.value.focus()
  // }, 100)
  //nextTick允许在下一个“tick”执行代码，确保所有的DOM更新都已经完成。完美解决
  nextTick(() => {
    pageTitleInputRef.value.focus()
  })
}
const handlePageTitleSave = () => {
  isEditPageTitle.value = false
  if (diaryPage.value.title !== originalTitle.value) diaryPage.value.context.isEdited = true // 记录编辑状态
}

//编辑日记本
import { messageManager } from '@/directives/index'

const handleAdd = () => {
  diaryStore.addPage(lastReadDiaryId.value)
}
const handleFlip = (m) => {
  userStore.updateLocalUserDiaryStatus({
    diaryId: lastReadDiaryId.value,
    lastReadPage: Math.min(
      Math.max(userDiaryStatus.value.lastReadPage + m, 1),
      diary.value.pages || userDiaryStatus.value.lastReadPage
    )
  })
}

const handDiaryEditClick = (diaryId) => {
  diaryStore.savePage(lastReadDiaryId.value, userDiaryStatus.value.lastReadPage)
  messageManager.showDiaryEditModal(diaryId)
}
watch(
  [() => userDiaryStatus.value.lastReadPage, lastReadDiaryId],
  ([newLastReadPage, newLastReadDiaryId], [oldLastReadPage, oldLastReadDiaryId]) => {
    diaryStore.savePage(oldLastReadDiaryId, oldLastReadPage)
    if (newLastReadDiaryId !== oldLastReadDiaryId) {
      userStore.setLocalLastReadDiaryId(newLastReadDiaryId)
    }
  }
)
const handleSave = async () => {
  const result = await diaryStore.savePage(
    lastReadDiaryId.value,
    userDiaryStatus.value.lastReadPage
  )
  if (result == 2) {
    ElMessage({
      message: messageStore.diaryPageConstant['SAVED'],
      grouping: true,
      type: 'info'
    })
  }
}

function onBeforeEnter(el) {
  el.style.opacity = 0
  el.style.height = 0
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: 'auto',
    delay: 0.15,
    onComplete: done
  })
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: 0.14,
    onComplete: done
  })
}
</script>
<template>
  <div class="container_note">
    <!-- 日记本的列表 -->
    <div class="diaryNav">
      <TransitionGroup
        tag="ul"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
        class="diaryNav_main"
      >
        <!--  -->
        <li v-for="(item, index) in userDiary" :key="item.id" :data-index="index">
          <a
            class="nav_link"
            :class="{
              active: lastReadDiaryId === item.diaryId ? true : false
            }"
            @click="userPreferences.lastReadDiaryId = item.diaryId"
            ><p>{{ diaryStore.getLocalDiaryById(item.diaryId).title }}</p></a
          >
          <ph-pencil-line
            class="icon_pencil"
            weight="duotone"
            @click="handDiaryEditClick(item.diaryId)"
          />
        </li>
      </TransitionGroup>
    </div>
    <!-- 日记本区域 -->
    <article>
      <!-- 日记本的标题，具有快速编辑功能 -->
      <h2 @mouseenter="handlePageTitleEdit()" :class="{ active: isEditPageTitle }">
        <p v-show="isAbleToEdit" class="sub__">--</p>
        <input
          ref="pageTitleInputRef"
          v-model="diaryPage.title"
          @blur="handlePageTitleSave()"
          :class="{ hidden: !isEditPageTitle }"
          :disabled="!isAbleToEdit"
        />
        <span ref="pageTitleInputMirrorRef" :class="{ hidden: isEditPageTitle }">{{
          diaryPage.title || '"Untitled"'
        }}</span>
        <p v-show="isAbleToEdit" class="sup__">--</p>
      </h2>

      <Transition name="fade">
        <notePage
          v-model:context="diaryPage.context"
          v-model:content="diaryPage.content"
          :page="diaryPage.page"
          :diaryId="diary.id"
          :placeholder="messageStore.diaryPageConstant['HINTS']"
          :status="isAbleToEdit"
          @save="handleSave"
        />
      </Transition>
    </article>
    <pagination
      class="pagination"
      :total="diary.pages"
      v-model:page="userDiaryStatus.lastReadPage"
      @add="handleAdd"
      @flip="handleFlip"
    />
    <div class="update_time">
      <p>
        {{ userStore.selectLanguage === 'en-US' ? 'Updated at' : '更新于' }}:
        {{ formatTimeToSecond(diaryPage.update_time) }}
      </p>
    </div>
    <div class="button_save">
      <div class="mapper">
        <button @click="handleSave" class="custom-btn btn-16">
          {{ userStore.selectLanguage === 'en-US' ? 'SAVE' : '保存' }}
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container_note {
  padding-bottom: 9.3rem;
  padding-top: 70px;
  @media screen and (max-width: 1200px) {
    padding-top: 40px;
  }
}
.diaryNav {
  will-change: transform;
  position: fixed;
  left: 0;
  z-index: 100;
  // @media screen and (max-width: 1200px) {
  //   left: 40px;
  //   top: 10vh;
  // }
  // @media screen and (max-width: 800px) {
  //   left: 30px;
  // }

  ul {
    color: rgb(68, 68, 68);
    padding-left: 2rem;
    height: 70vh;
    overflow-y: scroll;
    user-select: none;
    padding-right: 1.8rem;
    &::-webkit-scrollbar {
      width: 0;
      height: 2px;
    }
    &.diaryNav_main {
      a {
        font-size: 1.6rem;
        p {
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 6em;
          overflow: hidden;
        }
      }
    }

    li {
      margin-bottom: 0.5vw;
      position: relative;
      list-style: none;
      width: fit-content;
    }
  }
}

.nav_link {
  cursor: pointer;

  &:before {
    content: '';
    position: absolute;
    width: 50px;
    height: 6.6px;
    background-color: rgb(68, 68, 68);
    left: -100px;
    top: 50%;
    transition: 0.4s;
  }
}
.icon_pencil {
  position: absolute;
  right: -1.2em;
  font-size: 1.4em;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: 0.3s ease-in;
  opacity: 0;
  visibility: hidden;

  &:hover {
    color: var(--primary-light);
  }
}

.diaryNav li .nav_link:hover:before {
  left: -67px;
}
.diaryNav li .nav_link.active:before {
  left: -56px;
}
.diaryNav li .nav_link.active ~ .icon_pencil {
  opacity: 1;
  visibility: visible;
}

article {
  margin: 0 auto;
  width: 86%;
  @media screen and (max-width: 1000px) {
    width: 72%;
  }

  h2 {
    position: fixed;
    top: 80px;
    left: 50%;
    width: max-content;
    transform: translateX(-50%);
    z-index: 100;
    font-size: 1.8em;
    @media screen and (max-width: 1200px) {
      top: 51px;
    }
    input {
      background-color: transparent;
      outline: none;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      height: 2rem;
    }
    span {
      width: inherit;
      white-space: pre;
    }
    .hidden {
      visibility: hidden;
      position: fixed;
    }
    p.sub__,
    p.sup__ {
      transition: transform 0.3s ease;
      display: inline-block;
    }
    &:hover p.sub__,
    &.active p.sub__ {
      transform: translateX(-6.6px);
    }
    &:hover p.sup__,
    &.active p.sup__ {
      transform: translateX(6.6px);
    }
  }
}
.update_time {
  width: 88%;
  margin: 0 auto;
  display: flex;
  height: 2em;
  align-items: center;
  justify-content: flex-end;
  p {
    font-size: 1.2em;
    margin: 0;
  }
}

.button_save {
  .mapper {
    margin: 0 auto;
    width: fit-content;
  }
  .custom-btn {
    width: 6.6em;
    height: 2.7em;
    border-radius: 5px;
    font-family: inherit;
    font-weight: 500;
    font-size: 1em;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    box-shadow:
      inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
      7px 7px 20px 0px rgba(0, 0, 0, 0.1),
      4px 4px 5px 0px rgba(0, 0, 0, 0.1);
    outline: none;
  }
  /* 16 */
  .btn-16 {
    border: none;
    color: #000;
  }
  .btn-16:after {
    position: absolute;
    content: '';
    width: 0;
    height: 100%;
    top: 0;
    left: 0;
    direction: rtl;
    z-index: -1;
    box-shadow:
      -7px -7px 20px 0px #fff9,
      -4px -4px 5px 0px #fff9,
      7px 7px 20px 0px #0002,
      4px 4px 5px 0px #0001;
    transition: all 0.3s ease;
  }
  .btn-16:hover {
    color: var(--primary-light);
  }
  .btn-16:hover:after {
    left: auto;
    right: 0;
    width: 100%;
  }
  .btn-16:active {
    top: 2px;
    color: var(--primary);
  }
}
</style>
