import { defineStore } from 'pinia'
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useUserStore } from './user'
import { ElMessage } from 'element-plus'
import {
  addDiaryAPI,
  deleteDiaryAPI,
  getDiaryListAPI,
  updateDiaryAPI
} from '@/api/diary'
import {
  getDiaryPageListAPI,
  addDiaryPageAPI,
  deleteDiaryPageAPI,
  updateDiaryPageAPI
} from '@/api/diaryPage'
const defaultDiary = [
  {
    id: 0,
    title: 'origin',
    description: 'the origin diary',
    height: 88,
    words: 3,
    cover:
      'https://java-spring-mybatis.oss-cn-beijing.aliyuncs.com/3431aace-c971-43f6-b5dc-592eef39d2dc.jpg',
    pages: 1,
    status: 'active',
    username: 'author',
    createdTime: Date.now(),
    updatedTime: Date.now()
  }
]
const defaultPages = {
  0: [
    {
      page: 1,
      title: 'origin',
      content: 'please add a new diary, click left pencil',
      status: 'disabled',
      context: {
        selectionStart: 0,
        selectionEnd: 0,
        scrollY: 0,
        height: 740,
        words: 10
      },
      createdTime: Date.now(),
      updatedTime: Date.now()
    }
  ]
}

export const useDiaryStore = defineStore(
  'diary',
  () => {
    const diary = ref([
      {
        id: 0,
        title: 'origin',
        description: 'the origin diary',
        height: 88,
        words: 3,
        cover:
          'https://java-spring-mybatis.oss-cn-beijing.aliyuncs.com/3431aace-c971-43f6-b5dc-592eef39d2dc.jpg',
        pages: 1,
        status: 'active',
        username: 'author',
        createdTime: Date.now(),
        updatedTime: Date.now()
      }
    ])
    const diaryPages = ref({
      0: [
        {
          page: 1,
          title: 'origin',
          content: 'please add a new diary, click left pencil',
          status: 'disabled',
          context: {
            selectionStart: 0,
            selectionEnd: 0,
            scrollY: 0,
            height: 740,
            words: 10
          },
          createdTime: Date.now(),
          updatedTime: Date.now()
        }
      ]
    })
    let notePlaceholder = `
                        there are some tips for writing diary：
                        1. crtl + z  --> undo.
                        2. crtl + y --> redo.
                        3. tab --> write a new paragraph.
                        4. Please don't create a diary or a page at random.
                        5. all you write down will auto save in the area when you go away.
                        6. Anytime there's a pop-up alert asking it's saved immediately.
    `
    const update = async () => {
      await getDiary()
      for (let i = 0; i < diary.value.length; i++) {
        await getDiaryPage(diary.value[i].id)
      }
    }
    const setDiary = (diary_ = defaultDiary) => {
      console.log(diary_)
      diary.value = diary_
    }
    const setPages = (page_ = defaultPages) => {
      console.log(page_)
      diaryPages.value = page_
    }
    const getDiary = async () => {
      const res = await getDiaryListAPI()
      if (res.data.data) {
        diary.value = res.data.data
        ElMessage.success('Diary loaded successfully')
        return true
      }
      ElMessage.error('Failed to load diary')
      setDiary()
      return false
    }
    const getDiaryPage = async (diaryId) => {
      const res = await getDiaryPageListAPI({ diaryId })
      if (res.data.data.length > 0) {
        diaryPages.value[diaryId] = res.data.data.map((item) => {
          return { ...item.diaryPage, context: item.diaryPageContext }
        })
        return true
      }
      setPages()
      return false
    }

    const addPage = async (diaryId) => {
      const index = diary.value.findIndex((item) => item.id === diaryId)
      const res = await addDiaryPageAPI({
        diaryId,
        page: ++diary.value[index].pages
      })
      if (res.data.data) {
        const diaryPage_ = res.data.data
        diaryPages.value[diaryId].push({
          ...diaryPage_.diaryPage,
          context: diaryPage_.diaryPageContext
        })
        ElMessage.success('Page added successfully')
        return true
      }
      diary.value[index].pages--
      ElMessage.error('Failed to add page')
      return false
    }
    const addDiary = async () => {
      const userStore = useUserStore()
      const res = await addDiaryAPI()
      if (res.data.data) {
        const diary_ = res.data.data
        const res_ = await getDiaryPage(diary_.id)
        if (res_) {
          diary.value.push(diary_)
          userStore.addLocalUserDiaryStatus(diary_.id)
          userStore.userInfo.lastReadDiaryId = diary_.id
          ElMessage.success('Diary added successfully')
          return diary_.id
        }
      }
      ElMessage.error('Failed to add diary')
      return false
    }
    const deletePage = async (id, page) => {
      const pageList = diaryPages.value[id]
      const index = pageList.findIndex((item) => item.page === page)
      if (index === 0) {
        ElMessage.error('Failed to delete the first page')
        return false
      } else if (index !== -1 && pageList[index].context.words) {
        ElMessage.error('Failed to delete the page with content')
        return false
      } else {
        const res = await deleteDiaryPageAPI(pageList[index].id)
        if (res.data.code) {
          const userStore = useUserStore()
          const lastReadPage =
            userStore.getLocalUserDiaryStatus(id).lastReadPage
          const maxPage = --diary.value.find((item) => item.id === id).pages
          if (maxPage < lastReadPage)
            userStore.updateLocalUserDiaryStatus({
              diaryId: id,
              lastReadPage: maxPage
            })
          diaryPages.value[id].splice(index, 1)
          ElMessage.success('Page deleted successfully')
          return true
        }
        ElMessage.error('Failed to delete page')
      }
      return false
    }
    const deleteDiary = async (id) => {
      const index = diary.value.findIndex((item) => item.id === id)
      if (index !== -1 && index !== 0) {
        const res = await deleteDiaryAPI(id)
        if (res.data.code) {
          const title = diary.value[index].title
          const userStore = useUserStore()
          userStore.deleteLocalUserDiaryStatus(id)
          diary.value.splice(index, 1)
          diaryPages.value[id] = []
          ElMessage.success(`Diary ${title} deleted successfully`)
          return true
        }
      }
      ElMessage.error('Failed to delete diary')
      return false
    }
    const saveDiary = async (diaryId) => {
      const index = diary.value.findIndex((item) => item.id == diaryId)
      if (index !== -1) {
        const res = await updateDiaryAPI(diary.value[index])
        if (res.data.code) {
          ElMessage.success('Diary saved successfully')
          return true
        }
      }
      ElMessage.error('Failed to save diary')
    }
    const savePage = async (diaryId, page) => {
      const pageList = diaryPages.value[diaryId]
      const index = pageList.findIndex(
        (item) => item.diaryId == diaryId && item.page == page
      )
      if (index !== -1) {
        const res = await updateDiaryPageAPI({
          diaryPage: pageList[index],
          diaryPageContext: pageList[index].context
        })
        if (res.data.code) {
          ElMessage.success('Page saved successfully')
          return true
        }
        ElMessage.error('Failed to save page')
      }
    }
    const getLocalDiaryById = (id) => diary.value.find((item) => item.id == id)
    const getLocalDiariesByUsername = (username) =>
      diary.value.filter((item) => item.username == username)

    const getLocalPageByDiaryId = (diaryId, page) => {
      const pageList = diaryPages.value[diaryId]
      const index = pageList.findIndex((item) => item.page == page)
      if (index !== -1) {
        return pageList[index]
      }
    }
    const getLocalPagesByDiaryId = (diaryId) => {
      return diaryPages.value[diaryId].filter((item) => item.diaryId == diaryId)
    }
    const updateLocalDiary = ({ id, title, description, height }) => {
      // 根据 id 更新 diary
      const index = diary.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        diary.value[index].updatedTime = dayjs().format('YYYY-MM-DDTHH:mm:ss')
        diary.value[index].title = title
        diary.value[index].description = description
        diary.value[index].height = height
      }
      return true
    }
    const updateLocalDiaryCover = ({ id, cover }) => {
      // 根据 id 更新 diary
      const index = diary.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        diary.value[index].cover = cover
      }
      return true
    }
    return {
      diary,
      diaryPages,
      notePlaceholder,
      update,
      setDiary,
      setPages,
      getDiary,
      getLocalDiaryById,
      getLocalDiariesByUsername,
      getLocalPageByDiaryId,
      getLocalPagesByDiaryId,
      updateLocalDiary,
      updateLocalDiaryCover,
      addPage,
      addDiary,
      deletePage,
      deleteDiary,
      saveDiary,
      savePage
    }
  },
  {
    persist: true
  }
)
