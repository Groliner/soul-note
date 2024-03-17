<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  document.querySelector('.page1').addEventListener('click', function () {
    this.classList.add('flipped')
    // 假设只有两页，这里不需要进一步逻辑来显示第二页，
    // 因为第二页已经通过CSS准备好在第一页翻转后显示。
  })
})
</script>
<template>
  <div class="notebook">
    <div class="page page1">Page 1</div>
    <div class="page page2">Page 2</div>
  </div>

  <!-- 更多页面 -->
</template>
<style lang="scss" scoped>
.notebook {
  width: 300px;
  height: 400px;
  position: relative;
  perspective: 1000px;
  margin: 20px;
}

.page {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  backface-visibility: hidden; // 隐藏翻页背面
  transform-style: preserve-3d;
  transition: transform 1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.page1 {
  z-index: 2; // 确保第一页在第二页之上
}

.page2 {
  transform: rotateY(0deg); // 第二页正面朝上，但在第一页下面
  z-index: 1;
}

.flipped {
  transform: rotateY(-180deg); // 翻页效果
}
</style>
