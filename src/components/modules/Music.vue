<script setup>
import happy_birthday from '@/assets/music/Happy_Happy_Birthday.ogg'
import happy_birthday_lrc from '@/assets/music/Happy_Happy_Birthday.txt'
import { ref, onMounted } from 'vue'
import axios from 'axios'
const audio = ref(null)
const lyricsDiv = ref(null)

const lyrics = ref([])
const currentLineIndex = ref(0)
// 加载LRC文件内容
const loadLRC = async () => {
  const response = await axios.get(happy_birthday_lrc)
  console.log(happy_birthday_lrc)
  return response.data
}
const parseLRC = (lrc) => {
  const lines = lrc.split('\n')
  return lines
    .map((line) => {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/)
      if (match) {
        const minutes = parseInt(match[1])
        const seconds = parseInt(match[2])
        const milliseconds = parseInt(match[3]) * 10
        const text = match[4]
        return {
          time: minutes * 60 + seconds + milliseconds / 1000,
          text: text
        }
      }
      return null
    })
    .filter((line) => line)
}

const updateLyrics = () => {
  const currentTime = audio.value.currentTime
  if (
    currentLineIndex.value < lyrics.value.length - 1 &&
    currentTime >= lyrics.value[currentLineIndex.value + 1].time
  ) {
    currentLineIndex.value++
  }
  if (
    currentLineIndex.value > 0 &&
    currentTime < lyrics.value[currentLineIndex.value].time
  ) {
    currentLineIndex.value--
  }
  const lines = lyricsDiv.value.getElementsByTagName('p')
  for (let i = 0; i < lines.length; i++) {
    lines[i].classList.remove('current-line')
  }
  if (lines[currentLineIndex.value]) {
    lines[currentLineIndex.value].classList.add('current-line')
    lyricsDiv.value.scrollTop =
      lines[currentLineIndex.value].offsetTop - lyricsDiv.value.offsetTop
  }
}

onMounted(async () => {
  const lrcContent = await loadLRC()
  lyrics.value = parseLRC(lrcContent)
})
</script>
<template>
  <figure class="container_music">
    <figcaption>Happy Birthday</figcaption>
    <audio controls loop ref="audio" @timeupdate="updateLyrics">
      <source :src="happy_birthday" type="audio/ogg" />
      Your browser does not support the audio element.
    </audio>
    <div id="lyrics" ref="lyricsDiv" class="lyrics">
      <p
        v-for="(line, index) in lyrics"
        :key="index"
        class="line"
        :class="{ 'current-line': index === currentLineIndex }"
      >
        {{ line.text }}
      </p>
    </div>
  </figure>
</template>
<style lang="scss" scoped>
.container_music {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2em;
  figcaption {
    font-size: 3rem;
  }
  .lyrics {
    height: 50vh;
    overflow-y: hidden;
    font-size: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3em;
    .line {
      display: inline-block;
      color: rgb(235 0 91 / 25%);
      &.current-line {
        color: rgb(235 0 91);
      }
    }
  }
}
</style>
