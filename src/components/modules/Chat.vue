<!--
 * @Author: Gro lin
 * @Date: 2024-08-31 17:54:31
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-08-31 19:16:53
-->
<script setup>
import { ref } from 'vue'
const statusList = ['online', 'away', 'busy', 'offline']
const messages = ref(null)
const statusOptionsActive = ref(false)
const profileExpanded = ref(false)
const currentStatus = ref('online')
const messageInput = ref(null)
const scrollToBottom = () => {
  if (messages.value) {
    messages.value.scrollTop = document.documentElement.scrollHeight
  }
}

const toggleStatusOptions = () => {
  statusOptionsActive.value = !statusOptionsActive.value
}

const toggleExpand = () => {
  profileExpanded.value = !profileExpanded.value
}

const setStatus = (status) => {
  currentStatus.value = status
  statusOptionsActive.value = false
}

const newMessage = () => {
  const message = messageInput.value.value.trim()
  if (message === '') return

  // 动态添加消息到列表 (使用 v-for 渲染时应将此逻辑改为更新数据)
  const messagesList = messages.value.querySelector('ul')
  const newMessageElement = document.createElement('li')
  newMessageElement.className = 'sent'
  newMessageElement.innerHTML = `<img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>${message}</p>`
  messagesList.appendChild(newMessageElement)

  // 清空输入框
  messageInput.value.value = null

  // 滚动到最新消息
  scrollToBottom()
}

