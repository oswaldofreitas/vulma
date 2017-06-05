<template lang='pug'>
  li.menuitem
    a(@click='redirect', :class='routeClass')
      .icon(v-if='icon')
        i(:class='iconClass')
      slot
</template>

<style lang='sass' scoped>
  .icon
    margin-right: 10px
</style>

<script>
import iconMixin from '../../../mixins/icon'
import routeMixin from '../../../mixins/route'

export default {
  name: 'vulma-menuitem',
  mixins: [iconMixin, routeMixin]
}
</script>
