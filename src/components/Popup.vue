<script setup>
import { PhXCircle } from '@phosphor-icons/vue'
defineEmits(['refuse', 'confirm', 'close']) // 此处可以不声明

defineProps({
  open: {
    type: Boolean,
    default: false
  }
})
let startTime = 0
</script>
<template>
  <Transition name="popup">
    <div v-if="open" style="position: fixed; top: 0; z-index: 100">
      <div class="mask"></div>

      <div class="modal">
        <ph-x-circle weight="bold" class="x" @click="$emit('close')" />
        <p class="message">
          <slot name="content">Wow! there are some popup message.</slot>
        </p>
        <div class="options">
          <button
            class="btn"
            @mousedown="startTime = Date.now()"
            @click="$emit('confirm', startTime)"
          >
            Yes
          </button>
          <button
            class="btn"
            @mousedown="startTime = Date.now()"
            @click="$emit('refuse', startTime)"
          >
            No
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
<style lang="scss" scoped>
.mask {
  height: 100vh;
  width: 100vw;
  color: black;
  background-color: #ffec63;
  background-image: linear-gradient(
      45deg,
      #ffd966 25%,
      transparent 25%,
      transparent 75%,
      #ffd966 75%,
      #ffd966
    ),
    linear-gradient(-45deg, #ffd966 25%, transparent 25%, transparent 75%, #ffd966 75%, #ffd966);
  background-size: 60px 60px;
  background-position: 0 0;
  animation: slide 4s infinite linear;
}
@keyframes slide {
  0% {
    background-position: 0 0;
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    background-position: -120px 60px;
    opacity: 0.6;
  }
}

.modal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 1.6rem 3rem;
  border: 3px solid black;
  border-radius: 5px;
  background: white;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.2);
}
.x {
  position: absolute;
  right: 0.6rem;
  top: 0.6rem;
  font-size: 1.6rem;
  cursor: pointer;

  &:hover {
    color: var(--c-red-500);
  }
  &:active {
    color: black;
  }
}
.message {
  font-size: 1.1rem;
  margin-bottom: 1.6rem;
  margin-top: 0;
}
.btn {
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  background: white;
  padding: 0.3rem 3.4rem;
  border: 3px solid black;
  margin-right: 2.6rem;
  box-shadow: 0 0 0 black;
  transition: all 0.2s;
  cursor: pointer;
}

.btn:last-child {
  margin: 0;
}

.btn:hover {
  box-shadow: 0.2rem 0.2rem 0 black;
  transform: translate(-0.2rem, -0.2rem);
}

.btn:active {
  box-shadow: 0 0 0 black;
  transform: translate(0, 0);
}

.options {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.popup-enter-active {
  transition: opacity 0.77s cubic-bezier(0.5, 1, 0.89, 1);
}
.popup-leave-active {
  transition: opacity 0.32s cubic-bezier(0.5, 1, 0.89, 1);
}
</style>
