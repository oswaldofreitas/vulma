export default {
  data() {
    return {
      selectedColumns: []
    }
  },
  watch: {
    selectedColumns: function () {
      this.$emit('columnsChanged')
    }
  },
  mounted() {
    this.selectAllColumns()
  },
  computed: {
    cols: function () {
      return this.columns.map((col, index) => {
        const label = col.label !== undefined ? col.label : col.prop
        const name = label || `Column ${index + 1}`
        const slot = col.slot || col.prop
        const sort = col.sort !== undefined ? col.sort : Boolean(this.sort)
        const type = col.type ? col.type.name : 'String'
        const textAlign = 'text-' + (col.textAlign || { Date: 'center', Boolean: 'center', Number: 'right' }[type] || 'left')
        const visible = this.selectedColumns.some(
          selectedIndex => selectedIndex === index
        ) && !(col.group && this.hideGroupColumns)
        return Object.assign({}, col, { index, label, name, slot, sort, type, textAlign, visible })
      })
    },
    selectableCols: function () {
      if (this.hideGroupColumns)
        return this.cols.filter(col => !col.group)
      return this.cols
    }
  },
  methods: {
    selectAllColumns: function () {
      this.selectedColumns = this.selectableCols.map(col => col.index)
    }
  }
}
