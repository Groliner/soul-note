import request from '@/utils/request'

export const getUserDiaryStatusAPI = (data) =>
  request.get('userDiaryStatus', { params: data })

export const addUserDiaryStatusAPI = (data) =>
  request.post('userDiaryStatus', data)

export const updateUserDiaryStatusAPI = (data) =>
  request.put('userDiaryStatus', data)

export const deleteUserDiaryStatusAPI = (data) =>
  request.delete('userDiaryStatus' + data)
