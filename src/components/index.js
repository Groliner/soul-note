// 插件方式将组件全局注册
import slider from './Slider.vue'
import clock from './Clock.vue'
import radioPlayer from './RadioPlayer.vue'
import chip from './Chip.vue'
import segmentedControl from './SegmentedControl.vue'
import grolin from './SvgModules/Grolin.vue'
import wolong from './SvgModules/Wolong.vue'
import grozhi from './SvgModules/Grozhi.vue'
import popup from './Popup.vue'
import flexInput from './FlexInput.vue'
export const componentPlugin = {
  install(app) {
    app.component('ClockComponent', clock)
    app.component('SliderComponent', slider)
    app.component('RadioPlayerComponent', radioPlayer)
    app.component('ChipComponent', chip)
    app.component('SegmentedControlComponent', segmentedControl)
    app.component('grolin', grolin)
    app.component('wolong', wolong)
    app.component('grozhi', grozhi)
    app.component('PopupComponent', popup)
    app.component('flexInput', flexInput)
  }
}
