<template>
  <div class="container_home">
    <section class="section_home">
      <h1>主页-----home</h1>
      <p>testing: diary, account</p>
    </section>
    <div id="load">
      <div>G</div>
      <div>N</div>
      <div>I</div>
      <div>P</div>
      <div>O</div>
      <div>L</div>
      <div>E</div>
      <div>V</div>
      <div>E</div>
      <div>D</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container_home {
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

  #load {
    width: 50rem;
    height: 36px;
    @include absCenter;
    top: 40%;
    overflow: visible;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: default;
    div {
      position: absolute;
      width: 20px;
      height: 36px;
      opacity: 0;
      font-family: inherit;
      font-size: 2em;
      animation: move 3s linear infinite;
      -o-animation: move 3s linear infinite;
      -moz-animation: move 3s linear infinite;
      -webkit-animation: move 3s linear infinite;
      transform: rotate(180deg);
      -o-transform: rotate(180deg);
      -moz-transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
      color: #35c4f0;

      @for $i from 2 through 10 {
        &:nth-child(#{$i}) {
          $delay: ($i - 1) * 0.2s;
          animation-delay: $delay;
          -o-animation-delay: $delay;
          -moz-animation-delay: $delay;
          -webkit-animation-delay: $delay;
        }
      }

      @keyframes move {
        0% {
          left: 0;
          opacity: 0;
        }
        35% {
          left: 41%;
          -moz-transform: rotate(0deg);
          -webkit-transform: rotate(0deg);
          -o-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1;
        }
        65% {
          left: 59%;
          -moz-transform: rotate(0deg);
          -webkit-transform: rotate(0deg);
          -o-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1;
        }
        100% {
          left: 100%;
          -moz-transform: rotate(-180deg);
          -webkit-transform: rotate(-180deg);
          -o-transform: rotate(-180deg);
          transform: rotate(-180deg);
          opacity: 0;
        }
      }

      @-moz-keyframes move {
        0% {
          left: 0;
          opacity: 0;
        }
        35% {
          left: 41%;
          -moz-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1;
        }
        65% {
          left: 59%;
          -moz-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1;
        }
        100% {
          left: 100%;
          -moz-transform: rotate(-180deg);
          transform: rotate(-180deg);
          opacity: 0;
        }
      }

      @-webkit-keyframes move {
        0% {
          left: 0;
          opacity: 0;
        }
        35% {
          left: 41%;
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1;
        }
        65% {
          left: 59%;
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1;
        }
        100% {
          left: 100%;
          -webkit-transform: rotate(-180deg);
          transform: rotate(-180deg);
          opacity: 0;
        }
      }

      @-o-keyframes move {
        0% {
          left: 0;
          opacity: 0;
        }
        35% {
          left: 41%;
          -o-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1;
        }
        65% {
          left: 59%;
          -o-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1;
        }
        100% {
          left: 100%;
          -o-transform: rotate(-180deg);
          transform: rotate(-180deg);
          opacity: 0;
        }
      }
    }
  }
}
</style>
