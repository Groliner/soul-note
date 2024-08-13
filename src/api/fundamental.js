/*
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-08-09 15:20:57
 */
import request from '@/utils/AccountRequest'

export const uploadImgAPI = (data) => request.post('upload', data)
