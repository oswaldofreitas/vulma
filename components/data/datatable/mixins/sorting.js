export default {
  data() {
    return {
      sortCol: null,
      sortDescending: false
    }
  },
  computed: {
    sortedBy: function () {
      if (this.sortCol)
        return this.sortCol
      const sortCol = this.cols.filter(col => col.defaultSort)
      if (sortCol.length)
        return sortCol[0]
    },
    sortCols: function () {
      if (this.sortedBy)
        return [...this.groupCols, this.sortedBy]
      else
        return [...this.groupCols]
    },
    sortedData: function () {
      return this.groupedData.sort((a, b) => {
        for (let i = 0; i < this.sortCols.length; i++) {
          let sortResult = this.sortCompare(a, b, this.sortCols[i])
          if (sortResult) {
            if (this.sortDescending && this.sortCols[i].prop === this.sortedBy.prop)
              sortResult *= -1
            return sortResult
          }
        }
        return 0
      })
    }
  },
  methods: {
    sortCompare: function (row1, row2, col) {
      const val1 = this.getValue(row1, col)
      const val2 = this.getValue(row2, col)
      if (val1 > val2) return 1
      if (val1 < val2) return -1
      return 0
    },
    sortBy: function (col) {
      if (col.sort) {
        this.sortDescending = !this.sortDescending && this.sortedBy.prop === col.prop
        this.sortCol = col
      }
      this.$emit('sorted', col.prop)
    }
  }
}
