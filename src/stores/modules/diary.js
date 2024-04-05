import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'
import { ElMessage } from 'element-plus'
import { addDiaryAPI, deleteDiaryAPI, getDiaryListAPI } from '@/api/diary'
import { getUserDiaryStatusAPI } from '@/api/userDiaryStatus'
import {
  getDiaryPageListAPI,
  addDiaryPageAPI,
  deleteDiaryPageAPI
} from '@/api/diaryPage'
const defaultDiary = [
  {
    id: 1,
    title: 'origin',
    description: 'the origin diary',
    height: 88,
    words: 3,
    cover: '/deepSouls/src/assets/images/soul-note/note_1.webp',
    pages: 0,
    status: 'active',
    username: 'author',
    createdTime: Date.now(),
    updatedTime: Date.now()
  }
]
const defaultPages = [
  {
    diaryId: 1,
    page: 1,
    title: 'origin',
    content:
      'tips: \n ' +
      'tab to write a new paragraph \n ' +
      'redo Crtl + z \n ' +
      'undo Crtl + y \n ' +
      'Please be sincere with every diary entry. \n ',
    status: 'disabled',
    context: {
      selectionStart: 0,
      selectionEnd: 0,
      scrollY: 0,
      height: 500,
      words: 10
    },
    createdTime: Date.now(),
    updatedTime: Date.now()
  }
]
export const useDiaryStore = defineStore(
  'diary',
  () => {
    const diary = ref(JSON.parse(JSON.stringify(defaultDiary)))
    const diaryPages = ref(JSON.parse(JSON.stringify(defaultPages)))
    const update = async () => {
      await getDiary()
      for (let i = 0; i < diary.value.length; i++) {
        await getDiaryPage(diary.value[i].id)
      }
    }
    const setDiary = (diary = defaultDiary) => {
      diary.value = diary
    }
    const setPages = (page = defaultPages) => {
      diaryPages.value = page
    }
    const getDiary = async () => {
      const res = await getDiaryListAPI()
      if (res.data.data) {
        diary.value = res.data.data
        ElMessage.success('Diary loaded successfully')
        return true
      }
      ElMessage.error('Failed to load diary')
      return false
    }
    const getDiaryPage = async (diaryId) => {
      const res = await getDiaryPageListAPI({ diaryId })
      if (res.data.data.length > 0) {
        diaryPages.value = res.data.data.map((item) => {
          console.log(item)
          return { ...item.diaryPage, context: item.diaryPageContext }
        })
        return true
      }
      return false
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
    const addPage = async (diaryId) => {
      const res = await addDiaryPageAPI({ diaryId })
      if (res.data.data) {
        const diaryPage_ = res.data.data
        diaryPages.value.push({
          ...diaryPage_.diaryPage,
          context: diaryPage_.diaryPageContext
        })
        ElMessage.success('Page added successfully')
        await getDiary()
        return true
      }
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
          userStore.getUserDiaryStatus()
          return diary_.id
        }
      }
      return false
    }
    const deletePage = async (id, page) => {
      const index = diaryPages.value.findIndex(
        (item) => item.diaryId === id && item.page === page
      )
      if (index !== -1 && index !== 0) {
        const res = await deleteDiaryPageAPI(diaryPages.value[index].id)
        if (res.data.code) {
          diaryPages.value.splice(index, 1)
          getDiary()
          ElMessage.success('Page deleted successfully')
          return true
        }
      }
      ElMessage.error('Failed to delete page')
      return false
    }
    const deleteDiary = async (id) => {
      const index = diary.value.findIndex((item) => item.id === id)
      if (index !== -1 && index !== 0) {
        const res = await deleteDiaryAPI(id)
        if (res.data.code) {
          const title = diary.value[index].title
          diary.value.splice(index, 1)
          await getDiary()
          const userStore = useUserStore()
          await userStore.getUserDiaryStatus()
          ElMessage.success('Diary' + title + ' deleted successfully')
          return true
        }
      }
      ElMessage.error('Failed to delete diary')
      return false
    }
    const getLocalDiaryById = (id) => diary.value.find((item) => item.id == id)
    const getLocalDiariesByUsername = (username) =>
      diary.value.filter((item) => item.username == username)

    const getLocalPageByDiaryId = (diaryId) => {
      const userStore = useUserStore()
      const index = diaryPages.value.findIndex(
        (item) =>
          item.diaryId === diaryId &&
          item.page === userStore.getLocalUserDiaryStatus(diaryId).lastReadPage
      )
      if (index !== -1) {
        return diaryPages.value[index]
      }
    }
    const getLocalPagesByDiaryId = (diaryId) => {
      return diaryPages.value.filter((item) => item.diaryId == diaryId)
    }
    return {
      diary,
      diaryPages,
      update,
      setDiary,
      setPages,
      getDiary,
      getLocalDiaryById,
      getLocalDiariesByUsername,
      getLocalPageByDiaryId,
      getLocalPagesByDiaryId,
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
