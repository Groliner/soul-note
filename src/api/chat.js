import request from '@/utils/ChatRequest'

export const getWebSocketConfiguration = () => request.get('chat/websocket')
