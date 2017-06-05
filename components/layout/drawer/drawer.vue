<template lang='pug'>
  div
    transition(enter-active-class='animated slideInLeft', leave-active-class='animated slideOutLeft')
      .drawer(v-show='opened', @click='onClick')
        button.delete(@click='close')
        slot
    vulma-greymask(:active='opened', @click='close')
</template>

<style lang='sass' scoped>
  .drawer
    position: fixed
    top: 0
    left: 0
    bottom: 0
    z-index: 1000
    overflow-y: auto
    width: 290px
    background: white
    .delete
      position: absolute
      top: 5px
      right: 5px
</style>

<script>
import vulmaGreymask from '../../_shared/greymask'

export default {
  name: 'vulma-drawer',
  components: { vulmaGreymask },
  data() {
    return {
      opened: false
    }
  },
  methods: {
    open: function () {
      this.opened = true
    },
    close: function () {
      this.opened = false
    },
    toggle: function () {
      this.opened = !this.opened
    },
    onClick: function (e) {
      if (e.target.nodeName === 'A' && e.target.parentNode.className === 'menuitem')
        this.close()
    }
  }
}
</script>
