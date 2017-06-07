<template lang='pug'>
  figure.image(:class='figureClass')
    img(:src='src', :class='imgClass')
</template>

<style lang='sass' scoped>
  .circle
    border-radius: 50%
  .rounded
    border-radius: 25%
  .zoom-on-hover
    transition: all 0.3s
    &:hover
      transform: scale(1.1)
</style>

<script>
export default {
  name: 'vulma-avatar',
  props: {
    sizePx: {
      type: Number,
      default: 48,
      validator: function (value) {
        const validValues = [16, 24, 32, 48, 64, 96, 128]
        return validValues.includes(value)
      }
    },
    format: {
      type: String,
      default: 'circle',
      validator: function (value) {
        const validValues = [
          'circle',
          'rounded',
          'square'
        ]
        return validValues.includes(value)
      }
    },
    src: String,
    animate: [Boolean, String]
  },
  computed: {
    figureClass: function () {
      return [
        `is-${this.sizePx}x${this.sizePx}`
      ]
    },
    imgClass: function () {
      return [
        this.format,
        { 'zoom-on-hover': this.animate }
      ]
    }
  }
}
</script>
