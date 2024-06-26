import { defineStore } from 'pinia'
import { ref } from 'vue'
import dayjs from 'dayjs'
import { formatTimeToDate } from '@/composables/formatTime'
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
      'https://java-spring-mybatis.oss-cn-beijing.aliyuncs.com/2a28bcf6-368b-48cf-afd5-dfea17203f4e.jpg',
    pages: 1,
    status: 'active',
    userId: 0,
    createdTime: Date.now(),
    updatedTime: Date.now(),
    isEdited: false
  }
]
const defaultPages = JSON.stringify({
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
        words: 10,
        isEdited: false
      },
      createdTime: 1712639239247,
      updatedTime: 1712639239247
    }
  ]
})

export const useDiaryStore = defineStore(
  'diary',
  () => {
    const diary = ref(JSON.parse(JSON.stringify(defaultDiary)))
    const diaryPages = ref(JSON.parse(defaultPages))
    let notePlaceholder = `                 there are some tips for writing diary：
                        1. crtl + z  --> undo.
                        2. crtl + y --> redo.
                        3. tab --> write a new paragraph.
                        4. Please don't create a diary or a page at random.
                        5. all you write down will auto save in the area when you go away.
                        6. Anytime there's a pop-up alert asking it's saved immediately.`
    const initAll = ref(false) // 设置是否初始化所有数据,在用户想要重新加载数据时使用
    const init = async () => {
      if (initAll.value) return
      await getDiary()
      initAll.value = true
      for (let i = 0; i < diary.value.length; i++) {
        const diaryId = diary.value[i].id
        if (diaryId !== 0) await getDiaryPage(diaryId)
      }
    }
    const logout = () => {
      initAll.value = false
      setDiary()
      setPages()
    }
    const setDiary = (diary_ = defaultDiary) => {
      diary.value = diary_
    }
    const setPages = (page_ = JSON.parse(defaultPages)) => {
      diaryPages.value = page_
    }
    const getDiary = async () => {
      const res = await getDiaryListAPI()
      if (res.data.data) {
        diary.value = res.data.data.map((item) => {
          item.isEdited = false // 设置是否编辑过,便于后续判断是否需要提交
          return item
        })
        diary.value.unshift(defaultDiary[0])
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
          item.diaryPageContext.isEdited = false // 设置是否编辑过,便于后续判断是否需要提交
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
        diaryPage_.diaryPageContext.isEdited = false // 设置是否编辑过,便于后续判断是否需要提交
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
        diary_.isEdited = false // 设置是否编辑过,便于后续判断是否需要提交
        const res_ = await getDiaryPage(diary_.id)
        if (res_) {
          diary.value.push(diary_)
          userStore.addLocalUserDiaryStatus(diary_.id)
          userStore.setLocalLastReadDiaryId(diary_.id)
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
          // 保持最后阅读页码不会超过删除的页码,与后端同步
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
      if (index !== -1 && index !== 1) {
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
    const saveDiary = async (diaryId, isMust = false) => {
      const index = diary.value.findIndex((item) => item.id == diaryId)
      if ((index !== -1 && diary.value[index].isEdited) || isMust) {
        const res = await updateDiaryAPI(diary.value[index])
        if (res.data.code) {
          diary.value[index].isEdited = false
          ElMessage.success('Diary saved successfully')
          return true
        }
      }
      ElMessage.error('Failed to save diary')
    }
    const savePage = async (diaryId, page, isMust = false) => {
      const pageList = diaryPages.value[diaryId]
      if (pageList.length === 0) return // 判断是否页面列表为空,为空则不保存
      if (pageList === undefined) {
        ElMessage.info('Failed to find diary')
        return
      }
      const index = pageList.findIndex(
        (item) => item.diaryId == diaryId && item.page == page
      )
      if (index === -1) {
        // 要保存的页面不存在
        ElMessage.info('Failed to save page')
        return
      }
      if (!pageList[index].context.isEdited && !isMust) {
        return 2 // 判断是否编辑过,未编辑过则不保存
      }
      pageList[index].updatedTime = dayjs().format('YYYY-MM-DDTHH:mm:ss')
      const res = await updateDiaryPageAPI({
        diaryPage: pageList[index],
        diaryPageContext: pageList[index].context
      })
      if (res.data.code) {
        pageList[index].context.isEdited = false
        ElMessage.success('Page saved successfully')
        const userStore = useUserStore()
        userStore.getUserWordCount(formatTimeToDate(new Date()))
        return true
      }
      ElMessage.error('Failed to save page')
    }
    const getLocalDiaryById = (id) => {
      const index = diary.value.findIndex((item) => item.id === id && id !== 0)

      if (index !== -1) return diary.value[index]
      return diary.value[0]
    }
    const getLocalDiariesByUserId = (userId) =>
      diary.value.filter((item) => item.userId == userId)

    const getLocalPageByDiaryId = (diaryId, page) => {
      const pageList = diaryPages.value[diaryId]
      if (pageList !== undefined) {
        const index = pageList.findIndex((item) => item.page == page)
        if (index !== -1) {
          return pageList[index]
        }
      }
      return diaryPages.value[0][0]
    }
    const getLocalPagesByDiaryId = (diaryId) => {
      return diaryPages.value[diaryId]
    }
    const updateLocalDiary = ({ id, title, description, height }) => {
      // 根据 id 更新 diary
      const index = diary.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        diary.value[index].updatedTime = dayjs().format('YYYY-MM-DDTHH:mm:ss')
        diary.value[index].title = title
        diary.value[index].description = description
        diary.value[index].height = height
        diary.value[index].isEdited = true
      }
      return true
    }
    const updateLocalDiaryCover = ({ id, cover }) => {
      // 根据 id 更新 diary
      const index = diary.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        diary.value[index].cover = cover
        diary.value[index].isEdited = true
      }
      return true
    }
    return {
      diary,
      diaryPages,
      notePlaceholder,
      init,
      logout,
      setDiary,
      setPages,
      getDiary,
      getLocalDiaryById,
      getLocalDiariesByUserId,
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
