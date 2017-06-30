<template lang='pug'>
  .field
    .field-label(:class='sizeClass')
      label.label {{label}}
    .field-body
      .field.is-narrow
        .control
          label.radio(v-for='(row, index) in src', :key='index', :class='sizeClass')
            input(type='radio', :name='`radio${_uid}`', @change='onChange(row)', :checked='getValue(row) === model')
            |  {{getText(row)}}
</template>

<style lang='sass' scoped>
  .radio
    &.is-small
      font-size: 0.75rem
    &.is-medium
      font-size: 1.25rem
    &.is-large
      font-size: 1.5rem
</style>

<script>
import { deepValue } from '../../../utils/object'
import sizeMixin from '../../../mixins/size'

export default {
  name: 'vulma-radio',
  mixins: [sizeMixin],
  model: {
    prop: 'selectedValue'
  },
  props: {
    selectedValue: [String, Number, Date, Object, Array],
    label: String,
    src: Array,
    text: String,
    value: String
  },
  computed: {
    model: {
      get() { return this.selectedValue },
      set(value) { this.$emit('input', value) }
    }
  },
  methods: {
    getValue: function (row) {
      return this.value ? deepValue(row, this.value) : row
    },
    getText: function (row) {
      return this.text ? deepValue(row, this.text) : this.getValue(row)
    },
    onChange: function (row) {
      this.model = this.getValue(row)
    }
  }
}
</script>
