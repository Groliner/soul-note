/*
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-08-12 21:14:33
 */
import request from '@/utils/DiaryRequest'

export const getDiaryPageListAPI = (data) => request.get('diaryPage', { params: data })

export const addDiaryPageAPI = (diaryId, data) => request.post('diaryPage/' + diaryId, data)

export const updateDiaryPageAPI = (diaryId, data) => request.put('diaryPage/' + diaryId, data)

export const deleteDiaryPageAPI = (diaryId, data) =>
  request.delete('diaryPage/' + diaryId, {
    data: data
  })
