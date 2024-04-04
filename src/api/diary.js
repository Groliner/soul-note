import request from '@/utils/request'

export const getDiaryListAPI = () => request.get('diary')

export const addDiaryAPI = () => request.get('diary/add')

export const updateDiaryAPI = (data) => request.put('diary', data)

export const deleteDiaryAPI = (diaryId) => request.delete('diary/' + diaryId)
