import request from '@/utils/request'

export const getCaptchaAPI = () => request.get('public/captcha')

export const loginAPI = (data) => request.post('public/login', data)

export const signUpAPI = (data) => request.post('public/signup', data)

export const LogInTemplateAPI = () => request.get('public/template')

export const getUserInfoAPI = (username) => request.get('user/' + username)

export const updateUserInfoAPI = (data) =>
  request.put('user', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
