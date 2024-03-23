<template>
  <figure>
    <div class="img"></div>
    <div class="signature">
      <grolin class="sign grolin"></grolin>
      <wolong class="sign wolong"></wolong>
      <grozhi class="sign grozhi"></grozhi>
    </div>
  </figure>
</template>
<style lang="scss" scoped>
.img {
  background-image: url(../../assets/images/logo.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center right;
  height: 42%;
  filter: drop-shadow(2px 4px 6px var(--c-yellow-600));
}
.signature {
  height: 54%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .sign {
    height: 32%;
    opacity: 0.05;
    transition: opacity 0.5s ease;
    &:hover {
      opacity: 0.5;
    }
  }
}
</style>
