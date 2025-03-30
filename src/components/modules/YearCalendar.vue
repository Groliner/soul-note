<script setup>
// 添加年份按钮
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useUserStore } from '@/stores'
import { formatTimeToDate } from '@/composables/formatTime'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const { userWordCount } = storeToRefs(userStore)
const today = formatTimeToDate(new Date())
// 根据值计算颜色
function getColor(wordCount) {
  // 确保字数在0到100000之间
  wordCount = Math.max(0, Math.min(wordCount, 100000))

  let red, green, blue

  if (wordCount <= 1000) {
    // 从白色到青色的渐变
    // 字数在0到1000之间，红色从255渐变到0，绿色和蓝色保持在255
    const ratio = wordCount / 1000
    red = 255 * (1 - ratio)
    green = 255
    blue = 255
  } else {
    // 从青色到绿色的渐变
    // 字数在1001到2000之间，绿色保持255，蓝色从255渐变到0
    const ratio = (wordCount - 1000) / 1000
    red = 0
    green = 255
    blue = 255 * (1 - ratio)
  }

  // 生成RGB颜色字符串
  const color = `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`

  return color
}
const getDaysInMonth = (month, year) => {
  // 此处的month范围是1到12，因为构造Date中day参数设置为0时，会返回上一个月的最后一天
  // 利用getDate即可得到month月的天数
  return new Date(year, month, 0).getDate()
}
const selectYear = ref(new Date().getFullYear())
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
const noteWordsByYear = computed(() => {
  let notesGroup = {}
  userWordCount.value.forEach((noteWord) => {
    const date = new Date(noteWord.date)
    const year = date.getFullYear()
    if (!notesGroup[year]) {
      notesGroup[year] = []
    }
    notesGroup[year].push(noteWord)
  })
  return notesGroup
})
// 这里考虑是否也是用computed？用户字数再次页面加载时一般不会发生变化，那么还需要添加实时性吗？
const noteYearList = Object.keys(noteWordsByYear.value).sort()

const months = computed(() => {
  return monthNames.map((name, index) => {
    const noteWords = noteWordsByYear.value[selectYear.value]
    const daysInMonth = getDaysInMonth(index + 1, selectYear.value)
    // Array.from({ length: N })
    // 它会生成一个长度为 N 的数组，里面的每一项默认为 undefined，通过第二个参数（映射函数）来填充数组的值。
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const dayDate = formatTimeToDate(new Date(selectYear.value, index, i + 1))
      const index_ = noteWords?.length ? noteWords.findIndex((dv) => dv.date === dayDate) : -1

      const isToday = today === dayDate
      return {
        day: i + 1,
        value: index_ !== -1 ? noteWords[index_].wordCount : null,
        color: index_ !== -1 ? getColor(noteWords[index_].wordCount) : null,
        isToday
      }
    })
    return { name, days }
  })
})
const fontSize = ref('18px')
onMounted(() => {
  if (window.innerWidth < 620) fontSize.value = '10px'
})

import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
gsap.registerPlugin(CustomEase)
CustomEase.create('privateEase', '0.645, 0.045, 0.355, 1')

watch(
  selectYear,
  async (newVal, oldVal) => {
    await nextTick()
    gsap.to('.segmented-control__color', {
      x: `${(newVal - noteYearList[0]) * 3.3}rem`,
      duration: 0.3,
      ease: 'privateEase'
    })
  },
  {
    immediate: true
  }
)
</script>
<template>
  <div class="calendar-container">
    <div class="segmented-control">
      <div v-for="(year, index) in noteYearList" :key="year" :class="`segmented-control__${index}`">
        <input type="radio" name="radio2" :value="year" :id="`tab-${year}`" v-model="selectYear" />
        <label :for="`tab-${year}`">
          <p>{{ year }}</p></label
        >
      </div>
      <div class="segmented-control__color"></div>
    </div>
    <div class="year-calendar">
      <div v-for="month in months" :key="month.name" class="month">
        <h3>{{ month.name }}</h3>
        <div class="days-grid">
          <div
            v-for="day in month.days"
            :key="day"
            class="day"
            :style="{
              backgroundColor: day.value ? day.color : 'rgb(50 180 0 / 0%)'
            }"
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
                  backgroundColor: day.color || 'rgb(50 180 0 / 0%)',
                  width: fontSize,
                  height: fontSize
                }"
                style="padding: 0; border: none; font-family: inherit"
                class="tips"
                >{{ day.day }}</el-button
              >
            </el-tooltip>
            <span v-else style="color: #9baacf">{{ day.day }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar-container {
  width: min-content;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.segmented-control {
  // box-shadow: $shadow;
  border-radius: 0.6rem;
  display: flex;
  gap: 1.1rem;
  align-items: center;
  position: relative;

  &__1,
  &__2,
  &__0 {
    input {
      display: none;
    }

    > input:checked + label {
      transition: all 0.4s ease;
      color: var(--primary);
    }
    label {
      width: 2.2rem;
      font-size: 1.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      color: var(--greyDark);
      transition: all 0.4s ease;

      &:hover {
        color: var(--primary);
      }
    }
  }

  &__color {
    position: absolute;
    height: 0.15rem;
    width: 2.2rem;
    bottom: 0;
    border-radius: 0.8rem;
    box-shadow: $inner-shadow;
    pointer-events: none;
  }
}

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

  .month {
    flex: 1;
    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr); /* 7 days per week */
      gap: 5px;
      .day {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        @media screen and (max-width: 620px) {
          width: 10px;
          height: 10px;
        }

        &.today {
          border: 1px solid #409eff;
        }
      }
    }
  }
}
</style>
