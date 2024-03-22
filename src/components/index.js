// 插件方式将组件全局注册
import slider from './Slider.vue'
import clock from './Clock.vue'
import radioPlayer from './RadioPlayer.vue'
import chip from './Chip.vue'
import segmentedControl from './SegmentedControl.vue'
import grolin from './SvgModules/Grolin.vue'
import popup from './Popup.vue'
export const componentPlugin = {
  install(app) {
    app.component('ClockComponent', clock)
    app.component('SliderComponent', slider)
    app.component('RadioPlayerComponent', radioPlayer)
    app.component('ChipComponent', chip)
    app.component('SegmentedControlComponent', segmentedControl)
    app.component('grolin', grolin)
    app.component('PopupComponent', popup)
  }
}
