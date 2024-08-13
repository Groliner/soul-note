import request from '@/utils/AccountRequest'

export const getUserDiaryStatusAPI = (data) => request.get('userDiaryStatus', { params: data })
