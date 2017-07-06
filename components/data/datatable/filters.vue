<template lang='pug'>
  .datatable-filter
    vulma-button(icon='fa-filter', size='small', @click='$refs.modal.open()', :color="model.list.length ? 'info' : null")
      | {{i18n.filterButton}}
    vulma-modal(ref='modal', close-on-click-outside)
      .card
        .card-header
          .card-header-title
            vulma-radio(:src='conditions', text='description', value='value', v-model='model.conditions', size='small')
          .card-header-icon(v-show='model.list.length')
            vulma-button(size='small', color='danger', @click='removeAllFilters')
              | {{i18n.removeAllFilters}}
        .card-content
          vulma-select(:label='i18n.addFilterBy', :placeholder='i18n.selectAColumn', :src='filterCols', text='name', value='index', v-model='selectedColIndex', enable-search, size='small')
          vulma-select(v-show='filterTypesComputed.length', :placeholder='i18n.selectAFilterType', :src='filterTypesComputed', text='description', v-model='selectedFilterType', size='small' )
          template(v-if='selectedFilterType')
            vulma-input(v-if="selectedCol.type === 'Number'", type='number', size='small', v-model='filterValue')
            vulma-input(v-else-if="selectedCol.type === 'String'", size='small', v-model='filterValue')
            vulma-radio(v-else-if="selectedCol.type === 'Boolean'", :src='booleanValues', text='text', value='value', size='small', v-model='filterValue')
            vulma-datepicker(v-else-if="selectedCol.type === 'Date'", :locale='locale', :i18n="{ today: i18n.today }", v-model='filterValue', size='small')
            .has-text-right
              vulma-button(size='small', icon='fa-plus', @click='addFilter') {{i18n.add}}
          vulma-panel(:title='i18n.currentFilters', v-show='model.list.length')
            table.table.is-striped.is-narrow
              tbody
                tr(v-for='(filter, index) in model.list')
                  td {{filter.col.name}}
                  td {{filter.type.description}}
                  td {{filter.displayValue}}
                  td
                    vulma-button(size='small', icon='fa-trash', @click='removeFilter(index)')
</template>

<style lang='sass' scoped>
  @import '~bulma'

  .card-header-icon
    .fa-stack-2x
      color: $danger
      opacity: .5
</style>

<script>
import _ from 'lodash'
import { toLocaleDateString } from '../../../utils/datetime'
import modelMixin from '../../../mixins/model'

export default {
  name: 'filters',
  mixins: [modelMixin],
  props: {
    value: Object,
    cols: Array,
    locale: String,
    i18n: Object
  },
  data() {
    return {
      selectedColIndex: null,
      selectedFilterType: null,
      filterValue: null
    }
  },
  computed: {
    conditions: function () {
      return [
        { value: 'all', description: this.i18n.conditions.all },
        { value: 'any', description: this.i18n.conditions.any }
      ]
    },
    filterTypes: function () {
      return [
        { symbol: '=', description: this.i18n.types.equals, types: [Number, String, Boolean, Date] },
        { symbol: '!=', description: this.i18n.types.doesNotEqual, types: [Number, String, Date] },
        { symbol: '>', description: this.i18n.types.greatherThan, types: [Number, Date] },
        { symbol: '>=', description: this.i18n.types.greatherThanOrEqualTo, types: [Number, Date] },
        { symbol: '<', description: this.i18n.types.lessThan, types: [Number, Date] },
        { symbol: '<=', description: this.i18n.types.lessThanOrEqualTo, types: [Number, Date] },
        { symbol: 'startsWith', description: this.i18n.types.beginsWith, types: [String] },
        { symbol: '!startsWith', description: this.i18n.types.doesNotBeginsWith, types: [String] },
        { symbol: 'endsWith', description: this.i18n.types.endsWith, types: [String] },
        { symbol: '!endsWith', description: this.i18n.types.doesNotEndWith, types: [String] },
        { symbol: 'includes', description: this.i18n.types.contains, types: [String] },
        { symbol: '!includes', description: this.i18n.types.doesNotContain, types: [String] }
      ]
    },
    filterCols: function () {
      return this.cols.filter(col => col.filter === undefined || col.filter)
    },
    selectedCol: function () {
      if (!_.isNil(this.selectedColIndex))
        return this.cols[this.selectedColIndex]
    },
    filterTypesComputed: function () {
      if (!this.selectedCol)
        return []
      return this.filterTypes
        .filter(filterType => {
          return filterType.types
            .map(type => type.name)
            .includes(this.selectedCol.type)
        })
        .map(({ symbol, description }) => ({ symbol, description }))
    },
    booleanValues: function () {
      return [
        { value: true, text: this.i18n.boolean.true },
        { value: false, text: this.i18n.boolean.false }
      ]
    }
  },
  watch: {
    selectedCol: function (value) {
      this.selectedFilterType = null
      if (!value)
        return
      switch (this.selectedCol.type) {
        case 'Number':
          this.filterValue = 0
          break
        case 'String':
          this.filterValue = ''
          break
        case 'Boolean':
          this.filterValue = true
          break
        case 'Date':
          this.filterValue = new Date()
          break
      }
      if (this.filterTypesComputed.length === 1)
        this.selectedFilterType = this.filterTypesComputed[0]
    }
  },
  methods: {
    addFilter: function () {
      this.model.list.push({
        col: this.selectedCol,
        type: this.selectedFilterType,
        value: this.filterValue,
        displayValue: this.getDisplayValue(this.filterValue, this.selectedCol.type)
      })
      this.selectedColIndex = null
    },
    getDisplayValue: function (value, type) {
      switch (type) {
        case 'String':
          return String(value)
        case 'Boolean':
          return this.booleanValues.filter(bool => bool.value === value)[0].text
        case 'Date':
          return toLocaleDateString(this.locale, value, { day: '2-digit', month: '2-digit', year: 'numeric' })
        case 'Number':
          return value.toLocaleString(this.locale)
      }
    },
    removeAllFilters: function () {
      this.model.list = []
    },
    removeFilter: function (index) {
      this.model.list.splice(index, 1)
    }
  }
}
</script>
