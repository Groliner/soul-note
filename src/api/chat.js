/*
 * @Author: Gro lin
 * @Date: 2024-09-07 15:56:43
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-09-11 10:00:59
 */
import request from '@/utils/ChatRequest'

export const getWebSocketConfiguration = () => request.get('chat/websocket')

export const uploadFiles = (data) =>
  request.post('chat/upload/files', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

export const getMessages = (params) => request.get('chat/messages', { params })

export const responseMessageAPI = (params) => request.get('chat//message/receive', { params })
