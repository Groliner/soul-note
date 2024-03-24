<script setup>
defineProps({
  total: {
    type: Number,
    required: true
  }
})

const page = defineModel('page', {
  type: Number,
  required: true
})
</script>
<template>
  <div class="container_pagination">
    <div class="counter">{{ page }} / {{ total }}</div>

    <button
      class="paginate left"
      :data-state="page === 1 ? 'disabled' : ''"
      @click="page = Math.min(Math.max(page - 1, 1), total)"
    >
      <i></i><i></i>
    </button>
    <button
      class="paginate right"
      :data-state="page === total ? 'disabled' : ''"
      @click="page = Math.min(Math.max(page + 1, 1), total)"
    >
      <i></i><i></i>
    </button>
  </div>
</template>
<style lang="scss" scoped>
$size: 20px;
$thickness: 2px;
$angle: 40deg;
$angleHover: 30deg;
$angleActive: 25deg;

@mixin arrowTransform($angle, $x: 0, $y: 0) {
  i:first-child {
    transform: translate($x, $y) rotate($angle);
  }

  i:last-child {
    transform: translate($x, -$y) rotate(-$angle);
  }
}

.container_pagination {
  position: fixed;
  top: 150px;
  width: 150px;
  right: 50px;
}

button {
  -webkit-appearance: none;
  background: transparent;
  border: 0;
  outline: 0;
}

.paginate {
  position: relative;
  margin: 10px;
  width: $size;
  height: $size;
  cursor: pointer;
  transform: translate3d(0, 0, 0); // fixes flicker in webkit

  position: absolute;
  top: 50%;
  margin-top: -12px;
  -webkit-filter: drop-shadow(0 2px 0px rgba(0, 0, 0, 0.2));

  i {
    position: absolute;
    top: 40%;
    left: 0;
    width: $size;
    height: $thickness;
    border-radius: calc($thickness / 2);
    background: #131212;

    transition: all 0.15s ease;
  }

  &.left {
    right: 67%;

    i {
      transform-origin: 0% 50%;
    }

    @include arrowTransform($angle, 0, -1px);

    &:hover {
      @include arrowTransform($angleHover, 0, -1px);
    }

    &:active {
      @include arrowTransform($angleActive, 1px, -1px);
    }

    &[data-state='disabled'] {
      @include arrowTransform(0deg, -5px, 0);

      &:hover {
        @include arrowTransform(0deg, -5px, 0);
      }
    }
  }

  &.right {
    left: 67%;

    i {
      transform-origin: 100% 50%;
    }

    @include arrowTransform($angle, 0, 1px);

    &:hover {
      @include arrowTransform($angleHover, 0, 1px);
    }

    &:active {
      @include arrowTransform($angleActive, 1px, 1px);
    }

    &[data-state='disabled'] {
      @include arrowTransform(0deg, 5px, 0);

      &:hover {
        @include arrowTransform(0deg, 5px, 0);
      }
    }
  }

  &[data-state='disabled'] {
    opacity: 0.3;
    cursor: default;
  }
}

.counter {
  text-align: center;
  position: absolute;
  width: 100%;
  top: 50%;
  margin-top: -20px;
  font-size: 30px;
  font-family: Helvetica, sans-serif;
  text-shadow: 0px 2px 0px rgba(0, 0, 0, 0.2);
  color: #130303;
}
</style>
