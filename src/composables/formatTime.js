/*
 * @Author: Gro lin
 * @Date: 2024-08-09 12:19:25
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-12-29 17:34:12
 */
import dayjs from 'dayjs'

export const formatTime = (time) => {
  // 格式化为年月日（YYYY-MM-DD）
  return dayjs(time).format('YYYY-MM-DD')
}
export const formatTimeToSecond = (time) => {
  // 格式化为年月日时分秒（YYYY-MM-DD HH:mm:ss）
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}
export const compareTime = (time1, time2) => {
  // 将时间字符串转换为 dayjs 对象
  const t1 = dayjs(time1)
  const t2 = dayjs(time2)

  // 比较两个时间
  if (t1.isAfter(t2)) {
    return 1 // time1 大于 time2
  } else if (t1.isBefore(t2)) {
    return -1 // time1 小于 time2
  } else {
    return 0 // time1 等于 time2
  }
}
export const formatTimeToDate = (t) => {
  const year = t.getFullYear()
  const month = String(t.getMonth() + 1).padStart(2, '0') // 月份是从0开始的，所以需要+1
  const day = String(t.getDate()).padStart(2, '0') // 获取日
  return `${year}-${month}-${day}`
}
