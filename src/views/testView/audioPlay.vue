<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import happy_birthday from '@/assets/music/Happy_Happy_Birthday.ogg'
import happy_birthday_cover from '@/assets/music/Happy_Happy_Birthday.jpg'

import sakura from '@/assets/music/桜咲く.ogg'
import sakura_cover from '@/assets/music/桜咲く.jpg'

const playerTrack = ref(null)
const albumName = ref('')
const trackName = ref('')
const albumArt = ref(null)
const sArea = ref(null)
const seekBar = ref(null)
const trackTime = ref(null)
const insTime = ref(null)
const sHover = ref(null)
const tProgress = ref('')
const tTime = ref('')
const seekT = ref(0)
const seekLoc = ref(0)
const cM = ref(0)

const ctMinutes = ref(0)
const ctSeconds = ref(0)
const curMinutes = ref(0)
const curSeconds = ref(0)
const durMinutes = ref(0)
const durSeconds = ref(0)
const playProgress = ref(0)
const bTime = ref(0)
const nTime = ref(0)
const buffInterval = ref(null)
const tFlag = ref(false)
const albums = ['まよウタ!', 'STEP']
const trackNames = ['Happy Happy Birthday', '桜咲く']
const albumArtworks = ['Happy Happy Birthday', '桜咲く']
const coverArtworks = [happy_birthday_cover, sakura_cover]
const trackUrl = [happy_birthday, sakura]
const currIndex = ref(-1)
const isPlaying = ref(false)
const audio = ref(new Audio())
const hoverTime = computed(() => `${ctMinutes.value}:${ctSeconds.value}`)
const currentTime = computed(() => `${curMinutes.value}:${curSeconds.value}`)
const trackLength = computed(() => `${durMinutes.value}:${durSeconds.value}`)

const playPause = () => {
  setTimeout(() => {
    if (audio.value.paused) {
      playerTrack.value.classList.add('active')
      albumArt.value.classList.add('active')
      checkBuffering()
      audio.value.play()
      isPlaying.value = true
    } else {
      playerTrack.value.classList.remove('active')
      albumArt.value.classList.remove('active')
      clearInterval(buffInterval.value)
      albumArt.value.classList.remove('buffering')
      audio.value.pause()
      isPlaying.value = false
    }
  }, 300)
}

const showHover = (event) => {
  const seekBarPos = sArea.value.getBoundingClientRect()
  seekT.value = event.clientX - seekBarPos.left
  seekLoc.value = audio.value.duration * (seekT.value / sArea.value.offsetWidth)

  cM.value = seekLoc.value / 60

  ctMinutes.value = Math.floor(cM.value)
  ctSeconds.value = Math.floor(seekLoc.value - ctMinutes.value * 60)

  if (ctMinutes.value < 0 || ctSeconds.value < 0) return

  if (ctMinutes.value < 10) ctMinutes.value = '0' + ctMinutes.value
  if (ctSeconds.value < 10) ctSeconds.value = '0' + ctSeconds.value

  //   if (isNaN(ctMinutes.value) || isNaN(ctSeconds.value)) insTime.value = '--:--'
  //   else insTime.value = `${ctMinutes.value}:${ctSeconds.value}`
  insTime.value.classList.add('active')
}

const hideHover = () => {
  seekT.value = 0
  insTime.value.classList.remove('active')
}

const playFromClickedPos = () => {
  audio.value.currentTime = seekLoc.value
  hideHover()
}

