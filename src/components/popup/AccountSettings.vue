<script setup>
import avatar from '@/assets/music/Happy_Happy_Birthday.jpg'
import img from '@/assets/images/loading.webp'
import { ref } from 'vue'
const select_lang = ref('')
</script>
<template>
  <div class="container_settings">
    <div class="account_wrapper">
      <section class="section_1">
        <figure class="account_avatar">
          <figcaption class="account_avatar_label">account_avatar</figcaption>
          <img class="account_avatar_img" :src="avatar" />
        </figure>
        <div class="account_name">
          <p class="account_name_label">NAME:</p>
          <p class="account_name_value">GROLIN</p>
        </div>
        <div class="account_email">
          <p class="account_email_label">EMAIL:</p>
          <p class="account_email_value">grolin@gmail.com</p>
        </div>
        <div class="account_desc">
          <p class="account_desc_label">DESC:</p>
          <p class="account_desc_value">
            some words to show myself
            fejoewidjfoewjfojfeofjodskjflksdjfoiwejrwiuroewijofiwejrwiuroewijofiwejrwiuroewijofiwejrwiuiwejrwiuroewijofiwejrwiuroewijofiwejrwiuroewijofroewijof
            fejoewidjfoewjfojfeofjodskjflksdjfoiwejrwiuroewijofiwejrwiuroewijofiwejrwiuroewijofiwejrwiuiwejrwiuroewijofiwejrwiuroewijofiwejrwiuroewijofroewijof
            fejoewidjfoewjfojfeofjodskjflksdjfoiwejrwiuroewijofiwejrwiuroewijofiwejrwiuroewijofiwejrwiuiwejrwiuroewijofiwejrwiuroewijofiwejrwiuroewijofroewijof
            fejoewidjfoewjfojfeofjodskjflksdjfoiwejrwiuroewijofiwejrwiuroewijofiwejrwiuroewijofiwejrwiuiwejrwiuroewijofiwejrwiuroewijofiwejrwiuroewijofroewijof
            后期更换为日记本的形式
          </p>
        </div>
      </section>
      <div class="dash-line"></div>

      <div class="account_bg">
        <p class="account_bg_label">background-img</p>
        <figure class="account_bg_img">
          <img :src="img" />
        </figure>
      </div>
      <div class="dash-line"></div>

      <div class="account_lang">
        <p class="account_lang_label">language</p>
        <div class="select">
          <div class="en">
            <input
              id="English"
              type="radio"
              class="account_lang_input"
              value="1"
              v-model="select_lang"
            />
            <label for="English" class="account_lang_label">English</label>
          </div>
          <div class="zh">
            <input
              id="Chinese"
              type="radio"
              class="account_lang_input"
              value="2"
              v-model="select_lang"
            />
            <label for="Chinese" class="account_lang_label">Chinese</label>
          </div>
        </div>
      </div>
      <div class="dash-line"></div>

      <div class="account_others">
        <p class="account_others_label">account_others_label</p>
        <button class="account_others_btn">logout</button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container_settings {
  width: 100vw;
  height: 100vh;
  // color: rgba(223, 34, 122, 0.986);
  display: flex;
  align-items: center;
  justify-content: center;
}

.account_wrapper {
  border: 2px solid var(--primary-light);
  border-radius: 1rem;
  padding: 2rem 3rem;
  font-size: 2rem;

  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  width: 80vw;

  .dash-line {
    width: 100%;
    height: 1px;
    border-bottom: 1px rgb(188, 188, 196) dashed;
  }
  .section_1 {
    display: grid;
    grid-template-columns: minmax(min-content, 20%) 1fr;
    // 这里不设置网格的行,未来保持响应性
    column-gap: 3rem;
    row-gap: 0.5rem;
    grid-auto-flow: row;

    & > * {
      align-self: center;
      border-bottom: 1px solid var(--primary-light);
    }

    .account_avatar {
      width: 13rem;
      height: 13rem;
      border-radius: 50%;
      border: 2px solid rgb(154 198 13);
      grid-row: 1 / 3;
      align-self: center;
      justify-self: center;
      padding: 2px;
      background-color: white;
      transition: all 0.25s;
      cursor: pointer;
      box-shadow: $outer-shadow;

      &_label {
        display: none;
      }

      &_img {
        width: 100%;
        object-fit: cover;
        border-radius: inherit;
        transform: scale(1.1);
        object-position: center;
        transition: transform 0.25s;
        border: 2px solid var(--c-yellow-100);
      }
      &:hover {
        box-shadow:
          $shadow,
          $inner-shadow,
          0 0 30px rgba(0, 0, 0, 0.08);
        border-color: transparent;
        img {
          transform: scale(1.01);
        }
      }
    }
    .account_name {
      grid-row: 1 / 2;
      align-self: last baseline;

      & > * {
        display: inline-block;
        margin-right: 2rem;
      }

      &_label {
      }
      &_value {
      }
    }

    .account_email {
      grid-row: 2 / 3;

      & > * {
        display: inline-block;
        margin-right: 2rem;
      }
    }

    .account_desc {
      grid-column: 1/-1;
      margin-top: 1em;
      & > * {
        display: inline-block;
        margin-right: 2rem;
        word-break: break-all;
      }
    }
  }

  .account_bg {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 1rem;
    height: 16rem;

    &_label {
    }
    &_img {
      width: 60%;
      height: 80%;
      img {
        width: 100%;
        object-fit: cover;
        height: 100%;
      }
    }
  }

  .account_lang {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    &_label {
      transition: color 0.1s ease;
    }

    .select {
      width: 70%;
      display: flex;
      gap: 3rem;
    }

    &_input {
      display: none;

      &:hover + label {
        color: var(--primary-light);
        text-decoration: underline;
      }

      &:checked + label {
        color: var(--primary);
      }
    }
    &_label {
      cursor: pointer;
    }
  }
  .account_others {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &_btn {
      padding: 0.6rem 1.2rem;
      border-radius: 5px;
      background-color: #f0f0f0;
      color: #000;
      font-weight: 600;
      cursor: pointer;
      &:hover {
        background-color: #e0e0e0;
      }
    }
  }
}
</style>
