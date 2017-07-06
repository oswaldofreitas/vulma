<template lang='pug'>
  .datatable.flex-column(:class='{ condensed }')
    .actions.flex-row
      .level.is-mobile
        .level-item
          vulma-input(
            v-if='search',
            v-model='typingSearchTerm',
            icon-left='fa-search',
            size='small')
        .level-item
          filters(v-if='filter', v-model='filters', :cols='cols', :locale='locale', :i18n='translate.filters')
        .level-item
          vulma-select(
            v-if='columnsSelector',
            v-model='selectedColumns',
            :placeholder='translate.selectColumns',
            :src='selectableCols',
            text='name',
            value='index',
            :max-selected='0',
            :selected-text='translate.xColumnsSelected',
            enable-search,
            icon='fa-th',
            size='small')
        .level-item(v-if='excel')
          vulma-button.excel-button(icon='fa-download', size='small', @click='exportToExcel')
            | Excel
          a(:v-show='false', ref='download')
    .header.flex-row
      .fixed.left(ref='headerFixedLeft', v-if='fixedColumnsLeft.length')
        table
          thead
            tr(ref='headerFixedLeftRow')
              th(ref='headerFixedLeftCols', v-for='col in fixedColumnsLeft', v-show='col.visible', :class='[{ sort: col.sort }, col.textAlign]', @click='sortBy(col)')
                span {{col.label}}
                .icon(v-show='col.prop === sortedBy.prop && col.label')
                  i.fa(:class="[sortDescending ? 'fa-sort-amount-desc' : 'fa-sort-amount-asc']")
      .scrollable(ref='header')
        table
          thead
            tr
              th(ref='headerCols', v-for='col in scrollableColumns', v-show='col.visible', :class='[{ sort: col.sort }, col.textAlign]', @click='sortBy(col)')
                span {{col.label}}
                .icon(v-show='col.prop === sortedBy.prop && col.label')
                  i.fa(:class="[sortDescending ? 'fa-sort-amount-desc' : 'fa-sort-amount-asc']")
      .fixed.right(ref='headerFixedRight', v-if='fixedColumnsRight.length')
        table
          thead
            tr
              th(ref='headerFixedRightCols', v-for='col in fixedColumnsRight', v-show='col.visible', :class='[{ sort: col.sort }, col.textAlign]', @click='sortBy(col)')
                span {{col.label}}
                .icon(v-show='col.prop === sortedBy.prop && col.label')
                  i.fa(:class="[sortDescending ? 'fa-sort-amount-desc' : 'fa-sort-amount-asc']")
    .data.flex-row
      template(v-if='data.length')
        .fixed.left(ref='dataFixedLeft', v-if='fixedColumnsLeft.length')
          table
            template(v-for='(row, rowIndex) in data')
              tr.group(v-if='isFirstOfGroup(rowIndex)')
                td(ref='dataFixedGroupCol')
              tr(ref='dataFixedLeftRows', v-if='!row._vulma || isGroupOpened(row._vulma.group)', @click='onRowClick(row)', @mouseover='onMouseOverRow(rowIndex)', @mouseout='onMouseOutRow', :class='{ mouseover: rowIndex === rowIndexMouseOver }')
                td(ref='dataFixedLeftCols', v-for='col in fixedColumnsLeft', v-show='col.visible', :class='[col.textAlign]')
                  slot(:name='col.slot', :data='getDisplayValue(row, col)')
                  span(v-if='!hasCustomTemplate(col)')
                    vulma-highlight(:text='getDisplayValue(row, col)', :term='searchTerm')
        .scrollable(ref='data', @scroll='onScroll')
          table
            template(v-for='(row, rowIndex) in data')
              tr.group(v-if='isFirstOfGroup(rowIndex)', @click='toggleGroup(row._vulma.group)')
                td(ref='dataGroupCol', :colspan='scrollableColumns.length')
                  .icon: i.fa(:class="[ !row._vulma || isGroupOpened(row._vulma.group) ? 'fa-minus-square-o' : 'fa-plus-square-o' ]")
                  |  {{row._vulma.group}}
              tr(ref='dataRows', v-if='!row._vulma || isGroupOpened(row._vulma.group)', @click='onRowClick(row)', @mouseover='onMouseOverRow(rowIndex)', @mouseout='onMouseOutRow', :class='{ mouseover: rowIndex === rowIndexMouseOver }')
                td(ref='dataCols', v-for='col in scrollableColumns', v-show='col.visible', :class='[col.textAlign]')
                  slot(:name='col.slot', :data='getDisplayValue(row, col)')
                  span(v-if='!hasCustomTemplate(col)')
                    vulma-highlight(:text='getDisplayValue(row, col)', :term='searchTerm')
        .fixed.right(ref='dataFixedRight', v-if='fixedColumnsRight.length')
          table
            template(v-for='(row, rowIndex) in data')
              tr.group(v-if='isFirstOfGroup(rowIndex)')
                td
              tr(ref='dataFixedRightRows', v-if='!row._vulma || isGroupOpened(row._vulma.group)', @click='onRowClick(row)', @mouseover='onMouseOverRow(rowIndex)', @mouseout='onMouseOutRow', :class='{ mouseover: rowIndex === rowIndexMouseOver }')
                td(ref='dataFixedRightCols', v-for='col in fixedColumnsRight', v-show='col.visible', :class='[col.textAlign]')
                  slot(:name='col.slot', :data='getDisplayValue(row, col)')
                  span(v-if='!hasCustomTemplate(col)')
                    vulma-highlight(:text='getDisplayValue(row, col)', :term='searchTerm')
      .center(v-else-if='src.length') {{translate.noResults}}
      .center(v-else) {{translate.noData}}
    .pagination(v-show='pageOptions.enabled && filteredData.length')
      pagination(:options='pagination', :total-rows='totalRows', v-model='pageOptions', :i18n='translate.pagination')
