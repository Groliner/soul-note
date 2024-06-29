import request from '@/utils/request'

export const getUserDiaryStatusAPI = (data) =>
  request.get('userDiaryStatus', { params: data })
