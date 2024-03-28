import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'

const defaultDiary = [
  {
    diary_id: 'diary',
    title: 'Hello World',
    desc: 'the origin diary',
    context: {
      height: 88,
      words: 10
    },
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
    context: {
      height: 88,
      words: 10
    },
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
    context: {
      height: 88,
      words: 10
    },
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
    context: {
      height: 88,
      words: 10
    },
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
    diary_book_id: 'diary',
    page: 1,
    title: 'Hello World 1',
    content: 'tab to write a new paragraph \n redo Crtl + z / undo Crtl + y ',
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: 220,
      words: 10
    },
    create_time: Date.now(),
    update_time: Date.now()
  },
  {
    diary_book_id: 'diary',
    page: 2,
    title: 'Hello World 2',
    content: 'Hello World',
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: 150,
      words: 10
    },
    create_time: Date.now(),
    update_time: Date.now()
  },
  {
    diary_book_id: 'diary',
    page: 3,
    title: 'Hello diary 3',
    content: 'Hello diary',
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: 150,
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
      height: 150,
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
      height: 150,
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
      height: 150,
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
      height: 150,
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
      height: 150,
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
    const updateDiary = ({ diary_id, title, desc, context }) => {
      // 根据 diary_id 更新 diary
      const index = diary.value.findIndex((item) => item.diary_id === diary_id)
      if (index !== -1) {
        diary.value[index].update_time = Date.now()
        diary.value[index].title = title
        diary.value[index].desc = desc
        diary.value[index].context = context
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
          height: 150,
          words: 11
        },
        create_time: Date.now(),
        update_time: Date.now()
      }
      diaryPages.value.push(page)
      diary.value[index].last_read_page = page.page
      return true
    }
    const addDiary = () => {
      const diary_id = `diary_${diary.value.length + 1}`
      diary.value.push({
        diary_id: diary_id,
        title: 'Hello World',
        context: {
          height: 88,
          words: 10
        },
        cover: '/deepSouls/src/assets/images/soul-note/note_1.webp',
        desc: 'some desc...',
        author: 'author',
        last_read_page: 0,
        pages: 0,
        create_time: Date.now(),
        update_time: Date.now()
      })
      if (addPage(diary_id)) {
        const userStore = useUserStore()
        userStore.addDiary(diary_id)
        return diary_id
      }
      diary.value.pop()
      return false
    }
    const deletePage = (diary_book_id, page) => {
      const index = diaryPages.value.findIndex(
        (item) => item.diary_book_id === diary_book_id && item.page == page
      )
      if (index !== -1 && page !== 1 && diary_book_id !== 'diary') {
        diaryPages.value.splice(index, 1)
        return true
      }
      return false
    }
    const deleteDiary = (diary_id) => {
      const index = diary.value.findIndex((item) => item.diary_id === diary_id)
      if (index !== -1 && index !== 0) {
        diaryPages.value = diaryPages.value.filter(
          (item) => item.diary_book_id !== diary_id
        )
        diary.value.splice(index, 1)
        const userStore = useUserStore()
        userStore.deleteDiary(diary_id)
        return true
      }
      return false
    }
    const getDiary = (diary_id) => {
      return diary.value.find((item) => item.diary_id == diary_id)
    }
    const getPage = (diary_book_id, page) => {
      const index = diaryPages.value.findIndex(
        (item) => item.diary_book_id === diary_book_id && item.page == page
      )
      if (index !== -1) {
        return diaryPages.value[index]
      }
    }
    const getPages = (diary_book_id) => {
      return diaryPages.value.filter(
        (item) => item.diary_book_id == diary_book_id
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
