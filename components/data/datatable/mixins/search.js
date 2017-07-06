import _ from 'lodash'
import { removeAccents } from '../../../../utils/string'

export default {
  data() {
    return {
      typingSearchTerm: '',
      searchTerm: ''
    }
  },
  watch: {
    typingSearchTerm: _.debounce(function (value) {
      this.searchTerm = value
      this.$emit('searched', value)
    }, 500)
  },
  computed: {
    searchedData: function () {
      if (!this.searchTerm)
        return this.sortedData
      return this.sortedData.filter(row => this.cols
        .filter(col => col.visible)
        .map(col => this.getDisplayValue(row, col))
        .some(displayValue => {
          const term = removeAccents(this.searchTerm).toLowerCase()
          const text = removeAccents(displayValue).toLowerCase()
          return text.includes(term)
        })
      )
    }
  }
}
