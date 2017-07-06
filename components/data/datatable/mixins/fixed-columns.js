import _ from 'lodash'

export default {
  data() {
    return {
      rowIndexMouseOver: null
    }
  },
  computed: {
    scrollableColumns: function () {
      return this.cols.filter(col => !col.fixedLeft && !col.fixedRight)
    },
    fixedColumnsLeft: function () {
      return this.cols.filter(col => col.fixedLeft)
    },
    fixedColumnsRight: function () {
      return this.cols.filter(col => col.fixedRight)
    }
  },
  mounted() {
    this.normalize()
    this.$on([
      'groupToggle',
      'dataChanged',
      'sorted',
      'columnsChanged',
      'searched',
      'filterChanged'
    ], () => this.$nextTick(() => this.normalize()))
  },
  methods: {
    onScroll: function () {
      const data = this.$refs.data
      const margin = {
        right: Math.max(0, data.offsetWidth + data.scrollLeft - data.scrollWidth) + 'px',
        bottom: Math.max(0, data.offsetHeight + data.scrollTop - data.scrollHeight) + 'px'
      }
      this.$refs.header.scrollLeft = data.scrollLeft
      this.$refs.header.style.marginRight = margin.right
      if (this.$refs.dataFixedLeft) {
        this.$refs.dataFixedLeft.scrollTop = data.scrollTop
        this.$refs.dataFixedLeft.style.marginBottom = margin.bottom
      }
      if (this.$refs.dataFixedRight) {
        this.$refs.dataFixedRight.scrollTop = data.scrollTop
        this.$refs.dataFixedRight.style.marginBottom = margin.bottom
      }
    },
    onMouseOverRow: function (index) {
      this.rowIndexMouseOver = index
    },
    onMouseOutRow: function () {
      this.rowIndexMouseOver = null
    },
    normalize: _.debounce(function () {
      this.removeFixedSizes()
      if ((this.$refs.dataRows || []).length) {
        this.$refs.headerCols.forEach((headerCol, i) => {
          this.normalizeWidth([
            headerCol,
            this.$refs.dataCols[i]
          ])
        })
      }
      else if (this.$refs.dataGroupCol) {
        this.normalizeWidth([
          this.$refs.dataGroupCol[0],
          this.$refs.header
        ])
      }
      if (this.fixedColumnsLeft.length || this.fixedColumnsRight.length) {
        if ((this.$refs.dataRows || []).length) {
          if (this.$refs.headerFixedLeftCols) {
            this.$refs.headerFixedLeftCols.forEach((headerFixedLeftCol, i) => {
              this.normalizeWidth([
                headerFixedLeftCol,
                this.$refs.dataFixedLeftCols[i]
              ])
            })
          }
          if (this.$refs.headerFixedRightCols) {
            this.$refs.headerFixedRightCols.forEach((headerFixedRightCol, i) => {
              this.normalizeWidth([
                headerFixedRightCol,
                this.$refs.dataFixedRightCols[i]
              ])
            })
          }
          this.$refs.dataRows.forEach((dataRow, i) => {
            this.normalizeHeight([
              dataRow,
              this.$refs.dataFixedLeftRows ? this.$refs.dataFixedLeftRows[i] : undefined,
              this.$refs.dataFixedRightRows ? this.$refs.dataFixedRightRows[i] : undefined
            ])
          })
        }
        else if (this.$refs.dataFixedGroupCol && this.fixedColumnsLeft.length) {
          this.normalizeWidth([
            this.$refs.dataFixedGroupCol[0],
            this.$refs.headerFixedLeftRow
          ])
        }
        this.normalizeHeight([
          this.$refs.headerCols[0],
          this.$refs.headerFixedLeftCols ? this.$refs.headerFixedLeftCols[0] : undefined,
          this.$refs.headerFixedRightCols ? this.$refs.headerFixedRightCols[0] : undefined
        ])
      }
    }, 30),
    removeFixedSizes: function () {
      [
        this.$refs.headerCols,
        this.$refs.headerFixedLeftCols,
        this.$refs.headerFixedLeftRow,
        this.$refs.headerFixedRightCols,
        this.$refs.header,
        this.$refs.dataCols,
        this.$refs.dataFixedGroupCol,
        this.$refs.dataFixedLeftCols,
        this.$refs.dataFixedLeftRows,
        this.$refs.dataFixedRightCols,
        this.$refs.dataFixedRightRows,
        this.$refs.dataGroupCol,
        this.$refs.dataRows
      ].forEach(ref => {
        if (Array.isArray(ref))
          ref.forEach(item => this.removeFixedSize(item))
        else
          this.removeFixedSize(ref)
      })
    },
    removeFixedSize: function (el) {
      if (el) {
        el.style.height = null
        el.style.minHeight = null
        el.style.width = null
        el.style.minWidth = null
      }
    },
    normalizeHeight: function (elements) {
      elements = elements.filter(el => el)
      const heights = elements.map(el => el.clientHeight)
      const height = Math.max.apply(null, heights) + 'px'
      elements.forEach(el => {
        el.style.height = height
        el.style.minHeight = height
      })
    },
    normalizeWidth: function (elements) {
      elements = elements.filter(el => el)
      const widths = elements.map(el => el.clientWidth)
      const width = Math.max.apply(null, widths) + 'px'
      elements.forEach(el => {
        el.style.width = width
        el.style.minWidth = width
      })
    }
  }
}
