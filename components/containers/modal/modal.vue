<template lang='pug'>
  .modal(:class='modalClass')
    .modal-background(@click='onClickOutside')
    template(v-if='!isDialog')
      .modal-content
        slot
      button.modal-close(v-if='showCloseButton', @click='close')
    .modal-card(v-else)
      header.modal-card-head
        .icon(v-if='icon')
          i(:class='iconClass')
        .modal-card-title {{title}}
        button.delete(v-if='showCloseButton', @click='close')
      section.modal-card-body
        slot
      footer.modal-card-foot
        slot(name='footer')
</template>

<style lang='sass' scoped>
  .icon
    margin-right: 10px
</style>

<script>
import iconMixin from '../../../mixins/icon'

export default {
  name: 'vulma-modal',
  mixins: [iconMixin],
  data() {
    return {
      opened: false
    }
  },
  props: {
    isDialog: [Boolean, String],
    title: String,
    closeOnClickOutside: [Boolean, String],
    showCloseButton: {
      type: [Boolean, String],
      default: true
    }
  },
  computed: {
    modalClass: function () {
      return {
        'is-active': this.opened
      }
    }
  },
  methods: {
    open: function () {
      this.opened = true
    },
    close: function () {
      this.opened = false
    },
    onClickOutside: function () {
      if (this.closeOnClickOutside)
        this.close()
    }
  }
}
</script>
