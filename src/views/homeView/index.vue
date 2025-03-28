<script setup>
/*
TODO:
将主页的样式设提取为API

*/
import { useUserStore } from '@/stores'
import audioPlay from '../testView/audioPlay.vue'

import { computed, ref } from 'vue'
const userStore = useUserStore()
const themeMode = 1
const themeList = [
  {
    name: 'birthday',
    text: 'HAPPY BIRTHDAY!'
  },
  {
    name: 'simple',
    text: 'DEVELOPING'
  }
]
const theme = computed(() => themeList[themeMode])
</script>
<template>
  <div class="container_home">
    <section class="section_home" v-if="theme.name === 'birthday'">
      <!-- <h1>Happy Birthday ! Grozhi</h1> -->
      <h1>Happy Birthday ! Wolong</h1>
      <p>Moving forward and Handling your worries correctly, then catching the future</p>
    </section>
    <section class="section_home" v-else>
      <h1>主页-----home</h1>
      <p>
        {{
          userStore.selectLanguage === 'en-US' ? 'testing: diary, account' : '测试功能：日记，用户'
        }}
      </p>
    </section>
    <section class="section_loading">
      <div id="load" :class="{ birthday: theme.name === 'birthday' }">
        <div
          v-for="(word, index) in theme.text"
          :style="{
            animationDelay: `${index * 0.2}s`
          }"
        >
          {{ word }}
        </div>
      </div>
    </section>
    <!-- <section class="send-message">
      <h1>发送消息</h1>
      <input type="text" />
      <sendButton />
    </section> -->
    <section class="section_audio">
      <audioPlay :allBackground="false" :theme="theme.name" />
    </section>
  </div>
</template>
<style lang="scss" scoped>
.container_home {
  display: flex;
  flex-direction: column;
  .section_home {
    p,
    h1 {
      width: fit-content;
      margin: 0 auto;
    }
    p {
      margin-top: 2rem;
    }
  }

  .section_audio {
    position: relative;
  }

  .section_loading {
    position: relative;
    height: 50vh;
    #load {
      width: 50rem;
      height: 36px;
      @include absCenter;
      top: 40%;
      overflow: visible;
      user-select: none;
      cursor: default;

      &.birthday > div {
        color: #f00;
      }

      & > div {
        color: #10a0f3;
      }

      div {
        position: absolute;
        width: 20px;
        height: 36px;
        opacity: 0;
        font-family: inherit;
        font-size: 2em;
        animation: move 3s linear infinite;
        transform: rotate(180deg);

        // @for $i from 2 through 10 {
        //   &:nth-child(#{$i}) {
        //     $delay: ($i - 1) * 0.2s;
        //     animation-delay: $delay;
        //     -o-animation-delay: $delay;
        //     -moz-animation-delay: $delay;
        //     -webkit-animation-delay: $delay;
        //   }
        // }

        @keyframes move {
          0% {
            left: 100%;
            opacity: 0;
          }
          35% {
            left: 59%;
            transform: rotate(0deg);
            opacity: 1;
          }
          65% {
            left: 41%;
            transform: rotate(0deg);
            opacity: 1;
          }
          100% {
            left: 0%;
            transform: rotate(180deg);
            opacity: 0;
          }
        }
        @-moz-keyframes move {
          0% {
            left: 100%;
            opacity: 0;
          }
          35% {
            left: 59%;
            transform: rotate(0deg);
            opacity: 1;
          }
          65% {
            left: 41%;
            transform: rotate(0deg);
            opacity: 1;
          }
          100% {
            left: 0%;
            transform: rotate(180deg);
            opacity: 0;
          }
        }

        @-webkit-keyframes move {
          0% {
            left: 100%;
            opacity: 0;
          }
          35% {
            left: 59%;
            -moz-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
            opacity: 1;
          }
          65% {
            left: 41%;
            -moz-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
            opacity: 1;
          }
          100% {
            left: 0%;
            -moz-transform: rotate(180deg);
            -webkit-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            transform: rotate(180deg);
            opacity: 0;
          }
        }

        @-o-keyframes move {
          0% {
            left: 100%;
            opacity: 0;
          }
          35% {
            left: 59%;
            -moz-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
            opacity: 1;
          }
          65% {
            left: 41%;
            -moz-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
            opacity: 1;
          }
          100% {
            left: 0%;
            -moz-transform: rotate(180deg);
            -webkit-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            transform: rotate(180deg);
            opacity: 0;
          }
        }
      }
    }
  }
}
</style>