const handleKeyDown = (e) => {
  e.preventDefault()
  if (e.key === 'Enter') {
    newMessage()
  }
}
</script>
<template>
  <div id="frame">
    <div id="sidepanel">
      <div id="profile" :class="{ expanded: profileExpanded }">
        <div class="wrap">
          <img
            id="profile-img"
            src="http://emilcarlsson.se/assets/mikeross.png"
            class="online"
            alt=""
            @click="toggleStatusOptions"
          />
          <p>Mike Ross</p>
          <i class="fa fa-chevron-down expand-button" aria-hidden="true" @click="toggleExpand"></i>
          <div id="status-options" :class="{ active: statusOptionsActive }">
            <ul>
              <li
                :id="`status-${status}`"
                v-for="status in statusList"
                class="active"
                :key="status"
                @click="setStatus(status)"
              >
                <span class="status-circle"></span>
                <p>{{ status }}</p>
              </li>
            </ul>
          </div>
          <div id="expanded">
            <label for="twitter"><i class="fa fa-facebook fa-fw" aria-hidden="true"></i></label>
            <input name="twitter" type="text" value="mikeross" />
            <label for="twitter"><i class="fa fa-twitter fa-fw" aria-hidden="true"></i></label>
            <input name="twitter" type="text" value="ross81" />
            <label for="twitter"><i class="fa fa-instagram fa-fw" aria-hidden="true"></i></label>
            <input name="twitter" type="text" value="mike.ross" />
          </div>
        </div>
      </div>
      <div id="search">
        <label for=""><i class="fa fa-search" aria-hidden="true"></i></label>
        <input type="text" placeholder="Search contacts..." />
      </div>
      <div id="contacts" :class="{ expanded: profileExpanded }">
        <ul>
          <li class="contact">
            <div class="wrap">
              <span class="contact-status online"></span>
              <img src="http://emilcarlsson.se/assets/louislitt.png" alt="" />
              <div class="meta">
                <p class="name">Louis Litt</p>
                <p class="preview">You just got LITT up, Mike.</p>
              </div>
            </div>
          </li>
          <li class="contact active">
            <div class="wrap">
              <span class="contact-status busy"></span>
              <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
              <div class="meta">
                <p class="name">Harvey Specter</p>
                <p class="preview">
                  Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff.
                  Or, you do any one of a hundred and forty six other things.
                </p>
              </div>
            </div>
          </li>
          <li class="contact">
            <div class="wrap">
              <span class="contact-status away"></span>
              <img src="http://emilcarlsson.se/assets/rachelzane.png" alt="" />
              <div class="meta">
                <p class="name">Rachel Zane</p>
                <p class="preview">
                  I was thinking that we could have chicken tonight, sounds good?
                </p>
              </div>
            </div>
          </li>
          <li class="contact">
            <div class="wrap">
              <span class="contact-status online"></span>
              <img src="http://emilcarlsson.se/assets/donnapaulsen.png" alt="" />
              <div class="meta">
                <p class="name">Donna Paulsen</p>
                <p class="preview">Mike, I know everything! I'm Donna..</p>
              </div>
            </div>
          </li>
          <li class="contact">
            <div class="wrap">
              <span class="contact-status busy"></span>
              <img src="http://emilcarlsson.se/assets/jessicapearson.png" alt="" />
              <div class="meta">
                <p class="name">Jessica Pearson</p>
                <p class="preview">Have you finished the draft on the Hinsenburg deal?</p>
              </div>
            </div>
          </li>
          <li class="contact">
            <div class="wrap">
              <span class="contact-status"></span>
              <img src="http://emilcarlsson.se/assets/haroldgunderson.png" alt="" />
              <div class="meta">
                <p class="name">Harold Gunderson</p>
                <p class="preview">Thanks Mike! :)</p>
              </div>
            </div>
          </li>
          <li class="contact">
            <div class="wrap">
              <span class="contact-status"></span>
              <img src="http://emilcarlsson.se/assets/danielhardman.png" alt="" />
              <div class="meta">
                <p class="name">Daniel Hardman</p>
                <p class="preview">We'll meet again, Mike. Tell Jessica I said 'Hi'.</p>
              </div>
            </div>
          </li>
          <li class="contact">
            <div class="wrap">
              <span class="contact-status busy"></span>
              <img src="http://emilcarlsson.se/assets/katrinabennett.png" alt="" />
              <div class="meta">
                <p class="name">Katrina Bennett</p>
                <p class="preview">I've sent you the files for the Garrett trial.</p>
              </div>
            </div>
          </li>
          <li class="contact">
            <div class="wrap">
              <span class="contact-status"></span>
              <img src="http://emilcarlsson.se/assets/charlesforstman.png" alt="" />
              <div class="meta">
                <p class="name">Charles Forstman</p>
                <p class="preview">Mike, this isn't over.</p>
              </div>
            </div>
          </li>
          <li class="contact">
            <div class="wrap">
              <span class="contact-status"></span>
              <img src="http://emilcarlsson.se/assets/jonathansidwell.png" alt="" />
              <div class="meta">
                <p class="name">Jonathan Sidwell</p>
                <p class="preview"><span>You:</span> That's bullshit. This deal is solid.</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div id="bottom-bar">
        <button id="addcontact">
          <i class="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add contact</span>
        </button>
        <button id="settings">
          <i class="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span>
        </button>
      </div>
    </div>
    <div class="content">
      <div class="contact-profile">
        <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
        <p>Harvey Specter</p>
        <div class="social-media">
          <i class="fa fa-facebook" aria-hidden="true"></i>
          <i class="fa fa-twitter" aria-hidden="true"></i>
          <i class="fa fa-instagram" aria-hidden="true"></i>
        </div>
      </div>
      <div class="messages" ref="messages">
        <ul>
          <li class="sent">
            <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
            <p>
              How the hell am I supposed to get a jury to believe you when I am not even sure that I
              do?!
            </p>
          </li>
          <li class="replies">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            <p>When you're backed against the wall, break the god damn thing down.</p>
          </li>
          <li class="replies">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            <p>Excuses don't win championships.</p>
          </li>
          <li class="sent">
            <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
            <p>Oh yeah, did Michael Jordan tell you that?</p>
          </li>
          <li class="replies">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            <p>No, I told him that.</p>
          </li>
          <li class="replies">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            <p>What are your choices when someone puts a gun to your head?</p>
          </li>
          <li class="sent">
            <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
            <p>What are you talking about? You do what they say or they shoot you.</p>
          </li>
          <li class="replies">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            <p>
              Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or,
              you do any one of a hundred and forty six other things.
            </p>
          </li>
        </ul>
      </div>
      <div class="message-input" @keydown="handleKeyDown">
        <div class="wrap">
          <input type="text" placeholder="Write your message..." ref="messageInput" />
          <i class="fa fa-paperclip attachment" aria-hidden="true"></i>
          <button class="submit" @click="newMessage">
            <i class="fa fa-paper-plane" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
