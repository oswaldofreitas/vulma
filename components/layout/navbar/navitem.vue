<template lang='pug'>
  a.nav-item(@click='redirect', :class='[navItemClass, routeClass]')
    .icon(v-if='icon')
      i(:class='iconClass')
    slot
</template>

<script>
import iconMixin from '../../../mixins/icon'
import routeMixin from '../../../mixins/route'

export default {
  name: 'vulma-navitem',
  mixins: [iconMixin, routeMixin],
  props: {
    isTab: {
      type: [Boolean, String],
      default: true
    }
  },
  computed: {
    navItemClass: function () {
      return { 'is-tab': this.isTab }
    }
  }
}
</script>
