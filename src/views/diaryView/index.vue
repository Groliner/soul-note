<script setup>
import { ref, nextTick, onMounted, onUnmounted, computed, watch } from 'vue'
import notePage from './note.vue'
import pagination from './pagination.vue'
import { useDiaryStore, useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { PhPencilLine } from '@phosphor-icons/vue'
const userStore = useUserStore()
const { userDiary, userInfo } = storeToRefs(userStore)
const lastReadDiaryId = computed(() => userInfo.value.lastReadDiaryId)
const diaryStore = useDiaryStore()
const userDiaryStatus = computed(() =>
  userStore.getLocalUserDiaryStatus(lastReadDiaryId.value)
)
const diary = computed(() =>
  diaryStore.getLocalDiaryById(lastReadDiaryId.value)
)
const diaryPage = computed(() =>
  diaryStore.getLocalPageByDiaryId(
    lastReadDiaryId.value,
    userDiaryStatus.value.lastReadPage
  )
)
import { useRoute } from 'vue-router'
const route = useRoute()
import { gsap } from 'gsap'
const mirror = ref(null)
const pageTitleInput = ref(null)
const isEditPageTitle = ref(false)
// 创建一个ResizeObserver来监听尺寸变化
const observer = new ResizeObserver((entries) => {
  for (let entry of entries) {
    if (entry.contentRect.width)
      // 更新<span>元素的宽度
      gsap.to(pageTitleInput.value, {
        width: entry.contentRect.width + 8,
        ease: 'power4.Out',
        duration: 0.3
      })
  }
})
onMounted(() => {
  // 开始观察<span>元素
  observer.observe(mirror.value)
  if (route.query.diaryId && route.query.page) {
    const diaryId = parseInt(route.query.diaryId)
    const lastReadPage = parseInt(route.query.page)
    userStore.setLocalLastReadDiaryId(diaryId)
    userStore.updateLocalUserDiaryStatus(
      {
        diaryId,
        lastReadPage
      },
      false
    )
  }
})
// 记得在组件卸载时停止观察
onUnmounted(() => {
  observer.disconnect()
  diaryStore.savePage(lastReadDiaryId.value, userDiaryStatus.value.lastReadPage)
  userInfo.value.tt = 10
})
const isAbleToEdit = computed(() =>
  diaryPage.value ? !!(diaryPage.value.status === 'active') : false
)
const handleEdit = (m) => {
  if (!isAbleToEdit.value) return
  isEditPageTitle.value = m
  if (!isEditPageTitle.value) return
  pageTitleInput.value.style.width = mirror.value.offsetWidth + 8 + 'px'
  // 此处聚焦要延时,否则无法聚焦,但是会引入魔法延迟
  // setTimeout(() => {
  //   pageTitleInput.value.focus()
  // }, 100)
  //nextTick允许在下一个“tick”执行代码，确保所有的DOM更新都已经完成。完美解决
  nextTick(() => {
    pageTitleInput.value.focus()
  })
  diaryPage.value.context.isEdited = true // 记录编辑状态
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

const handClick = (diaryId) => {
  diaryStore.savePage(lastReadDiaryId.value, userDiaryStatus.value.lastReadPage)
  messageManager.showDiaryEditModal(diaryId)
}
watch(
  [() => userDiaryStatus.value.lastReadPage, lastReadDiaryId],
  (
    [newLastReadPage, newLastReadDiaryId],
    [oldLastReadPage, oldLastReadDiaryId]
  ) => {
    diaryStore.savePage(oldLastReadDiaryId, oldLastReadPage)
  }
)
</script>
<template>
  <div class="container_note">
    <div class="diaryNav">
      <ul class="diaryNav_main">
        <li
          v-for="(item, index) in userDiary"
          :key="item.id"
          :data-index="index"
        >
          <a
            class="nav_link"
            :class="{
              active: userInfo.lastReadDiaryId === item.diaryId ? true : false
            }"
            @click="userInfo.lastReadDiaryId = item.diaryId"
            ><p>{{ diaryStore.getLocalDiaryById(item.diaryId).title }}</p></a
          >
          <ph-pencil-line
            class="icon_pencil"
            weight="duotone"
            @click="handClick(item.diaryId)"
          />
        </li>
      </ul>
    </div>
    <article>
      <h2 @mouseenter="handleEdit(true)" :class="{ active: isEditPageTitle }">
        <p v-show="isAbleToEdit" class="sub__">--</p>
        <input
          ref="pageTitleInput"
          v-model="diaryPage.title"
          @blur="handleEdit(false)"
          :class="{ hidden: !isEditPageTitle }"
          :disabled="!isAbleToEdit"
        />
        <span ref="mirror" :class="{ hidden: isEditPageTitle }">{{
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
          :placeholder="diaryStore.notePlaceholder"
          :status="isAbleToEdit"
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
  </div>
</template>
<style lang="scss" scoped>
.container_note {
  padding-bottom: 9.3rem;
  padding-top: 70px;
  @media screen and (max-width: 1200px) {
    padding-top: 88px;
  }
}
.diaryNav {
  will-change: transform;
  position: fixed;
  left: 50px;
  z-index: 100;
  @media screen and (max-width: 1200px) {
    left: 40px;
  }

  ul {
    color: rgb(68, 68, 68);
    padding: 0;

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
  left: -77px;
}
.diaryNav li .nav_link.active:before {
  left: -66px;
}
.diaryNav li .nav_link.active ~ .icon_pencil {
  opacity: 1;
  visibility: visible;
}

article {
  margin: 0 auto;
  width: 86%;

  h2 {
    position: fixed;
    top: 100px;
    left: 50%;
    width: max-content;
    transform: translateX(-50%);
    z-index: 100;
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
</style>
