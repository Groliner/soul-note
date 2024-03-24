import { defineStore } from 'pinia'
import { ref } from 'vue'

const defaultDiary = [
  {
    diary_id: 'diary_1',
    title: 'Hello World',
    pages: 3,
    create_time: Date.now(),
    update_time: Date.now()
  }
]
const defaultPages = [
  {
    diary_book_id: 'diary_1',
    page: 1,
    title: 'Hello World 1',
    content: 'Hello World',
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: '150px'
    },
    create_time: Date.now(),
    update_time: Date.now()
  },
  {
    diary_book_id: 'diary_1',
    page: 2,
    title: 'Hello World 2',
    content: 'Hello World',
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: '150px'
    },
    create_time: Date.now(),
    update_time: Date.now()
  },
  {
    diary_book_id: 'diary_1',
    page: 3,
    title: 'Hello World 3',
    content: 'Hello World',
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: '150px'
    },
    create_time: Date.now(),
    update_time: Date.now()
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
    const updateDiaryTitle = (diary_id, new_title) => {
      // 根据 diary_id 更新 diary
      const index = diary.value.findIndex((item) => item.diary_id === diary_id)
      if (index !== -1) {
        diary.value[index].update_time = Date.now()
        diary.value[index].title = new_title
      }
    }
    const updatePage = (diary_book_id, page, pageData) => {
      const index = diaryPages.value.findIndex(
        (item) => item.diary_book_id === diary_book_id
      )
      if (index !== -1) {
        const pageIndex = diaryPages.value[index].pages.findIndex(
          (item) => item.page === page
        )
        if (pageIndex !== -1) {
          diaryPages.value[index].pages[pageIndex] = pageData
        } else {
          diaryPages.value[index].pages.push(pageData)
        }
      } else {
        diaryPages.value.push({
          diary_book_id,
          pages: [pageData]
        })
      }
    }
    const getDiary = (diary_id) => {
      return diary.value.find((item) => item.diary_id === diary_id)
    }
    const getPage = (diary_book_id, page) => {
      const index = diaryPages.value.findIndex(
        (item) => item.diary_book_id === diary_book_id && item.page === page
      )
      if (index !== -1) {
        return diaryPages.value[index]
      }
    }
    return {
      diary,
      diaryPages,
      setDiary,
      setPages,
      getDiary,
      getPage,
      updateDiaryTitle,
      updatePage
    }
  },
  {
    persist: true
  }
)
