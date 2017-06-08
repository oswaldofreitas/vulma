<template lang='pug'>
  .columns.is-multiline.is-mobile
    slot
</template>

<script>
export default {
  name: 'vulma-collapsible',
  props: {
    expandable: [Boolean, String]
  },
  methods: {
    onChildOpened(uid) {
      if (!this.expandable) {
        this.$children.forEach(child => {
          if (child._uid !== uid)
            child.close()
        })
      }
    }
  }
}
</script>
