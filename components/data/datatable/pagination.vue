<template lang='pug'>
  .datatable-pagination
    nav.pagination.is-centered.is-small(v-if='model.pageSize')
      a.pagination-previous(v-if='previousPage', @click='goToPreviousPage')
        .icon: i.fa.fa-angle-left
      a.pagination-next(v-if='nextPage', @click='goToNextPage')
        .icon: i.fa.fa-angle-right
      ul.pagination-list
        template(v-if='previousPage')
          li: a(@click='goToFirstPage').pagination-link 1
          template(v-if='previousPage !== 1')
            li: .pagination-ellipsis &hellip;
            li: a(@click='goToPreviousPage').pagination-link {{previousPage}}
        li: a.pagination-link.is-current {{model.currentPage}}
        template(v-if='nextPage')
          li: a(@click='goToNextPage').pagination-link {{nextPage}}
          template(v-if='nextPage !== totalPages')
            li: .pagination-ellipsis &hellip;
            li: a(@click='goToLastPage').pagination-link {{totalPages}}
    .page-size
      small {{i18n.pageSize}}:&nbsp;
      vulma-select(:src='pageSizesComputed', text='text', value='value', size='small', v-model='model.pageSize')
</template>

<style lang='sass' scoped>
  .datatable-pagination
    display: flex
    flex-wrap: wrap
    flex-grow: 1
    justify-content: space-around
    margin-top: 20px
    .pagination
      flex-shrink: 0
    .page-size
      display: flex
      align-items: center
      white-space: nowrap
      small
        margin-top: 5px
</style>

<script>
import modelMixin from 'vulma/mixins/model'

export default {
  name: 'pagination',
  mixins: [modelMixin],
  props: {
    value: Object,
    options: Object,
    totalRows: Number,
    i18n: Object
  },
  computed: {
    previousPage: function () {
      return this.model.currentPage > 1 ? this.model.currentPage - 1 : null
    },
    nextPage: function () {
      return this.model.currentPage < this.totalPages ? this.model.currentPage + 1 : null
    },
    totalPages: function () {
      return Math.ceil(this.totalRows / this.model.pageSize)
    },
    pageSizesComputed: function () {
      let pageSizes = this.model.pageSizes.map(size => ({
        value: size,
        text: size
      }))
      if (this.model.canShowAll)
        pageSizes = [{
          value: 0,
          text: this.i18n.showAll
        }, ...pageSizes]
      return pageSizes
    }
  },
  watch: {
    options: 'setOptions',
    totalPages: 'goToFirstPage',
    model: {
      deep: true,
      handler: function () {
        if (this.model.currentPage > this.totalPages)
          this.goToFirstPage()
      }
    }
  },
  mounted() {
    this.setOptions()
  },
  methods: {
    setOptions: function () {
      Object.assign(this.model, this.options)
    },
    goToPreviousPage: function () {
      this.model.currentPage -= 1
    },
    goToNextPage: function () {
      this.model.currentPage += 1
    },
    goToFirstPage: function () {
      this.model.currentPage = 1
    },
    goToLastPage: function () {
      this.model.currentPage = this.totalPages
    }
  }
}
</script>