</template>

<style lang='sass' scoped>
  @import '~bulma'

  .flex-row
    display: flex
  .flex-column
    display: flex
    flex-direction: column
  .center
    margin: auto
  .text-left
    text-align: left
  .text-center
    text-align: center
  .text-right
    text-align: right
  table
    border-collapse: collapse
    border-spacing: 0
    tr
      &:nth-child(even)
        background-color: $white-bis
      &.mouseover
        background-color: $light
        color: $light-invert
    td, th
      padding: 10px 20px
      vertical-align: middle
    th
      background: $primary
      color: $primary-invert
      text-align: left
  .datatable
    align-items: center
    width: 100%
    height: 100%
    .icon .fa
      font-size: $size-7
    .fixed
      overflow: hidden
      flex-shrink: 0
      &.left
        border-right: 3px solid $light
      &.right
        border-left: 3px solid $light
    .actions
      margin-bottom: 10px
      flex-shrink: 0
      .level
        flex-wrap: wrap
        justify-content: flex-end
        align-items: flex-end
        .level-item
          margin-right: 10px
          flex-grow: 0
          .excel-button
            color: white
            font-weight: $weight-bold
            border-color: rgb(32, 114, 69)
            background-color: rgb(32, 114, 69)
    .header
      flex-shrink: 0
      max-width: 100%
      .scrollable
        overflow: hidden
      th.sort:hover
        cursor: pointer
        span
          text-decoration: underline
    .data
      max-width: 100%
      .group
        height: 50px
        background-color: white
      .scrollable
        overflow: auto
        .group
          font-weight: $weight-bold
          cursor: pointer
          &:hover
            color: $primary
    .pagination
      flex-shrink: 0
      width: 100%
    &.condensed
      font-size: $size-7
      table
        td, th
          padding: 5px
      .data
        .group
          height: 35px
</style>

<script>
import { toLocaleDateString } from '../../../utils/datetime'
import { deepValue } from '../../../utils/object'
import Filters from './filters'
import Pagination from './pagination'
import Columns from './mixins/columns'
import CustomTemplate from './mixins/custom-template'
import Excel from './mixins/excel'
import Filtering from './mixins/filtering'
import FixedColumns from './mixins/fixed-columns'
import Grouping from './mixins/grouping'
import I18n from './mixins/i18n'
import Paging from './mixins/paging'
import Search from './mixins/search'
import Sorting from './mixins/sorting'

export default {
  name: 'vulma-datatable',
  components: {
    Filters,
    Pagination
  },
  mixins: [
    Columns,
    CustomTemplate,
    Excel,
    Filtering,
    FixedColumns,
    Grouping,
    I18n,
    Paging,
    Search,
    Sorting
  ],
  props: {
    src: Array,
    columns: Array,
    columnsSelector: [Boolean, String],
    condensed: [Boolean, String],
    groupsExpanded: [Boolean, String],
    hideGroupColumns: [Boolean, String],
    sort: [Boolean, String],
    search: [Boolean, String],
    filter: [Boolean, String],
    pagination: Object,
    locale: {
      type: String,
      default: function () {
        return navigator.language
      }
    },
    excel: [Boolean, String],
    i18n: Object
  },
  watch: {
    data: {
      deep: true,
      handler: function () {
        this.$emit('dataChanged')
      }
    }
  },
  computed: {
    data: function () {
      return this.pagedData
    }
  },
  methods: {
    getValue: function (row, col) {
      const value = deepValue(row, col.prop)
      return col.wrapper ? col.wrapper(value) : value
    },
    getDisplayValue: function (row, col) {
      const value = this.getValue(row, col)
      switch (col.type) {
        case 'String':
          return String(value)
        case 'Boolean':
          return value ? String.fromCharCode(10004) : ''
        case 'Date':
          return toLocaleDateString(this.locale, value, { day: '2-digit', month: '2-digit', year: 'numeric' })
        case 'Number':
          return value.toLocaleString(this.locale, col.decimals ? { minimumFractionDigits: col.decimals, maximumFractionDigits: col.decimals } : undefined)
      }
    },
    onRowClick(row) {
      this.$emit('rowClick', row)
    }
  }
}
</script>