const updateCurrTime = () => {
  nTime.value = new Date().getTime()

  if (!tFlag.value) {
    tFlag.value = true
    trackTime.value.classList.add('active')
  }

  curMinutes.value = Math.floor(audio.value.currentTime / 60)
  curSeconds.value = Math.floor(audio.value.currentTime - curMinutes.value * 60)

  durMinutes.value = Math.floor(audio.value.duration / 60)
  durSeconds.value = Math.floor(audio.value.duration - durMinutes.value * 60)

  playProgress.value = (audio.value.currentTime / audio.value.duration) * 100

  if (curMinutes.value < 10) curMinutes.value = '0' + curMinutes.value
  if (curSeconds.value < 10) curSeconds.value = '0' + curSeconds.value

  if (durMinutes.value < 10) durMinutes.value = '0' + durMinutes.value
  if (durSeconds.value < 10) durSeconds.value = '0' + durSeconds.value

  if (isNaN(curMinutes.value) || isNaN(curSeconds.value))
    tProgress.value = '00:00'
  else tProgress.value = `${curMinutes.value}:${curSeconds.value}`

  if (isNaN(durMinutes.value) || isNaN(durSeconds.value)) tTime.value = '00:00'
  else tTime.value = `${durMinutes.value}:${durSeconds.value}`

  if (
    isNaN(curMinutes.value) ||
    isNaN(curSeconds.value) ||
    isNaN(durMinutes.value) ||
    isNaN(durSeconds.value)
  )
    trackTime.value.classList.remove('active')
  else trackTime.value.classList.add('active')

  if (playProgress.value >= 100) {
    playProgress.value = 0
    tProgress.value = '00:00'
    albumArt.value.classList.remove('buffering')
    albumArt.value.classList.remove('active')
    clearInterval(buffInterval.value)
    selectTrack(1)
  }
}

const checkBuffering = () => {
  clearInterval(buffInterval.value)
  buffInterval.value = setInterval(() => {
    if (nTime.value === 0 || bTime.value - nTime.value > 1000)
      albumArt.value.classList.add('buffering')
    else albumArt.value.classList.remove('buffering')

    bTime.value = new Date().getTime()
  }, 100)
}

const selectTrack = (flag) => {
  if (flag === 0 || flag === 1) currIndex.value++
  else currIndex.value--

  if (currIndex.value > -1 && currIndex.value < albumArtworks.length) {
    if (flag === 0) isPlaying.value = false
    else {
      albumArt.value.classList.remove('buffering')
      isPlaying.value = true
    }

    seekBar.value.style.width = '0px'
    trackTime.value.classList.remove('active')
    tProgress.value = '00:00'
    tTime.value = '00:00'

    albumName.value = albums[currIndex.value]
    trackName.value = trackNames[currIndex.value]

    audio.value.src = trackUrl[currIndex.value]

    nTime.value = 0
    bTime.value = new Date().getTime()

    if (flag !== 0) {
      audio.value.play()
      playerTrack.value.classList.add('active')
      albumArt.value.classList.add('active')

      clearInterval(buffInterval.value)
      checkBuffering()
    }

    document
      .getElementById(albumArtworks[currIndex.value])
      .classList.add('active')
  } else {
    if (flag === 0 || flag === 1) {
      currIndex.value = -1
      selectTrack(1)
    } else {
      currIndex.value = albumArtworks.length
      selectTrack(-1)
    }
  }
}

onMounted(() => {
  selectTrack(0)

  audio.value.volume = 0.5

  audio.value.addEventListener('timeupdate', updateCurrTime)
})

onUnmounted(() => {
  isPlaying.value = false
  audio.value.removeEventListener('timeupdate', updateCurrTime)
  clearInterval(buffInterval.value)
  audio.value.pause()
})

const volumeArea = ref(null)
const volumeBar = ref(null)
const volumeHover = ref(null)
const seekVolume = ref(0)
const volume = ref(0.5)

const volumeShowHover = (event) => {
  const volumeBarPos = volumeArea.value.getBoundingClientRect()
  seekVolume.value = -event.clientY + volumeBarPos.bottom
}
const volumeHideHover = (event) => {
  seekVolume.value = 0
}
const volumeClickedPos = () => {
  volume.value = seekVolume.value / volumeArea.value.offsetHeight
  if (volume.value < 0 || volume.value > 1) return
  audio.value.volume = volume.value
  volumeHideHover()
}

import {
  PhPause,
  PhPlay,
  PhCaretLineLeft,
  PhCaretLineRight
} from '@phosphor-icons/vue'

