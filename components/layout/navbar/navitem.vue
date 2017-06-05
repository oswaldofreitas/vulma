<template lang='pug'>
  a.nav-item(:class='navItemClass')
    .icon(v-if='icon')
      i(:class='iconClass')
    slot
</template>

<script>
import iconMixin from '../../../mixins/icon'

export default {
  name: 'vulma-navitem',
  mixins: [iconMixin],
  props: {
    active: [Boolean, String],
    isTab: {
      type: [Boolean, String],
      default: true
    }
  },
  computed: {
    navItemClass: function () {
      return {
        'is-active': this.active,
        'is-tab': this.isTab
      }
    }
  }
}
</script>
