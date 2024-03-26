export const formatTime = (time) => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // getMonth()返回的月份是从0开始的
  const day = date.getDate()

  // 格式化为年月日（YYYY-MM-DD）
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}
