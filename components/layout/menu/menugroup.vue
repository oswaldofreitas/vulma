<template lang='pug'>
  li.menu-group
    a(@click='toggle')
      | {{title}}
      strong.is-pulled-right {{opened ? '-' : '+'}}
    transition(duration='500', leave-active-class='animated fadeOutLeft', enter-active-class='animated bounceInLeft')
      ul(v-show='opened'): slot
</template>

<style lang='sass' scoped>
  @import '~bulma'

  a
    font-weight: $weight-semibold
</style>

<script>
export default {
  name: 'vulma-menugroup',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      opened: false
    }
  },
  methods: {
    open: function () {
      if (this.$parent.$options._componentTag === 'vulma-menu') {
        this.$parent.$children.forEach(child => {
          if (child.$options._componentTag === 'vulma-menugroup' && child._uid !== this._uid)
            child.close()
        })
      }
      this.opened = true
    },
    close: function () {
      this.opened = false
    },
    toggle: function () {
      if (this.opened)
        this.close()
      else
        this.open()
    }
  }
}
</script>
