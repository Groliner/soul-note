import dayjs from 'dayjs'

export const formatTime = (time) => {
  // 格式化为年月日（YYYY-MM-DD）
  return dayjs(time).format('YYYY-MM-DD')
}
