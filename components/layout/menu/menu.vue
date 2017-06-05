<template lang='pug'>
  .menu
    ul.menu-list
      slot
</template>

<style lang='sass' scoped>
  .menu
    padding: 10px
</style>

<script>
export default {
  name: 'vulma-menu'
}
</script>
