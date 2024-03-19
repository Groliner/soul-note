import request from '@/utils/request'

export const loginAPI = (data) => request.post('public/login', data)

export const signUpAPI = (data) => request.post('public/signup', data)

export const LogInTemplateAPI = () => request.get('public/template')
