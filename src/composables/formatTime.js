import dayjs from 'dayjs'

export const formatTime = (time) => {
  // 格式化为年月日（YYYY-MM-DD）
  return dayjs(time).format('YYYY-MM-DD')
}

export const formatTimeToDate = (t) => {
  const year = t.getFullYear()
  const month = String(t.getMonth() + 1).padStart(2, '0') // 月份是从0开始的，所以需要+1
  const day = String(t.getDate()).padStart(2, '0') // 获取日
  return `${year}-${month}-${day}`
}
