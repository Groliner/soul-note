<script setup>
import { useUserStore, useDiaryStore } from '@/stores'
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const diaryStore = useDiaryStore()
const { user_diary, userInfo } = storeToRefs(userStore)
const diaries = computed(() => diaryStore.getDiaries(userInfo.value.id))
</script>
<template>
  <div class="pfl-wrapper">
    <article>
      <div class="profile-photo"></div>
      <div class="profile-info">
        <h1>{{ userInfo.username }}</h1>
        <p>
          <a>{{ userInfo.email }}</a
          >.
          <br />
          {{ userInfo.desc }}
        </p>
      </div>
      <div class="profile-content">
        <div class="people">
          <a class="round-tile">
            <div class="roundal codepen"></div>
            <h4>CodePen</h4>
          </a>
          <a class="round-tile">
            <div class="roundal instagram"></div>
            <h4>Instagram</h4>
          </a>
          <a class="round-tile">
            <div class="roundal twitter"></div>
            <h4>Twitter</h4>
          </a>
        </div>
        <div class="posts">
          <div class="tile" v-for="diary in diaries" :key="diary.diary_id">
            <div class="inner">
              <figure>
                <img :src="diary.cover" />
                <figcaption
                  :class="{
                    active: diary.diary_id === user_diary.last_read_diary_id
                  }"
                >
                  {{ diary.title }}
                </figcaption>
              </figure>
              <h4>{{ diary.desc }}</h4>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
<style lang="scss" scoped>
.pfl-wrapper {
  width: 100%;
  height: 100%;
  padding: 40px;
  background-color: var(--c-yellow-100);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.08);
}

article {
  display: block;
  width: auto;
  height: auto;
  padding: 50px 0;
  overflow: auto;

  .profile-photo {
    display: block;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background-color: white;
    margin: 0 auto;
    background-image: url(../../assets/images/logo.png);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .profile-info {
    display: block;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    text-align: center;

    h1 {
      font-size: 2em;
      font-weight: 600;
      margin-top: 0.5em;
    }
  }
  .profile-content {
    display: grid;
    grid-template-columns: 1fr 4fr;
    gap: 1rem;
    border-top: 2px solid var(--primary-light);
    justify-content: space-around;

    .people {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin: 60px 0 0;

      .round-tile {
        display: inline-block;
        float: left;
        margin-bottom: 30px;
        text-align: center;
        text-decoration: none;

        &:hover {
          text-decoration: none;

          .roundal {
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.08);
            transition: box-shadow 0.25s;
          }

          h4 {
            color: rgb(2, 117, 216);
            transition: color 0.25s;
            text-decoration: none;
          }
        }

        .roundal {
          display: block;
          margin: 0 auto 10px;
          width: 90px;
          height: 90px;
          background-color: #363636;
          border-radius: 50%;
          transition: box-shadow 0.25s;

          &.twitter {
            background-color: #1da1f2;
            background-image: url('http://www.macdrifter.com/theme/images/twitter-snow.svg');
            background-size: 50% auto;
            background-position: center center;
            background-repeat: no-repeat;
          }

          &.codepen {
            background-color: black;
            background-image: url('https://www.shareicon.net/download/2016/11/03/849433_codepen_512x512.png');
            background-size: 115% auto;
            background-position: center center;
            background-repeat: no-repeat;
          }

          &.instagram {
            background-color: transparent;
            background-image: url('http://sevenfiguresocial.com/wp-content/uploads/2016/08/instagram_gradient_wallpaper_by_jasonzigrino-da28exh-550x400.png');
            background-size: auto 100%;
            background-position: center center;
            background-repeat: no-repeat;
            position: relative;
            overflow: hidden;

            &:before {
              display: block;
              content: '';
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              background-image: url('https://sirgo.org/images/instagram-black-and-white-cliparts-11.png');
              background-size: 50% auto;
              background-position: center center;
              background-repeat: no-repeat;
              z-index: 1;
            }
          }
        }

        h4 {
          font-size: 1.1em;
          color: rgba(32, 32, 32, 0.6);
          transition: color 0.25s;
          text-decoration: none;
        }
      }
    }

    .posts {
      margin: 1rem 0;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-auto-rows: 1fr;
      gap: 1rem;

      .tile {
        align-self: center;
        justify-self: center;
        border: 2.7px solid #f1deda;

        .inner {
          overflow: hidden;
          border-radius: 5px;
          background-color: white;
          cursor: pointer;
          transition: box-shadow 0.25s;

          figure {
            max-width: 10rem;
            display: flex;
            flex-direction: column;
            img {
              width: 100%;
            }
            figcaption {
              background-color: var(--greyDark);
              color: #fff;
              text-align: center;
              font-size: 1.2em;

              &.active {
                background-color: var(--primary);
              }
            }
          }

          h4 {
            font-size: 1.1em;
            line-height: 1.4em;
            padding: 20px 15px 10px;
            transition: color 0.25s;
          }

          &:hover {
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.08);
            transition: box-shadow 0.25s;

            h4 {
              color: rgb(2, 117, 216);
              transition: color 0.25s;
            }
          }
        }
      }
    }
  }
}
</style>
