export default {
  data() {
    return {
      pageOptions: {
        enabled: false,
        pageSize: 10,
        pageSizes: [5, 10, 20, 50, 100],
        canShowAll: true,
        currentPage: 1
      }
    }
  },
  computed: {
    totalRows: function () {
      return this.filteredData.length
    },
    pagedData: function () {
      if (!this.pageOptions.enabled || !this.pageOptions.pageSize)
        return this.filteredData
      const pos = (this.pageOptions.currentPage - 1) * this.pageOptions.pageSize
      return this.filteredData.slice(pos, pos + this.pageOptions.pageSize)
    }
  }
}
