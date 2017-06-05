export default {
  computed: {
    model: {
      get() { return this.value },
      set(value) { this.$emit('input', value) }
    }
  }
}
