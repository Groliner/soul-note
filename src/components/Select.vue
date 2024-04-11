<script setup>
/*global TweenMax, TimelineMax, Power1, Power2*/

/*
author: Marco Barría
devDependencies:
  - GSAP TweenMax https://greensock.com/tweenmax (Necessary for animation.)
*/

// MOBILE DETECT, RANDOM FUNCTION
var Utils = {
  Android: function () {
    return navigator.userAgent.match(/Android/i)
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i)
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i)
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i)
  },
  any: function () {
    return (
      Utils.Android() ||
      Utils.BlackBerry() ||
      Utils.iOS() ||
      Utils.Opera() ||
      Utils.Windows()
    )
  },
  randomInRange: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

var $borders = [].slice.call(document.querySelectorAll('.border-inner'), 0),
  wrapperRombo = document.getElementById('wrapper'),
  control = document.getElementById('control'),
  colors = ['#df3891', '#fff78b', '#692286', '#c4a66b', '#ed95c0', '#6ac1b8'],
  nRombo = 46,
  timer = 0.8

var setObj = function setObj() {
  var zoomLevel = document.documentElement.clientWidth / window.innerWidth
  var heightIOs = window.innerHeight * zoomLevel

  if (Utils.iOS()) {
    if (heightIOs > window.innerWidth) {
      document.querySelector('.Main').style.height = heightIOs + 'px'
      document.querySelector('.Main').style.minHeight = heightIOs + 'px'
    }
  }

  TweenMax.set(document.querySelectorAll('.border-inner')[0], {
    y: -32
  })
  TweenMax.set(document.querySelectorAll('.border-inner')[1], {
    y: 32
  })
  TweenMax.set(document.querySelectorAll('.border-inner')[2], {
    x: -32
  })
  TweenMax.set(document.querySelectorAll('.border-inner')[3], {
    x: 32
  })
}

var border = function border() {
  var tl = new TimelineMax()

  tl.to($borders, 1.8, {
    x: 0,
    y: 0,
    force3D: true,
    ease: Power1.easeOut,
    onComplete: function () {
      document.body.classList.remove('overflow')
    }
  })

  return tl
}

var romboInit = function romboInit() {
  for (var i = 0; i < nRombo; i++) {
    var gridItem = document.createElement('div')
    var romboDiv = document.createElement('div')

    wrapperRombo.appendChild(gridItem)
    gridItem.className = 'box'

    TweenMax.set('.box', {
      perspective: 600,
      transformOrigin: '50% 50%'
    })

    document.querySelectorAll('.box')[i].appendChild(romboDiv)
    romboDiv.className = 'rombo'

    TweenMax.set('.rombo', {
      transformStyle: 'preserve-3d'
    })

    if (Utils.any()) {
      TweenMax.set(document.querySelectorAll('.rombo')[i], {
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        top: Utils.randomInRange(-40, 40),
        left: Utils.randomInRange(-40, 40),
        y: 0,
        scale: 0,
        opacity: 0,
        transformOrigin: '50% 50%',
        rotationY: Utils.randomInRange(-720, 720),
        rotation: Utils.randomInRange(-320, 320)
      })
    } else {
      TweenMax.set(document.querySelectorAll('.rombo')[i], {
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        top: Utils.randomInRange(-180, 180),
        left: Utils.randomInRange(-180, 180),
        y: -100,
        scale: 0,
        opacity: 0,
        transformOrigin: '50% 50%',
        rotationY: Utils.randomInRange(-720, 720),
        rotation: Utils.randomInRange(-320, 320)
      })
    }
  }
}

var romboAnimation = function romboAnimation() {
  var romboTodo = [].slice.call(document.querySelectorAll('.rombo'), 0)
  var tl = new TimelineMax()

  tl.staggerTo(
    romboTodo,
    1.2,
    {
      y: 0,
      scale: 1,
      opacity: 1,
      rotationY: 0,
      rotation: '+=240',
      force3D: true,
      ease: Power2.easeOut
    },
    0.08
  )

  return tl
}

var init = function init() {
  setObj()
  romboInit()

  // MASTER SCENES

  var master = new TimelineMax({
    delay: 0.4
  })

  master.add(border(), 'scene1').add(romboAnimation(), '-=1.8', 'scene2')
  master.timeScale(timer)

  function go(el) {
    master.play()
    master.timeScale(timer)
    el.textContent = 'REVERSE'
  }

  function rewards(el) {
    master.reverse()
    master.timeScale(timer * 5)
    el.textContent = 'PLAY'
  }

  control.onclick = function () {
    master.reversed() ? go(this) : rewards(this)
    return false
  }
}

window.onload = init
</script>
<template>
  <main class="Main" role="main">
    <a id="control" href="#">REVERSE</a>
    <div id="borderBlack" class="border">
      <div class="border-inner"></div>
      <div class="border-inner"></div>
      <div class="border-inner"></div>
      <div class="border-inner"></div>
    </div>
    <div id="wrapper"></div>
  </main>
</template>
<style lang="scss" scoped>
$color-white: #fff;
$color-pink: #ff3668;
$color-border: #000;
$component: 'Main';

.#{$component} {
  display: block;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.border {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  min-height: 100vh;
  z-index: 10;
  &-inner {
    background-color: $color-border;
    position: absolute;
    will-change: transform;
  }
  &-inner:nth-child(1),
  &-inner:nth-child(2) {
    width: 100%;
    height: 31px;
  }
  &-inner:nth-child(3),
  &-inner:nth-child(4) {
    width: 31px;
    height: 100%;
  }
  &-inner:nth-child(1) {
    top: 0;
    left: 0;
    transform: translateY(-32px);
  }
  &-inner:nth-child(2) {
    bottom: 0;
    left: 0;
    transform: translateY(32px);
  }
  &-inner:nth-child(3) {
    top: 0;
    left: 0;
    transform: translateX(-32px);
  }
  &-inner:nth-child(4) {
    top: 0;
    right: 0;
    transform: translateX(32px);
  }
}

#wrapper {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  .box {
    display: inline-block;
    float: left;
    position: relative;
    width: 16.666%;
    height: 15vh;
  }
  .rombo {
    display: inline-block;
    background-color: $color-pink;
    will-change: transform, opacity;
    opacity: 0;
    // new
    position: absolute;
    width: 2vw;
    height: 1vw;
  }
}

@media only screen and (max-width: 736px) {
  #wrapper {
    .rombo {
      width: 4vw;
      height: 2vw;
    }
  }

  .#{$component} {
    height: 100vh;
    min-height: 100vh;
  }

  .border {
    min-height: 100%;
    &-inner:nth-child(1),
    &-inner:nth-child(2) {
      width: 100%;
      height: 10px;
    }
    &-inner:nth-child(3),
    &-inner:nth-child(4) {
      width: 10px;
      height: 100%;
    }
  }
}

#control {
  background-color: #fff;
  border: 1px solid #eee;
  display: block;
  color: #000;
  text-decoration: none;
  font-family: 'Cutive Mono';
  text-align: center;
  letter-spacing: 5px;
  padding: 2px 8px 2px 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}

* {
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

*,
*:after,
*:before {
  box-sizing: border-box;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizelegibility;
}

html,
body {
  height: 100%;
}

body {
  background-color: $color-white;
  font-size: 16px;
}

.overflow {
  overflow: hidden !important;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}
</style>
