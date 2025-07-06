/*
 * @Author: Gro lin
 * @Date: 2024-09-07 15:56:43
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-09-30 15:58:21
 */
import request from '@/utils/request/ChatRequest'

export const getWebSocketConfiguration = () => request.get('chat/websocket')

export const uploadFiles = (data) =>
  request.post('chat/upload/files', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

export const getMessages = (params) => request.get('chat/messages', { params })

export const responseMessageAPI = (params) => request.get('chat//message/receive', { params })

// export const getOnlineUsers = () => request.get('online-users')
// 代办，此处的在线判据通过用户是否连接socket来判断，而不是通过后端接口

// chat-friends
export const getChatFriendsAPI = () => request.get('chat/friends')

export const addChatFriendAPI = (friendId) => request.post('chat/friends/add/' + friendId)

export const deleteChatFriendAPI = (friendId) => request.delete('chat/friends/delete/' + friendId)

export const updateChatFriendAPI = (friendId, data) =>
  request.put('chat/friends/update/' + friendId, data)

// chat-groups
export const getChatGroupsAPI = () => request.get('chat/groups')

export const addChatGroupAPI = () => request.post('chat/groups/insert')

export const deleteChatGroupAPI = (groupId) => request.delete('chat/groups/delete/' + groupId)

export const updateChatGroupAPI = (groupId, data) =>
  request.put('chat/groups/update/' + groupId, data)

// chat-groups-members
export const getChatGroupMembersAPI = (groupId) =>
  request.get('chat/groups/members', { params: { groupId } })

export const addChatGroupMemberAPI = (groupId, data) =>
  request.post(`chat/groups/${groupId}/members/insert`, data)

export const deleteChatGroupMemberAPI = (groupId, memberId) =>
  request.delete(`chat/groups/${groupId}/members/delete/${memberId}`)

export const updateChatGroupMemberAPI = (groupId, data) =>
  request.put(`chat/groups/${groupId}/members/update`, data)
