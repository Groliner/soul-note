<template>
  <div class="date-value-table">
    <div
      v-for="(day, index) in days"
      :key="index"
      class="day-cell"
      :style="{ backgroundColor: getColor(day.value) }"
    >
      <el-tooltip
        class="box-item"
        effect="dark"
        :content="`${day.value} times`"
        placement="bottom-end"
      >
        <el-button></el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

// 假设接收的 prop 是一个数组，每个元素包含时间戳（timestamp）和值（value）
const props = defineProps({
  dates: {
    type: Array,
    default: () => [
      {
        timestamp: Date.now(),
        value: 0
      },
      {
        timestamp: Date.now() + 86400000,
        value: 50
      },
      {
        timestamp: Date.now() + 86400000 * 2,
        value: 100
      }
    ]
  }
})

const days = computed(() => {
  return props.dates.map((entry) => ({
    date: new Date(entry.timestamp).toLocaleDateString(),
    value: entry.value
  }))
})

// 根据值计算颜色
function getColor(value) {
  // 这里简化颜色计算逻辑，实际项目中可以根据需求调整
  const intensity = Math.min(value / 100, 1) // 假设 100 是最大值
  return `rgba(50, 180, 0, ${intensity})` // 根据强度显示颜色
}
</script>

<style scoped>
.date-value-table {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(10px, 1fr)
  ); /* 根据需要调整 */
  gap: 10px;
}

.day-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 10px; /* 根据需要调整 */
  border: 1px solid #ccc;
  cursor: pointer;
  transition: transform 0.2s;
  transform-origin: center;
}
</style>
