import request from '@/utils/request'

export const uploadImgAPI = (data) => request.post('upload', data)
