<template>
  <div class="container">
    <div class="main">
      <div class="content">
        <nav id="menu" class="menu">
          <div
            class="morph-shape"
            data-morph-open="M158.5,0H0v53.1c0,0,19.6-4.6,66-0.2s60.5-3.8,92.5-0.1V0z"
            data-morph-trans="M158.5,0H0v53.1c0,0,35.4,15.4,82,13.8s76.5-14.1,76.5-14.1V0z"
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 158.5 61.2"
              preserveAspectRatio="none"
            >
              <path
                fill="none"
                d="M158.5,0H0v55.6c20.9-12.8,38.5,19.5,73.5-1.9s73.2-7.2,85,0V0z"
              />
            </svg>
          </div>
          <button class="menu__label">
            <i class="fa fa-fw fa-bars"></i><span>Open Menu</span>
          </button>
          <ul class="menu__inner">
            <li>
              <a href="#"
                ><i class="fa fa-fw fa-bookmark-o"></i
                ><span>Reading List</span></a
              >
            </li>
            <li>
              <a href="#"
                ><i class="fa fa-fw fa-hdd-o"></i><span>Saved Items</span></a
              >
            </li>
            <li>
              <a href="#"
                ><i class="fa fa-fw fa-image"></i><span>All Media</span></a
              >
            </li>
            <li>
              <a href="#"
                ><i class="fa fa-fw fa-heart-o"></i><span>Favorites</span></a
              >
            </li>
            <li>
              <a href="#"
                ><i class="fa fa-fw fa-envelope-o"></i><span>Messages</span></a
              >
            </li>
            <li>
              <a href="#"
                ><i class="fa fa-fw fa-bell-o"></i><span>Notifications</span></a
              >
            </li>
          </ul>
        </nav>
      </div>
      ​
    </div>
    <!-- /main -->
  </div>
  <!-- /container -->
</template>

<script setup>
;(function () {
  function SVGDDMenu(el, options) {
    this.el = el
    this.init()
  }

  SVGDDMenu.prototype.init = function () {
    this.shapeEl = this.el.querySelector('div.morph-shape')

    var s = Snap(this.shapeEl.querySelector('svg'))
    this.pathEl = s.select('path')
    this.paths = {
      reset: this.pathEl.attr('d'),
      trans: this.shapeEl.getAttribute('data-morph-trans'),
      open: this.shapeEl.getAttribute('data-morph-open')
    }

    this.isOpen = false

    this.initEvents()
  }

  SVGDDMenu.prototype.initEvents = function () {
    this.el.addEventListener('click', this.toggle.bind(this))

    // For Demo purposes only
    ;[].slice.call(this.el.querySelectorAll('a')).forEach(function (el) {
      el.onclick = function () {
        return false
      }
    })
  }

  SVGDDMenu.prototype.toggle = function () {
    var self = this

    if (this.isOpen) {
      classie.remove(self.el, 'menu--open')

      self.pathEl.stop().animate({ path: this.paths.reset }, 3000, mina.elastic)
    } else {
      classie.add(self.el, 'menu--open')

      this.pathEl
        .stop()
        .animate({ path: this.paths.trans }, 320, mina.easeinout, function () {
          self.pathEl
            .stop()
            .animate({ path: self.paths.open }, 2500, mina.elastic)
        })
    }

    this.isOpen = !this.isOpen
  }

  new SVGDDMenu(document.getElementById('menu'))
})()
</script>

<style lang="scss" scoped>
.menu {
  width: 300px;
  height: 70px;
  margin: 2em auto;
  position: relative;
  text-align: left;
  cursor: pointer;
  z-index: 100;
}

.menu__label {
  display: block;
  background: none;
  border: none;
  width: 100%;
  height: 70px;
  padding: 0 1.25em;
  font-size: 1.3em;
  color: #fff;
  position: relative;
  outline: none;
  text-align: left;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent; /* For some Androids */
}

.menu__inner li a span,
.menu__label span {
  font-size: 0.68em;
  font-family: 'helvetica' sans;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.2;
  font-weight: 600;
}

.menu .fa {
  vertical-align: top;
  line-height: 1.25;
  margin-right: 0.65em;
  font-size: 1.15em;
}

.menu__inner {
  list-style: none;
  padding: 0 1.25em;
  font-size: 1.3em;
  margin: 0;
  position: absolute;
  overflow: hidden;
  height: 0;
  -webkit-transition: height 0.5s cubic-bezier(0.7, 0, 0.3, 1);
  transition: height 0.5s cubic-bezier(0.7, 0, 0.3, 1);
}

.menu.menu--open .menu__inner {
  height: 310px;
}

.menu__inner li a {
  display: block;
  padding: 0.53em 0;
  line-height: 1.2;
  opacity: 0;
  color: rgba(0, 0, 0, 0.25);
  text-decoration: none;
  pointer-events: none;
  outline: none;
  -webkit-transform: translate3d(0, -20px, 0);
  transform: translate3d(0, -20px, 0);
  -webkit-transition:
    opacity 0.3s,
    -webkit-transform 0.3s;
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.menu__inner li a:hover {
  color: rgba(0, 0, 0, 0.75);
}

.menu--open .menu__inner li a {
  opacity: 1;
  pointer-events: auto;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.menu--open .menu__inner li:nth-child(2) a {
  -webkit-transition-delay: 0.04s;
  transition-delay: 0.04s;
}

.menu--open .menu__inner li:nth-child(3) a {
  -webkit-transition-delay: 0.08s;
  transition-delay: 0.08s;
}

.menu--open .menu__inner li:nth-child(4) a {
  -webkit-transition-delay: 0.12s;
  transition-delay: 0.12s;
}

.menu--open .menu__inner li:nth-child(5) a {
  -webkit-transition-delay: 0.16s;
  transition-delay: 0.16s;
}

.menu--open .menu__inner li:nth-child(6) a {
  -webkit-transition-delay: 0.2s;
  transition-delay: 0.2s;
}

.morph-shape,
.morph-shape svg {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}

.morph-shape {
  height: 70px;
  -webkit-transition: height 0.5s cubic-bezier(0.7, 0, 0.3, 1);
  transition: height 0.5s cubic-bezier(0.7, 0, 0.3, 1);
  overflow: visible;
}

.morph-shape svg {
  height: 100%;
  overflow: visible;
}

.menu.menu--open .morph-shape {
  height: 500px;
}

.menu.menu--open .morph-shape svg path {
  fill: gray;
}

.morph-shape svg path {
  fill: #00c3ff;
  -webkit-transition: fill 0.5s cubic-bezier(0.7, 0, 0.3, 1);
  transition: fill 0.5s cubic-bezier(0.7, 0, 0.3, 1);
}
</style>
