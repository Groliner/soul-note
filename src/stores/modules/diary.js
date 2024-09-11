import { defineStore } from 'pinia'
import { ref } from 'vue'
import dayjs from 'dayjs'
import { formatTimeToDate } from '@/composables/formatTime'
import { useUserStore } from './user'
import { useMessageStore } from './message'
import { ElMessage } from 'element-plus'
import { addDiaryAPI, deleteDiaryAPI, getDiaryListAPI, updateDiaryAPI } from '@/api/diary'
import {
  getDiaryPageListAPI,
  addDiaryPageAPI,
  deleteDiaryPageAPI,
  updateDiaryPageAPI
} from '@/api/diaryPage'
import { encryptData, decryptData } from '@/composables/IOAESKey'

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
    const messageStore = useMessageStore()
    const diary = ref(JSON.parse(JSON.stringify(defaultDiary)))
    const diaryPages = ref(JSON.parse(defaultPages))
    const initAll = ref(
      !window.location.pathname.startsWith('/diary') &&
        !window.location.pathname.startsWith('/account')
    ) // 设置是否初始化所有数据,在用户想要重新加载数据时使用
    const init = async (isForceRefresh) => {
      if (initAll.value && !isForceRefresh) return
      await getDiary()
      initAll.value = true
      for (let i = 0; i < diary.value.length; i++) {
        const diaryId = diary.value[i].id
        if (diaryId !== 0) getDiaryPage(diaryId)
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
      if (res.data.code == 1) {
        diary.value = res.data.data.map((item) => {
          item.isEdited = false // 设置是否编辑过,便于后续判断是否需要提交
          return item
        })
        diary.value.unshift(defaultDiary[0])
        ElMessage.success(messageStore.diaryConstant['LOAD_SUCCESS'])
        return true
      }
      ElMessage.error(messageStore.diaryConstant['LOAD_ERROR'])
      setDiary()
      return false
    }
    const getDiaryPage = async (diaryId) => {
      const res = await getDiaryPageListAPI({ diaryId })
      if (res.data.data.length > 0 && res.data.code == 1) {
        diaryPages.value[diaryId] = res.data.data.map((item) => {
          item.diaryPageContext.isEdited = false // 设置是否编辑过,便于后续判断是否需要提交
          return { ...item.diaryPage, context: item.diaryPageContext }
        })
        diaryPages.value[diaryId].map(async (item) => {
          item.content = await decryptData(item.content)
        })
        return true
      }
      setPages()
      return false
    }

    const addPage = async (diaryId) => {
      const index = diary.value.findIndex((item) => item.id === diaryId)
      const res = await addDiaryPageAPI(diaryId, {
        page: ++diary.value[index].pages
      })
      if (res.data.code == 1) {
        const diaryPage_ = res.data.data
        diaryPage_.diaryPageContext.isEdited = false // 设置是否编辑过,便于后续判断是否需要提交
        diaryPages.value[diaryId].push({
          ...diaryPage_.diaryPage,
          context: diaryPage_.diaryPageContext
        })

        ElMessage.success(messageStore.diaryPageConstant['ADD_SUCCESS'])
        return true
      }
      diary.value[index].pages--
      ElMessage.error(messageStore.diaryPageConstant['ADD_ERROR'])
      return false
    }
    const addDiary = async () => {
      const userStore = useUserStore()
      const res = await addDiaryAPI()
      if (res.data.code == 1) {
        const diary_ = res.data.data
        diary_.isEdited = false // 设置是否编辑过,便于后续判断是否需要提交
        const res_ = await getDiaryPage(diary_.id)
        if (res_) {
          diary.value.push(diary_)
          userStore.addLocalUserDiaryStatus(diary_.id)
          userStore.setLocalLastReadDiaryId(diary_.id)
          ElMessage.success(messageStore.diaryConstant['ADD_SUCCESS'])

          return diary_.id
        }
      } else {
        ElMessage.error(messageStore.diaryConstant['ADD_ERROR'])
      }

      return false
    }
    const deletePage = async (id, page) => {
      const pageList = diaryPages.value[id]
      const index = pageList.findIndex((item) => item.page === page)
      if (index === 0) {
        ElMessage.error(messageStore.diaryPageConstant['DELETE_FIRST_ERROR'])
        return false
      } else if (index !== -1 && pageList[index].context.words) {
        ElMessage.error(messageStore.diaryPageConstant['DELETE_WITH_CONTENT_ERROR'])
        return false
      } else {
        const res = await deleteDiaryPageAPI(pageList[index].diaryId, {
          ids: [pageList[index].id]
        })
        if (res.data.code == 1) {
          // 保持最后阅读页码不会超过删除的页码,与后端同步
          const userStore = useUserStore()
          const lastReadPage = userStore.getLocalUserDiaryStatus(id).lastReadPage
          const maxPage = --diary.value.find((item) => item.id === id).pages
          if (maxPage < lastReadPage)
            userStore.updateLocalUserDiaryStatus({
              diaryId: id,
              lastReadPage: maxPage
            })
          diaryPages.value[id].splice(index, 1)

          ElMessage.success(messageStore.diaryPageConstant['DELETE_SUCCESS'])
          return true
        }
        ElMessage.error(messageStore.diaryPageConstant['DELETE_ERROR'])
      }
      return false
    }
    const deleteDiary = async (id) => {
      const index = diary.value.findIndex((item) => item.id === id)
      if (index !== -1 && index !== 1) {
        const res = await deleteDiaryAPI(id)
        if (res.data.code == 1) {
          const title = diary.value[index].title
          const userStore = useUserStore()
          userStore.deleteLocalUserDiaryStatus(id)
          diary.value.splice(index, 1)
          diaryPages.value[id] = []

          ElMessage.success(title + messageStore.diaryConstant['DELETE_SUCCESS'])
          return true
        }
        ElMessage.error(messageStore.diaryConstant['DELETE_ERROR'])
      } else {
        ElMessage.error(messageStore.diaryConstant['DELETE_WARNING'])
      }

      return false
    }
    const saveDiary = async (diaryId, isMust = false) => {
      const index = diary.value.findIndex((item) => item.id == diaryId)
      const diary_ = diary.value[index]
      if ((index !== -1 && diary_.isEdited) || isMust) {
        const res = await updateDiaryAPI(diary_.id, diary_)
        if (res.data.code == 1) {
          diary.value[index].isEdited = false
          const userStore = useUserStore()
          userStore.setLocalLastReadDiaryId(diaryId)
          ElMessage.success(messageStore.diaryConstant['SAVE_SUCCESS'])
          return true
        }
      }
      ElMessage.error(messageStore.diaryConstant['SAVE_ERROR'])
    }
    const savePage = async (diaryId, page, isMust = false) => {
      const pageList = diaryPages.value[diaryId]
      if (!pageList) return // 判断是否页面列表为空,为空则不保存
      if (pageList === undefined) {
        ElMessage.info(messageStore.diaryConstant['FIND_ERROR'])
        return
      }
      const index = pageList.findIndex((item) => item.diaryId == diaryId && item.page == page)
      if (index === -1) {
        // 要保存的页面已经删除
        return
      }
      if (!pageList[index].context.isEdited && !isMust) {
        return 2 // 判断是否编辑过,未编辑过则不保存
      }
      const diaryPage = {}
      let diaryPageContext
      Object.keys(pageList[index]).forEach((key) => {
        if (key === 'context') {
          diaryPageContext = pageList[index].context
        } else {
          diaryPage[key] = pageList[index][key]
        }
      })
      diaryPage.updatedTime = dayjs().format('YYYY-MM-DDTHH:mm:ss')
      diaryPage.content = await encryptData(diaryPage.content)

      const res = await updateDiaryPageAPI(pageList[index].diaryId, {
        diaryPage,
        diaryPageContext
      })
      if (res.data.code == 1) {
        pageList[index].context.isEdited = false
        ElMessage.success(messageStore.diaryPageConstant['SAVE_SUCCESS'])
        const userStore = useUserStore()
        userStore.getUserWordCount(formatTimeToDate(new Date()))
        correctDiaryWord(diaryId)
        return true
      }
      ElMessage.error(messageStore.diaryPageConstant['SAVE_ERROR'])
    }
    const correctDiaryWord = (diaryId) => {
      const pageList = diaryPages.value[diaryId]
      if (!pageList) return
      const index = diary.value.findIndex((item) => item.id === diaryId)
      if (index !== -1) {
        const words = pageList.reduce((acc, cur) => acc + cur.context.words, 0)
        diary.value[index].words = words
      }
    }
    const getLocalDiaryById = (id) => {
      const index = diary.value.findIndex((item) => item.id === id && id !== 0)

      if (index !== -1) return diary.value[index]
      return diary.value[0]
    }
    const getLocalDiariesByUserId = (userId) => diary.value.filter((item) => item.userId == userId)

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
      const pageList = diaryPages.value[diaryId]
      if (pageList) return diaryPages.value[diaryId]
      return diaryPages.value[0]
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
