<template lang='pug'>
  .field
    .control
      label.checkbox
        input(type='checkbox', @change='onChange', :checked='model')
        | &nbsp;
        slot
</template>

<script>
import modelMixin from '../../../mixins/model'
import { deepValue } from '../../../utils/object'

export default {
  name: 'vulma-checkbox',
  mixins: [modelMixin],
  props: {
    value: Boolean
  },
  methods: {
    onChange: function (e) {
      this.model = e.target.checked
    }
  }
}
</script>
