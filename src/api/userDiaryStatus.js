import request from '@/utils/request/AccountRequest'

export const getUserDiaryStatusAPI = (data) => request.get('userDiaryStatus', { params: data })
