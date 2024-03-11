import { ref, computed } from 'vue'
import dayjs from 'dayjs'

export const useCountDown = () => {
  const time = ref(0)
  const formatTime = computed(() => dayjs.unix(time.value).format('mm:ss'))
  const start = (setTime) => {
    time.value = setTime
    const timer = setInterval(() => {
      time.value--
      if (time.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
  return {
    formatTime,
    start
  }
}
