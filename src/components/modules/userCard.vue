<script setup>
import { ref } from 'vue'
import { PhCodepenLogo } from '@phosphor-icons/vue'
const open = ref(false)
</script>
<template>
  <div class="profile">
    <div class="photo">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/764024/profile/profile-512.jpg"
      />
    </div>
    <div class="content">
      <div class="text">
        <h3>Kelly Chen</h3>
        <h6>Front-end Web Designer</h6>
      </div>
      <div class="btn" @click="open = !open" :class="{ active: open }">
        <span></span>
      </div>
    </div>
    <div class="box" :class="{ open: open }">
      <ph-codepen-logo class="icon" />
      <ph-codepen-logo class="icon" />
      <ph-codepen-logo class="icon" />
      <ph-codepen-logo class="icon" />
      <ph-codepen-logo class="icon" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';
@mixin size($w, $h) {
  width: $w;
  height: $h;
}

@mixin bdrs($bdrs) {
  border-radius: $bdrs;
}

* {
  outline: none;
  user-select: none;
}

body,
html {
  margin: 0;
  background: #ddd;
  color: #7a7b7c;
}

body {
  font-family: 'Raleway', 'Microsoft JhengHei', Arial, sans-serif;
}

.profile {
  @include size(330px, 100px);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @include bdrs(5px);
  background-color: #fafafa;
  box-shadow: 0 0 2rem #babbbc;
  animation: show-profile 0.5s forwards ease-in-out;

  @keyframes show-profile {
    0% {
      width: 0;
    }
  }

  .photo,
  .content {
    box-sizing: border-box;
  }

  .photo {
    @include size(100px, 100px);
    @include bdrs(50%);
    overflow: hidden;
    border: 5px solid #fafafa;
    background-color: #fafafa;
    margin-left: -50px;
    box-shadow: 0 0 0.5rem #babbbc;
    animation: rotate-photo 0.5s forwards ease-in-out;

    @keyframes rotate-photo {
      100% {
        transform: rotate(-360deg);
      }
    }

    img {
      width: 100%;
    }
  }

  .content {
    padding: 10px;
    overflow: hidden;
    position: absolute;
    @include size(100%, 100%);
    top: 0;
    left: 0;

    &::before {
      content: '';
      position: absolute;
      @include size(230px, 150px);
      background-color: #e9f3e6;
      left: 0;
      top: -20px;
      z-index: -1;
      transform: rotate(-8deg);
    }

    .text {
      margin-top: 20px;
      margin-left: 50px;

      h3,
      h6 {
        font-weight: normal;
        margin: 3px 0;
        letter-spacing: 0.5px;
        white-space: nowrap;
      }
    }

    .btn {
      background-color: #abc;
      @include size(50px, 50px);
      position: absolute;
      right: 25px;
      top: 25px;
      @include bdrs(50%);
      z-index: 1;
      cursor: pointer;
      transition-duration: 0.3s;
      animation: pop-btn 0.3s both ease-in-out 0.5s;

      @keyframes pop-btn {
        0% {
          transform: scale(0);
        }
        80% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1);
        }
      }

      &:hover {
        box-shadow: 0 0 0 5px rgba(#abc, 0.5);
      }

      span {
        @include size(60%, 2px);
        position: absolute;
        background-color: white;
        top: 50%;
        left: 20%;
        transform: translateY(-50%);
        animation: to-hamburger 0.3s forwards ease-in-out;

        &::before,
        &::after {
          content: '';
          @include size(100%, 2px);
          position: absolute;
          background-color: white;
          transition-duration: 0.3s;
          transform: rotate(0deg);
          right: 0;
        }

        &::before {
          margin-top: -7px;
        }

        &::after {
          margin-top: 7px;
        }
      }
      &.active {
        span {
          animation: to-arrow 0.3s forwards ease-in-out;
          &::before,
          &::after {
            width: 60%;
            right: -1px;
          }

          &::before {
            transform: rotate(45deg);
          }

          &::after {
            transform: rotate(-45deg);
          }
        }
      }
      @keyframes to-hamburger {
        from {
          transform: translateY(-50%) rotate(-180deg);
        }
      }

      @keyframes to-arrow {
        from {
          transform: translateY(-50%) rotate(0deg);
        }
        to {
          transform: translateY(-50%) rotate(180deg);
        }
      }
    }
  }
}

.box {
  @include size(150px, 150px);
  opacity: 0;
  @include bdrs(50%);
  background-color: rgba(white, 0.7);
  position: absolute;
  top: 50%;
  right: -40%;
  transform: translate(-50%, -50%);
  transition-duration: 0.3s;

  .icon {
    @include size(50px, 50px);
    @include bdrs(50%);
    background-color: #ececec;
    font-size: 26px;
    text-align: center;
    line-height: 50px;
    position: absolute;
    left: 18px;
    top: calc(75px - 50px / 2);
    box-shadow: 0 0 0.5rem #babbbc;
    transition: all 0.3s ease;

    &:hover {
      transition-delay: initial !important;
      box-shadow: 0 0 0 5px #babbbc;
    }
  }

  &.open {
    opacity: 1;

    .icon {
      left: 60px;
      $item: 5;
      @for $i from 0 through ($item - 1) {
        $deg: math.div(
          180deg,
          $item - 1
        ); // 因圍繞半圓，為頭尾垂直對齊使 item-1
        &:nth-of-type(#{$i + 1}) {
          transform: rotate($deg * $i - 90)
            translateX(120px)
            rotate(-$deg * $i + 90);
          transition-delay: 0.1s * $i;
        }
      }
    }
  }
}
</style>
