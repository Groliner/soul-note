/*
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-08-11 16:25:39
 */
import request from '@/utils/DiaryRequest'

export const getDiaryListAPI = () => request.get('diary')

export const addDiaryAPI = () => request.get('diary/add')

export const updateDiaryAPI = (diaryId, data) => request.put('diary/' + diaryId, data)

export const deleteDiaryAPI = (diaryId) => request.delete('diary/' + diaryId)
