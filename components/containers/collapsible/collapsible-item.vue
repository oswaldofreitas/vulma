<template lang='pug'>
  .column.is-12
    .columns.is-multiline.is-mobile
      .header.column.is-12.box.is-marginless(@click='toggle')
        .icon(v-if='icon')
          i(:class='iconClass')
        strong {{title}}
        .icon.is-pulled-right
          i.fa(:class="[ opened ? 'fa-angle-up' : 'fa-angle-down' ]")
      transition(:duration='{ enter: 700, leave: 300 }', enter-active-class='animated fadeIn', leave-active-class='animated fadeOut')
        .body.column.is-12.box(v-show='opened')
          slot
</template>

<style lang='sass' scoped>
  @import '~bulma'

  .box
    border-radius: 0 !important
  .header
    cursor: pointer
    &:hover
      background-color: $white-ter
    .icon
      margin-right: 10px
  .body
    overflow: auto
</style>

<script>
import iconMixin from '../../../mixins/icon'

export default {
  name: 'vulma-collapsible-item',
  mixins: [iconMixin],
  props: {
    title: String,
    startOpened: [Boolean, String]
  },
  data() {
    return {
      opened: false
    }
  },
  mounted() {
    if (this.startOpened)
      this.open()
  },
  methods: {
    open: function () {
      this.opened = true
      this.$parent.onChildOpened(this._uid)
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
