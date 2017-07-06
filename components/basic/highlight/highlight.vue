<template lang='pug'>
  div(v-html='highlight')
</template>

<style lang='sass' scoped>
</style>

<script>
import { removeAccents } from '../../../utils/string'

export default {
  name: 'vulma-highlight',
  props: {
    text: {
      type: String,
      default: ''
    },
    term: {
      type: String,
      default: ''
    },
    ignoreCase: {
      type: [Boolean, String],
      default: true
    },
    ignoreAccents: {
      type: [Boolean, String],
      default: true
    }
  },
  computed: {
    highlight: function () {
      if (!this.term)
        return this.text
      let term = this.term
      let text = this.text
      if (this.ignoreCase) {
        term = term.toLowerCase()
        text = text.toLowerCase()
      }
      if (this.ignoreAccents) {
        term = removeAccents(term)
        text = removeAccents(text)
      }
      const index = text.indexOf(term)
      if (index === -1)
        return this.text
      const length = this.term.length
      return this.text.substr(0, index) +
        '<mark>' +
        this.text.substr(index, length) +
        '</mark>' +
        this.text.substr(index + length)
    }
  }
}
</script>