const props = defineProps({
  allBackground: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div id="app-cover">
    <div
      id="bg-artwork"
      :style="{ backgroundImage: `url(${coverArtworks[currIndex]})` }"
      v-if="props.allBackground"
    ></div>
    <div id="bg-layer" v-if="props.allBackground"></div>
    <div id="player">
      <div id="player-track" ref="playerTrack" :class="{ active: isPlaying }">
        <div>
          <div id="track-name">{{ trackName }}</div>
          <div id="album-name">{{ albumName }}</div>
          <div id="track-time" ref="trackTime">
            <div id="current-time">{{ currentTime }}</div>
            <div id="track-length" ref="tTime">{{ trackLength }}</div>
          </div>
          <div
            id="s-area"
            ref="sArea"
            @mousemove="showHover"
            @mouseleave="hideHover"
            @click="playFromClickedPos"
          >
            <div id="ins-time" ref="insTime" :style="{ left: `${seekT}px` }">
              {{ hoverTime }}
            </div>
            <div
              id="s-hover"
              ref="sHover"
              :style="{ width: `${seekT}px` }"
            ></div>
            <div
              id="seek-bar"
              ref="seekBar"
              :style="{ width: `${playProgress}%` }"
            ></div>
          </div>
        </div>
      </div>
      <div id="player-content">
        <div
          id="volume-area"
          ref="volumeArea"
          @mousemove="volumeShowHover"
          @mouseleave="volumeHideHover"
          @click="volumeClickedPos"
        >
          <div
            id="volume-hover"
            ref="volumeHover"
            :style="{ height: `${seekVolume}px` }"
          ></div>
          <div
            id="volume-bar"
            ref="volumeBar"
            :style="{ height: `${volume * 100}%` }"
          ></div>
        </div>
        <div id="album-art" ref="albumArt">
          <img
            v-for="(art, index) in albumArtworks"
            :key="index"
            :id="art"
            :src="coverArtworks[index]"
            :class="{ active: currIndex === index }"
          />
          <div id="buffer-box">Buffering ...</div>
        </div>
        <div id="player-controls">
          <div class="button" id="play-previous" @click="selectTrack(-1)">
            <PhCaretLineLeft :size="32" />
          </div>
          <div class="button" id="play-pause-button" @click="playPause">
            <PhPause :size="32" v-if="isPlaying" />
            <PhPlay :size="32" v-else />
          </div>
          <div class="button" id="play-next" @click="selectTrack(1)">
            <PhCaretLineRight :size="32" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Add your styles here */
</style>

<style lang="scss" scoped>
*:focus {
  outline: none;
}

body {
  font-family: Helvetica, Arial;
  margin: 0;
  background-color: #ffeff5;
}

#app-cover {
  position: absolute;
  // top: 50%;
  right: 0;
  left: 0;
  width: 42rem;
  height: 8rem;
  margin: -4px auto;
}

#bg-artwork {
  position: fixed;
  top: -30px;
  right: -30px;
  bottom: -30px;
  left: -30px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  filter: blur(40px);
  -webkit-filter: blur(40px);
  z-index: 1;
}

#bg-layer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
  opacity: 0.51;
  z-index: 2;
}

#player {
  position: relative;
  height: 100%;
  z-index: 3;
}

#player-track {
  position: absolute;
  top: 0;
  right: 0.8rem;
  left: 0.8rem;
  background-color: #fff7f7;
  border-radius: 1rem 1rem 0 0;
  transition: 0.3s ease top;
  z-index: 1;
  display: flex;
  flex-direction: row-reverse;
  height: 100%;

  &.active {
    top: -105%;
    padding: 0.3rem;
    height: 105%;
  }
  & > div {
    width: 54%;
    margin-right: 4%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5rem;
  }
}

#track-name {
  color: #54576f;
  font-size: 1.8rem;
  font-weight: bold;
}
#album-name {
  color: #acaebd;
  font-size: 1.3rem;
}

#track-time {
  //   height: 1.3rem;
  //   margin-bottom: 3px;
  //   overflow: hidden;
}

#current-time {
  float: left;
}

