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
            :content="`${day.isToday ? 'today' : day.day} ${day.value} times`"
            placement="bottom-end"
          >
            <el-button style="opacity: 0; padding: 0; width: 20px; height: 20px"
              >1</el-button
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
import { ref, onMounted } from 'vue'
const props = defineProps({
  dates: {
    type: Array,
    default: () => [
      {
        timestamp: Date.now(),
        value: 10
      },
      {
        timestamp: Date.now() + 86400012,
        value: 23
      },
      {
        timestamp: Date.now() + 86400000 * 2,
        value: 100
      }
    ]
  }
})
const months = ref([])
// 根据值计算颜色
function getColor(value) {
  // 这里简化颜色计算逻辑，实际项目中可以根据需求调整
  const intensity = Math.min(value / 100, 1) // 假设 100 是最大值
  return `rgba(50, 180, 0, ${intensity})` // 根据强度显示颜色
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
      const dayDate = new Date(year, index, i + 1).getTime()
      const dateValue = props.dates.find(
        (dv) =>
          new Date(dv.timestamp).toDateString() ===
          new Date(dayDate).toDateString()
      )
      const isToday =
        new Date().toDateString() === new Date(dayDate).toDateString()
      return {
        day: i + 1,
        value: dateValue ? dateValue.value : null, // 若找到匹配的日期，返回其 value 值；否则返回 null
        color: dateValue ? getColor(dateValue.value) : null,
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
