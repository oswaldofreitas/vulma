export default {
  props: {
    size: {
      type: String,
      validator: function (value) {
        const validValues = [
          'small',
          'medium',
          'large'
        ]
        return validValues.includes(value)
      }
    }
  },
  computed: {
    sizeClass: function () {
      return [
        this.size ? `is-${this.size}` : ''
      ]
    }
  }
}
