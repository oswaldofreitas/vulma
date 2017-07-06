import _ from 'lodash'

export default {
  computed: {
    translate: function () {
      return _.merge({
        selectColumns: 'Select columns',
        xColumnsSelected: '{0} columns selected',
        noData: 'No data',
        noResults: 'No results',
        filters: {
          filterButton: 'Filter',
          removeAllFilters: 'Remove All Filters',
          addFilterBy: 'Add Filter By',
          selectAColumn: 'Select a column',
          selectAFilterType: 'Select a filter type',
          today: 'Today',
          add: 'Add',
          currentFilters: 'Current Filters',
          conditions: {
            all: 'All conditions',
            any: 'Any condition'
          },
          types: {
            equals: 'Equals',
            doesNotEqual: 'Does Not Equal',
            greatherThan: 'Greater Than',
            greatherThanOrEqualTo: 'Greather Than or Equal To',
            lessThan: 'Less Than',
            lessThanOrEqualTo: 'Less Than or Equal To',
            beginsWith: 'Begins With',
            doesNotBeginsWith: 'Does Not Begins With',
            endsWith: 'Ends With',
            doesNotEndWith: 'Does Not End With',
            contains: 'Contains',
            doesNotContain: 'Does Not Contain'
          },
          boolean: {
            true: 'True',
            false: 'False'
          }
        },
        pagination: {
          pageSize: 'Page size',
          showAll: 'Show All'
        }
      }, this.i18n)
    }
  }
}
