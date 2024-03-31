import request from '@/utils/request'

export const getDiaryPageListAPI = ({ diaryId, page }) =>
  request.get('diaryPage?diaryId' + diaryId + '&page=' + page)

export const addDiaryPageAPI = (data) => request.post('diaryPage', data)

export const updateDiaryPageAPI = (data) => request.put('diaryPage', data)

export const deleteDiaryPageAPI = (diary_page_id) =>
  request.delete('diaryPage/' + diary_page_id)
