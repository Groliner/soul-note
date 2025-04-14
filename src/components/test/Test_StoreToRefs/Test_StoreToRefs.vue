<!--
 * @Author: Gro lin
 * @Date: 2025-04-14 13:10:13
 * @LastEditors: Gro lin
 * @LastEditTime: 2025-04-14 13:22:24
-->
<template>
  <h3>不使用 storeToRefs：</h3>
  <p>Count: {{ constantStore.count }}</p>
  <p>Double Count: {{ constantStore.doubleCount }}</p>

  <h3>使用 storeToRefs：</h3>
  <p>Count Ref: {{ count }}</p>
  <p>Double Count Ref: {{ doubleCount }}</p>

  <button @click="constantStore.increment()">增加</button>
</template>

<script setup>
import { watch } from 'vue'
import { useConstantStore } from './constant'
import { storeToRefs } from 'pinia'

// 方法 1：直接使用 store
const constantStore = useConstantStore()

// 方法 2：storeToRefs 解构属性并保持响应性
const { count, doubleCount } = storeToRefs(constantStore)
const _ = constantStore.count // 相当于从constantStore中解包了count
console.log(constantStore.count)
console.log(count)
watch(count, () => {
  console.log('count changed:', constantStore.count)
})
watch(
  () => _,
  () => {
    console.log('*count changed:', constantStore.count)
    // 这个侦测器不会触发
  }
)
watch(
  () => constantStore.count,
  () => {
    console.log('****count changed:', constantStore.count)
  }
)
</script>
