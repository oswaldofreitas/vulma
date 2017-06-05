<template lang='pug'>
  .field
    label.label {{label}}
    .control
      vulma-input(v-if='!opened', v-model='formattedSelectedText' :placeholder='placeholder', read-only, icon-right='fa-angle-down', @focus='open', :icon-left='icon', :size='size')
      transition(:duration='{ enter: 700, leave: 400 }', leave-active-class='animated zoomOut', enter-active-class='animated zoomIn')
        .box(v-if='opened', v-click-outside='close')
          vulma-input(v-if='enableSearch', v-model='searchTerm', icon-left='fa-search', size='small')
          .items
            template(v-for='(items, groupname) in list')
              .group(v-if='group')
                .groupname {{groupname}}
              .item(v-for='(item, index) in items', v-show='canShow(item.row)', @click='onItemClick(item, groupname, index)', :class='itemClass(item)')
                .level.is-mobile
                  .level-left(v-if='multiple')
                    .icon(v-if='item.selected'): i.fa.fa-check-square-o
                    .icon(v-else): i.fa.fa-square-o
                  .level-item
                    slot(:data='item.row')
                    template(v-if='!hasCustomTemplate')
                      small(v-if="size === 'small'") {{getText(item.row)}}
                      p(v-else) {{getText(item.row)}}
                  .level-right
                    .icon.is-pulled-right(v-if='!multiple && item.selected'): i.fa.fa-check
</template>

<style lang='sass' scoped>
  @import '~bulma'

  .box
    box-shadow: 8px 8px 8px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)
    .items
      max-height: 50vh
      overflow: auto
      .group
        padding: 5px 0
        min-height: 2em
        font-weight: $weight-bold
        color: $grey-light
      .item
        cursor: pointer
        padding: 5px
        .level-item
          justify-content: flex-start
        .icon > i
          font-size: $size-6
          margin-right: 5px
        &.selected
          font-weight: $weight-semibold
          background-color: $white-ter
        &:hover
          background-color: $primary
          color: $white
</style>

<script>
import _ from 'lodash'
import iconMixin from '../../../mixins/icon'
import sizeMixin from '../../../mixins/size'
import { deepValue } from '../../../utils/object'
import { removeAccents } from '../../../utils/string'

export default {
  name: 'vulma-select',
  mixins: [iconMixin, sizeMixin],
  model: {
    prop: 'selectedValue'
  },
  props: {
    selectedValue: [String, Number, Date, Object, Array],
    label: String,
    placeholder: {
      type: String,
      default: 'Select a value'
    },
    src: {
      type: Array,
      default: function () {
        return []
      }
    },
    group: String,
    text: String,
    value: String,
    maxSelected: {
      type: Number,
      default: 1,
      validator: function (value) {
        return value >= 0
      }
    },
    maxTextItems: {
      type: Number,
      default: 1,
      validator: function (value) {
        return value >= 1
      }
    },
    selectedText: {
      type: String,
      default: '{0} items selected'
    },
    enableSearch: [Boolean, String]
  },
  data() {
    return {
      opened: false,
      list: [],
      number_selected: 0,
      last_selected: null,
      searchTerm: '',
      hasCustomTemplate: false
    }
  },
  mounted() {
    this.hasCustomTemplate = this.$scopedSlots.default
    if (this.multiple && !this.model)
      this.model = []
    this.updateList()
  },
  computed: {
    model: {
      get() { return this.selectedValue },
      set(value) { this.$emit('input', value) }
    },
    formattedSelectedText: function () {
      if (_.isNil(this.model))
        return ''
      if (!this.multiple)
        return this.getText(this.getSelectedRows()[0])
      if (this.model.length > this.maxTextItems)
        return this.selectedText.replace('{0}', this.model.length)
      return this.getSelectedRows().map(x => this.getText(x)).join(', ')
    },
    multiple: function () {
      return this.maxSelected !== 1
    }
  },
  methods: {
    open: function () {
      this.searchTerm = ''
      this.opened = true
    },
    close: function () {
      this.opened = false
    },
    updateList: function () {
      this.number_selected = 0
      this.list = this.src.reduce((o, row, index) => {
        const groupname = this.group ? deepValue(row, this.group) : ''
        const selected = this.isSelected(row)
        if (!o[groupname])
          o[groupname] = []
        if (selected) {
          this.number_selected++
          if (!this.multiple)
            this.last_selected = { groupname, index: o[groupname].length }
        }
        o[groupname].push({ index, row, selected })
        return o
      }, {})
    },
    isSelected: function (row) {
      if (_.isNil(this.model))
        return false
      const value = this.getValue(row)
      if (this.maxSelected === 1)
        return _.isEqual(value, this.model)
      else if (Array.isArray(this.model))
        return this.model.some(x => _.isEqual(value, x))
    },
    getSelectedRows: function () {
      let selectedValues = this.multiple ? this.model : _.isNil(this.model) ? [] : [this.model]
      return this.src.filter(row => {
        let rowValue = this.getValue(row)
        return selectedValues.some(selectedValue => _.isEqual(selectedValue, rowValue))
      })
    },
    getValue: function (row) {
      return this.value ? deepValue(row, this.value) : row
    },
    getText: function (row) {
      return this.text ? deepValue(row, this.text) : this.getValue(row)
    },
    onItemClick: function (item, groupname, index) {
      if (this.maxSelected > 1 && !item.selected && this.number_selected === this.maxSelected)
        return
      item.selected = !item.selected
      this.number_selected += item.selected ? 1 : -1
      const value = this.getValue(item.row)
      if (!this.multiple) {
        if (item.selected) {
          if (this.last_selected)
            this.list[this.last_selected.groupname][this.last_selected.index].selected = false
          this.model = value
          this.last_selected = { groupname, index }
          this.close()
        }
        else {
          this.model = null
          this.last_selected = null
        }
      }
      else if (item.selected)
        this.model = [...this.model, value]
      else
        this.model = this.model.filter(x => !_.isEqual(x, value))
    },
    canShow: function (row) {
      if (!this.searchTerm)
        return true
      const term = removeAccents(this.searchTerm).toLowerCase()
      const text = removeAccents(this.getText(row)).toLowerCase()
      return text.includes(term)
    },
    itemClass: function (item) {
      return {
        'selected': item.selected
      }
    }
  }
}
</script>