#track-length {
  float: right;
}

#current-time,
#track-length {
  color: transparent;
  font-size: 1rem;
  background-color: #ffe8ee;
  border-radius: 1.1rem;
  transition: 0.3s ease all;
}

#track-time.active #current-time,
#track-time.active #track-length {
  color: #f86d92;
  background-color: transparent;
}

#s-area,
#seek-bar {
  position: relative;
  height: 4px;
  border-radius: 4px;
}

#s-area {
  background-color: #ffe8ee;
  cursor: pointer;
}

#ins-time {
  position: absolute;
  top: -2.4rem;
  color: #fff;
  font-size: 1rem;
  white-space: pre;
  padding: 5px 6px;
  border-radius: 4px;
  display: none;
  user-select: none;

  &.active {
    display: block;
    margin-left: -1.5rem;
  }
}

#s-hover {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  opacity: 0.2;
  z-index: 2;
}

#ins-time,
#s-hover {
  background-color: #3b3d50;
}

#seek-bar {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  background-color: #fd6d94;
  transition: 0.2s ease width;
  z-index: 1;
}

#player-content {
  position: relative;
  height: 100%;
  background-color: #fff;
  // box-shadow: 0 30px 80px #656565;
  box-shadow: $shadow;
  border-radius: 15px;
  z-index: 2;
  padding-right: 2.5rem;
}

#album-art {
  position: absolute;
  top: -4.44rem;
  width: 9.6rem;
  height: 9.6rem;
  margin-left: 4.44rem;
  transform: rotateZ(0);
  transition: 0.3s ease all;
  box-shadow: 0 0 0 10px #fff;
  border-radius: 50%;
  overflow: hidden;
}

#album-art.active {
  top: -6.67rem;
  box-shadow:
    0 0 0 6px #fff7f7,
    0 30px 50px -15px #afb7c1;
}

#album-art:before {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  width: 20px;
  height: 20px;
  margin: -10px auto 0 auto;
  background-color: #d6dee7;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px #fff;
  z-index: 2;
}

#album-art img {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: -1;
}

#album-art img.active {
  opacity: 1;
  z-index: 1;
}

#album-art.active img.active {
  z-index: 1;
  animation: rotateAlbumArt 3s linear 0s infinite forwards;
}

@keyframes rotateAlbumArt {
  0% {
    transform: rotateZ(0);
  }
  100% {
    transform: rotateZ(360deg);
  }
}

#buffer-box {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  height: 13px;
  color: #1f1f1f;
  font-size: 13px;
  font-family: Helvetica;
  text-align: center;
  font-weight: bold;
  line-height: 1;
  padding: 6px;
  margin: -12px auto 0 auto;
  background-color: rgba(255, 255, 255, 0.19);
  opacity: 0;
  z-index: 2;
}

#album-art img,
#buffer-box {
  transition: 0.1s linear all;
}

#album-art.buffering img {
  opacity: 0.25;
}

#album-art.buffering img.active {
  opacity: 0.8;
  filter: blur(2px);
  -webkit-filter: blur(2px);
}

#album-art.buffering #buffer-box {
  opacity: 1;
}

#player-controls {
  width: 23rem;
  float: right;
  overflow: hidden;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}

.button {
  width: 3.8rem;
  height: 3.8rem;
  background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  & > * {
    width: 60%;
    height: 100%;
  }
}

.button,
.button * {
  transition: 0.2s ease all;
}

.button:hover {
  background-color: #d6d6de;
}

.button:hover * {
  color: #fff;
}

#volume-area,
#volume-bar {
  position: absolute;
  width: 9px;
  height: 80%;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  left: 1.4rem;
  bottom: 10%;
}

#volume-area {
  background-color: #ffe8ee;
  cursor: pointer;
}

#volume-hover {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  opacity: 0.2;
  z-index: 2;
}

#volume-hover {
  background-color: #3b3d50;
}

#volume-bar {
  content: '';
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  height: 0;
  background-color: #fd6d94;
  transition: 0.2s ease width;
  z-index: 1;
}
</style>
