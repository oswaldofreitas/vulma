function validator(value) {
  const validValues = [
    'primary',
    'info',
    'success',
    'warning',
    'danger',
    'white',
    'light',
    'dark',
    'black',
    'link'
  ]
  return validValues.includes(value) || value.startsWith('custom-')
}

const colorMixin = {
  props: {
    color: {
      type: String,
      validator
    }
  },
  computed: {
    colorClass: function () {
      return [
        this.color ? `is-${this.color}` : ''
      ]
    },
    bgColorClass: function () {
      return [
        this.color ? `bgcolor-${this.color}` : ''
      ]
    }
  }
}

const colorDefaultPrimaryMixin = Object.assign({}, colorMixin, {
  props: {
    color: {
      type: String,
      default: 'primary',
      validator
    }
  }
})

export default colorMixin
export { colorDefaultPrimaryMixin }
