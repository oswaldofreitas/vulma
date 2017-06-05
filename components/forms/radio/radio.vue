<template lang='pug'>
  .field
    label.label(v-if='label') {{label}}
    .control
      label.radio(v-for='(row, index) in src', :key='index')
        input(type='radio', :name='`radio${_uid}`', @change='onChange(row)', :checked='getValue(row) === model')
        |  {{getText(row)}}
</template>

<script>
import { deepValue } from '../../../utils/object'

export default {
  name: 'vulma-radio',
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
