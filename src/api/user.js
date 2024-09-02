/*
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-08-18 21:58:37
 */
import request from '@/utils/AccountRequest'
import req from '@/utils/request'

export const getCaptchaAPI = () => request.get('public/captcha')

export const LogInTemplateAPI = () => req.get('template')

export const getUserInfoAPI = () => request.get('user')

export const updateUserInfoAPI = (data) => request.put('user', data)

export const getUserWordCountAPI = (data) => request.get('userWordCounts', { params: data })

export const updateLastReadDiaryId = (id, data) => request.put('user/lastReadDiaryId/' + id, data)

export const getOnlineUsers = () => req.get('online-users')

export const getFriendsAPI = () => request.get('user/friends')

export const updateUserPreferencesAPI = (data) => request.put('userPreferences', data)

export const getUserPreferencesAPI = () => request.get('userPreferences')

export const addUserBackgroundImgAPI = (data) => request.post('accountImg', data)

export const deleteUserBackgroundImgAPI = (data) => request.delete('accountImg', { data })
