export default {
  bind: function (el, binding, vNode) {
    el.__clickOutside = (e) => {
      if (binding.modifiers.bubble || (!el.contains(e.target) && el !== e.target))
        binding.value(e)
    }
    document.addEventListener('click', el.__clickOutside)
  },
  unbind: function (el, binding) {
    document.removeEventListener('click', el.__clickOutside)
    el.__clickOutside = null
  }
}
