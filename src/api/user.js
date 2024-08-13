/*
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-08-12 10:07:16
 */
import request from '@/utils/AccountRequest'
import req from '@/utils/request'

export const getCaptchaAPI = () => request.get('public/captcha')

export const LogInTemplateAPI = () => req.get('template')

export const getUserInfoAPI = () => request.get('user')

export const updateUserInfoAPI = (data) => request.put('user', data)

export const getUserWordCountAPI = (data) => request.get('userWordCounts', { params: data })

export const updateBackgroundImg = (id, data) => request.put('user/backgroundImg/' + id, data)

export const updateLastReadDiaryId = (id, data) => request.put('user/lastReadDiaryId/' + id, data)

export const getOnlineUsers = () => request.get('online-users')
