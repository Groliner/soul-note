<script setup>
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const props = defineProps({
  total: {
    type: Number,
    required: true
  }
})

const page = defineModel('page', {
  type: Number,
  required: true
})
const emit = defineEmits(['add'])
const handleAdd = async () => {
  if (page.value < props.total)
    page.value = Math.min(Math.max(page.value + 1, 1), props.total)
  else {
    console.log(123)
    proxy
      .$showConfirmModal('Do you want to add a new page?', {
        mask: false,
        pressTime: 20
      })
      .then((res) => {
        if (res) {
          emit('add')
        }
      })
  }
}
</script>
<template>
  <div class="container_pagination">
    <button
      class="paginate left"
      :data-state="page === 1 ? 'disabled' : ''"
      @click="page = Math.min(Math.max(page - 1, 1), total)"
    >
      <i></i><i></i>
    </button>
    <div class="counter">
      <flexInput
        v-model:text="page"
        :placeholder="page"
        :offsetWidth="0"
        :hover="false"
      />
      <p>/</p>
      <p>{{ total }}</p>
    </div>
    <button
      class="paginate right"
      :data-state="page === total ? 'add' : ''"
      @click="handleAdd"
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
  top: 120px;
  right: 130px;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  justify-content: center;
  align-items: center;
  gap: 2px;
  transition: all 0.3s ease;

  .counter {
    text-align: center;
    font-size: 30px;
    font-family: Helvetica, sans-serif;
    text-shadow: 0px 2px 0px rgba(0, 0, 0, 0.2);
    color: #130303;
    display: grid;
    grid-template-columns: 1fr min-content 1fr;
    justify-content: space-between;
    align-items: center;
  }
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

  top: 50%;
  margin-top: -20px;
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
  }

  &[data-state='add'] i {
    background-color: var(--c-green-500);
    cursor: default;
  }
  &[data-state='disabled'] {
    opacity: 0.3;
    cursor: default;
  }
}
</style>
