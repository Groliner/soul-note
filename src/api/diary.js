import request from '@/utils/request'

export const getDiaryListAPI = ({ diaryId, userId }) =>
  request.get('diary?id=' + diaryId + '&userId=' + userId)

export const addDiaryAPI = (data) => request.post('diary', data)

export const updateDiaryAPI = (data) => request.put('diary', data)

export const deleteDiaryAPI = (diaryId) => request.delete('diary/' + diaryId)