$white: #f5f5f5;
$dark: #2c3e50;
$lighter: #32465a;
$lightest: #496886;
$light: #435f7a;
$red: #e74c3c;
$green: #2ecc71;
$yellow: #f1c40f;
$gray: #95a5a6;
$break: 735px;
$break-big: 900px;

@mixin transition($transition...) {
  -moz-transition: $transition;
  -o-transition: $transition;
  -webkit-transition: $transition;
  transition: $transition;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #27ae60;
  font-family: 'proxima-nova', 'Source Sans Pro', sans-serif;
  font-size: 1em;
  letter-spacing: 0.1px;
  color: $lighter;
  text-rendering: optimizeLegibility;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004);
  -webkit-font-smoothing: antialiased;
}

#frame {
  width: 95%;
  min-width: 360px;
  max-width: 1000px;
  height: 92vh;
  min-height: 300px;
  max-height: 720px;
  background: #e6eaea;
  @media screen and (max-width: 360px) {
    width: 100%;
    height: 100vh;
  }

  #sidepanel {
    float: left;
    min-width: 280px;
    max-width: 340px;
    width: 40%;
    height: 100%;
    background: $dark;
    color: $white;
    overflow: hidden;
    position: relative;
    @media screen and (max-width: $break) {
      width: 58px;
      min-width: 58px;
    }

    #profile {
      width: 80%;
      margin: 25px auto;
      @media screen and (max-width: $break) {
        width: 100%;
        margin: 0 auto;
        padding: 5px 0 0 0;
        background: $lighter;
      }

      &.expanded {
        .wrap {
          height: 210px;
          line-height: initial;

          p {
            margin-top: 20px;
          }

          i.expand-button {
            -moz-transform: scaleY(-1);
            -o-transform: scaleY(-1);
            -webkit-transform: scaleY(-1);
            transform: scaleY(-1);
            filter: FlipH;
            -ms-filter: 'FlipH';
          }
        }
      }

      .wrap {
        height: 60px;
        line-height: 60px;
        overflow: hidden;
        @include transition(0.3s height ease);
        @media screen and (max-width: $break) {
          height: 55px;
        }

        img {
          width: 50px;
          border-radius: 50%;
          padding: 3px;
          border: 2px solid $red;
          height: auto;
          float: left;
          cursor: pointer;
          @include transition(0.3s border ease);
          @media screen and (max-width: $break) {
            width: 40px;
            margin-left: 4px;
          }

          &.online {
            border: 2px solid $green;
          }

          &.away {
            border: 2px solid $yellow;
          }

          &.busy {
            border: 2px solid $red;
          }

          &.offline {
            border: 2px solid $gray;
          }
        }

        p {
          float: left;
          margin-left: 15px;
          @media screen and (max-width: $break) {
            display: none;
          }
        }

        i.expand-button {
          float: right;
          margin-top: 23px;
          font-size: 0.8em;
          cursor: pointer;
          color: $light;
          @media screen and (max-width: $break) {
            display: none;
          }
        }

        #status-options {
          position: absolute;
          opacity: 0;
          visibility: hidden;
          width: 150px;
          margin: 70px 0 0 0;
          border-radius: 6px;
          z-index: 99;
          line-height: initial;
          background: $light;
          @include transition(0.3s all ease);
          @media screen and (max-width: $break) {
            width: 58px;
            margin-top: 57px;
          }

          &.active {
            opacity: 1;
            visibility: visible;
            margin: 75px 0 0 0;
            @media screen and (max-width: $break) {
              margin-top: 62px;
            }
          }

          &:before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 8px solid $light;
            margin: -8px 0 0 24px;
            @media screen and (max-width: $break) {
              margin-left: 23px;
            }
          }

          ul {
            overflow: hidden;
            border-radius: 6px;

            li {
              padding: 15px 0 30px 18px;
              display: block;
              cursor: pointer;
              @media screen and (max-width: $break) {
                padding: 15px 0 35px 22px;
              }

              &:hover {
                background: $lightest;
              }

              span.status-circle {
                position: absolute;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin: 5px 0 0 0;
                @media screen and (max-width: $break) {
                  width: 14px;
                  height: 14px;
                }

                &:before {
                  content: '';
                  position: absolute;
                  width: 14px;
                  height: 14px;
                  margin: -3px 0 0 -3px;
                  background: transparent;
                  border-radius: 50%;
                  z-index: 0;
                  @media screen and (max-width: $break) {
                    height: 18px;
                    width: 18px;
                  }
                }
              }

              p {
                padding-left: 12px;
                @media screen and (max-width: $break) {
                  display: none;
                }
              }

              &#status-online {
                span.status-circle {
                  background: $green;
                }

                &.active {
                  span.status-circle {
                    &:before {
                      border: 1px solid $green;
                    }
                  }
                }
              }

              &#status-away {
                span.status-circle {
                  background: $yellow;
                }

                &.active {
                  span.status-circle {
                    &:before {
                      border: 1px solid $yellow;
                    }
                  }
                }
              }

              &#status-busy {
                span.status-circle {
                  background: $red;
                }

                &.active {
                  span.status-circle {
                    &:before {
                      border: 1px solid $red;
                    }
                  }
                }
              }

              &#status-offline {
                span.status-circle {
                  background: $gray;
                }

                &.active {
                  span.status-circle {
                    &:before {
                      border: 1px solid $gray;
                    }
                  }
                }
              }
            }
          }
        }

        #expanded {
          padding: 100px 0 0 0;
          display: block;
          line-height: initial !important;

          label {
            float: left;
            clear: both;
            margin: 0 8px 5px 0;
            padding: 5px 0;
          }

          input {
            border: none;
            margin-bottom: 6px;
            background: $lighter;
            border-radius: 3px;
            color: $white;
            padding: 7px;
            width: calc(100% - 43px);

            &:focus {
              outline: none;
              background: $light;
            }
          }
        }
      }
    }

    #search {
      border-top: 1px solid $lighter;
      border-bottom: 1px solid $lighter;
      font-weight: 300;
      @media screen and (max-width: $break) {
        display: none;
      }

      label {
        position: absolute;
        margin: 10px 0 0 20px;
      }

      input {
        font-family: 'proxima-nova', 'Source Sans Pro', sans-serif;
        padding: 10px 0 10px 46px;
        width: calc(100% - 25px);
        border: none;
        background: $lighter;
        color: $white;

        &:focus {
          outline: none;
          background: $light;
        }

        &::-webkit-input-placeholder {
          color: $white;
        }
        &::-moz-placeholder {
          color: $white;
        }
        &:-ms-input-placeholder {
          color: $white;
        }
        &:-moz-placeholder {
          color: $white;
        }
      }
    }

    #contacts {
      height: calc(100% - 177px);
      overflow-y: scroll;
      overflow-x: hidden;
      @media screen and (max-width: $break) {
        height: calc(100% - 149px);
        overflow-y: scroll;
        overflow-x: hidden;

        &::-webkit-scrollbar {
          display: none;
        }
      }

      &.expanded {
        height: calc(100% - 334px);
      }

      &::-webkit-scrollbar {
        width: 8px;
        background: $dark;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #243140;
      }

      ul {
        li.contact {
          position: relative;
          padding: 10px 0 15px 0;
          font-size: 0.9em;
          cursor: pointer;
          @media screen and (max-width: $break) {
            padding: 6px 0 46px 8px;
          }

          &:hover {
            background: $lighter;
          }

          &.active {
            background: $lighter;
            border-right: 5px solid $light;

            span.contact-status {
              border: 2px solid $lighter !important;
            }
          }

          .wrap {
            width: 88%;
            margin: 0 auto;
            position: relative;
            @media screen and (max-width: $break) {
              width: 100%;
            }

            span {
              position: absolute;
              left: 0;
              margin: -2px 0 0 -2px;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              border: 2px solid $dark;
              background: $gray;

              &.online {
                background: $green;
              }

              &.away {
                background: $yellow;
              }

              &.busy {
                background: $red;
              }
            }

            img {
              width: 40px;
              border-radius: 50%;
              float: left;
              margin-right: 10px;
              @media screen and (max-width: $break) {
                margin-right: 0px;
              }
            }

            .meta {
              padding: 5px 0 0 0;
              @media screen and (max-width: $break) {
                display: none;
              }

              .name {
                font-weight: 600;
              }

              .preview {
                margin: 5px 0 0 0;
                padding: 0 0 1px;
                font-weight: 400;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                @include transition(1s all ease);

                span {
                  position: initial;
                  border-radius: initial;
                  background: none;
                  border: none;
                  padding: 0 2px 0 0;
                  margin: 0 0 0 1px;
                  opacity: 0.5;
                }
              }
            }
          }
        }
      }
    }

    #bottom-bar {
      position: absolute;
      width: 100%;
      bottom: 0;

      button {
        float: left;
        border: none;
        width: 50%;
        padding: 10px 0;
        background: $lighter;
        color: $white;
        cursor: pointer;
        font-size: 0.85em;
        font-family: 'proxima-nova', 'Source Sans Pro', sans-serif;
        @media screen and (max-width: $break) {
          float: none;
          width: 100%;
          padding: 15px 0;
        }

        &:focus {
          outline: none;
        }

        &:nth-child(1) {
          border-right: 1px solid $dark;
          @media screen and (max-width: $break) {
            border-right: none;
            border-bottom: 1px solid $dark;
          }
        }

        &:hover {
          background: $light;
        }

        i {
          margin-right: 3px;
          font-size: 1em;
          @media screen and (max-width: $break) {
            font-size: 1.3em;
          }
        }

        span {
          @media screen and (max-width: $break) {
            display: none;
          }
        }
      }
    }
  }

  .content {
    float: right;
    width: 60%;
    height: 100%;
    overflow: hidden;
    position: relative;
    @media screen and (max-width: $break) {
      width: calc(100% - 58px);
      min-width: 300px !important;
    }
    @media screen and (min-width: $break-big) {
      width: calc(100% - 340px);
    }

    .contact-profile {
      width: 100%;
      height: 60px;
      line-height: 60px;
      background: $white;

      img {
        width: 40px;
        border-radius: 50%;
        float: left;
        margin: 9px 12px 0 9px;
      }

      p {
        float: left;
      }

      .social-media {
        float: right;

        i {
          margin-left: 14px;
          cursor: pointer;

          &:nth-last-child(1) {
            margin-right: 20px;
          }

          &:hover {
            color: $light;
          }
        }
      }
    }

    .messages {
      height: auto;
      min-height: calc(100% - 93px);
      max-height: calc(100% - 93px);
      overflow-y: scroll;
      overflow-x: hidden;
      @media screen and (max-width: $break) {
        max-height: calc(100% - 105px);
      }

      &::-webkit-scrollbar {
        width: 8px;
        background: rgba(0, 0, 0, 0);
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
      }

      ul {
        li {
          display: inline-block;
          clear: both;
          float: left;
          margin: 15px 15px 5px 15px;
          width: calc(100% - 25px);
          font-size: 0.9em;

          &:nth-last-child(1) {
            margin-bottom: 20px;
          }

          &.sent {
            img {
              margin: 6px 8px 0 0;
            }

            p {
              background: $light;
              color: $white;
            }
          }

          &.replies {
            img {
              float: right;
              margin: 6px 0 0 8px;
            }

            p {
              background: $white;
              float: right;
            }
          }

          img {
            width: 22px;
            border-radius: 50%;
            float: left;
          }

          p {
            display: inline-block;
            padding: 10px 15px;
            border-radius: 20px;
            max-width: 205px;
            line-height: 130%;
            @media screen and (min-width: $break) {
              max-width: 300px;
            }
          }
        }
      }
    }

    .message-input {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 99;

      .wrap {
        position: relative;

        input {
          font-family: 'proxima-nova', 'Source Sans Pro', sans-serif;
          float: left;
          border: none;
          width: calc(100% - 90px);
          padding: 11px 32px 10px 8px;
          font-size: 0.8em;
          color: $lighter;
          @media screen and (max-width: $break) {
            padding: 15px 32px 16px 8px;
          }

          &:focus {
            outline: none;
          }
        }

        .attachment {
          position: absolute;
          right: 60px;
          z-index: 4;
          margin-top: 10px;
          font-size: 1.1em;
          color: $light;
          opacity: 0.5;
          cursor: pointer;
          @media screen and (max-width: $break) {
            margin-top: 17px;
            right: 65px;
          }

          &:hover {
            opacity: 1;
          }
        }

        button {
          float: right;
          border: none;
          width: 50px;
          padding: 12px 0;
          cursor: pointer;
          background: $lighter;
          color: $white;
          @media screen and (max-width: $break) {
            padding: 16px 0;
          }

          &:hover {
            background: $light;
          }

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>
