<template lang='pug'>
  .panel
    .panel-heading
      .icon(v-if='icon')
        i(:class='iconClass')
      | {{title}}
    .panel-block
      slot
</template>

<style lang='sass' scoped>
  .icon
    margin-right: 10px
</style>

<script>
import iconMixin from '../../../mixins/icon'

export default {
  name: 'vulma-panel',
  mixins: [iconMixin],
  props: {
    title: String
  }
}
</script>
