import { defineStore } from 'pinia'
import { ref } from 'vue'

const defaultDiary = [
  {
    diary_id: 'diary_1',
    title: 'Hello World 1',
    desc: 'some desc...haha',
    cover: '/deepSouls/src/assets/images/soul-note/note_1.webp',
    last_read_page: 1,
    pages: 3,
    author: 'author',
    create_time: Date.now(),
    update_time: Date.now()
  },
  {
    diary_id: 'diary_2',
    title: 'Hello World 2',
    desc: 'some desc...haha',
    cover: '/deepSouls/src/assets/images/soul-note/note_2.webp',
    author: 'author',
    last_read_page: 1,
    pages: 2,
    create_time: Date.now(),
    update_time: Date.now()
  },
  {
    diary_id: 'diary_3',
    title: 'Hello World 3',
    desc: 'some desc...haha',
    cover: '/deepSouls/src/assets/images/soul-note/note_3.webp',
    author: 'author',
    last_read_page: 1,
    pages: 2,
    create_time: Date.now(),
    update_time: Date.now()
  },
  {
    diary_id: 'diary_4',
    title: 'Hello World 4',
    cover: '/deepSouls/src/assets/images/soul-note/note_4.webp',
    desc: 'some desc...haha',
    author: 'author',
    last_read_page: 1,
    pages: 1,
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
      height: '150px',
      words: 10
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
      height: '150px',
      words: 10
    },
    create_time: Date.now(),
    update_time: Date.now()
  },
  {
    diary_book_id: 'diary_1',
    page: 3,
    title: 'Hello diary_1 3',
    content: 'Hello diary_1',
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: '150px',
      words: 10
    },
    create_time: Date.now(),
    update_time: Date.now()
  },
  {
    diary_book_id: 'diary_4',
    page: 1,
    title: 'Hello diary_4 3',
    content: 'Hello diary_4',
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: '150px',
      words: 10
    },
    create_time: Date.now(),
    update_time: Date.now()
  },
  {
    diary_book_id: 'diary_2',
    page: 1,
    title: 'Hello diary_2 3',
    content: 'Hello diary_2',
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: '150px',
      words: 10
    },
    create_time: Date.now(),
    update_time: Date.now()
  },
  {
    diary_book_id: 'diary_3',
    page: 2,
    title: 'Hello diary_3 3',
    content: 'Hello diary_3',
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: '150px',
      words: 10
    },
    create_time: Date.now(),
    update_time: Date.now()
  },
  {
    diary_book_id: 'diary_3',
    page: 1,
    title: 'Hello diary_3 3',
    content: 'Hello diary_3',
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: '150px',
      words: 10
    },
    create_time: Date.now(),
    update_time: Date.now()
  },
  {
    diary_book_id: 'diary_2',
    page: 2,
    title: 'Hello diary_2 3',
    content: 'Hello diary_2',
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: '150px',
      words: 10
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
    const updateDiary = ({ diary_id, title, desc }) => {
      // 根据 diary_id 更新 diary
      const index = diary.value.findIndex((item) => item.diary_id === diary_id)
      if (index !== -1) {
        diary.value[index].update_time = Date.now()
        diary.value[index].title = title
        diary.value[index].desc = desc
      }
      return true
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
    const addPage = (diary_book_id) => {
      const index = diary.value.findIndex(
        (item) => item.diary_id === diary_book_id
      )
      if (index === -1) return false
      // 添加 diary_page
      const page = {
        diary_book_id: diary_book_id,
        page: ++diary.value[index].pages,
        title: 'NEW PAGE',
        content: 'Hello World',
        context: {
          selectionStart: 0,
          selectionEnd: 0,
          scrollY: 0,
          height: '150px',
          words: 11
        },
        create_time: Date.now(),
        update_time: Date.now()
      }
      diaryPages.value.push(page)
      diary.value[index].last_read_page = page.page
      return true
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
    const getPages = (diary_book_id) => {
      return diaryPages.value.filter(
        (item) => item.diary_book_id === diary_book_id
      )
    }
    return {
      diary,
      diaryPages,
      setDiary,
      setPages,
      getDiary,
      getPage,
      getPages,
      updateDiary,
      updatePage,
      addPage
    }
  },
  {
    persist: true
  }
)
