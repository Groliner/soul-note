<script setup>
import { ref, nextTick, onMounted, onUnmounted, computed } from 'vue'
import notePage from './note.vue'
import pagination from './pagination.vue'
import { useDiaryStore, useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { PhPencilLine } from '@phosphor-icons/vue'
const userStore = useUserStore()
const { user_diary } = storeToRefs(userStore)
const diaryStore = useDiaryStore()
const diary = computed(() =>
  diaryStore.getDiary(user_diary.value.last_read_diary_id)
)
const diaryPage = computed(() =>
  diaryStore.getPage(
    user_diary.value.last_read_diary_id,
    diary.value.last_read_page
  )
)

import { gsap } from 'gsap'
const mirror = ref(null)
const pageTitleInput = ref(null)
const isEditPageTitle = ref(false)
onMounted(() => {
  if (mirror.value) {
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

    // 开始观察<span>元素
    observer.observe(mirror.value)

    // 记得在组件卸载时停止观察
    onUnmounted(() => {
      observer.disconnect()
    })
  }
})
const handleEdit = (m) => {
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
}

//编辑日记本

import editPop from './editPop.vue'
import { ElMessage } from 'element-plus'
const pop = ref(false)

const handleAdd_ = () => {
  if (diaryStore.addPage(user_diary.value.last_read_diary_id)) {
    ElMessage.success('Add page successfully')
  } else {
    ElMessage.warning('Add page failed')
  }
}
</script>
<template>
  <div class="container_note">
    <div class="diaryNav">
      <ul class="diaryNav_main">
        <li
          v-for="(item, index) in user_diary.diaries"
          :key="item"
          :data-index="index"
        >
          <a
            class="nav_link"
            :class="{
              active: user_diary.last_read_diary_id === item ? true : false
            }"
            @click="user_diary.last_read_diary_id = item"
            >{{ item }}</a
          >
          <ph-pencil-line
            class="icon_pencil"
            weight="duotone"
            @click="pop = true"
          />
        </li>
      </ul>
    </div>
    <article>
      <h2 @mouseenter="handleEdit(true)" :class="{ active: isEditPageTitle }">
        <p class="sub__">--</p>
        <input
          ref="pageTitleInput"
          v-model="diaryPage.title"
          @blur="handleEdit(false)"
          :class="{ hidden: !isEditPageTitle }"
        />
        <span ref="mirror" :class="{ hidden: isEditPageTitle }">{{
          diaryPage.title || '"Untitled"'
        }}</span>
        <p class="sup__">--</p>
      </h2>

      <Transition name="fade">
        <notePage
          v-model:context="diaryPage.context"
          v-model:content="diaryPage.content"
          :page="diaryPage.page"
          :diaryId="diary.diary_id"
        />
      </Transition>
    </article>
    <pagination
      class="pagination"
      :total="diary.pages"
      v-model:page="diary.last_read_page"
      @add="handleAdd_"
    />
    <Teleport to="body">
      <editPop :diaryId="user_diary.last_read_diary_id" v-model:open="pop" />

      ></Teleport
    >
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

  ul {
    color: rgb(68, 68, 68);
    padding: 0;

    &.diaryNav_main {
      a {
        font-size: 1.97rem;
      }
    }

    li {
      margin-bottom: 0.5vw;
      position: relative;
      list-style: none;
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
