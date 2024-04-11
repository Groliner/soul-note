<template>
  <div class="year-calendar">
    <div v-for="month in months" :key="month.name" class="month">
      <h3>{{ month.name }}</h3>
      <div class="days-grid">
        <div
          v-for="day in month.days"
          :key="day"
          class="day"
          :style="{ backgroundColor: day.color || 'rgb(50 180 0 / 0%)' }"
          style="border-radius: 2px"
          :class="{ today: day.isToday }"
        >
          <el-tooltip
            v-if="day.value"
            class="box-item"
            effect="dark"
            :content="`${day.value} words`"
            placement="bottom-end"
          >
            <el-button
              :style="{
                backgroundColor: day.color || 'rgb(50 180 0 / 0%)'
              }"
              style="
                padding: 0;
                width: 20px;
                height: 20px;
                border: none;
                font-family: inherit;
              "
              >{{ day.day }}</el-button
            >
          </el-tooltip>
          <span
            v-else
            :style="{ color: day.value === 0 ? '#6d5dfc' : '#9baacf' }"
            >{{ day.day }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores'
import { formatTimeToDate } from '@/composables/formatTime'
const userStore = useUserStore()
const userWordCount = computed(() => userStore.userWordCount)
const months = ref([])
const today = formatTimeToDate(new Date())
// 根据值计算颜色
function getColor(wordCount) {
  // 确保字数在0到100000之间
  wordCount = Math.max(0, Math.min(wordCount, 100000))

  let red, green, blue

  if (wordCount <= 50000) {
    // 从白色到青色的渐变
    // 字数在0到50000之间，红色从255渐变到0，绿色和蓝色保持在255
    const ratio = wordCount / 50000
    red = 255 * (1 - ratio)
    green = 255
    blue = 255
  } else {
    // 从青色到绿色的渐变
    // 字数在50001到100000之间，绿色保持255，蓝色从255渐变到0
    const ratio = (wordCount - 50000) / 50000
    red = 0
    green = 255
    blue = 255 * (1 - ratio)
  }

  // 生成RGB颜色字符串
  const color = `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`

  return color
}
const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate()
}
const populateYear = () => {
  const year = new Date().getFullYear()
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  months.value = monthNames.map((name, index) => {
    const daysInMonth = getDaysInMonth(index + 1, year)
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const dayDate = formatTimeToDate(new Date(year, index, i + 1))
      const index_ = userWordCount.value
        ? userWordCount.value.findIndex((dv) => dv.date === dayDate)
        : null

      const isToday = today === dayDate
      return {
        day: i + 1,
        value: index_ !== -1 ? userWordCount.value[index_].wordCount : null, // 若找到匹配的日期，返回其 value 值；否则返回 null
        color:
          index_ !== -1
            ? getColor(userWordCount.value[index_].wordCount)
            : null,
        isToday
      }
    })
    return { name, days }
  })
}

onMounted(() => {
  populateYear()
})
</script>

<style lang="scss" scoped>
.year-calendar {
  width: min-content;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;

  @media screen and (max-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media screen and (max-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.month {
  flex: 1;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7 days per week */
  gap: 5px;
}

.day {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.today {
    border: 1px solid #409eff;
  }
}
</style>
