<template lang='pug'>
  .field
    label.label(v-if='label', :class='sizeClass') {{label}}
    .control(:class='controlClass')
      input.input(:value='model', :type='type', :placeholder='placeholder', :class='sizeClass', @input='onInput', @focus='onFocus')
      .icon.is-left(v-if='iconLeft', :class='sizeClass')
        i(:class='iconLeftClass')
      .icon.is-right(v-if='iconRight', :class='sizeClass')
        i(:class='iconRightClass')
</template>

<script>
import { iconLeftRightMixin } from '../../../mixins/icon'
import modelMixin from '../../../mixins/model'
import sizeMixin from '../../../mixins/size'

export default {
  name: 'vulma-input',
  mixins: [iconLeftRightMixin, modelMixin, sizeMixin],
  props: {
    value: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    label: String,
    placeholder: String,
    readOnly: [Boolean, String]
  },
  computed: {
    controlClass: function () {
      return {
        'has-icons-left': this.iconLeft,
        'has-icons-right': this.iconRight
      }
    }
  },
  methods: {
    onInput(e) {
      this.model = e.target.value
    },
    onFocus() {
      this.$emit('focus')
    }
  }
}
</script>
