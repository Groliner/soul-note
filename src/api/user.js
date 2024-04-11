import request from '@/utils/request'

export const getCaptchaAPI = () => request.get('public/captcha')

export const loginAPI = (data) => request.post('public/login', data)

export const signUpAPI = (data) => request.post('public/signup', data)

export const logOutAPI = () => request.post('public/logout')

export const LogInTemplateAPI = () => request.get('public/template')

export const getUserInfoAPI = () => request.get('user')

export const updateUserInfoAPI = (data) => request.put('user', data)

export const getUserWordCountAPI = (data) =>
  request.get('userWordCounts', { params: data })
