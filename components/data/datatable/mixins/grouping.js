export default {
  data() {
    return {
      openedGroups: {}
    }
  },
  computed: {
    groupCols: function () {
      return this.cols
        .filter(col => col.group)
        .sort((a, b) => a.group - b.group)
    },
    groupedData: function () {
      let data = [...this.src]
      if (!this.groupCols.length)
        return data
      return data.map(row => {
        const _vulma = {
          group: this.getGroupName(row)
        }
        return Object.assign({ _vulma }, row)
      })
    }
  },
  methods: {
    getGroupName: function (row) {
      return this.groupCols.map(col => {
        return this.getValue(row, col)
      }).join(' - ')
    },
    isFirstOfGroup: function (rowIndex) {
      return rowIndex === 0 || this.data[rowIndex - 1]._vulma.group !== this.data[rowIndex]._vulma.group
    },
    isGroupOpened: function (groupName) {
      if (groupName === undefined)
        return true
      if (this.openedGroups[groupName] === undefined)
        return this.groupsExpanded
      return this.openedGroups[groupName]
    },
    toggleGroup: function (groupName) {
      this.$set(this.openedGroups, groupName, !this.isGroupOpened(groupName))
      this.$emit('groupToggle', groupName)
    }
  }
}
