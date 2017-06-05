<template lang='pug'>
  nav.nav(:class='navClass')
    .nav-left
      a.nav-item(v-if='showMenuButton', @click="$emit('menu-clicked')")
        .menu-button
          span
          span
          span
      a.nav-item(v-if='brandLogo', @click='goHome')
        img(:src='brandLogo')
      a.nav-item(v-if='brandName', @click='goHome') {{brandName}}
      slot(name='left')
    .nav-center
      slot(name='center')
    .nav-right
      slot(name='right')
</template>

<style lang='sass' scoped>
  @import '~bulma'

  .menu-button
    +hamburger($nav-height)
  .fixed
    position: fixed
    top: 0
    width: 100%
</style>

<script>
export default {
  name: 'vulma-navbar',
  props: {
    showMenuButton: [Boolean, String],
    brandName: String,
    brandLogo: String,
    showShadow: [Boolean, String],
    fixed: {
      type: [Boolean, String],
      default: true
    }
  },
  computed: {
    navClass: function () {
      return {
        'has-shadow': this.showShadow,
        'fixed': this.fixed
      }
    }
  },
  methods: {
    goHome: function () {
      if (this.$router)
        this.$router.push('/')
    }
  }
}
</script>
