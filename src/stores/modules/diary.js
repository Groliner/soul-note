import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'
import { ElMessage } from 'element-plus'

const defaultDiary = [
  {
    id: 'diary',
    title: 'origin',
    description: 'the origin diary',
    height: 88,
    words: 10,
    cover: '/deepSouls/src/assets/images/soul-note/note_1.webp',
    lastReadPage: 1,
    pages: 3,
    userId: 'author',
    createdTime: Date.now(),
    updatedTime: Date.now()
  },
  {
    id: 'diary_2',
    title: 'Hello World 2',
    description: 'some desc...haha',
    height: 88,
    words: 10,
    cover: '/deepSouls/src/assets/images/soul-note/note_2.webp',
    userId: 'author',
    lastReadPage: 1,
    pages: 2,
    createdTime: Date.now(),
    updatedTime: Date.now()
  },
  {
    id: 'diary_3',
    title: 'Hello World 3',
    description: 'some desc...haha',
    height: 88,
    words: 10,
    cover: '/deepSouls/src/assets/images/soul-note/note_3.webp',
    userId: 'author',
    lastReadPage: 1,
    pages: 2,
    createdTime: Date.now(),
    updatedTime: Date.now()
  },
  {
    id: 'diary_4',
    title: 'Hello World 4',
    height: 88,
    words: 10,
    cover: '/deepSouls/src/assets/images/soul-note/note_4.webp',
    description: 'some desc...haha',
    userId: 'author',
    lastReadPage: 1,
    pages: 1,
    createdTime: Date.now(),
    updatedTime: Date.now()
  }
]
const defaultPages = [
  {
    diaryId: 'diary',
    page: 1,
    title: 'origin',
    content:
      'tips: \n ' +
      'tab to write a new paragraph \n ' +
      'redo Crtl + z \n ' +
      'undo Crtl + y \n ' +
      'Please be sincere with every diary entry. \n ',
    status: 0,
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: 500,
      words: 10
    },
    createdTime: Date.now(),
    updatedTime: Date.now()
  },
  {
    diaryId: 'diary',
    page: 2,
    title: 'Hello World 2',
    content: 'Hello World',
    status: 1,
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: 150,
      words: 10
    },
    createdTime: Date.now(),
    updatedTime: Date.now()
  },
  {
    diaryId: 'diary',
    page: 3,
    title: 'Hello diary 3',
    content: 'Hello diary',
    status: 1,
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: 150,
      words: 10
    },
    createdTime: Date.now(),
    updatedTime: Date.now()
  },
  {
    diaryId: 'diary_4',
    page: 1,
    title: 'Hello diary_4 3',
    content: 'Hello diary_4',
    status: 1,
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: 150,
      words: 10
    },
    createdTime: Date.now(),
    updatedTime: Date.now()
  },
  {
    diaryId: 'diary_2',
    page: 1,
    title: 'Hello diary_2 3',
    content: 'Hello diary_2',
    status: 1,
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: 150,
      words: 10
    },
    createdTime: Date.now(),
    updatedTime: Date.now()
  },
  {
    diaryId: 'diary_3',
    page: 2,
    title: 'Hello diary_3 3',
    content: 'Hello diary_3',
    status: 1,
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: 150,
      words: 10
    },
    createdTime: Date.now(),
    updatedTime: Date.now()
  },
  {
    diaryId: 'diary_3',
    page: 1,
    title: 'Hello diary_3 3',
    content: 'Hello diary_3',
    status: 1,
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: 150,
      words: 10
    },
    createdTime: Date.now(),
    updatedTime: Date.now()
  },
  {
    diaryId: 'diary_2',
    page: 2,
    title: 'Hello diary_2 3',
    content: 'Hello diary_2',
    status: 1,
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: 150,
      words: 10
    },
    createdTime: Date.now(),
    updatedTime: Date.now()
  }
]
export const useDiaryStore = defineStore(
  'diary',
  () => {
    const diary = ref(defaultDiary)
    const diaryPages = ref(defaultPages)
    const setDiary = (diary = defaultDiary) => {
      diary.value = diary
    }
    const setPages = (page = defaultPages) => {
      diaryPages.value = page
    }
    const updateDiary = ({ id, title, description, context }) => {
      // 根据 id 更新 diary
      const index = diary.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        diary.value[index].updatedTime = Date.now()
        diary.value[index].title = title
        diary.value[index].description = description
        diary.value[index].context = context
      }
      return true
    }
    const addPage = (id) => {
      const index = diary.value.findIndex((item) => item.id === id)
      if (index === -1) return false
      // 添加 diary_page
      const page = {
        id: id,
        page: ++diary.value[index].pages,
        title: 'NEW PAGE',
        content: 'Hello World',
        status: 1,
        context: {
          selectionStart: 0,
          selectionEnd: 0,
          scrollY: 0,
          height: 150,
          words: 11
        },
        createdTime: Date.now(),
        updatedTime: Date.now()
      }
      diaryPages.value.push(page)
      diary.value[index].lastReadPage = page.page
      return true
    }
    const addDiary = () => {
      const id = `diary_${diary.value.length + 1}`
      diary.value.push({
        id: id,
        title: 'Hello World',
        height: 88,
        words: 10,
        cover: '/deepSouls/src/assets/images/soul-note/note_1.webp',
        description: 'some desc...',
        userId: 'author',
        pages: 0,
        createdTime: Date.now(),
        updatedTime: Date.now()
      })
      if (addPage(id)) {
        const userStore = useUserStore()
        userStore.addDiary(id)
        return id
      }
      diary.value.pop()
      return false
    }
    const deletePage = (id, page) => {
      const index = diaryPages.value.findIndex(
        (item) => item.id === id && item.page == page
      )
      const index_d = diary.value.findIndex((item) => item.id === id)
      if (page === 1) ElMessage.warning('The first page cannot be deleted')
      else if (diaryPages.value[index].content.length > 1)
        ElMessage.warning('Please delete the content first')
      else if (index !== -1 && id !== 'diary' && index_d !== -1) {
        diaryPages.value.splice(index, 1)
        diary.value[index_d].lastReadPage = --diary.value[index_d].pages
        return true
      }
      return false
    }
    const deleteDiary = (id) => {
      const index = diary.value.findIndex((item) => item.id === id)
      if (index !== -1 && index !== 0) {
        diaryPages.value = diaryPages.value.filter((item) => item.id !== id)
        diary.value.splice(index, 1)
        const userStore = useUserStore()
        userStore.deleteDiary(id)
        return true
      }
      return false
    }
    const getDiary = (id) => diary.value.find((item) => item.id == id)
    const getDiaries = (userId) =>
      diary.value.filter((item) => item.userId == userId)

    const getPage = (diaryId, page) => {
      const index = diaryPages.value.findIndex(
        (item) => item.diaryId === diaryId && item.page == page
      )
      if (index !== -1) {
        return diaryPages.value[index]
      }
    }
    const getPages = (diaryId) => {
      return diaryPages.value.filter((item) => item.diaryId == diaryId)
    }
    return {
      diary,
      diaryPages,
      setDiary,
      setPages,
      getDiary,
      getDiaries,
      getPage,
      getPages,
      updateDiary,
      addPage,
      addDiary,
      deletePage,
      deleteDiary
    }
  },
  {
    persist: true
  }
)
