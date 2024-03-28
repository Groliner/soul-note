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
const emit = defineEmits(['add', 'flip'])
const handleAdd = (m) => {
  if (page.value < props.total || m === -1) {
    emit('flip', m)
  } else {
    proxy
      .$showConfirmModal('Do you want to add a new page?', {
        mask: false,
        pressTime: 120
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
      @click="handleAdd(-1)"
    >
      <i></i><i></i>
    </button>
    <div class="counter">
      <p>{{ page }}</p>
      <p>/</p>
      <p>{{ total }}</p>
    </div>
    <button
      class="paginate right"
      :data-state="page === total ? 'add' : ''"
      @click="handleAdd(1)"
    >
      <i></i><i></i>
    </button>
    <div class="select_container">
      <select v-model="page" size="15">
        <option
          v-for="i in total"
          :key="i"
          :value="i"
          :class="{ active: page == i }"
        >
          {{ i }}
        </option>
      </select>
    </div>
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

.select_container {
  position: fixed;
  right: 10px;
  top: 26%;
  font-family: inherit;
  overflow: hidden;

  select {
    font-family: inherit;

    option {
      font-family: inherit;
      background-color: var(--c-yellow-100);
      text-align: center;

      &.active {
        background-color: var(--c-yellow-200);
      }
    }
    appearance: none;
    background-color: transparent;
    width: 100px;
    padding: 10px;
    border: none;
    font-size: 1.5em;
    outline: none;
    cursor: pointer;

    // 移除 IE 浏览器的默认样式
    &::-ms-expand {
      display: none;
    }
  }
}
</style>
