<template lang='pug'>
  transition(enter-active-class='animated fadeIn', leave-active-class='animated fadeOut')
    .mask(v-if='active', @click="$emit('click')")
</template>

<style lang='sass' scoped>
  .mask
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 999
    background-color: rgba(0,0,0,0.5)
</style>

<script>
export default {
  name: 'vulma-greymask',
  props: {
    active: [Boolean, String]
  }
}
</script>
