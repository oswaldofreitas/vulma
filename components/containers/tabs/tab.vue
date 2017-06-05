<template lang='pug'>
  .tab(v-if='active')
    slot
</template>

<style lang='sass' scoped>
  .tab
    overflow: auto
</style>

<script>
export default {
  name: 'vulma-tab',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      active: false
    }
  },
  computed: {
    tabClass: function () {
      return {
        'is-active': this.active
      }
    }
  }
}
</script>
