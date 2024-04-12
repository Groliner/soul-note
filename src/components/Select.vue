<template>
  <p>loading 组件</p>
  <span class="loader-21"> </span>
</template>
<style lang="scss" scoped>
$base: #263238;
$lite: #fff;
$brand: #ff3d00;
$size: 4em;

.loader-21 {
  width: $size;
  height: $size;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border: 10px solid;
  border-color: rgba($brand, 0.15) rgba($lite, 0.25) rgba($lite, 0.35)
    rgba($lite, 0.5);
  animation: rotation 1s linear infinite;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
