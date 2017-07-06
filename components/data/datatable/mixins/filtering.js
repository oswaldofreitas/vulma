export default {
  data() {
    return {
      filters: {
        conditions: 'all',
        list: []
      }
    }
  },
  watch: {
    filters: function () {
      this.$emit('filterChanged')
    }
  },
  computed: {
    filteredData: function () {
      if (!this.filters.list.length)
        return this.searchedData
      const func = this.filters.conditions === 'all'
        ? Array.prototype.every
        : Array.prototype.some
      return this.searchedData.filter(row => func.apply(
        this.filters.list,
        [filter => this.checkFilter(row, filter)])
      )
    }
  },
  methods: {
    checkFilter: function (row, filter) {
      let value = this.getValue(row, filter.col)
      let filterValue = filter.value
      if (filter.col.type === 'String') {
        value = value.toLowerCase()
        filterValue = filterValue.toLowerCase()
      }
      else if (filter.col.type === 'Date') {
        value = new Date(value).setHours(0, 0, 0, 0)
        filterValue = new Date(filterValue).setHours(0, 0, 0, 0)
      }
      switch (filter.type.symbol) {
        case '=': return value === filterValue
        case '!=': return value !== filterValue
        case '>': return value > filterValue
        case '>=': return value >= filterValue
        case '<': return value < filterValue
        case '<=': return value <= filterValue
        case 'startsWith': return value.startsWith(filterValue)
        case '!startsWith': return !value.startsWith(filterValue)
        case 'endsWith': return value.endsWith(filterValue)
        case '!endsWith': return !value.endsWith(filterValue)
        case 'includes': return value.includes(filterValue)
        case '!includes': return !value.includes(filterValue)
      }
    }
  }
}
