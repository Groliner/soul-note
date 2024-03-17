import request from '@/utils/request'

export const loginAPI = (data) => request.post('login', data)

export const signUpAPI = (data) => request.post('user', data)

export const LogInTemplateAPI = () => request.get('login/template')
