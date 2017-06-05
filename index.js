import 'animate.css'
import './vulma.sass'
import * as components from './components/all'
import ClickOutsideDirective from './directives/click-outside'

export default {
  install: function (Vue, options) {
    // Directives
    Vue.directive('click-outside', ClickOutsideDirective)
    // Components
    for (let key in components) {
      let c = components[key]
      Vue.component(c.name, c)
    }
  }
}
