/*
 * @Author: Gro lin
 * @Date: 2025-04-14 11:23:51
 * @LastEditors: Gro lin
 * @LastEditTime: 2025-04-14 13:17:38
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useConstantStore = defineStore('constant', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  const increment = () => {
    count.value++
  }

  return {
    count,
    doubleCount,
    increment
  }
})
