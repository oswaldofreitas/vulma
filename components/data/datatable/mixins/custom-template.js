export default {
  methods: {
    hasCustomTemplate: function (col) {
      return Boolean(this.$scopedSlots[col.prop] || this.$scopedSlots[col.slot])
    }
  }
}
